// data can be any array-like object.  It just needs to support .length, .slice, and an element getter []

function parseMidi(data) {
  var p = new Parser(data)
  var headerChunk = p.readChunk();
  var trackChunk = p.readChunk()
  var casmChunk = p.readChunk()
	
  if (headerChunk.id != 'MThd')
    throw "Bad MIDI file.  Expected 'MHdr', got: '" + headerChunk.id + "'"
	
  if (trackChunk.id != 'MTrk')
    throw "Bad MIDI file.  Expected 'MTrk', got: '" + trackChunk.id + "'"

  if (casmChunk.id != 'CASM')
    throw "Bad MIDI file.  Expected 'CASM', got: '" + casmChunk.id + "'"

  //console.debug("parseCasm casm", casmChunk.id, casmChunk.length); 
	  
  return {
    header: parseHeader(headerChunk.data),
    data: parseData(trackChunk.data),
	casm: parseCasm(casmChunk.data)
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

function parseData(data) {
  function readEvent() {
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
          case 0x02:
            event.type = 'copyrightNotice'
            event.text = p.readString(length)
            return event
          case 0x03:
            event.type = 'trackName'
            event.text = p.readString(length)
			console.debug(event.text, event.deltaTime);				
            return event
          case 0x04:
            event.type = 'instrumentName'
            event.text = p.readString(length)
			console.debug(event.text, event.deltaTime);				
            return event
          case 0x05:
            event.type = 'lyrics'
            event.text = p.readString(length)
            return event
          case 0x06:
            event.type = 'marker'
            event.text = p.readString(length)	
			console.debug(event.text, event.deltaTime);	
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
            return event
          case 0x51:
            event.type = 'setTempo';
            if (length != 3) throw "Expected length for setTempo event is 3, got " + length
            event.microsecondsPerBeat = p.readUInt24()
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
            return event
          case 0x58:
            event.type = 'timeSignature'
            if (length != 4) throw "Expected length for timeSignature event is 4, got " + length
            event.numerator = p.readUInt8()
            event.denominator = (1 << p.readUInt8())
            event.metronome = p.readUInt8()
            event.thirtyseconds = p.readUInt8()
            return event
          case 0x59:
            event.type = 'keySignature'
            if (length != 2) throw "Expected length for keySignature event is 2, got " + length
            event.key = p.readInt8()
            event.scale = p.readUInt8()
            return event
          case 0x7f:
            event.type = 'sequencerSpecific'
            event.data = p.readBytes(length)
            return event
          default:
            event.type = 'unknownMeta'
            event.data = p.readBytes(length)
            event.metatypeByte = metatypeByte
            return event
        }
      } else if (eventTypeByte == 0xf0) {
        event.type = 'sysEx'
        var length = p.readVarInt()
        event.data = p.readBytes(length)
        return event
      } else if (eventTypeByte == 0xf7) {
        event.type = 'endSysEx'
        var length = p.readVarInt()
        event.data = p.readBytes(length)
        return event
      } else {
        throw "Unrecognised MIDI event type byte: " + eventTypeByte
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
          throw "Unrecognised MIDI event type: " + eventType	  
      }
    }
  }
  
  const p = new Parser(data);
  let variation = null;
  var events = {Hdr : {}};
  var lastEventTypeByte = null  
  
  while (!p.eof()) {
    const event = readEvent();
	
	if (event) 
	{
		if (event.type == 'marker') {
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
			if (variation) events[variation].push(event);
		}
	}
  }
  return events  
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
