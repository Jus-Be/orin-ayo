// data can be any array-like object.  It just needs to support .length, .slice, and an element getter []
var lastEventTypeByte = null; 
  
function parseMidi(data, arrName) {
  console.debug("parseMidi", arrName);
  
  var p = new Parser(data)
  var headerChunk = p.readChunk();
  
  if (headerChunk.id == 'MThd') {
      var casm = [];	  
	  var header = parseHeader(headerChunk.data);

	  if (header.numTracks == 1) {			//type 0, single track
	  
		  if (arrName.toLowerCase().endsWith(".sas")) {
		     return {header, data: parseSas(p, arrName), casm: []};
			 
		  }	
		  else
			  
		  if (arrName.toLowerCase().endsWith(".mid")) {
		     return {header, data: parseSmf(p, arrName)};
			 
		  }			  
		  else {		  
			  var trackChunk = p.readChunk()
			  var casmChunk = p.readChunk()
				
			  if (trackChunk.id != 'MTrk')
				throw "Bad MIDI file.  Expected 'MTrk', got: '" + trackChunk.id + "'"
			  
			  if (!arrName.toLowerCase().endsWith(".kst")) {
				  if (casmChunk.id != 'CASM')
					throw "Bad MIDI file.  Expected 'CASM', got: '" + casmChunk.id + "'"

				  //console.debug("parseCasm casm", casmChunk.id, casmChunk.length); 
				  casm = parseCasm(casmChunk.data);
			  }
				  
			  return {header, data: parseData(trackChunk.data, arrName), casm};
		  }	  
	  }
  }
  else
	  
  if (headerChunk.id == 'AC07') { 
	  return parseAc7(data);
  } 
  else {
	throw "Bad style file.  Expected 'MHdr or AC07', got: '" + headerChunk.id + "'"	  
  }
}

function parseSmf(parser, arrName) {
	console.debug("parseSmf", arrName);	
  var events = {Hdr : {}, music: []};
	
	while (!parser.eof()) {
		const event = readEvent(parser);

		if (event && event.data) {
			//console.debug("chord type", event.type, event.data[0], event.data[1], event.data[2]);
							
			if (event.type == "sysEx" && event.data[0] == 0x43 && event.data[1] == 0x7E && event.data[2] == 0x02) {
				console.debug("chord type", event.data[3], event.data[4], event.data[5]);
				event.sysexType = "chord";
				event.chordRoot = event.data[3];
				event.chordType = event.data[4];
				event.chordBass = event.data[5];
				events.music.push(event);				
			}
			else
				
			if (event.type == "sysEx" && event.data[0] == 0x43 && event.data[1] == 0x7E && event.data[2] == 0x00) {
				console.debug("section control", event.data[3]);
				event.sysexType = "section-control";
				event.section = event.data[3];	
				events.music.push(event);				
			}
			else
				
			if (event.type == "sysEx" && event.data[0] == 0x43 && event.data[1] == 0x60 && event.data[2] == 0x7A) {
				console.debug("start sequence");
				event.sysexType = "start-sequence";	
				events.music.push(event);				
			}
			else
				
			if (event.type == "sysEx" && event.data[0] == 0x43 && event.data[1] == 0x60 && event.data[2] == 0x7D) {
				console.debug("stop sequence");
				event.sysexType = "stop-sequence";	
				events.music.push(event);				
			}
		} 
		else
		
		if (event) {			
				
			if (event.type == "lyrics") {
				console.debug("lyrics", event.text);	
				events.music.push(event);				
			}
			else
				
			if (event.type == "setTempo") {
				events.Hdr.setTempo = event;
			}
			else
				
			if (event.type == "timeSignature") {
				events.Hdr.timeSignature = event;
			}
			else
				
			if (event.type == "keySignature") {
				events.Hdr.keySignature = event;
			}			
		}					
	}
	return events;
}

function parseSas(parser, arrName) {
  console.debug("parseSas", arrName);
  
  let cc111Num = 1, temp = [], variation = "SInt";
  var events = {Hdr : {}, "SInt": [], "Intro A": [], "Intro B": [], "Intro C": [], "Ending A": [], "Main A": [], "Main B": [], "Main C": [], "Main D": [], "Fill In AA": [], "Fill In BB": [], "Fill In CC": [], "Fill In DD": [], "Fill In BA": []}, markers = []; 			  
  
  while (!parser.eof()) {
    const event = readEvent(parser);
	
	if (event) {		

		if (event.channel == 1) event.channel = 10; 		// Bass  
		else if (event.channel == 2) event.channel = 11; 	// Keyboard	    
		else if (event.channel == 3) event.channel = 12; 	// Guitar  
		else if (event.channel == 4) event.channel = 13; 	// Pad		  
		else if (event.channel == 5) event.channel = 14; 	// Phrase 1  	
		else if (event.channel == 6) event.channel = 15; 	// Phrase 2
		//else if (event.channel == 8) event.channel = 9; 	// Percussion	
			
		if (event.type == "setTempo") {
			events.Hdr.setTempo = event;
		}
		else
			
		if (event.type == "timeSignature") {
			events.Hdr.timeSignature = event;
		}				  
		else
			
		if (event.type == "controller") 
		{
		  if (event.controllerType == 110) {
			  cc111Num = event.value;
			  
			  if (cc111Num == 01)  variation = "Intro A";
			  if (cc111Num == 10)  variation = "Intro B";
			  if (cc111Num == 11)  variation = "Intro C";
			  
			  if (cc111Num == 2)  variation = "Main A";
			  if (cc111Num == 3)  variation = "Main B";	
			  if (cc111Num == 4)  variation = "Main C";
			  if (cc111Num == 5)  variation = "Main D";		
			  if (cc111Num == 32)  variation = "Ending A";				  

			  if (cc111Num == 11)  variation = "Fill In AA";
			  if (cc111Num == 12)  variation = "Fill In BB";
			  if (cc111Num == 13)  variation = "Fill In CC";	
			  if (cc111Num == 14)  variation = "Fill In DD";
			  
			  if (cc111Num == 15)  variation = "Fill In BA";			  
			  
			  console.debug("Start of pattern " + cc111Num);
			  lastEventTypeByte = null;			  
			  continue;
		  }
		  else
			  
		  if (event.controllerType == 111) {	
			  variation = null;  
			  console.debug("End of pattern " + cc111Num + " goto pattern " + event.value);	
		  }		  
		}
		
		if (variation) {
			if (variation == "SInt" && (event.type == "controller" && event.controllerType != 110 && event.controllerType != 111) || event.type == "programChange") {	
				events[variation].push(event);
			}
			else
				
			if (variation != "SInt") {
				console.debug(variation);
				events[variation].push(event);
			}	
		}			
	}
	
  }	  
  return events 
}

function parseAc7(data) {
  var ac7 = new Parser(data)
  var id = ac7.readString(4)
  var length = ac7.readUInt32LE() 
  var elementsOffset = ac7.readUInt32LE();
  var mixrOffset = ac7.readUInt32LE();
  var drumOffset = ac7.readUInt32LE();
  var otherOffset = ac7.readUInt32LE();	  
  var endMarker = ac7.readUInt32LE();	
  
  var eleMarker = ac7.readUInt32LE();
  var eleSize = ac7.readUInt16LE();
  var eleCount = ac7.readUInt8();
  var eleDefn = [];
  
  
  for (let i=0; i<eleCount; i++) {
	  eleDefn[i] = ac7.readUInt32LE();
  }
  
  var rhythmName = ac7.readAtom(); 
  var timeSignature = ac7.readAtom(); 
  var tempo = ac7.readAtom(); 
  var volume = ac7.readAtom();   
  
  console.debug("parseMidi ac7 header", id, eleCount, rhythmName, tempo, volume);
  var style = [];
  
  for (let i=0; i<eleCount; i++) {
	  ac7.pos = elementsOffset + eleDefn[i];
      var eleId = ac7.readString(4);
	  var eleLen = ac7.readUInt16LE();
	  
	  style[i] = {};	  
      style[i].elemTimeSignature = ac7.readAtom(); 	
      style[i].elemNoOfMeasures = ac7.readAtom(); 
      style[i].elemNoOfTracks = ac7.readAtom(); 
	  
      style[i].trackIndex = new Uint16Array(ac7.readAtom()); 	  
      style[i].mixerIndex = new Uint16Array(ac7.readAtom()); 
	  style[i].partIndicator = new Uint8Array(ac7.readAtom()); 
	  	  
	  for (let j=0; j<style[i].elemNoOfTracks; j++) {
		  style[i].mixerIndex[j] = style[i].mixerIndex[j] - 0x8000;
		  style[i].trackIndex[j] = style[i].trackIndex[j] - 0x8000;
		  //console.debug("parseMidi ac7 element part/track", i, j, style[i].partIndicator[j], style[i].mixerIndex[j] - 0x8000, style[i].trackIndex[j] - 0x8000);
	  }
  }
  
  console.debug("parseMidi ac7 element segment", style);  

  var mixer = [];  	
  ac7.pos = mixrOffset;
  var mixrId = ac7.readString(4);
  var mixrLen = ac7.readUInt32LE();  
  var mixrEntries = ac7.readUInt16LE(); 

  var mixrDefn = [];
  
  for (let i=0; i<mixrEntries; i++) {
	  mixrDefn[i] = ac7.readUInt32LE();
  }  
  
  for (let i=0; i<mixrEntries; i++) {
	  ac7.pos = mixrDefn[i];
	  mixer[i] = {};
	  mixer[i].patch = ac7.readUInt8();
	  mixer[i].bank = ac7.readUInt8();
	  mixer[i].volume = ac7.readUInt8();
	  mixer[i].pan = ac7.readUInt8();
	  mixer[i].reverb = ac7.readUInt8();
	  mixer[i].chorus = ac7.readUInt8();	  
  }   

  console.debug("parseMidi ac7 element mixer segment", mixrId, mixrEntries, mixer);  

  var drum = [];  	
  ac7.pos = drumOffset;
  var drumId = ac7.readString(4);
  var drumLen = ac7.readUInt32LE();  
  var drumEntries = ac7.readUInt16LE(); 

  var drumDefn = [];
  
  for (let i=0; i<drumEntries; i++) {
	  drumDefn[i] = ac7.readUInt32LE();
  }  
  
  for (let i=0; i<drumEntries; i++) {
	  ac7.pos = drumDefn[i];
	  drum[i] = {events: []};
	  
	  var event = ac7.readEvent();
	  
	  while (event.code != 252) {
		  drum[i].events.push(event);
		  event = ac7.readEvent();		  
	  }
  }   

  console.debug("parseMidi ac7 element drum segment", drumId, drum);   
  
  var other = [];  	
  ac7.pos = otherOffset;
  var otherId = ac7.readString(4);
  var otherLen = ac7.readUInt32LE();  
  var otherEntries = ac7.readUInt16LE(); 

  var otherDefn = [];
  
  for (let i=0; i<otherEntries; i++) {
	  otherDefn[i] = ac7.readUInt32LE();
  }  
  
  for (let i=0; i<otherEntries; i++) {
	  ac7.pos = otherDefn[i];
	  
	  var starter = ac7.readBytes(3); 
	  other[i] = {events: [], starter};
	  
	  var event = ac7.readEvent();
	  
	  while (event.code != 252) {
		  other[i].events.push(event);
		  event = ac7.readEvent();		  
	  }
  }   

  console.debug("parseMidi ac7 element other segment", otherId, other);  
  let styleData = {}; 
  styleData["SInt"] = []; 
	
  for (let i=0; i<eleCount; i++)  {
	  if (i == 6 || i == 11) continue; // parts 7 & 12 are empty
	  
	  let section = "Intro A";
	  if (i == 1) section = "Main A";
	  if (i == 2) section = "Main B";
	  if (i == 3) section = "Fill In AA";
	  if (i == 4) section = "Fill In BB";
	  if (i == 5) section = "Ending A";
	  if (i == 7) section = "Main C";
	  if (i == 8) section = "Main D";
	  if (i == 9) section = "Fill In CC";
	  if (i == 10) section = "Fill In DD";

	  styleData[section] = [];
	  let empty = true;	  
	  
	  for (let j=0; j<style[i].elemNoOfTracks; j++) {
		  let channel = -1;	// only selecting major 0x8n
		  if (style[i].partIndicator[j] == 0x0f || style[i].partIndicator[j] == 0x85) channel = 8;		  
		  if (style[i].partIndicator[j] == 0x00 || style[i].partIndicator[j] == 0x80) channel = 9;
		  if (style[i].partIndicator[j] == 0x01 || style[i].partIndicator[j] == 0x81) channel = 10;
		  if (style[i].partIndicator[j] == 0x02 || style[i].partIndicator[j] == 0x82) channel = 11;
		  if (style[i].partIndicator[j] == 0x03 || style[i].partIndicator[j] == 0x83) channel = 12;
		  if (style[i].partIndicator[j] == 0x04 || style[i].partIndicator[j] == 0x84) channel = 13;
		  if (style[i].partIndicator[j] == 0x05 || style[i].partIndicator[j] == 0x85) channel = 14;		  
		  if (style[i].partIndicator[j] == 0x06 || style[i].partIndicator[j] == 0x86) channel = 15;		  
		  
		  if (channel > -1) {
			  let midi = drum[style[i].trackIndex[j]];
			  if (channel > 9) midi = other[style[i].trackIndex[j]]; 
			  let ticks = 0;
			  
			  if (midi?.events.length > 0) {
				  let mixr = mixer[style[i].mixerIndex[j]];
				  
				  if (mixr) {
					  styleData[section].push({channel, code: 256, ticks: 0, delta: 0, type: "controller", controllerType: 0, value: mixr.bank});		  
					  styleData[section].push({channel, code: 256, ticks: 0, delta: 0, type: "programChange", programNumber: mixr.patch});
					  styleData[section].push({channel, code: 256, ticks: 0, delta: 0, type: "controller", controllerType: 7, value: mixr.volume});
					  styleData[section].push({channel, code: 256, ticks: 0, delta: 0, type: "controller", controllerType: 10, value: mixr.pan});			  
				  }

				  for (let k=0; k<midi.events.length; k++) {
					  ticks = ticks + midi.events[k].delta;
					  
					  if (midi.events[k].code < 128) {
						empty = false;
						styleData[section].push({channel, ticks, delta: midi.events[k].delta, code: midi.events[k].code, value: midi.events[k].value});
					  }
				  }
			  }
		  }
	  }
	  
	  if (empty) {
		  styleData[section] = [];
		  
	  } else {
	  
		  styleData[section].sort((a, b) => {
			  return a.ticks - b.ticks;
		  });
		  
		  let oldTicks = 0;
		  
		  for (let j=0; j<styleData[section].length; j++) 
		  {
			  styleData[section][j].deltaTime = styleData[section][j].ticks - oldTicks;
			  oldTicks = styleData[section][j].ticks;
			  
			  if (styleData[section][j].code < 128) {
				  styleData[section][j].noteNumber = styleData[section][j].code;
				  styleData[section][j].type = styleData[section][j].value == 0 ? "noteOff" : "noteOn";	
				  styleData[section][j].velocity = styleData[section][j].value;				  
			  }
		  }	
	  }		  
  }
  
  styleData["SFF1"] = [];
  styleData["SInt"] = [];
  styleData["Hdr"] = {setTempo: {microsecondsPerBeat:  60 / tempo * 1000000}}  
  console.debug("parseMidi ac7 styleData", styleData);   
  
  return {
	header: {format: 0, numTracks: 1, ticksPerBeat: 96},
	data: styleData,
	casm: []		
  }	
}

function parseCasm(data) {
  var p = new Parser(data);
  var csegs = [];
  //console.debug("parseCasm", p);
  
  while (!p.eof()) {
	  var csegChunk = p.readChunk()
	  var s = new Parser(csegChunk.data);		  
	  var sdecChunk = s.readChunk()
	  var d = new Parser(sdecChunk.data);
	  var cseg = {}; 
	  cseg.ctabs = [];
	  cseg.styles = d.readString(sdecChunk.length).split(","); 

      while (!s.eof()) {
		 var ctabChunk = s.readChunk();
		 
		 if (ctabChunk.id == "Ctab" || ctabChunk.id == "Ctb2") {
			 var t = new Parser(ctabChunk.data);
			 var ctab = {};
			 
			 ctab.id = ctabChunk.id;
			 ctab.source = t.readUInt8();
			 ctab.name = t.readString(8);
			 ctab.destination = t.readUInt8();
			 t.readBytes(8);		 
			 ctab.sourceChord = t.readUInt8();
			 ctab.sourceChordType = t.readUInt8();	

			 if (ctabChunk.id == "Ctab") {			 
				 ctab.ntr = t.readUInt8();
				 ctab.ntt = t.readUInt8();	
				 ctab.highKey = t.readUInt8();
				 ctab.noteLowLimit = t.readUInt8();	
				 ctab.noteHighLimit = t.readUInt8();
				 ctab.retriggerRule = t.readUInt8();			 
				 //console.debug("parseCasm ctab", ctab); 

			 } else {
				 ctab.lowestNote = t.readUInt8();
				 ctab.highestNote = t.readUInt8();	
				 ctab.lowNotes = getNotes(t);
				 ctab.middleNotes = getNotes(t);				 
				 ctab.highNotes = getNotes(t);
				 //console.debug("parseCasm ctb2", ctab); 				 
			 }

			 cseg.ctabs.push(ctab);			 
		 }
	  }
	
	  csegs.push(cseg);	
  }
  
  return csegs;
}

function getNotes(t) {
  var notes = {};
  notes.ntr = t.readUInt8();
  notes.ntt = t.readUInt8();
  notes.highKey = t.readUInt8();
  notes.noteLowLimit = t.readUInt8();	
  notes.noteHighLimit = t.readUInt8();
  notes.retriggerRule = t.readUInt8();  
  return notes;
}

function parseHeader(data) {
  var p = new Parser(data)
  var format = p.readUInt16()
  var numTracks = p.readUInt16()

  var result = {
    format: format,
    numTracks: numTracks
  }

  var timeDivision = p.readUInt16()
  
  if (timeDivision & 0x8000) {
    result.framesPerSecond = 0x100 - (timeDivision >> 8)
    result.ticksPerFrame = timeDivision & 0xFF
  } else {
    result.ticksPerBeat = timeDivision
  }
  return result
}

function parseData(data, arrName) {
  const p = new Parser(data);
  let variation = null;
  var events = {Hdr : {}};
  
  while (!p.eof()) {
    const event = readEvent(p);
	
	if (event) 
	{
		if (event.type == 'marker') 
		{
			if (arrName.toLowerCase().endsWith(".kst")) {			
				if (event.text == 'ARRA_MAJ') event.text = 'Main A';
				if (event.text == 'ARRB_MAJ') event.text = 'Main B';
				if (event.text == 'ARRC_MAJ') event.text = 'Main C';
				if (event.text == 'ARRD_MAJ') event.text = 'Main D';			
				if (event.text == 'FILA_MAJ') event.text = 'Fill In AA';
				if (event.text == 'FILB_MAJ') event.text = 'Fill In BB';
				if (event.text == 'FILC_MAJ') event.text = 'Fill In CC';
				if (event.text == 'FILD_MAJ') event.text = 'Fill In DD';
				if (event.text == 'INT1_MAJ') event.text = 'Intro A';			
				if (event.text == 'INT2_MAJ') event.text = 'Intro B';
				if (event.text == 'INT3_MAJ') event.text = 'Intro C';			
				if (event.text == 'END1_MAJ') event.text = 'Ending A';		
				if (event.text == 'END2_MAJ') event.text = 'Ending B';			
				if (event.text == 'END3_MAJ') event.text = 'Ending C';						
				if (event.text == 'BRKA_MAJ') event.text = 'Fill In AB';
				if (event.text == 'BRKB_MAJ') event.text = 'Fill In BA';
				
				if (event.text == 'Audya Style 1.0') {
					event.text = 'SInt';
					events['SFF1'] = [];
				}
			}
			
			variation = event.text;
			events[variation] = [];
			lastEventTypeByte = null;
		}
		else
			
		if (event.type == "setTempo") {
			events.Hdr.setTempo = event;
		}
		else
			
		if (event.type == "timeSignature") {
			events.Hdr.timeSignature = event;
		}			
		else {	
		
		  if (arrName.toLowerCase().endsWith(".kst")) {
			  if (event.channel == 4) event.channel = 10; 		// Bass  
			  else if (event.channel == 5) event.channel = 11; 	// Keyboard	    
			  else if (event.channel == 6) event.channel = 12; 	// Guitar  
			  else if (event.channel == 7) event.channel = 13; 	// Pad		  
			  else if (event.channel == 10) event.channel = 14; // Phrase 1  
			  else if (event.channel == 11) event.channel = 15; // Phrase 2	
		  }		  
		
		  if (variation) events[variation].push(event);
		}
	}
  }
  return events  
}

function readEvent(p) {
    var event = {}
    event.deltaTime = p.readVarInt()
	
    var eventTypeByte = p.readUInt8()

    if ((eventTypeByte & 0xf0) === 0xf0) {
      // system / meta event
      if (eventTypeByte === 0xff) {
        // meta event
        event.meta = true
        var metatypeByte = p.readUInt8()
        var length = p.readVarInt()
        switch (metatypeByte) {
          case 0x00:
            event.type = 'sequenceNumber'
            if (length !== 2) throw "Expected length for sequenceNumber event is 2, got " + length
            event.number = p.readUInt16()
            return event
          case 0x01:
            event.type = 'text'
            event.text = p.readString(length)
			//console.debug(event.type, event.text, event.deltaTime);				
            return null; //event			
          case 0x02:
            event.type = 'copyrightNotice'
            event.text = p.readString(length)
            return event
          case 0x03:
            event.type = 'trackName'
            event.text = p.readString(length)
			//console.debug(event.type, event.text, event.deltaTime);				
            return event
          case 0x04:
            event.type = 'instrumentName'
            event.text = p.readString(length)
			//console.debug(event.type, event.text, event.deltaTime);				
            return event
          case 0x05:
            event.type = 'lyrics'
            event.text = p.readString(length)
			//console.debug(event.type, event.deltaTime, event.text);				
            return event
          case 0x06:
            event.type = 'marker'
            event.text = p.readString(length)	
			//console.debug(event.type, event.deltaTime, event.text);	
            return event;
          case 0x07:
            event.type = 'cuePoint'
            event.text = p.readString(length)
            return event
          case 0x20:
            event.type = 'channelPrefix'
            if (length != 1) throw "Expected length for channelPrefix event is 1, got " + length
            event.channel = p.readUInt8()
            return event
          case 0x21:
            event.type = 'portPrefix'
            if (length != 1) throw "Expected length for portPrefix event is 1, got " + length
            event.port = p.readUInt8()
            return event
          case 0x2f:			
            event.type = 'endOfTrack'
            if (length != 0) throw "Expected length for endOfTrack event is 0, got " + length
			//console.debug(event.type,event.deltaTime);				
            return event
          case 0x51:
            event.type = 'setTempo';
            if (length != 3) throw "Expected length for setTempo event is 3, got " + length
            event.microsecondsPerBeat = p.readUInt24()
			//console.debug(event.type, event.deltaTime);				
            return event
          case 0x54:
            event.type = 'smpteOffset';
            if (length != 5) throw "Expected length for smpteOffset event is 5, got " + length
            var hourByte = p.readUInt8()
            var FRAME_RATES = { 0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30 }
            event.frameRate = FRAME_RATES[hourByte & 0x60]
            event.hour = hourByte & 0x1f
            event.min = p.readUInt8()
            event.sec = p.readUInt8()
            event.frame = p.readUInt8()
            event.subFrame = p.readUInt8()
			//console.debug(event.type, event.deltaTime);				
            return event
          case 0x58:
            event.type = 'timeSignature'
            if (length != 4) throw "Expected length for timeSignature event is 4, got " + length
            event.numerator = p.readUInt8()
            event.denominator = (1 << p.readUInt8())
            event.metronome = p.readUInt8()
            event.thirtyseconds = p.readUInt8()
			//console.debug(event.type, event.deltaTime);				
            return event
          case 0x59:
            event.type = 'keySignature'
            if (length != 2) throw "Expected length for keySignature event is 2, got " + length
            event.key = p.readInt8()
            event.scale = p.readUInt8()
			event.tonic = convertKey(event.key)
			event.symbol = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][event.tonic]
			//console.debug(event.type, event.deltaTime);				
            return event
          case 0x7f:
            event.type = 'sequencerSpecific'
            event.data = p.readBytes(length)
			//console.debug(event.type, event.deltaTime);				
            return event
          default:
            event.type = 'unknownMeta'
            event.data = p.readBytes(length)
            event.metatypeByte = metatypeByte
			//console.debug(event.type, event.deltaTime);				
            return event
        }
      } else if (eventTypeByte == 0xf0) {
        event.type = 'sysEx'
        var length = p.readVarInt()
        event.data = p.readBytes(length)	
		//console.debug(event.type, length, event.deltaTime, event.data[0], event.data[4]);			
        return event;
      } else if (eventTypeByte == 0xf7) {
        event.type = 'endSysEx'
        var length = p.readVarInt()
        event.data = p.readBytes(length)
		//console.debug(event.type, event.deltaTime);			
        return event;
      } else {
        console.debug("Unrecognised MIDI event type byte: " + eventTypeByte);
		return null;
      }
    } else {
      // channel event
      var param1
      if ((eventTypeByte & 0x80) === 0) {
        // running status - reuse lastEventTypeByte as the event type.
        // eventTypeByte is actually the first parameter
        if (lastEventTypeByte === null)
          //throw "Running status byte encountered before status byte"
		  return null;
        param1 = eventTypeByte
        eventTypeByte = lastEventTypeByte
        event.running = true
      } else {
        param1 = p.readUInt8()
        lastEventTypeByte = eventTypeByte
      }
      var eventType = eventTypeByte >> 4
      event.channel = eventTypeByte & 0x0f  
	  
      switch (eventType) {
        case 0x08:
          event.type = 'noteOff'
          event.noteNumber = param1
          event.velocity = p.readUInt8()
          return event
        case 0x09:
          var velocity = p.readUInt8()
          event.type = velocity === 0 ? 'noteOff' : 'noteOn'
          event.noteNumber = param1
          event.velocity = velocity
          if (velocity === 0) event.byte9 = true
          return event
        case 0x0a:
          event.type = 'noteAftertouch'
          event.noteNumber = param1
          event.amount = p.readUInt8()
          return event
        case 0x0b:
          event.type = 'controller'
          event.controllerType = param1
          event.value = p.readUInt8()
          return event
        case 0x0c:
          event.type = 'programChange'
          event.programNumber = param1
          return event
        case 0x0d:
          event.type = 'channelAftertouch'
          event.amount = param1
          return event
        case 0x0e:
          event.type = 'pitchBend'
          event.value = (param1 + (p.readUInt8() << 7)) - 0x2000
          return event
        default:
          console.error("Unrecognised MIDI event type: " + eventType);
		  return null;
      }
    }
}

function convertKey(key) {
	if (key == 1) return 7;	
	if (key == 2) return 2;	
	if (key == 3) return 9;
	if (key == 4) return 4;
	if (key == 5) return 11;
	if (key == 6) return 6;	

	if (key == -1) return 5;	
	if (key == -2) return 10;	
	if (key == -3) return 3;
	if (key == -4) return 8;
	if (key == -5) return 1;
	if (key == -6) return 6;	
	
	return 0;	
}

function Parser(data) {
  this.buffer = data;
  this.view = new Uint8Array(data);  
  this.bufferLen = this.view.length
  this.pos = 0
  this.decoder = new TextDecoder("utf-8");  
}

Parser.prototype.eof = function() {
  return this.pos >= this.bufferLen
}

Parser.prototype.readUInt8 = function() {
  var result = this.view[this.pos];
  this.pos += 1
  return result
}

Parser.prototype.readInt8 = function() {
  var u = this.readUInt8()
  if (u & 0x80)
    return u - 0x100
  else
    return u
}

Parser.prototype.readUInt16 = function() {
  var b0 = this.readUInt8(),
      b1 = this.readUInt8()

    return (b0 << 8) + b1
}

Parser.prototype.readUInt16LE = function() {
  var b0 = this.readUInt8(),
      b1 = this.readUInt8()

    return (b1 << 8) + b0
}

Parser.prototype.readInt16 = function() {
  var u = this.readUInt16()
  if (u & 0x8000)
    return u - 0x10000
  else
    return u
}

Parser.prototype.readUInt24 = function() {
  var b0 = this.readUInt8(),
      b1 = this.readUInt8(),
      b2 = this.readUInt8()

    return (b0 << 16) + (b1 << 8) + b2
}

Parser.prototype.readInt24 = function() {
  var u = this.readUInt24()
  if (u & 0x800000)
    return u - 0x1000000
  else
    return u
}

Parser.prototype.readUInt32 = function() {
  var b0 = this.readUInt8(),
      b1 = this.readUInt8(),
      b2 = this.readUInt8(),
      b3 = this.readUInt8()

    return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3
}

Parser.prototype.readUInt32LE = function() {
  var b0 = this.readUInt8(),
      b1 = this.readUInt8(),
      b2 = this.readUInt8(),
      b3 = this.readUInt8()

    return (b3 << 24) + (b2 << 16) + (b1 << 8) + b0
}

Parser.prototype.readBytes = function(len) {
  var bytes = this.buffer.slice(this.pos, this.pos + len)
  this.pos += len
  return bytes
}

Parser.prototype.readString = function(len) {
  var bytes = this.readBytes(len);
  var string = this.decoder.decode(bytes);  
  //console.debug("readString", len, bytes, string);  
  return string;
}

Parser.prototype.readVarInt = function() {
  var result = 0
  while (!this.eof()) {
    var b = this.readUInt8()
    if (b & 0x80) {
      result += (b & 0x7f)
      result <<= 7
    } else {
      // b is last byte
      return result + b
    }
  }
  // premature eof
  return result
}

Parser.prototype.readChunk = function() {
  var id = this.readString(4)
  var length = this.readUInt32()
  var data = this.readBytes(length)
  return {
    id: id,
    length: length,
    data: data
  }
}

Parser.prototype.readAtom = function() {
	var type = this.readUInt8();
	var length = this.readUInt8();

	if (type == 0) return this.readString(length);
	if (type == 1) return this.readUInt8();  
	if (type == 2) return this.readUInt8(); 
	if (type == 6) return this.readUInt8(); 	
	if (type == 7) return this.readUInt8(); 	
	if (type == 9) return this.readUInt8(); 
	if (type == 32) return this.readBytes(length); 	
	if (type == 33) return this.readBytes(length); 
	if (type == 34) return this.readBytes(length); 
}

Parser.prototype.readEvent = function() {
	var delta = this.readUInt8();
	var code = this.readUInt8();
	var value = this.readUInt8();
	return {delta, code, value};
}
