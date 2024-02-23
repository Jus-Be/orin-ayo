let parserMessage  = [];
let triad = [];
let runningStatus;
let thirdByteFlag;

let prevReturnedTimestamp;
let prevReceivedTimestamp;
let connTimePrevious;
let firstMessageReceived = true;


function parseMidiByte(currentByte) {
  if ((currentByte >> 7) === 1) {
    /** Current byte is statusbyte */
		runningStatus = currentByte;
		thirdByteFlag = false;

    if (((currentByte >> 7) === 1) && ((currentByte >> 3) === 0b11111)) {
      /** System Real-Time Messages */
      parserMessage[0] = currentByte;
      return parserMessage;
    }

    /** Message with only one byte */
		if ((currentByte >> 2) === 0b111101) {
			if(currentByte === 0xF7) {
				/** End of exclusive, not supported. Discarded for now.  */
				return;
			}
      parserMessage[0] = currentByte;

			return parserMessage;
		}
		return false;
  }

  if (thirdByteFlag === true) {
		/** Expected third, and last, byte of message */
		thirdByteFlag = false;
		parserMessage[2] = currentByte;
		return parserMessage;
	}

  if (runningStatus === 0) {
		/** System Exclusive (SysEx) databytes, from 3rd byte until EoX, or
		 * orphaned databytes. */
		return;
	}

  /** Channel Voice Messages */
	switch (runningStatus >> 4) {
    case 0x8:
    case 0x9:
    case 0xA:
    case 0xB:
    case 0xE:
      thirdByteFlag = true;
      parserMessage[0] = runningStatus;
      parserMessage[1] = currentByte;
      return;
    case 0xC:
    case 0xD:
      parserMessage[0] = runningStatus;
      parserMessage[1] = currentByte;
      return parserMessage;
    }

    	/** System Common Message */
	switch (runningStatus) {
    case 0xF2:
      thirdByteFlag = true;
      parserMessage[0] = runningStatus;
      parserMessage[1] = currentByte;
      runningStatus = 0;
      return parserMessage;
    case 0xF1:
    case 0xF3:
      thirdByteFlag = false;
      parserMessage[0] = runningStatus;
      parserMessage[1] = currentByte;
      runningStatus = 0;
      return parserMessage;
    case 0xF0:
      break;
    }
  
    runningStatus = 0;
    return;
}


function convertTimestamp(timestampBLE, connTime) {
  if (firstMessageReceived) {
    firstMessageReceived = false;

    connTimePrevious      = connTime;
    prevReceivedTimestamp = timestampBLE;
    prevReturnedTimestamp = connTime;

    return 0;
  }

  let trueTSInterval  = (((timestampBLE - prevReceivedTimestamp) & 8191)
                      + Math.round((((connTime - connTimePrevious) 
                      - ((timestampBLE - prevReceivedTimestamp) & 8191))) 
                      / 8192)
                      * 8192);

  let addedDelay = (trueTSInterval - (connTime - prevReturnedTimestamp));
  if (addedDelay < 0) {
		addedDelay = 0;
	}

  connTimePrevious	    = connTime;
	prevReceivedTimestamp	= timestampBLE;
	prevReturnedTimestamp = performance.now() + addedDelay;

  return addedDelay;
}


function bleMIDIrx(blepacket) {
  //console.log('BLE-in: ' + blepacket);

  midiMessage         = [];
  let connTime = performance.now();
  let currentByte;

  let nextIsNewTimestamp = false;

  let timestampBLE = (blepacket[1] & 0x7F) + (((blepacket[0] & 0x3F) << 7));
  let delay = convertTimestamp(timestampBLE, connTime);

  /** Check messages in package. */
  for (pos = 2; pos < blepacket.length; pos++) {
    currentByte = blepacket[pos];

    /** Check MSB and expectations to ID current byte as timestamp,
		 * statusbyte or databyte */
		if ((currentByte >> 7) && (nextIsNewTimestamp)) {
        /** New Timestamp means last message is complete */
        nextIsNewTimestamp  = false;

        if ((currentByte & 0x7F) < (timestampBLE & 0x7F)) {
          /** Timestamp overflow, increment Timestamp High */
          timestampBLE += 1 << 7;
        }
  
        /** Storing newest timestamp for later reference, and translating
         * timestamp to local time */
        timestampBLE =	((currentByte & 0x7F) + (timestampBLE & 0x1F80));
        delay = convertTimestamp(timestampBLE, connTime);
  
        if(midiMessage === undefined) {
          /** Previous message was not complete */
          console.log('Incomplete message: pos ' + pos);
        }

    } else {
        /** Statusbytes and databytes */
			  nextIsNewTimestamp  = true;

        midiMessage = parseMidiByte(currentByte)
        if (midiMessage) {
          /** Message completed */
          parserMessage         = [];
          displayMIDImessage(midiMessage, delay);
        }
    }
  }
}

function translateChordaToI1(callback, flag, midiMessage) {
  const trigger = midiMessage[1];	
  const velocity = midiMessage[2];
  const channel = 1 + (midiMessage[0] & 0b00001111);
  
  // Chorda in BASS mode (single notes on pads and harmony notes bridge)
  // Harmony interval is 4,3,5,4,3 on major chords and 3,4,5,3,4 on minor chords
  
  if (channel == 9) {			
	  triad[trigger] = flag;
	  console.log("translateChordaToI1", flag, velocity, channel, trigger)	

	  if (trigger == 48) callback({number: 60}, "INSTRUMENT1", velocity)	  	// 5 (G)
	  else if (trigger == 50) callback({number: 62}, "INSTRUMENT1", velocity)   // 6m (Am)  
	  else if (trigger == 52) callback({number: 64}, "INSTRUMENT1", velocity)   // 1 (C)
	  else if (trigger == 53) callback({number: 65}, "INSTRUMENT1", velocity)	// 2m (Dm)  
	  else if (trigger == 55) callback({number: 67}, "INSTRUMENT1", velocity)	// 4 (F) 		  

	  else if (trigger == 59) callback({number: 71}, "INSTRUMENT1", velocity)	// 7 - start/stop

	  if (flag) {
		  if (trigger == 64 || (trigger == 65 && triad[50]) || (trigger == 67 && triad[52]) || (trigger == 69 && triad[53]) || (trigger == 71 && triad[55]) || (trigger == 74 && triad[59])) {
			  callback({number: 43}, "INSTRUMENT1", velocity)	// next style/strum down	  
		  }
		  else 
			  
		  if (trigger == 67 || (trigger == 69 && triad[50]) || (trigger == 71 && triad[52]) || (trigger == 72 && triad[53]) || (trigger == 74 && triad[55]) || (trigger == 79 && triad[59])) {
			  callback({number: 41}, "INSTRUMENT1", velocity)	// prev style/ strum up				  
		  }
		  else 
			  
		  if (trigger == 60 || (trigger == 62 && triad[50]) || (trigger == 64 && triad[52]) || (trigger == 65 && triad[53]) || (trigger == 67 && triad[55])) {
			  callback({number: 45}, "INSTRUMENT1", velocity)	// FILL			  	  
		  }
	  } else {
		  if (trigger == 64 || (trigger == 65) || (trigger == 67) || (trigger == 69) || (trigger == 71) || (trigger == 74)) {
			  callback({number: 43}, "INSTRUMENT1", velocity)			  
		  }
		  else 
			  
		  if (trigger == 67 || (trigger == 69) || (trigger == 71) || (trigger == 72) || (trigger == 74) || (trigger == 79)) {
			  callback({number: 41}, "INSTRUMENT1", velocity)			  
		  }
		  else 
			  
		  if (trigger == 60 || (trigger == 62) || (trigger == 64) || (trigger == 65) || (trigger == 67)) {
			  callback({number: 45}, "INSTRUMENT1", velocity)				  	  
		  }		  
	  }
  } 	
}


function displayMIDImessage(midiMessage, delay) {
	//console.log('displayMIDImessage', midiMessage);
	// handleNoteOff({number: note, device, velocity)
	let trigger, stored
	
	switch(midiMessage[0] >>> 4) {	  
	case 0b1000:  // Note off
		translateChordaToI1(handleNoteOff, false, midiMessage);  		  
	  break;
	  
	case 0b1001:  // Note on
		translateChordaToI1(handleNoteOn, true, midiMessage); 		  
	  break;	
	  
    case 0b1011:  // Control Change
	  //console.debug('Control Change', midiMessage);
	  break;

    case 0b1100: // Program Change
      console.debug('Program Changed to: ' + padString(midiMessage[1],3) + '......| Channel: ' + padString((1 + midiMessage[0]&0b00001111),2));
      break;
	  
    case 0b1101: // Channel Pressure (After-touch)
      //console.debug('Channel Pressure: ' + padString(midiMessage[1],3) + '........| Channel: ' + padString((1 + midiMessage[0]&0b00001111),2));
      break;
	  
    case 0b1110: // Pitch Bend Change
      //console.debug('Bending pitch: ' + padString((((midiMessage[1] & 127) * 128) + (midiMessage[2] & 127)), 10) + '....| Channel: ' + padString((1 + midiMessage[0]&0b00001111),2));
      break;
	  
    case 0b1111: // System Messages	
	  console.debug('System Messages', midiMessage);	
      break;	
	}
}

function noteNamer(midiValue) {
  let noteNumber    = midiValue % 12;
  let octaveNumber  = ((midiValue - noteNumber) / 12) - 1;
  let noteString    = "";

  switch(noteNumber) {
    case 0:
      noteString = "C" + octaveNumber + "....";
      break;
    case 1:
      noteString = "C#/Db" + octaveNumber;
      break;
    case 2:
      noteString = "D" + octaveNumber + "....";
      break;
    case 3:
      noteString = "D#/Eb" + octaveNumber;
      break;
    case 4:
      noteString = "E" + octaveNumber + "....";
      break;
    case 5:
      noteString = "F" + octaveNumber + "....";
      break;
    case 6:
      noteString = "F#/Gb" + octaveNumber;
      break;
    case 7:
      noteString = "G" + octaveNumber + "....";
      break;
    case 8:
      noteString = "G#/Ab" + octaveNumber;
      break;
    case 9:
      noteString = "A" + octaveNumber + "....";
      break;
    case 10:
      noteString = "A#/Bb" + octaveNumber;
      break;
    case 11:
      noteString = "B" + octaveNumber + "....";
      break;
    default:
      break;
  }
  return noteString;
}

function padString(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}