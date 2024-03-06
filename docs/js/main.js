const BASE = 48;
const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const SECTIONS = ["Arr A", "Arr B", "Arr C", "Arr D", "Intro 1", "End 1"];
const SECTION_IDS = ["arra", "arrb", "arrc", "arrd"]

const STRUM_NEUTRAL =  1.2857;
const STRUM_UP = -1.0000;
const STRUM_DOWN = 0.1429;
const STRUM_LEFT = 0.7143;
const STRUM_RIGHT = -0.4286;

const GREEN = 1;
const RED = 2;
const YELLOW = 0;
const BLUE = 3;
const ORANGE = 4;
const STARPOWER = 8;
const START = 9;

const STRUM = 9;
const TOUCH = 5;
const LOGO = 12;
const CONTROL = 100;

var bluetoothDevice = null;
var midiSynth = null;
var arrSynth = null;
var requestArrEnd = false;
var requestedEnd = "Ending A"
var tempVariation = {};
var currentSffVar = "Intro A";
var loadFile = null;
var fretButton = 127;
var padFretButton = 127;
var artiphonStrumUp = false;
var artiphonI1Base = 36;
var footSwCode7Enabled = false;
var playButton = null;
var gamePadModeButton = null;
var styleType = null;
var keyboard = new Map();
var bassLoop = null;
var drumLoop = null;
var chordLoop = null;
var realdrumLoop = null;
var songSequence = null;
var arrSequence = null;
var realdrumDevice = null;
var arranger = "webaudio";
var realGuitarStyle = "none";
var output = null;
var input = null;
var forward = null;
var padsDevice = null;
var padsInitialised = false;
var chordTracker = null;
var orinayo = null;
var orinayo_section = null;
var orinayo_strum = null;
var statusMsg = null;
var base = BASE;
var key = "C"
var keyChange = 0;
var padsMode = 0;
var sectionChange = 0;
var rgIndex = 0;
var nextRgIndex = 0;
var styleStarted = false;
var activeChord = null;
var arrChordType = "maj";
var guitarAvailable = false;
var firstChord = [base, base + 4, base + 7];
var rcLooperChord = 0;
var aerosPart = 1;
var aerosChordTrack = 1;
var aerosAux = false;
var aerosAuxMode = false;
var currentPlayNote;
var startofVariation;
var tempoCanvas = null;
var nextBeatTime = 0;
var playStartTime = 0;
var audioContext = null;
var unlocked = false;
var arrangerBeat;
var current16thNote;        		// What note is currently last scheduled?
var tempo = 100.0;          		// tempo (in beats per minute)
var lookahead = 25.0;       		// How frequently to call scheduling function 
									//(in milliseconds)
var scheduleAheadTime = 0.1;		// How far ahead to schedule audio (sec)
									// This is calculated from lookahead, and overlaps 
									// with next interval (in case the timer is late)
var nextNoteTime = 0.0;     		// when the next note is due.
var canvasContext;          		// canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; 		// the last "box" we drew on the screen
var notesInQueue = [];      		// the notes that have been put into the web audio,
									// and may or may not have played yet. {note, time}
var timerWorker = null;     		// The Web Worker used to fire timer messages

var canvas = {
  context : null,
  gameWidth : null,
  gameHeight : null
};

var game = null;
var pad = {buttons: [], axis: []};

var timeoutId = 0;
var timeouts = {};

var timeoutWorker = new Worker("./js/timeout-worker.js");
timeoutWorker.addEventListener("message", myWorkerTimer);

var idbKeyval = (function (exports) {
	'use strict';

	class Store {
		constructor(dbName = 'keyval-store', storeName = 'keyval') {
			this.storeName = storeName;
			this._dbp = new Promise((resolve, reject) => {
				const openreq = indexedDB.open(dbName, 1);
				openreq.onerror = () => reject(openreq.error);
				openreq.onsuccess = () => resolve(openreq.result);
				// First time setup: create an empty object store
				openreq.onupgradeneeded = () => {
					openreq.result.createObjectStore(storeName);
				};
			});
		}
		_withIDBStore(type, callback) {
			return this._dbp.then(db => new Promise((resolve, reject) => {
				const transaction = db.transaction(this.storeName, type);
				transaction.oncomplete = () => resolve();
				transaction.onabort = transaction.onerror = () => reject(transaction.error);
				callback(transaction.objectStore(this.storeName));
			}));
		}
	}
	let store;

	function getDefaultStore() {
		if (!store)
			store = new Store();
		return store;
	}

	function get(key, store = getDefaultStore()) {
		let req;
		return store._withIDBStore('readonly', store => {
			req = store.get(key);
		}).then(() => req.result);
	}

	function set(key, value, store = getDefaultStore()) {
		return store._withIDBStore('readwrite', store => {
			store.put(value, key);
		});
	}

	function del(key, store = getDefaultStore()) {
		return store._withIDBStore('readwrite', store => {
			store.delete(key);
		});
	}

	function clear(store = getDefaultStore()) {
		return store._withIDBStore('readwrite', store => {
			store.clear();
		});
	}

	function keys(store = getDefaultStore()) {
		let req;
		return store._withIDBStore('readwrite', store => {
			req = store.getAll();
		}).then(() => req.result);
	}

	exports.Store = Store;
	exports.get = get;
	exports.set = set;
	exports.del = del;
	exports.clear = clear;
	exports.keys = keys;

	return exports;

}({}));

window.requestAnimFrame = window.requestAnimationFrame;
window.addEventListener("load", onloadHandler);
window.addEventListener("beforeunload", () => saveConfig());
window.addEventListener('message', messageHandler);

function myWorkerTimer(evt) {
  var data = evt.data,
      id = data.id,
      fn = timeouts[id].fn,
      args = timeouts[id].args;

  fn.apply(null, args);
  delete timeouts[id];
};

function myclearTimeout(id) {
  timeoutWorker.postMessage({command: "clearTimeout", id: id});
  delete timeouts[id];
};

function mysetTimeout(fn, delay) {
  var args = Array.prototype.slice.call(arguments, 2);
  timeoutId += 1;
  delay = delay || 0;
  var id = timeoutId;
  timeouts[id] = {fn: fn, args: args};
  timeoutWorker.postMessage({command: "setTimeout", id: id, timeout: delay});
  return id;
};

function messageHandler(evt) {
	console.debug("messageHandler", evt);	
}

function onChordaConnect() {
	console.debug('onChordaConnect');	

	const MIDI_SERVICE_UID            = '03B80E5A-EDE8-4B33-A751-6CE34EC4C700'.toLowerCase();
	const MIDI_IO_CHARACTERISTIC_UID  = '7772E5DB-3868-4112-A1A9-F2669D106BF3'.toLowerCase();

	navigator.bluetooth.requestDevice({
		filters: [{
		  services: [MIDI_SERVICE_UID],
		  name: "Artiphon Chorda"
		}]
	})
	.then(device => {
		bluetoothDevice = device;
		// Set up event listener for when device gets disconnected.
		console.debug('Connecting to GATT server of ' + device.name);
		device.addEventListener('gattserverdisconnected', onChordaDisconnected);
		return device.gatt.connect();
	})
	.then(server => {
		console.debug('Getting Service...');
		return server.getPrimaryService(MIDI_SERVICE_UID);
	})
	.then(service => {
		console.debug('Getting Characteristic...');
		return service.getCharacteristic(MIDI_IO_CHARACTERISTIC_UID);
	})
	.then(characteristic => {
		console.debug('Found Characteristic...');
		return characteristic.startNotifications();
	})
	.then(characteristic => {
		// Set up event listener for when characteristic value changes.
		characteristic.addEventListener('characteristicvaluechanged',	handleChordaMidiMessage);
		console.debug('Bluetooth MIDI Notifications have been started.')
		document.querySelector(".chorda_bluetooth").innerHTML = "BT ON";
	})
	.catch(error => { 
		console.error('ERRORCODE: ' + error); 
		document.querySelector(".chorda_bluetooth").innerHTML = "BT Error";		
	});	
}

function onChordaDisconnected(event) {
	document.querySelector(".chorda_bluetooth").innerHTML = "BT OFF";	
	if (!bluetoothDevice || !bluetoothDevice.gatt.connected) return;
	bluetoothDevice.gatt.disconnect();
	let device = event.target;
	console.debug('Device ' + device.name + ' is disconnected.');	
}

function handleChordaMidiMessage(evt) {
	const {buffer}  = evt.target.value;
	const eventData = new Uint8Array(buffer);

	bleMIDIrx(eventData);	
}

function loadMidiSynth() {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', "./assets/gmgsx.sf2", true);
	xhr.responseType = 'arraybuffer';

	xhr.addEventListener('load', function(ev) {
		const midiSf2 = new Uint8Array(ev.target.response);
		console.debug("loadMidiSynth", midiSf2);
		
		midiSynth = new SoundFont.WebMidiLink();
		midiSynth.loadSoundFont(new Uint8Array(midiSf2));			
	});

	xhr.send();	
}

function onloadHandler() {
	console.debug("onloadHandler");

	playButton = document.querySelector(".play");
	gamePadModeButton = document.querySelector(".gamepad_mode");
	styleType = document.querySelector(".style_type");
	tempoCanvas = orinayo = document.querySelector('#tempoCanvas');	
	orinayo = document.querySelector('#orinayo');
	orinayo_section = document.querySelector('#orinayo-section');
	orinayo_strum = document.querySelector('#orinayo-strum');	
	statusMsg = document.querySelector('#statusMsg');

	window.addEventListener("gamepadconnected", connectHandler);
	window.addEventListener("gamepaddisconnected", disconnectHandler);

	document.querySelector('#giglad').addEventListener("click", () => {			
		setTimeout(() => outputSendControlChange (85, 127, 4), 10000);	// FADE IN
		setTimeout(() => outputSendControlChange (86, 127, 4), 20000);	// FADE OUT
		setTimeout(() => outputSendControlChange (87, 127, 4), 30000);	// PLAY
		setTimeout(() => outputSendControlChange (88, 127, 4), 40000);	// STOP		
		
		setTimeout(() => outputSendControlChange (102, 127, 4), 50000);	// intro
		setTimeout(() => outputSendControlChange (103, 127, 4), 60000);
		setTimeout(() => outputSendControlChange (104, 127, 4), 70000);
		
		setTimeout(() => outputSendControlChange (108, 127, 4), 80000);	// Main
		setTimeout(() => outputSendControlChange (109, 127, 4), 90000);
		setTimeout(() => outputSendControlChange (110, 127, 4), 100000);
		setTimeout(() => outputSendControlChange (111, 127, 4), 110000);		
			
		setTimeout(() => outputSendControlChange (112, 127, 4), 120000);	// Fill/Break
		setTimeout(() => outputSendControlChange (113, 127, 4), 130000);
		setTimeout(() => outputSendControlChange (114, 127, 4), 140000);
		setTimeout(() => outputSendControlChange (115, 127, 4), 150000);
		setTimeout(() => outputSendControlChange (116, 127, 4), 160000);
		setTimeout(() => outputSendControlChange (117, 127, 4), 170000);
		setTimeout(() => outputSendControlChange (118, 127, 4), 180000);
		setTimeout(() => outputSendControlChange (119, 127, 4), 190000);	

		setTimeout(() => outputSendControlChange (105, 127, 4), 200000);	// End
		setTimeout(() => outputSendControlChange (106, 127, 4), 210000);
		setTimeout(() => outputSendControlChange (107, 127, 4), 220000);
			
	});

	const upload = document.getElementById("load-midifile");
	
	upload.addEventListener('change', function(event) {
		handleFileContent(event);
	});	
	
  
	const chordaBluetooth = document.querySelector(".chorda_bluetooth");
	
	chordaBluetooth.addEventListener('click', function(event) {
		onChordaConnect(event);
	});		

	resetApp = document.querySelector(".reset_app")
		
	resetApp.addEventListener('click', function(event) {
		location.reload();
	});	
	
	loadFile = document.querySelector(".load_file")
		
	loadFile.addEventListener('click', function(event) {
		upload.click();	
	});	

	styleType.addEventListener("click", function() {
		styleType.innerText = styleType.innerText == "DJ" ? "Normal" : "DJ";	
	});
	
	gamePadModeButton.addEventListener("click", function() {	
		gamePadModeButton.innerText = (gamePadModeButton.innerText == "Color Tabs" ? "Smart Strums" : (gamePadModeButton.innerText == "Smart Strums" ? "Smart Strings" : "Color Tabs"));	
	});	
	
	
	playButton.addEventListener("click", function() {	
		if (arranger == "webaudio" && realdrumLoop) {
			
			if (drumLoop) {
				toggleStartStop();
			} else {
				setupRealDrums();	
			}
		} else {
			toggleStartStop();					
		}
	});	
	
	document.querySelector("#tempo").addEventListener("input", function(event) {
		tempo = +event.target.value; 
		document.getElementById('showTempo').innerText = tempo;
	});
	
	document.addEventListener('keyup', (event) => {
		var name = event.key;
		var code = event.code;
		
		//console.debug("keyup", name, code);	
		keyboard.delete(name);			
	});
	
	document.addEventListener('keydown', (event) => {
		var name = event.key;
		var code = event.code;
		
		//console.debug("keydown", name, code);
		
		if (!keyboard.has(name)) {
			keyboard.set(name, true);			
			handleKeyboard(name, code);	
		}			
	});	
	
	letsGo();
}

function handleFileContent(event) {
	console.debug("handleFileContent", event);	
	var files = event.target.files;

	for (const file of files) {
		var reader = new FileReader();

		reader.onload = function(event)	{
			if (file.name.toLowerCase().endsWith(".kst") || file.name.toLowerCase().endsWith(".sty") || file.name.toLowerCase().endsWith(".prs") || file.name.toLowerCase().endsWith(".bcs") || file.name.toLowerCase().endsWith(".ac7")) {
				handleStyleFile(file, event.target.result);
			}			
			else
				
			if (file.name.toLowerCase().endsWith(".sf2")) {
				handleSF2File(file, event.target.result);
			}			
			else {
				alert("Only soundfonts or style files supported");
			}
		};

		reader.onerror = function(event) {
			console.error("handleFileContent - error", event);
		};

		reader.readAsArrayBuffer(file);
		break;
	}
}

function handleSF2File(file, data) {
	console.debug("handleSF2File", file, data);
	
	const store = new idbKeyval.Store(file.name, file.name);

	idbKeyval.set(file.name, data, store).then(function () {
		console.debug("sf2 set", file.name, data);
		arrSynth = {name: file.name};
		saveConfig();
		location.reload();			
		
	}).catch(function (err) {
		console.error('sf2 set failed!', err)
	});			
}

function handleStyleFile(file, data) {
	console.debug("handleStyleFile", file, input);
	
	const store = new idbKeyval.Store(file.name, file.name);

	idbKeyval.set(file.name, data, store).then(function () {
		arrSequence = {name: file.name};
		saveConfig();
		location.reload();			
		
	}).catch(function (err) {
		console.error('handleStyleFile db set failed!', err)
	});	
}

function setTempo(tmpo) {
	tempo = tmpo;
	document.querySelector("#tempo").value = tempo; 
	document.getElementById('showTempo').innerText = tempo;
}

function handleKeyboard(name, code) {
	//console.debug("handleKeyboard", name, code);
	var handled = false;

	if (!game) {
		setup();
		resetGuitarHero();
	}	
		
	if (keyboard.get("Enter")) {
		pad.buttons[LOGO] = true;
		if (keyboard.get("Backspace")) pad.buttons[YELLOW] = true; 	// End1
		handled = true;				
	}
	else
	  
	if (keyboard.get("+")) {
		pad.axis[STRUM] = STRUM_RIGHT;
		handled = true;			
	}	
	else
	  
	if (keyboard.get("-")) {
		pad.axis[STRUM] = STRUM_LEFT;
		handled = true;			
	}	
	  
	if (keyboard.get("0") || keyboard.get(".") || keyboard.get("1") || keyboard.get("2") || keyboard.get("3") || keyboard.get("4") || keyboard.get("5") || keyboard.get("6") || keyboard.get("7") || keyboard.get("8") || keyboard.get("9") || keyboard.get("*") || keyboard.get("/") || keyboard.get("Backspace")) {	
		toggleStrumUpDown();
		handled = true;			

		if (keyboard.get("Backspace") && keyboard.get("0")) {	// Fill
			pad.axis[TOUCH] = -0.7;
			pad.axis[STRUM] = STRUM_DOWN;			
		}
		else	
		
		if (keyboard.get(".") && !keyboard.get("0")) {		// style next
			pad.buttons[START] = true;
			handled = true;		
		}
		else

		if (keyboard.get("0") && !keyboard.get(".")) {		// style prev
			pad.buttons[STARPOWER] = true;
			handled = true;				
		}		
		else 
			
		if (keyboard.get("Backspace") && keyboard.get("1")) {	// Mute Drums
			pad.axis[TOUCH] = 1.0;	
			pad.axis[STRUM] = STRUM_DOWN;			
		}
		else 
			
		if (keyboard.get("Backspace") && keyboard.get("2")) {	// Mute Chord
			pad.axis[TOUCH] = 1.0;	
			pad.axis[STRUM] = STRUM_DOWN;				
		}
		else 
			
		if (keyboard.get("Backspace") && keyboard.get("3")) {	// Mute Bass
			pad.axis[TOUCH] = -0.4;
			pad.axis[STRUM] = STRUM_DOWN;			
		}
		else 
			
		if (keyboard.get("7") && keyboard.get("8")) {			// 3
			pad.buttons[GREEN] = true;
			pad.buttons[YELLOW] = true;			
			pad.buttons[BLUE] = true;				
		}
		else 
			
		if (keyboard.get("1") && keyboard.get("2")) {			// 2
			pad.buttons[RED] = true;		
			pad.buttons[BLUE] = true;				
		}
		else 
			
		if (keyboard.get("4") && keyboard.get("5")) {			// 6
			pad.buttons[RED] = true;
			pad.buttons[YELLOW] = true;			
			pad.buttons[BLUE] = true;	
			
		}
		else 
			
		if (keyboard.get("5") && keyboard.get("6")) {			// 1sus
			pad.buttons[ORANGE] = true;
			pad.buttons[YELLOW] = true;	
		}
		else 
			
		if (keyboard.get("8") && keyboard.get("9")) {			// 5sus
			pad.buttons[GREEN] = true;
			pad.buttons[YELLOW] = true;	
			
		}
		else 
			
		if (keyboard.get("2") && keyboard.get("3")) {			// 4m
			pad.buttons[ORANGE] = true;
			pad.buttons[RED] = true;	
			
		}	

		else if (keyboard.get("5") && !keyboard.get("4") && !keyboard.get("6")) {
			pad.buttons[YELLOW] = true;		// 1	
			
		}
		else if (keyboard.get("2") && !keyboard.get("1") && !keyboard.get("3")) {
			pad.buttons[ORANGE] = true;		// 4	
			
		}			
		else if (keyboard.get("8") && !keyboard.get("7") && !keyboard.get("9")) {
			pad.buttons[GREEN] = true;	
			
		}			// 5
		else if (keyboard.get("4") && !keyboard.get("5")) {
			pad.buttons[RED] = true;								// 6m	
			
		}			
		else if (keyboard.get("1") && !keyboard.get("2")) {
			pad.buttons[BLUE] = true;								// 2m	
			
		}
		
		else if (keyboard.get("7") && !keyboard.get("8")) {														// 3m
			pad.buttons[GREEN] = true;
			pad.buttons[BLUE] = true;	
			
		}
		else if (keyboard.get("3") && !keyboard.get("2")) {														// 4/6
			pad.buttons[ORANGE] = true;
			pad.buttons[BLUE] = true;	
			
		}		
		else if (keyboard.get("6") && !keyboard.get("5")) {														// 1/3
			pad.buttons[BLUE] = true;
			pad.buttons[YELLOW] = true;	
			
		}
		else if (keyboard.get("9") && !keyboard.get("8")) {														// 5/7
			pad.buttons[GREEN] = true;
			pad.buttons[RED] = true;	
			
		}
		else if (keyboard.get("*") && keyboard.get("/")) {														// 3b
			pad.buttons[ORANGE] = true;		
			pad.buttons[BLUE] = true;
			pad.buttons[RED] = true;	
			
		}	
		else if (keyboard.get("/") && !keyboard.get("*")) {														// 5b			
			pad.buttons[YELLOW] = true;			
			pad.buttons[GREEN] = true;
			pad.buttons[RED] = true;	
			
		}		
		else if (keyboard.get("*") && !keyboard.get("/")) {														// 7b
			pad.buttons[YELLOW] = true;			
			pad.buttons[RED] = true;	
			
		}		
	}	

	if (handled) {
		doChord();
		updateCanvas();			
		resetGuitarHero();	
	}
	
}

function toggleStrumUpDown() {
	pad.axis[STRUM] = artiphonStrumUp ? STRUM_UP : STRUM_DOWN;
	if (forward) forward.playNote(artiphonStrumUp ? 122 : 121, 1, {velocity: 0.5, duration: 1000});				
	artiphonStrumUp = !artiphonStrumUp;
}

function handleNoteOff(note, device, velocity, channel) {	
	//console.debug("handleNoteOff", note);
	
	if (device == "WIDI Uhost") {
		//console.debug("WIDI - chorda handleNoteOff", note.number, device, velocity, channel);
		translateChordaToI1(handleNoteOff, false, note.number, velocity, channel) 	// calls handleNoteOff again with device == INSTRUMENT1			
	}
	else
		
	if (device == "INSTRUMENT1") {
		const fwdChord = [];
		
		if (!game) {
			setup();
			resetArtiphonI1Buttons();	
			resetArtiphonI1Axis();		
		}		
			
		if (gamePadModeButton.innerText == "Color Tabs") {
			if (pad.buttons[GREEN]) fwdChord.push(127);						
			if (pad.buttons[RED]) fwdChord.push(126);
			if (pad.buttons[YELLOW]) fwdChord.push(125);						
			if (pad.buttons[BLUE]) fwdChord.push(124);
			if (pad.buttons[ORANGE]) fwdChord.push(123);
			if (pad.axis[STRUM] == STRUM_UP) fwdChord.push(122);								
			if (pad.axis[STRUM] == STRUM_DOWN) fwdChord.push(121);	
			
			if (forward) forward.stopNote(fwdChord, 1, {velocity});	
			stopPads();
			
			if (note.number < artiphonI1Base + 10 && note.number >= artiphonI1Base) {
				stopChord();
			}			
			
		} else {
			
			if (pad.buttons[GREEN]) fwdChord.push(127);						
			if (pad.buttons[RED]) fwdChord.push(126);
			if (pad.buttons[YELLOW]) fwdChord.push(125);						
			if (pad.buttons[BLUE]) fwdChord.push(124);
			if (pad.buttons[ORANGE]) fwdChord.push(123);
			/*if (pad.axis[STRUM] == STRUM_UP) fwdChord.push(122);								
			if (pad.axis[STRUM] == STRUM_DOWN) fwdChord.push(121);*/

			pad.axis[STRUM] = STRUM_UP;
			fwdChord.push(122);	
			
			if (fretButton) {
				fwdChord.push(fretButton);
			}
			if (forward) forward.stopNote(fwdChord, 1, {velocity});
			stopPads();			
		}			
						
		if (note.number < artiphonI1Base + 10 && note.number >= artiphonI1Base) {
			pad.axis[STRUM] = 0;
			pad.buttons[CONTROL] = false;	
			pad.buttons[START] = false;	
			pad.buttons[STARPOWER] = false;	
			pad.axis[TOUCH] = 0;	

			if (padFretButton && forward) {
				const fwdChord = [119];
				fwdChord.push(padFretButton);	
				forward.stopNote(fwdChord, 1, {velocity});	
			}			
		}	
		else				

		if (note.number == artiphonI1Base + 24) {			// GREEN	
			pad.buttons[GREEN] = false;			
		}
		else 
			
		if (note.number == artiphonI1Base + 26) {			// RED		
			pad.buttons[RED] = false;				
		}
		else 
			
		if (note.number == artiphonI1Base + 28) {			// YELLOW		
			pad.buttons[YELLOW] = false;			
		}
		else 
			
		if (note.number == artiphonI1Base + 29) {			// BLUE		
			pad.buttons[BLUE] = false;
		}
		else 
			
		if (note.number == artiphonI1Base + 31) {			// ORANGE		
			pad.buttons[ORANGE] = false;	
		}
		else 
			
		if (note.number == artiphonI1Base + 33) {			// CONTROL		
			pad.buttons[CONTROL] = false;	
			pad.buttons[START] = false;	
			pad.buttons[STARPOWER] = false;				
		}
		else 
			
		if (note.number == artiphonI1Base + 35) {			// PLAY		
			pad.buttons[LOGO] = false;	
			pad.buttons[GREEN] = false;	
			pad.buttons[RED] = false;
			pad.buttons[YELLOW] = false;
			pad.buttons[BLUE] = false;
			pad.buttons[ORANGE] = false;			
		}		
		
		updateCanvas();				
	}				

	
}

function handleNoteOn(note, device, velocity, channel) {
	//console.debug("handleNoteOn", note, device, velocity, channel);
	
	if (device == "WIDI Uhost") {
		//console.debug("WIDI - chorda handleNoteOn", note.number, device, velocity);		
		translateChordaToI1(handleNoteOn, true, note.number, velocity, channel) 	// calls handleNoteOn again with device == INSTRUMENT1	
	}
	else
		
	if (device == "INSTRUMENT1") {
		
		if (!game) {
			setup();
			resetArtiphonI1Buttons();	
			resetArtiphonI1Axis();		
		}	
			
		if (note.number < artiphonI1Base + 10 && note.number >= artiphonI1Base) {			// STRUM UP/DOWN (BRIDGE Buttons)
			//console.debug("handleNoteOn - strum up/down", pad.buttons[GREEN], pad.buttons[RED], pad.buttons[YELLOW], pad.buttons[BLUE], pad.buttons[ORANGE]);	

			if (!pad.buttons[GREEN] && !pad.buttons[RED] && !pad.buttons[YELLOW] && !pad.buttons[BLUE] && !pad.buttons[ORANGE] && !pad.buttons[CONTROL] && !pad.buttons[LOGO]) {
				
				if (note.number == artiphonI1Base + 9) {
					pad.axis[TOUCH] = -0.7;
					pad.axis[STRUM] = STRUM_DOWN;			// fill
				}
				else
					
				if (note.number == artiphonI1Base) {
					pad.axis[TOUCH] = -0.7;
					pad.axis[STRUM] = STRUM_UP;				// break
				}
				else				
					
				if (note.number == artiphonI1Base + 7) {
					pad.buttons[START] = false;	
					pad.buttons[STARPOWER] = true;			// next var				
				}				
				else
					
				if (note.number == artiphonI1Base + 5) {
					pad.buttons[START] = true;				// prev var
					pad.buttons[STARPOWER] = false;						
				}
				
				if (!styleStarted && forward) {						
					if (note.number == artiphonI1Base) {
						padFretButton = (127);
						padsMode = 0;						
					}
					if (note.number == artiphonI1Base + 4) {
						padFretButton =(126);
						padsMode = 1;	
					}
					if (note.number == artiphonI1Base + 5) {
						padFretButton =(125);	
						padsMode = 2;	
					}
					if (note.number == artiphonI1Base + 7) {
						padFretButton =(124);	
						padsMode = 3;
					}
					if (note.number == artiphonI1Base + 9) {
						padFretButton = (123);
						padsMode = 4;
					}					

					if (padFretButton) {
						if (padsDevice?.stopNote || padsDevice?.name == "soundfont") stopPads();
						const fwdChord = [119];
						fwdChord.push(padFretButton);	
						forward.playNote(fwdChord, 1, {velocity});	
						return;
					}
				}
			}
			else
				
			if (gamePadModeButton.innerText == "Color Tabs") {
				
				if (note.number == artiphonI1Base) pad.axis[STRUM] = STRUM_UP;	
				if (note.number == artiphonI1Base + 2) pad.axis[STRUM] = STRUM_DOWN;	
				if (note.number == artiphonI1Base + 4) pad.axis[STRUM] = STRUM_UP;	
				if (note.number == artiphonI1Base + 5) pad.axis[STRUM] = STRUM_DOWN;	
				if (note.number == artiphonI1Base + 7) pad.axis[STRUM] = STRUM_UP;	
				if (note.number == artiphonI1Base + 9) pad.axis[STRUM] = STRUM_DOWN;								
			
			} else if (gamePadModeButton.innerText == "Smart Strums") {
					
				if (note.number == artiphonI1Base) fretButton = (127);	
				if (note.number == artiphonI1Base + 2) fretButton =(126);
				if (note.number == artiphonI1Base + 4) fretButton =(125);	
				if (note.number == artiphonI1Base + 5) fretButton =(124);	
				if (note.number == artiphonI1Base + 7) fretButton = (123);	

				const fwdChord = [fretButton];
				
				if (note.number == artiphonI1Base + 9) {
					pad.axis[STRUM] = STRUM_UP;
					fwdChord.push(122);						
				}
				
				forward.playNote(fwdChord, 1, {velocity});	
				
			} else if (gamePadModeButton.innerText == "Smart Strings") {
					
				if (note.number == artiphonI1Base) fretButton = (127);	
				if (note.number == artiphonI1Base + 2) fretButton =(126);
				if (note.number == artiphonI1Base + 4) fretButton =(125);	
				if (note.number == artiphonI1Base + 5) fretButton =(124);	
				if (note.number == artiphonI1Base + 7) fretButton = (123);	
				
				const fwdChord = [fretButton];			
				
				if (note.number == artiphonI1Base + 9) {
					fwdChord.push(121);	
					pad.axis[STRUM] = STRUM_DOWN;
				} else {
					fwdChord.push(122);	
					pad.axis[STRUM] = STRUM_UP;
					
				}					
				forward.playNote(fwdChord, 1, {velocity});					
			}
				
			if (pad.buttons[LOGO]) 
			{
				if (note.number == artiphonI1Base) pad.buttons[GREEN] = true;
				if (note.number == artiphonI1Base + 2) pad.buttons[RED] = true;
				if (note.number == artiphonI1Base + 4) pad.buttons[YELLOW] = true;
				if (note.number == artiphonI1Base + 5) pad.buttons[BLUE] = true;	
				if (note.number == artiphonI1Base + 7) pad.buttons[ORANGE] = true;			
			}				
		}
		else				

		if (note.number == artiphonI1Base + 24) {			// GREEN	
			pad.buttons[GREEN] = true;			
		}
		else 
			
		if (note.number == artiphonI1Base + 26) {			// RED		
			pad.buttons[RED] = true;				
		}
		else 
			
		if (note.number == artiphonI1Base + 28) {			// YELLOW		
			pad.buttons[YELLOW] = true;			
		}
		else 
			
		if (note.number == artiphonI1Base + 29) {			// BLUE		
			pad.buttons[BLUE] = true;
		}
		else 
			
		if (note.number == artiphonI1Base + 31) {			// ORANGE		
			pad.buttons[ORANGE] = true;	
		}	
		else 
			
		if (note.number == artiphonI1Base + 33) {			// FILL, NEXT and PREV				
			pad.buttons[CONTROL] = true;				
		}		
		else 
			
		if (note.number == artiphonI1Base + 35) {			// INTRO, END, START, STOP			
			pad.buttons[LOGO] = true;						// requires strum up/down to execute
		}		
		
		if (forward && gamePadModeButton.innerText == "Color Tabs") {
			const fwdChord = [];
			if (pad.buttons[GREEN]) fwdChord.push(127);						
			if (pad.buttons[RED]) fwdChord.push(126);
			if (pad.buttons[YELLOW]) fwdChord.push(125);						
			if (pad.buttons[BLUE]) fwdChord.push(124);
			if (pad.buttons[ORANGE]) fwdChord.push(123);
			if (pad.axis[STRUM] == STRUM_UP) fwdChord.push(122);								
			if (pad.axis[STRUM] == STRUM_DOWN) fwdChord.push(121);						
			
			if (fwdChord.length > 0) forward.playNote(fwdChord, 1, {velocity});
		}

		updateCanvas();	

		if (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN || pad.buttons[START] || pad.buttons[STARPOWER]) {			
			doChord();				
		}
	}

}

function resetArtiphonI1Buttons() {
	for (var i=0; i<20; i++) {	  
	  pad.buttons[i] = false;
	}	
}

function resetArtiphonI1Axis() {
	for (var i=0; i<20; i++) {	  
	  pad.axis[i] = 0;
	}	
}

function resetGuitarHero() {
	for (var i=0; i<20; i++) {	  
	  pad.buttons[i] = false;
	  pad.axis[i] = 0;
	}	
}

function connectHandler(e) {
  console.debug("connectHandler " + e.gamepad.id, e.gamepad);	
  
  if (e.gamepad.id.indexOf("Guitar") > -1 || (e.gamepad.id.indexOf("248a") > -1 && e.gamepad.id.indexOf("8266") > -1)) {
	console.debug("connectHandler found gamepad " + e.gamepad.id, e.gamepad);
  
	if (!game) setup();
		  
	for (var i=0; i<e.gamepad.buttons.length; i++) {	  
	  pad.buttons[i] = false;
	}
	  window.setTimeout(updateStatus);  
  }
}

function disconnectHandler(e) {
  if (e.gamepad.id.indexOf("Guitar ") > -1)
  {
	  console.debug("removing guitar");	  
  }
}

function updateStatus() {
	var guitar = null
	var ring = null
	
	var gamepads = navigator.getGamepads();	
	  
	for (var i = 0; i < gamepads.length; i++) {
		//console.debug("found gamepad " + gamepads[i].id, gamepads[i]);
		
		if (gamepads[i] && gamepads[i].id.indexOf("Guitar") > -1) {
		  guitar = gamepads[i];
		  guitarAvailable = true;
		  break;
		}
		else
			
		if (gamepads[i] && gamepads[i].id.indexOf("248a") > -1 && gamepads[i].id.indexOf("8266") > -1) {
		  ring = gamepads[i];
		  guitarAvailable = true;
		  break;
		}		
	}
	
	var updated = false;

	if (ring) {	
		for (var i=0; i<ring.buttons.length; i++) 
		{
			var val = ring.buttons[i];
			var touched = false;							
		  
			if (typeof(val) == "object") {	  			
				if ('touched' in val) {
				  touched = val.touched;
				}			
			}
		  
			if (pad.buttons[i] != touched) {
				console.debug("button " + i, touched, ring.axes[0], ring.axes[1]);									
				pad.buttons[i] = touched;
				//updated = updated || true;
			}
		}

	}
	else	
  
	if (guitar) {				
		//console.debug("using guitar" + guitar.id, guitar);
		
		for (var i=0; i<guitar.buttons.length; i++) 
		{
			var val = guitar.buttons[i];
			var touched = false;							
		  
			if (typeof(val) == "object") 
			{	  			
				if ('touched' in val) {
				  touched = val.touched;
				}			
			}
		  
			if (pad.buttons[i] != touched) {
				//console.debug("button " + i, touched);									
				pad.buttons[i] = touched;
				updated = updated || true;
			}
		}	
		if (guitar.axes.length > STRUM) 
		{			
			if (pad.axis[STRUM] != guitar.axes[STRUM].toFixed(4)) {
				//console.debug("strum", guitar.axes[STRUM].toFixed(4));							
				pad.axis[STRUM] = guitar.axes[STRUM].toFixed(4);
				updated = updated || true;
			}

			if (pad.axis[TOUCH] != guitar.axes[TOUCH].toFixed(1)) {
				//console.debug("touch", guitar.axes[TOUCH].toFixed(1));							
				pad.axis[TOUCH] = guitar.axes[TOUCH].toFixed(1);
				updated = updated || true;				
			}			
		}				
	}
		
	if (updated) {
		doChord();
		updateCanvas();	
	}	
	
	window.setTimeout(updateStatus);
}

function letsGo() {
	let data = localStorage.getItem("orin.ayo.config");
	if (!data) data = '{"arranger": "webaudio"}';
	console.debug("letsGo", data, WebMidi);		
	
	const config = JSON.parse(data);
	
    WebMidi.enable(async function (err)
    {
      if (err) {
        alert("Orin Ayo - " + err);
	  }
	  
	  setupUI(config, err);	
    }, true);
}

function normaliseStyle() {
	if (arrSequence.data["Main A"] && arrSequence.data["Fill In AA"]) 
	{
		if (!arrSequence.data["Main B"] || arrSequence.data["Main B"].length == 0) {
			arrSequence.data["Main B"] = JSON.parse(JSON.stringify(arrSequence.data["Main A"]));
			arrSequence.data["Fill In BB"] = JSON.parse(JSON.stringify(arrSequence.data["Fill In AA"]));		
		}
		
		if (!arrSequence.data["Main C"] || arrSequence.data["Main C"].length == 0) {
			arrSequence.data["Main C"] = JSON.parse(JSON.stringify(arrSequence.data["Main A"]));
			arrSequence.data["Fill In CC"] = JSON.parse(JSON.stringify(arrSequence.data["Fill In AA"]));		
		}	
		
		if (!arrSequence.data["Main D"] || arrSequence.data["Main D"].length == 0) {
			arrSequence.data["Main D"] = JSON.parse(JSON.stringify(arrSequence.data["Main B"]));
			arrSequence.data["Fill In DD"] = JSON.parse(JSON.stringify(arrSequence.data["Fill In BB"]));		
		}	
		
		if (!arrSequence.data["Fill In BB"] || arrSequence.data["Fill In BB"].length == 0) {
			arrSequence.data["Fill In BB"] = JSON.parse(JSON.stringify(arrSequence.data["Fill In AA"]));		
		}		

		if (!arrSequence.data["Fill In DD"] || arrSequence.data["Fill In DD"].length == 0) {
			arrSequence.data["Fill In DD"] = JSON.parse(JSON.stringify(arrSequence.data["Fill In BB"]));		
		}

		if (!arrSequence.data["Fill In CC"] || arrSequence.data["Fill In CC"].length == 0) {
			arrSequence.data["Fill In CC"] = JSON.parse(JSON.stringify(arrSequence.data["Fill In AA"]));		
		}	
				
		const bpm = Math.floor(60 /(arrSequence.data.Hdr.setTempo.microsecondsPerBeat / 1000000))
		setTempo(bpm);	
		
		const initHdr = arrSequence.data["SFF1"] || arrSequence.data["SFF2"];
		
		if (initHdr && output) 
		{
			for (let event of initHdr) 
			{			
				if (event.type == "sysEx") {
					const params = new Uint8Array(event.data);
					const manufacturer = params[0];
					const ops = [];
					for (let i=1; i<params.length - 1; i++) ops.push(params[i]);
					
					console.debug("SFF sysEx", manufacturer, ops)	
					output.sendSysex(manufacturer, ops);				
				}				
			}
		}	
	}		
}

async function setupUI(config,err) {	
	console.debug("setupUI", config);
	
	statusMsg.innerHTML = "Orin Ayo";	
	keyChange = config.keyChange ? config.keyChange : keyChange;
	dokeyChange();
	
	const midiIn = document.getElementById("midiInSel");
	const midiOut = document.getElementById("midiOutSel");
	const midiFwd = document.getElementById("midiFwdSel");
	const midiPads = document.getElementById("midiPadsSel");	
	const midiChordTracker = document.getElementById("midiChordTrackerSel");
	const realDrumsDevice = document.getElementById("realdrumLoopDevice");			
	const realDrumsLoop = document.getElementById("realdrumLoopLoop");	
	const songSeq = document.getElementById("songSequence");	
	const realguitar = document.getElementById("realguitar");
	
	let realGuitarIndex = 0;
	
	realguitar.options[0] = new Option("**UNUSED**", "none", config.realguitar == "none");
	realguitar.options[1] = new Option("Funk One - 16th (90-120 BPM)", "Funk1_S_16th_90_120", config.realguitar == "Funk1_S_16th_90_120");			
	realguitar.options[2] = new Option("Funk Three - 16th (90-120 BPM)", "Funk3_S_16th_90_120", config.realguitar == "Funk3_S_16th_90_120");
	realguitar.options[3] = new Option("4'4 Basic Strum 8th (100-200 BPM)", "Basic_B44_8th_100_200", config.realguitar == "Basic_B44_8th_100_200");
	realguitar.options[4] = new Option("4'4 Basic Picking 16th (50-90 BPM)", "Basic_P44_16T_50_90", config.realguitar == "Basic_P44_16T_50_90");

	realGuitarIndex = config.realGuitarStyle == "Funk1_S_16th_90_120" ? 1 : realGuitarIndex;
	realGuitarIndex = config.realGuitarStyle == "Funk3_S_16th_90_120" ? 2 : realGuitarIndex;				
	realGuitarIndex = config.realGuitarStyle == "Basic_B44_8th_100_200" ? 3 : realGuitarIndex;			
	realGuitarIndex = config.realGuitarStyle == "Basic_P44_16T_50_90" ? 4 : realGuitarIndex;			
	realguitar.selectedIndex = realGuitarIndex;			
	realGuitarStyle = config.realGuitarStyle;	
	
	const arrangerStyle =  document.getElementById("arrangerStyle");
	arrangerStyle.options[0] = new Option("**UNUSED**", "arrangerStyle");	
	let styleSelected = false;
	let iStyle = 0;
	
	const arrangerSf2 =  document.getElementById("arrangerSf2");
	arrangerSf2.options[0] = new Option("**UNUSED**", "arrangerSf2");	
	let sf2Selected = false;
	let iSf2 = 0;	
	
	indexedDB.databases().then(function (databases) 
	{
		databases.forEach(function (db) {
			console.debug("found database", db.name);
			
			if (db.name.toLowerCase().endsWith(".sf2")) {
				iSf2++;
				sf2Selected = config.sf2Name == db.name;
				arrangerSf2.options[iSf2] = new Option(db.name, db.name, sf2Selected, sf2Selected);				
			}
			else
				
			if (db.name.toLowerCase().endsWith(".kst") || db.name.toLowerCase().endsWith(".sty") || db.name.toLowerCase().endsWith(".prs")  || db.name.toLowerCase().endsWith(".bcs") || db.name.toLowerCase().endsWith(".ac7")) {
				iStyle++;
				styleSelected = config.arrName == db.name;
				arrangerStyle.options[iStyle] = new Option(db.name, db.name, styleSelected, styleSelected);				
			}
		})
	})		

	const arrangerType =  document.getElementById("arrangerType");	
	arrangerType.options[0] = new Option("Style Files Format", "sff", config.arranger == "sff");		
	arrangerType.options[1] = new Option("Web Audio Files", "webaudio", config.arranger == "webaudio");		
	arrangerType.options[2] = new Option("Ketron SD/Event", "ketron", config.arranger == "ketron");
	arrangerType.options[3] = new Option("Yamaha MODX", "modx", config.arranger == "modx");
	arrangerType.options[4] = new Option("Yamaha Montage", "montage", config.arranger == "montage");	
	arrangerType.options[5] = new Option("Yamaha PRS SX", "psrsx", config.arranger == "psrsx");	
	arrangerType.options[6] = new Option("Yamaha QY100", "qy100", config.arranger == "qy100");		
	arrangerType.options[7] = new Option("Korg Micro Arranger", "microarranger", config.arranger == "microarranger");				
	arrangerType.options[8] = new Option("Giglad Arranger", "giglad", config.arranger == "giglad");	
	arrangerType.options[9] = new Option("Boss RC Loop Station", "rclooper", config.arranger == "rclooper");	
	arrangerType.options[10] = new Option("Aeros Loop Studio", "aeroslooper", config.arranger == "aeroslooper");	
	
	let arrangerIndex = 0;
	arrangerIndex = config.arranger == "webaudio" ? 1 : arrangerIndex;
	arrangerIndex = config.arranger == "ketron" ? 2 : arrangerIndex;
	arrangerIndex = config.arranger == "modx" ? 3 : arrangerIndex;		
	arrangerIndex = config.arranger == "montage" ? 4 : arrangerIndex;
	arrangerIndex = config.arranger == "psrsx" ? 5 : arrangerIndex;			
	arrangerIndex = config.arranger == "qy100" ? 6 : arrangerIndex;		
	arrangerIndex = config.arranger == "microarranger" ? 7 : arrangerIndex;				
	arrangerIndex = config.arranger == "giglad" ? 8 : arrangerIndex;				
	arrangerIndex = config.arranger == "rclooper" ? 9 : arrangerIndex;	
	arrangerIndex = config.arranger == "aeroslooper" ? 10 : arrangerIndex;		
	arrangerType.selectedIndex = arrangerIndex;			
	arranger = config.arranger;	
	
	setGigladUI();
   
	midiOut.options[0] = new Option("**UNUSED**", "midiOutSel");
	midiFwd.options[0] = new Option("**UNUSED**", "midiFwdSel");
	midiPads.options[0] = new Option("**UNUSED**", "midiPadsSel");	

	midiChordTracker.options[0] = new Option("**UNUSED**", "midiChordTrackerSel");
	midiIn.options[0] = new Option("**UNUSED**", "midiInSel");
	realDrumsDevice.options[0] = new Option("**UNUSED**", "realDrumsDevice");
	realDrumsLoop.options[0] = new Option("**UNUSED**", "realDrumsLoop");	
	songSeq.options[0] = new Option("**UNUSED**", "songSeq");

	midiPads.options[1] = new Option("Sound Font", "soundfont");	
	
	if (config.padsDevice == "soundfont") {
		padsDevice = {name : "soundfont"};	
		midiPads.options[1] = new Option("Sound Font", "soundfont", true, true);		
	}	

	if (!err) for (var i=0; i<WebMidi.outputs.length; i++) 	{
		let outSelected = false;		
		
		if (config.output && config.output == WebMidi.outputs[i].name) {
			outSelected = true;
			output = WebMidi.outputs[i];
		}
		midiOut.options[i + 1] = new Option(WebMidi.outputs[i].name, WebMidi.outputs[i].name, outSelected, outSelected);

		let padsSelected = false;
		
		if (config.padsDevice && config.padsDevice == WebMidi.outputs[i].name) {
			padsSelected = true;
			padsDevice = WebMidi.outputs[i];
		}
		midiPads.options[i + 2] = new Option(WebMidi.outputs[i].name, WebMidi.outputs[i].name, padsSelected, padsSelected);

		let fwdSelected = false;
		
		if (config.forward && config.forward == WebMidi.outputs[i].name) {
			fwdSelected = true;
			forward = WebMidi.outputs[i];
		}
		midiFwd.options[i + 1] = new Option(WebMidi.outputs[i].name, WebMidi.outputs[i].name, fwdSelected, fwdSelected);

		let chordTrackerSelected = false;	
	
		if (config.chordTracker && config.chordTracker == WebMidi.outputs[i].name) {
			chordTrackerSelected = true;
			chordTracker = WebMidi.outputs[i];
		}
		midiChordTracker.options[i + 1] = new Option(WebMidi.outputs[i].name, WebMidi.outputs[i].name, chordTrackerSelected, chordTrackerSelected);
	}

	if (!err) for (var i=0; i<WebMidi.inputs.length; i++) {
		let selected = false;	
		
		if (config.input && config.input == WebMidi.inputs[i].name) {
			selected = true;
			input = WebMidi.inputs[i];
		}
		midiIn.options[i + 1] = new Option(WebMidi.inputs[i].name, WebMidi.inputs[i].name, selected, selected);
	}

	if (!err) midiIn.addEventListener("click", function()
	{
		input = null;

		if (midiIn.value != "midiInSel") {
			input = WebMidi.getInputByName(midiIn.value);
			saveConfig();			
			console.debug("selected input midi port", input, midiIn.value);
		}
	});

	if (!err) midiOut.addEventListener("click", function()
	{
		output = null;

		if (midiOut.value != "midiOutSel") {
			output = WebMidi.getOutputByName(midiOut.value);
			saveConfig();			
			console.debug("selected output midi port", output, midiOut.value);
		}
	});
	
	if (!err) midiPads.addEventListener("click", function()
	{
		padsDevice = null;

		if (midiPads.value != "midiPadsSel" && midiPads.value != "soundfont") {
			padsDevice = WebMidi.getOutputByName(midiPads.value);
			saveConfig();			
			console.debug("selected pads midi port", padsDevice, midiPads.value);
		} 
		else
			
		if ( midiPads.value == "soundfont") {
			console.debug("SoundFont pads");
			padsDevice = {name: "soundfont"};
			saveConfig();			
		}			
	});

	if (!err) midiFwd.addEventListener("click", function()
	{
		forward = null;
		enableSequencer(false);

		if (midiFwd.value != "midiFwdSel") {
			forward = WebMidi.getOutputByName(midiFwd.value);
			saveConfig();			
			enableSequencer(!!forward && realGuitarStyle != "none");
			console.debug("selected forward midi port", forward, midiFwd.value);
		}
	});
	
	if (!err) midiChordTracker.addEventListener("click", function()
	{
		chordTracker = null;

		if (midiChordTracker.value != "midiChordTrackerSel") {
			chordTracker = WebMidi.getOutputByName(midiChordTracker.value);
			saveConfig();			
			console.debug("selected chordTracker midi port", chordTracker, midiChordTracker.value);
		}
	});
	
	arrangerType.addEventListener("click", function()
	{
		arranger = arrangerType.value;
		setGigladUI(); // reset. remove if no more giglad
		console.debug("selected arranger type", arranger, arrangerType.value);				
		saveConfig();
	});
	
	arrangerStyle.addEventListener("click", function()
	{
		arrSequence = null
		if (arrangerStyle.value == "arrangerStyle") return;
		
		arrSequence = {name: arrangerStyle.value};
		saveConfig();			
	});	
	
	arrangerSf2.addEventListener("click", function()
	{
		arrSynth = null;
		if (arrangerSf2.value == "arrangerSf2") return;	
		
		arrSynth = {name: arrangerSf2.value};
		saveConfig();			
	});
	
	realguitar.addEventListener("click", function()
	{
		realGuitarStyle = realguitar.value;
		console.debug("selected realguitar style", realGuitarStyle, realguitar.value);				
		saveConfig();
	});
	
	for (var i=0; i<song_sequences.length; i++) {
		let selectedSong = false;		
		
		if (config.songName && config.songName == song_sequences[i].name) {
			selectedSong = true;
			songSequence = song_sequences[i];
		}
		songSeq.options[i + 1] = new Option(song_sequences[i].label, song_sequences[i].name, selectedSong, selectedSong);
	}	

	songSeq.addEventListener("click", function()
	{
		songSequence = null;

		if (songSeq.value != "songSeq")
		{
			for (let song of song_sequences) 
			{
				if (songSeq.value == song.name) {
					songSequence = song
					setupSongSequence();
					saveConfig();						
					break;
				}						
			}		
			console.debug("selected song sequence", songSequence, songSeq.value);
		}
	});	
	
	for (var i=0; i<drum_loops.length; i++) {
		let selectedDrum = false;	
		
		if (config.realdrumLoop && config.realdrumLoop == drum_loops[i].name) {
			selectedDrum = true;
			realdrumLoop = drum_loops[i];
		}
		realDrumsLoop.options[i + 1] = new Option(drum_loops[i].label, drum_loops[i].name, selectedDrum, selectedDrum);
	}	

	realDrumsLoop.addEventListener("click", function()
	{
		realdrumLoop = null;

		if (realDrumsLoop.value != "realDrumsLoop")
		{
			for (let drum of drum_loops) 
			{
				if (realDrumsLoop.value == drum.name) {
					realdrumLoop = drum
					setupRealDrums();
					saveConfig();					
					break;
				}						
			}
			console.debug("selected real drums loop", realdrumLoop, realDrumsLoop.value);
		}
	});		

	console.debug("WebMidi devices", input, output, forward, chordTracker);
	
	const audioMedia = await navigator.mediaDevices.getUserMedia({audio:true});
	audioMedia.getTracks().forEach( (track) => track.stop());				
	const devices = await navigator.mediaDevices.enumerateDevices();
	const outputs = devices.filter(({ kind }) => kind === 'audiooutput');			
	
	for (var i=0; i<outputs.length; i++) 	{
		let selectedDevice = false;			
		
		if (config.realdrumDevice && config.realdrumDevice == outputs[i].deviceId) {
			selectedDevice = true;
			realdrumDevice = outputs[i];
		}
		realDrumsDevice.options[i + 1] = new Option(outputs[i].label, outputs[i].deviceId, selectedDevice, selectedDevice);
	}	

	realDrumsDevice.addEventListener("click", async function()
	{
		realdrumDevice = null;

		if (realDrumsDevice.value != "realDrumsDevice") {
			const audioMedia = await navigator.mediaDevices.getUserMedia({audio:true});
			audioMedia.getTracks().forEach( (track) => track.stop());				
			const devices = await navigator.mediaDevices.enumerateDevices();
			const outputs = devices.filter(({ kind }) => kind === 'audiooutput');
			
			for (let output of outputs) 
			{
				if (realDrumsDevice.value == output.deviceId) {
					realdrumDevice = output;
					setupRealDrums();
					saveConfig();					
					break;
				}						
			}
			console.debug("selected real drums device ", realdrumDevice, realDrumsDevice.value);
		}
	});				

	if (input)
	{
		input.addListener('noteon', "all", function (e) {		
			//console.debug("Received 'noteon' message (" + e.note.name + " " + e.note.name + e.note.octave + ").", e.note, e);
			handleNoteOn(e.note, midiIn.value, e.velocity, e.channel);
		});

		input.addListener("noteoff", "all", function (e) {
			//console.debug("Received noteoff message", e);
			handleNoteOff(e.note, midiIn.value, e.velocity, e.channel);			
		});	
		
		input.addListener("keyaftertouch", "all", function (e) {
			//console.debug("Received after touch message", e);
		});		
		
		input.addListener("programchange", "all", function (e) {
			//console.debug("Received program change message", e.value);
		});		

		
		input.addListener("pitchbend", "all", function (e) {
			//console.debug("Received pitchbend", e);
		});		

		input.addListener('controlchange', "all", function (e) {
			//console.debug("Received control-change (CC)", e?.controller?.number, e.value);	
					
			if (arranger == "aeroslooper" && e?.controller.number == 113) 
			{					
				if (e.value == 0) {
					console.debug("Aeros section change message", aerosChordTrack);			  
					outputSendControlChange (39, aerosChordTrack, 4); 	// play current chord on new part					
					
					if (aerosAux) {	
						aerosAux = false;

						// switch to aux part
						
						if (aerosChordTrack == 1) { // intro
							console.debug("Aeros section intro message");						
							setTimeout(() => outputSendControlChange (113, 91, 4), 300); // switch to main part at end of loop
						}
						else
							
						if (aerosChordTrack == 6) { // end
							console.debug("Aeros section end message");							
							setTimeout(() => outputSendControlChange (43, 3, 4), 300); // stop at end of loop
						}					
						
					}					
				}
				else
					
				if (e.value == 3) {	// switched to aux mode
					aerosAuxMode = true;
				}					
				
			}
		});
	}									
	
	enableSequencer(!!forward && realGuitarStyle != "none");
	
	if (config.arrName) {		
		getArrSequence(config.arrName, setupSongSequence);		
	}
	
	if (config.sf2Name) {					
		getArrSynth(config.sf2Name);	// load sf2 file
	}
	else

	if (arranger == "sff") {	// use gmgsx.sf2 as dummy midiSynth
		loadMidiSynth();
	}		
};

function getArrSequence(arrName, callback) {
	console.debug("getArrSequence", arrName);
	arrSequence = {name: arrName};
	
	const store = new idbKeyval.Store(arrName, arrName);		

	idbKeyval.get(arrName, store).then(function (data) 
	{
		if (data) {
			console.debug("getArrSequence", arrName, data);
			arrSequence = parseMidi(data, arrName);
			normaliseStyle();	
			arrSequence.name = arrName;	
			
			if (callback) callback();				
		}			
	}).catch(function (err) {
		console.error('getArrSequence failed!', err)
	});	
}

function getArrSynth(sf2Name) {
	console.debug("getArrSynth", sf2Name);
	arrSynth = {name: sf2Name};
	
	const store = new idbKeyval.Store(sf2Name, sf2Name);		

	idbKeyval.get(sf2Name, store).then(function (data) 
	{
		if (data) {
			console.debug("sf2 get", sf2Name, data);
			
			arrSynth = new SoundFont.WebMidiLink();
			arrSynth.loadSoundFont(new Uint8Array(data));	
			arrSynth.name = sf2Name;
			//arrSynth.setReverb(true);			
		}			
	}).catch(function (err) {
		console.error('getArrSynth failed!', err)
	});	
}

function setGigladUI() {
	document.getElementById("giglad").style.display = "none";
	if (arranger == "giglad") document.getElementById("giglad").style.display = "";	
}

function saveConfig() {
    let config = {};
	config.keyChange = keyChange;
    config.output = output ? output.name : null;
    config.forward = forward ? forward.name : null;
    config.padsDevice = padsDevice ? padsDevice.name : null;	
	config.chordTracker = chordTracker ? chordTracker.name : null;
    config.input = input ? input.name : null;
	config.arranger = arranger;
	config.realGuitarStyle = realGuitarStyle;
	config.realdrumLoop = realdrumLoop ? realdrumLoop.name : null;
	config.realdrumDevice = realdrumDevice ? realdrumDevice.deviceId : null;
	config.songName = songSequence ? songSequence.name : null;
	config.arrName = arrSequence ? arrSequence.name : null;
	config.sf2Name = arrSynth ? arrSynth.name : null;

    localStorage.setItem("orin.ayo.config", JSON.stringify(config));
	
	if (!bluetoothDevice) {
		return;
	}
	console.debug('Disconnecting from Artiphone Bluetooth Chorda Device...');
	
	if (bluetoothDevice.gatt.connected) {
		bluetoothDevice.gatt.disconnect();
	}	
}

function doBreak() {
	console.debug("doBreak " + arranger);	

	if (arranger == "sff") {
	
	} 	
	else 
		
	if (arranger == "webaudio" && realdrumLoop) 
	{
		if (sectionChange == 0) {
			drumLoop.update('brka', false);		
		}
		if (sectionChange == 1) {
			drumLoop.update('brkb', false);			
		}
		if (sectionChange == 2) {
			drumLoop.update('brkc', false);			
		}
		
		if (sectionChange == 3) {
			drumLoop.update('brkd', false);			
		}
	}
	else
		
	if (arranger == "ketron") {
		sendKetronSysex(0x0B + sectionChange);		
	} 	
	else 
		
	if (arranger == "microarranger") {
        if (output) outputSendProgramChange(90, 4);
	} 
	else 
		
	if (arranger == "psrsx") {
		sendYamahaSysEx(0x18);		// Yamaha break
	}
	else 
		
	if (arranger == "qy100") {
		doQY100Fill();		
	}	
	else 
		
	if (arranger == "giglad") {
		doGigladFill();  			
	}
	else 
		
	if (arranger == "aeroslooper") {
		aerosAux = true;
		aerosChordTrack = 4;
		
		if (aerosAuxMode) {
			outputSendControlChange (39, aerosChordTrack, 4);
		} else  {
			outputSendControlChange (113, 73, 4);	// switch to aux part												
		}
		
	} 	
	else 

	if (arranger == "rclooper") {
		doRcLooperFill(false);  			
	} 	
	else 	
	
	if (arranger == "modx" || arranger == "montage") {
		doModxFill();		
	}
}

function doFill() {
	//console.debug("doFill " + arranger);
	
	if (arranger == "sff") {
		doSffFill(false);
	} 	
	else 	
	
	if (arranger == "webaudio" &&  drumLoop) {
		if (sectionChange == 0) drumLoop.update('fila', false);
		if (sectionChange == 1) drumLoop.update('filb', false);
		if (sectionChange == 2) drumLoop.update('filc', false);
		if (sectionChange == 3) drumLoop.update('fild', false);
	}
	else
			
	if (arranger == "ketron") {
		sendKetronSysex(0x07 + sectionChange);		
	}
	else 
		
	if (arranger == "microarranger") {
		doKorgFill();	
	} 	
	else 
		
	if (arranger == "psrsx") {		
		doPsrSxFill();		
	}
	else 
		
	if (arranger == "qy100") {		
		doQY100Fill();		
	}	
	else 
		
	if (arranger == "aeroslooper") {
		aerosAux = true;	
		aerosChordTrack = 5;
		
		if (aerosAuxMode) {
			outputSendControlChange (39, aerosChordTrack, 4);
		} else  {
			outputSendControlChange (113, 73, 4);	// switch to aux part												
		}								
	}	
	else
		
	if (arranger == "rclooper") {
		doRcLooperFill(false);  			
	}	
	else 
		
	if (arranger == "giglad") {
		doGigladFill(); 		
	} 	
	else 
	
	if (arranger == "modx" || arranger == "montage") {
		doModxFill();		
	}
}

function doRcLooperFill(newSection) {
	if (!output) return;
	
	console.debug("doRcLooperFill", newSection, sectionChange);	

	if (sectionChange == 0) {
		if (newSection) {
			outputSendControlChange (64, 127, 4); 			
		} else {
			outputSendControlChange (66, 127, 4); 
			setTimeout(() => outputSendControlChange (64, 127, 4), 1000); 		
		}
	}
	
	if (sectionChange == 1) {
		if (newSection) {
			outputSendControlChange (65, 127, 4); 			
		} else {		
			outputSendControlChange (67, 127, 4); 	
			setTimeout(() => outputSendControlChange (65, 127, 4), 1000); 	
		}			
	}
	if (sectionChange == 2) {
		if (newSection) {
			outputSendControlChange (66, 127, 4); 			
		} else {		
			outputSendControlChange (64, 127, 4); 
			setTimeout(() => outputSendControlChange (66, 127, 4), 1000); 			
		}
	}		
	if (sectionChange == 3) {
		if (newSection) {
			outputSendControlChange (67, 127, 4); 			
		} else {		
			outputSendControlChange (65, 127, 4); 
			setTimeout(() => outputSendControlChange (67, 127, 4), 1000); 	
		}			
	}	
}

function doGigladFill() {
	if (!output) return;	
	console.debug("doGigladFill " + sectionChange);	

	if (sectionChange == 0) {
		outputSendControlChange (112, 127, 4); 			
		setTimeout(() => outputSendControlChange (108, 127, 4), 2000); 
	}
	if (sectionChange == 1) {
		outputSendControlChange (113, 127, 4); 	
		setTimeout(() => outputSendControlChange (109, 127, 4), 2000);  			
	}
	if (sectionChange == 2) {
		outputSendControlChange (114, 127, 4); 			
		setTimeout(() => outputSendControlChange (110, 127, 4), 2000);  
	}		
	if (sectionChange == 3) {
		outputSendControlChange (115, 127, 4); 			
		setTimeout(() => outputSendControlChange (111, 127, 4), 2000); 
	}	
}

function doModxFill() {
	if (!output) return;	
	console.debug("doModxFill " + sectionChange);	
	
	if (arranger == "modx") 
	{
		if (sectionChange == 0) {
			outputSendControlChange (92, 32, 4); 			
			setTimeout(() => outputSendControlChange (92, 16, 4), 2000); 
		}
		if (sectionChange == 1) {
			outputSendControlChange (92, 32, 4); 	
			setTimeout(() => outputSendControlChange (92, 48, 4), 2000);  			
		}
		if (sectionChange == 2) {
			outputSendControlChange (92, 64, 4); 			
			setTimeout(() => outputSendControlChange (92, 80, 4), 2000);  
		}		
		if (sectionChange == 3) {
			outputSendControlChange (92, 96, 4); 			
			setTimeout(() => outputSendControlChange (92, 80, 4), 2000); 
		}	
	} 
	
	else 
		
	if (arranger == "montage") 	{	
		if (sectionChange == 0) {
			outputSendControlChange (92, 64, 4); 			
			setTimeout(() => outputSendControlChange (92, 16, 4), 2000); 
		}
		if (sectionChange == 1) {
			outputSendControlChange (92, 64, 4); 	
			setTimeout(() => outputSendControlChange (92, 32, 4), 2000);  			
		}
		if (sectionChange == 2) {
			outputSendControlChange (92, 80, 4); 			
			setTimeout(() => outputSendControlChange (92, 48, 4), 2000);  
		}		
		if (sectionChange == 3) {
			outputSendControlChange (92, 96, 4); 			
			setTimeout(() => outputSendControlChange (92, 48, 4), 2000); 
		}		
	}
}

function doKorgFill() {
	if (!output) return;	
	console.debug("doKorgFill " + arranger);			
	const tempArr = sectionChange % 2;
	
	if (tempArr == 0) {
		if (output) outputSendProgramChange(86, 4);
		setTimeout(() => outputSendProgramChange(80 + sectionChange, 4), 1000);			
		console.debug("doKorgFill A");		
	} else {
		if (output) outputSendProgramChange(87, 4);
		setTimeout(() => outputSendProgramChange(80 + sectionChange, 4), 1000);			
		console.debug("doKorgFill B");					
	}		
}

function doPsrSxFill() {
	console.debug("doPsrSxFill " + arranger);			

	if (sectionChange == 0) {
		sendYamahaSysEx(0x10);
		setTimeout(() => sendYamahaSysEx(0x08), 1000);			
	}
	if (sectionChange == 1) {
		sendYamahaSysEx(0x11);	
		setTimeout(() => sendYamahaSysEx(0x09), 1000);		
	}
	if (sectionChange == 2) {		
		sendYamahaSysEx(0x12); 
		setTimeout(() => sendYamahaSysEx(0x0A), 1000);			
	}		
	if (sectionChange == 3) {
		sendYamahaSysEx(0x13);
		setTimeout(() => sendYamahaSysEx(0x0B), 1000);			
	}		
}

function doQY100Fill() {
	console.debug("doQY100Fill " + arranger);			
	const tempArr = sectionChange % 2;
	
	if (tempArr == 0) {
		sendYamahaSysEx(0x0C);
		setTimeout(() => sendYamahaSysEx(0x09), 1000);			
		console.debug("doQY100Fill qy100 A");		
	} else {
		sendYamahaSysEx(0x0B);	
		setTimeout(() => sendYamahaSysEx(0x0A), 1000);				
		console.debug("doQY100Fill qy100 B");					
	}		
}

function setSffVar(changed) {
	const autoFill = document.querySelector("#autoFill").checked;
	
	if (sectionChange == 0) {
		currentSffVar = "Main A";		
		if ((autoFill && changed) || !changed) currentSffVar = "Fill In AA";
	}
	if (sectionChange == 1) {
		currentSffVar = "Main B";			
		if ((autoFill && changed) || !changed) currentSffVar = "Fill In BB";	
	}
	if (sectionChange == 2) {		
		currentSffVar = "Main C";
		if ((autoFill && changed) || !changed) currentSffVar = "Fill In CC";		
	}		
	if (sectionChange == 3) {
		currentSffVar = "Main D";	
		if ((autoFill && changed) || !changed) currentSffVar = "Fill In DD";		
	}
	
	orinayo_section.innerHTML = currentSffVar;		
}

function doSffSInt() {
	for (let evt in arrSequence.data["SInt"]) {			
		const event = arrSequence.data["SInt"][evt];
		
		if (event.type == "programChange") sendProgramChange(event);	
		if (event.type == "controller") sendControlChange(event);				
	}	
}
	
function doSffFill(changed) {
	if (!styleStarted) return;
	
	setSffVar(changed);	
	
	if (!arrSequence.data[currentSffVar]) {
		sectionChange++;
		if (sectionChange > 3) sectionChange = 0;
		orinayo_section.innerHTML = SECTIONS[sectionChange];
		setSffVar(changed);
		if (!arrSequence.data[currentSffVar]) return;
	}
	
	currentPlayNote = 0;
	nextNoteTime = playStartTime;
	currentPlayNote = -1;

	while (nextNoteTime < audioContext.currentTime + scheduleAheadTime && currentPlayNote < arrSequence.data[currentSffVar].length - 1) {
		currentPlayNote++;
		const timestamp = arrSequence.data[currentSffVar][currentPlayNote].deltaTime * (60 / (tempo * arrSequence.header.ticksPerBeat));
		nextNoteTime = nextNoteTime + timestamp;
	}
	
	clearAllSffNotes();
	doSffSInt();

	//console.debug("doSffFill", currentSffVar, arrangerBeat, currentPlayNote, arrSequence.data[currentSffVar].length);	
}

function checkForTouchArea() {
	//console.debug("GREEN Touch", pad.axis[TOUCH] == -0.7);	
	
	if (pad.axis[TOUCH] == -0.7 || pad.axis[TOUCH] == -0.8) { 
		//console.debug("GREEN Touch");		

		if (pad.axis[STRUM] == STRUM_UP) {
			doBreak();			
		}
		else
			
		if (pad.axis[STRUM] == STRUM_DOWN) {
			doFill();
		}
	}
	else
		
	if (pad.axis[TOUCH] == -0.4 || pad.axis[TOUCH] == -0.3) { 
		console.debug("RED Touch");		

		if (pad.axis[STRUM] == STRUM_UP) pressFootSwitch(9);	// FSW 9
		if (pad.axis[STRUM] == STRUM_DOWN) pressFootSwitch(8);	// FSW-8
	}
	else
		
	if (pad.axis[TOUCH] == 0.2 || pad.axis[TOUCH] == 0.1) { 
		console.debug("YELLOW Touch");		

		if (pad.axis[STRUM] == STRUM_UP) pressFootSwitch(11);	// FSW 11
		if (pad.axis[STRUM] == STRUM_DOWN) pressFootSwitch(10);	// FSW-10
	}		
	else
		
	if (pad.axis[TOUCH] == 0.4 || pad.axis[TOUCH] == 0.5) { 
		console.debug("BLUE Touch");		

		if (pad.axis[STRUM] == STRUM_UP) pressFootSwitch(13);	// FSW 13
		if (pad.axis[STRUM] == STRUM_DOWN) pressFootSwitch(12);	// FSW-12
	}		
	else
		
	if (pad.axis[TOUCH] == 1.0) { 
		console.debug("ORANGE Touch");	
			
		if (pad.axis[STRUM] == STRUM_UP) pressFootSwitch(7);	// FSW 7
		if (pad.axis[STRUM] == STRUM_DOWN) pressFootSwitch(6);	// FSW-6
	}			
}

function playPadSynthNote(note, channel, velocity) {
	const eventTypeByte = 0x90 | channel;
	const evt = {data: "midi," + eventTypeByte + "," + note + "," + velocity}
	arrSynth.onmessage(evt);	
}

function stopPadSynthNote(note, channel, velocity) {
	const eventTypeByte = 0x80 | channel;
	const evt = {data: "midi," + eventTypeByte + "," + note + "," + velocity}
	arrSynth.onmessage(evt);	
}

function playPads(chords, channel, opts) {
	//console.debug("playPads", chords, channel, opts);
	
	if (!styleStarted) 
	{	
		if (!padsInitialised) {
			padsInitialised = true;
			sendProgramChange({programNumber: 89, channel: 0});
		}
		
		if (arrSynth) 
		{
			if (chords instanceof Array) 
			{
				for (note of chords) {
					playPadSynthNote(note, channel - 1, opts.velocity * 127);
				}
				
			} else {
				playPadSynthNote(chords, channel - 1, opts.velocity * 127);
			}			
		} 
		else 
		
		if (padsDevice?.stopNote) {
			padsDevice.playNote(chords, channel, opts);			
		}
	}
}

function stopPads() {
	//console.debug("stopPads");
	
	if (!styleStarted) 
	{
		if (arrSynth) 
		{
			if (firstChord instanceof Array) 
			{
				for (note of firstChord) {
					stopPadSynthNote(note, 0, 0.5 * 127);
				}
				
				if (firstChord.length == 4) stopPadSynthNote(firstChord[0] + 24, 0, 0.5 * 127);		
							
			} else {
				stopPadSynthNote(firstChord, 0, 0.5 * 127);
			}			

		} 
		else 
			
		if (padsDevice?.stopNote) {
			padsDevice.stopNote(firstChord, 1, {velocity: 0.5}); 
			if (firstChord instanceof Array && firstChord.length == 4) padsDevice.stopNote(firstChord[0] + 24, 1, {velocity: 0.5}); 		
		}
	}
}

function playChord(chord, root, type, bass) {	
	//console.debug("playChord", chord, root, type, bass);
	
	firstChord = chord;
	arrChordType = (type == 0x20 ? "sus" : (type == 0x08 ? "min" : (type == 0x13 ? "maj7" : "maj")));
	
	
	if ((pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN) && !activeChord) {
		const arrChord = (firstChord.length == 4 ? firstChord[1] : firstChord[0]) % 12;
		const key = "key" + arrChord + "_" + arrChordType + "_" + SECTION_IDS[sectionChange];
		const bassKey = "key" + (chord[0] % 12) + "_" + arrChordType + "_" + SECTION_IDS[sectionChange];

	
		if (padsDevice?.stopNote || padsDevice?.name == "soundfont") {
			//console.debug("playChord pads", chord);
		
			const rootNote = (chord.length == 4 ? chord[0] + 24 : chord[0]);			
			const thirdNote = (chord.length == 4 ? chord[2] : chord[1]);	
			const fifthNote = (chord.length == 4 ? chord[3] : chord[2]);				

			if (padsMode == 1) {
				if (pad.axis[STRUM] == STRUM_UP) playPads(rootNote, 1, {velocity: 0.5});		// up root
				if (pad.axis[STRUM] == STRUM_DOWN) playPads(rootNote, 1, {velocity: 0.5});   // down	root				
			}		
			else
				
			if (padsMode == 2) {
				if (pad.axis[STRUM] == STRUM_DOWN) playPads(chord, 1, {velocity: 0.5});		// down chord
				if (pad.axis[STRUM] == STRUM_UP) playPads(rootNote, 1, {velocity: 0.5});     // up	root				
			}	
			else
				
			if (padsMode == 3) {
				if (pad.axis[STRUM] == STRUM_UP) playPads(thirdNote, 1, {velocity: 0.5});	// up third
				if (pad.axis[STRUM] == STRUM_DOWN) playPads(rootNote, 1, {velocity: 0.5});   // down	root				
			}
			else
				
			if (padsMode == 4) {
				if (pad.axis[STRUM] == STRUM_UP) playPads(fifthNote, 1, {velocity: 0.5});	// up fifth
				if (pad.axis[STRUM] == STRUM_DOWN) playPads(rootNote, 1, {velocity: 0.5});   // down	root				
			}
			else
				
			if (padsMode == 5) {
				if (pad.axis[STRUM] == STRUM_UP) playPads(chord, 1, {velocity: 0.5});		// up chord
				if (pad.axis[STRUM] == STRUM_DOWN) playPads(chord, 1, {velocity: 0.5});   	// down	chord				
			}			
		}
		
		if (styleType.innerText == "Normal" && (styleStarted  || (arranger != "aeroslooper" && arranger != "rclooper"))) {		
			//console.debug("playChord output", chord);
								
			if (chordTracker) {		
				const trasposedRoot = transposeNote(root);
				const transposedBass = transposeNote(bass);
				chordTracker.sendSysex(0x43, [0x7E, 0x02, trasposedRoot, type, transposedBass, type]);				
			}
			
			if (arranger == "webaudio" && realdrumLoop) {				
				if (bassLoop) bassLoop.update(bassKey, false);
				if (chordLoop) chordLoop.update(key, false);		
			}
			else
				
			if ((arranger == "aeroslooper" || arranger == "rclooper") && output) {
				//console.debug("playChord looper ", rcLooperChord, root);
		

				if (arranger == "rclooper") 
				{
					if (rcLooperChord != root) 
					{					
						if (root > 48 && root < 55) {					
							outputSendControlChange ((root - 28), 127, 4);	
						}

						rcLooperChord = root;	
					}						
				}
				else
					
				if (arranger == "aeroslooper" && aerosPart < 3) 
				{
					if (root > 48 && root < 55) {
						aerosChordTrack = root - 48;	
						//console.debug("playChord aeros looper ", aerosChordTrack, aerosPart);						
						outputSendControlChange (39, aerosChordTrack, 4);
					}						
				}	
				
			} else {

				if (arranger == "sff") {
					if (styleStarted) setTimeout(clearAllSffNotes);
					
				} else if (output) {
					if (pad.axis[STRUM] == STRUM_UP) outputPlayNote(chord, [4], {velocity: 0.5});		// up
					if (pad.axis[STRUM] == STRUM_DOWN) outputPlayNote(chord, [4], {velocity: 0.5});   	// down	
				}
				
				if (!guitarAvailable && forward) 
				{
					if (gamePadModeButton.innerText != "Color Tabs") {					
						forward.playNote(chord, 1, {velocity: 0.5});
					}
				}					
			}
			
		} else {
			if (arranger == "aeroslooper" && aerosPart < 3) aerosChordTrack = root - 48;
		}			
		
		activeChord = chord;
	}
}

function clearAllSffNotes() {
	//console.debug("clearAllSffNotes");
	
	var events = Object.getOwnPropertyNames(tempVariation);

	for (var i=0; i<events.length; i++) {
		const event = tempVariation[events[i]].event;
		const channel = getCasmChannel(currentSffVar, event.channel);
		const note = tempVariation[events[i]].note;
		
		if (output) {						
			outputStopNote(note, channel + 1, {velocity: event.velocity});
			
			if (midiSynth) {
				const instrumentNode = document.getElementById("arr-instrument-" + channel);
				if (instrumentNode) instrumentNode.parentNode.parentNode.parentNode.parentNode.querySelector("tbody > tr:nth-child(" + (parseInt(channel) + 1) + ") > td:nth-child(" + (4 + parseInt(note) + 1) + ")").classList.remove("note-on");				
			}
		}
		else
			
		if (arrSynth) {
			const eventTypeByte = 0x80 | channel;
			const evt = {data: "midi," + eventTypeByte + "," + note + "," + event.velocity};
			arrSynth.onmessage(evt);
		}							
	}	
}

function transposeNote(root) {
	// TODO	
	
	if (keyChange == 1) {
		if (root == 0x31) root = 0x41;
		else if (root == 0x32) root = 0x42;		
		else if (root == 0x33) root = 0x34;
		else if (root == 0x34) root = 0x44;	
		else if (root == 0x35) root = 0x45;
		else if (root == 0x36) root = 0x46;	
		else if (root == 0x37) root = 0x31;
		
		else if (root == 0x23) root = 0x33;	
		else if (root == 0x26) root = 0x36;
		else if (root == 0x27) root = 0x37;					
	}
	else
	if (keyChange == 2) {
		if (root == 0x31) root = 0x32;
		else if (root == 0x32) root = 0x33;		
		else if (root == 0x33) root = 0x44;
		else if (root == 0x34) root = 0x35;	
		else if (root == 0x35) root = 0x36;
		else if (root == 0x36) root = 0x37;	
		else if (root == 0x37) root = 0x41;
		
		else if (root == 0x23) root = 0x34;	
		else if (root == 0x26) root = 0x46;
		else if (root == 0x27) root = 0x31;					
	}			
	else
	if (keyChange == 3) {
		if (root == 0x31) root = 0x42;
		else if (root == 0x32) root = 0x34;		
		else if (root == 0x33) root = 0x35;
		else if (root == 0x34) root = 0x45;	
		else if (root == 0x35) root = 0x46;
		else if (root == 0x36) root = 0x31;	
		else if (root == 0x37) root = 0x32;
		
		else if (root == 0x23) root = 0x44;	
		else if (root == 0x26) root = 0x37;
		else if (root == 0x27) root = 0x41;					
	}
	else
	if (keyChange == 4) {
		if (root == 0x31) root = 0x33;
		else if (root == 0x32) root = 0x44;		
		else if (root == 0x33) root = 0x45;
		else if (root == 0x34) root = 0x36;	
		else if (root == 0x35) root = 0x37;
		else if (root == 0x36) root = 0x41;	
		else if (root == 0x37) root = 0x42;
		
		else if (root == 0x23) root = 0x35;	
		else if (root == 0x26) root = 0x31;
		else if (root == 0x27) root = 0x32;					
	}	
	else
	if (keyChange == 5) {
		if (root == 0x31) root = 0x34;
		else if (root == 0x32) root = 0x35;		
		else if (root == 0x33) root = 0x36;
		else if (root == 0x34) root = 0x46;	
		else if (root == 0x35) root = 0x31;
		else if (root == 0x36) root = 0x32;	
		else if (root == 0x37) root = 0x33;
		
		else if (root == 0x23) root = 0x45;	
		else if (root == 0x26) root = 0x41;
		else if (root == 0x27) root = 0x42;					
	}	
	else
	if (keyChange == 6) {
		if (root == 0x31) root = 0x44;
		else if (root == 0x32) root = 0x45;		
		else if (root == 0x33) root = 0x46;
		else if (root == 0x34) root = 0x31;	
		else if (root == 0x35) root = 0x41;
		else if (root == 0x36) root = 0x42;	
		else if (root == 0x37) root = 0x34;
		
		else if (root == 0x23) root = 0x36;	
		else if (root == 0x26) root = 0x32;
		else if (root == 0x27) root = 0x33;		
	}		
	else
	if (keyChange == 7) {
		if (root == 0x31) root = 0x35;
		else if (root == 0x32) root = 0x36;		
		else if (root == 0x33) root = 0x37;
		else if (root == 0x34) root = 0x41;	
		else if (root == 0x35) root = 0x32;
		else if (root == 0x36) root = 0x33;	
		else if (root == 0x37) root = 0x44;
		
		else if (root == 0x23) root = 0x46;	
		else if (root == 0x26) root = 0x42;
		else if (root == 0x27) root = 0x34;				
	}	
	else
	if (keyChange == 8) {
		if (root == 0x31) root = 0x45;
		else if (root == 0x32) root = 0x46;		
		else if (root == 0x33) root = 0x31;
		else if (root == 0x34) root = 0x32;	
		else if (root == 0x35) root = 0x42;
		else if (root == 0x36) root = 0x34;	
		else if (root == 0x37) root = 0x35;
		
		else if (root == 0x23) root = 0x31;	
		else if (root == 0x26) root = 0x33;
		else if (root == 0x27) root = 0x44;				
	}
	else
	if (keyChange == 9) {
		if (root == 0x31) root = 0x36;
		else if (root == 0x32) root = 0x37;		
		else if (root == 0x33) root = 0x41;
		else if (root == 0x34) root = 0x42;	
		else if (root == 0x35) root = 0x33;
		else if (root == 0x36) root = 0x44;	
		else if (root == 0x37) root = 0x45;
		
		else if (root == 0x23) root = 0x41;	
		else if (root == 0x26) root = 0x34;
		else if (root == 0x27) root = 0x35;				
	}	
	else
	if (keyChange == 10) {
		if (root == 0x31) root = 0x46;
		else if (root == 0x32) root = 0x31;		
		else if (root == 0x33) root = 0x32;
		else if (root == 0x34) root = 0x33;	
		else if (root == 0x35) root = 0x43;
		else if (root == 0x36) root = 0x35;	
		else if (root == 0x37) root = 0x36;
		
		else if (root == 0x23) root = 0x32;	
		else if (root == 0x26) root = 0x44;
		else if (root == 0x27) root = 0x45;				
	}	
	else
	if (keyChange == 11) {
		if (root == 0x31) root = 0x37;
		else if (root == 0x32) root = 0x41;		
		else if (root == 0x33) root = 0x42;
		else if (root == 0x34) root = 0x34;	
		else if (root == 0x35) root = 0x34;
		else if (root == 0x36) root = 0x45;	
		else if (root == 0x37) root = 0x46;
		
		else if (root == 0x23) root = 0x42;	
		else if (root == 0x26) root = 0x35;
		else if (root == 0x27) root = 0x36;				
	}	
	return root;
}

function sendYamahaSysEx(code) {
    if (output) { 
        console.debug("sendYamahaSysEx", code)	
		output.sendSysex(0x43, [0x7E, 0x00, code, 0x7F]);	
		
		setTimeout(() => {
			output.sendSysex(0x43, [0x7E, 0x00, code, 0x00]);	
		}, 500);		
	}	
}

function sendKetronSysex(code) {
    if (output) { 
        console.debug("sendKetronSysex", code)	
		output.sendSysex(0x26, [0x79, 0x05, 0x00, code, 0x7F]);
		
		setTimeout(() => {
			output.sendSysex(0x26, [0x79, 0x05, 0x00, code, 0x00]);	
		}, 500);		
	}	
}

function pressFootSwitch(code) {
	console.debug("pressFootSwitch", code)	

	if (arranger == "sff") 
	{				
		if (code == 6) {	// drum toggle
			const instrumentNode = document.getElementById("arr-instrument-9");		
			instrumentNode.checked = !instrumentNode.checked;			
		}
		else
			
		if (code == 7) {	// drum toggle
			const instrumentNode = document.getElementById("arr-instrument-10");		
			instrumentNode.checked = !instrumentNode.checked;			
		}
		
		if (code == 8 || code == 9) {	// chord toggle
			const chord1 = document.getElementById("arr-instrument-11");		
			chord1.checked = !chord1.checked;

			const chord2 = document.getElementById("arr-instrument-12");		
			chord2.checked = !chord2.checked;

			const chord3 = document.getElementById("arr-instrument-13");		
			chord3.checked = !chord3.checked;

			const chord4 = document.getElementById("arr-instrument-14");		
			chord4.checked = !chord4.checked;

			const chord5 = document.getElementById("arr-instrument-15");		
			chord5.checked = !chord5.checked;			
		}		
		
	} 	
	else 
		
	if (arranger == "webaudio" && realdrumLoop) {
		if (code == 7 && drumLoop) drumLoop.muteToggle();
		if (code == 6 && chordLoop) chordLoop.muteToggle();		
		if (code == 6 && bassLoop) bassLoop.muteToggle();	
		if (code == 9 && chordLoop) chordLoop.muteToggle();		
		if (code == 8 && bassLoop) bassLoop.muteToggle();		
	}
	else	
		
	if (arranger == "aeroslooper" && output) {
		aerosAux = true;	
		
		if (code == 6) {					
			aerosChordTrack = 2;	// drum A	
		}			
		else
			
		if (code == 7) {					
			aerosChordTrack = 3;	// drum B
		}
		
		if (aerosAuxMode) {
			outputSendControlChange (39, aerosChordTrack, 4);
		} else  {
			outputSendControlChange (113, 73, 4);	// switch to aux part												
		}
		
	}
	else	
		
	if (arranger == "rclooper" && output) {
		if (code == 7) outputSendControlChange (69, 127, 4);	// mute/unmute drums
		
		if (code == 6) 
		{
			if (footSwCode7Enabled) {
				outputSendControlChange (71, 127, 4);			// loop volume off 
			} else {
				outputSendControlChange (70, 127, 4)			// loop volume on
			}
			footSwCode7Enabled = !footSwCode7Enabled;			
		}
	}
	else
	
    if (output && arranger == "ketron") { 
		output.sendSysex(0x26, [0x7C, 0x05, 0x01, 0x55 + code, 0x7F]);
		
		setTimeout(() => {
			output.sendSysex(0x26, [0x7C, 0x05, 0x01, 0x55 + code, 0x00]);	
		}, 500);		
	}	
}

function resetArrToA() {
	sectionChange = 0;
	rgIndex = 0;
	nextRgIndex = 0;
	
	if (arranger == "sff") {
	
	} 	
	else 	
	
	if (arranger == "ketron") {
		sendKetronSysex(3 + sectionChange);	
		console.debug("resetArrToA Ketron " + sectionChange);		
	} 	
	else 
		
	if (arranger == "psrsx") {
		sendYamahaSysEx(0x00);	
		console.debug("resetArrToA PSR SX " + sectionChange);			
	}
	else 
		
	if (arranger == "qy100") {
		sendYamahaSysEx(0x09);	
		console.debug("resetArrToA QY100 " + sectionChange);			
	} 	
	else 
		
	if (arranger == "microarranger") {
		if (output) outputSendProgramChange(80, 4);	
		console.debug("resetArrToA Micro Arranger " + sectionChange);			
	} 	
	else	
	
	if (arranger == "aeroslooper") {
		if (output) {
			aerosPart = 1;	
			aerosChordTrack = 1;
			//outputSendControlChange (113, 70 + aerosPart, 4);				// switch to main part	
		}
		console.debug("resetArrToA Aeros Looper " + sectionChange);			
	}
	else	
	
	if (arranger == "rclooper") {
		if (output) outputSendControlChange (64, 127, 4);
		console.debug("resetArrToA RC Looper " + sectionChange);			
	}	
	else	
	
	if (arranger == "giglad") {
		if (output) outputSendControlChange (108, 127, 4);
		console.debug("resetArrToA Giglad " + sectionChange);			
	}	
	else	
	
	if (arranger == "modx") {
		if (output) outputSendControlChange (92, 16, 4);
		console.debug("resetArrToA MODX " + sectionChange);			
	}
	else
		
	if (arranger == "montage") {
		if (output) outputSendControlChange (92, 16, 4);
		console.debug("resetArrToA Montage " + sectionChange);			
	}
	
	orinayo_section.innerHTML = SECTIONS[sectionChange];
	
	if (window[realGuitarStyle]) {
		orinayo_strum.innerHTML = "Strum " + (rgIndex + 1) + "/" + window[realGuitarStyle].length;	
	}		
}

function stopChord() {
	if (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN) 
	{
		if (activeChord)
		{
			//console.debug("stopChord", pad)
			
			if (output) outputStopNote(activeChord, [4], {velocity: 0.5}); 
			if (!guitarAvailable && forward) forward.stopNote(activeChord, 1, {velocity: 0.5});		
			if (padsDevice?.stopNote || padsDevice?.name == "soundfont") stopPads();
			
			if (!guitarAvailable && forward) 
			{
				if (gamePadModeButton.innerText != "Color Tabs") {					
					forward.stopNote(activeChord, 1);
				}
			}			
			
			activeChord = null;
		}	   
	}
}

function playSectionCheck() {
	let arrChanged = false;
				
	if (pad.buttons[STARPOWER]) {	// next variation. jump to section of button pressed

		if (pad.buttons[YELLOW]) sectionChange = 0;
		else if (pad.buttons[BLUE]) sectionChange = 1;		
		else if (pad.buttons[RED]) sectionChange = 2;
		else if (pad.buttons[ORANGE] || pad.buttons[GREEN]) sectionChange = 3;	
		else {
			sectionChange++;
			if (sectionChange > 3) sectionChange = 0;			
		}
		
		if (window[realGuitarStyle]) {
			nextRgIndex++;
			if (nextRgIndex ==  window[realGuitarStyle].length) nextRgIndex = 0;
		}
		arrChanged = true;	
	} 
	else 
		
	if (pad.buttons[START]) {		// prev variation. do nothing if button pressed (used by realguitar)
	
		if (!pad.buttons[YELLOW] && !pad.buttons[BLUE] && !pad.buttons[ORANGE] && !pad.buttons[RED]  && !pad.buttons[GREEN]) {
			sectionChange--;		
			if (sectionChange < 0) sectionChange = 3;

			if (window[realGuitarStyle]) {			
				nextRgIndex--;				
				if (nextRgIndex < 0) nextRgIndex = window[realGuitarStyle].length - 1;		
			}
			arrChanged = true;		
		}			
	}	
	
	//console.debug("playSectionCheck pressed " + arrChanged, sectionChange);
	orinayo_section.innerHTML = SECTIONS[sectionChange];		
			
	if (drumLoop && realdrumLoop) {
		orinayo_section.innerHTML = ">" + orinayo_section.innerHTML;	
		
		if (sectionChange == 0) drumLoop.update(arrChanged ? 'arra': 'fila', false);
		if (sectionChange == 1) drumLoop.update(arrChanged ? 'arrb': 'filb', false);
		if (sectionChange == 2) drumLoop.update(arrChanged ? 'arrc': 'filc', false);
		if (sectionChange == 3) drumLoop.update(arrChanged ? 'arrd': 'fild', false);	
	}
	else {
		changeArrSection(arrChanged);		
	}

	if (window[realGuitarStyle]) {
		orinayo_strum.innerHTML = ">Strum " + (nextRgIndex + 1) + "/" + window[realGuitarStyle].length;	
	}

}

function changeArrSection(changed) {
	
	if (arranger == "sff") {
		doSffFill(changed);		
		console.debug("changeArrSection SFF " + sectionChange);	
	} 	
	else 	
	
	if (arranger == "ketron") {
		sendKetronSysex(3 + sectionChange);	
		console.debug("changeArrSection Ketron " + sectionChange);		
	}
	else 
		
	if (arranger == "psrsx") {
		doPsrSxFill();
		console.debug("changeArrSection PSR SX " + sectionChange);			
	} 	
	else 
		
	if (arranger == "qy100") {
		doQY100Fill();
		console.debug("changeArrSection QY100 " + sectionChange);			
	} 
	else 
		
	if (arranger == "aeroslooper") {
		// auto-fill in loop. nothing to do if not changed
		
		if (changed) {
			aerosAuxMode = false;			
			aerosPart = (sectionChange == 0 || sectionChange == 2) ? 1 : 2;
			outputSendControlChange (113, 80 + aerosPart, 4);			
		}
		console.debug("changeArrSection Aeros Looper " + sectionChange);			
	}
	else 
		
	if (arranger == "rclooper") {
		doRcLooperFill(changed);  	
		console.debug("changeArrSection RC Looper " + sectionChange);			
	}	
	else 
		
	if (arranger == "giglad") {
		doGigladFill();
		console.debug("changeArrSection Giglad " + sectionChange);			
	} 	
	else 
		
	if (arranger == "microarranger") {
		doKorgFill();
		console.debug("changeArrSection Micro Arranger " + sectionChange);			
	} 	
	else	
	
	if (arranger == "modx" || arranger == "montage") {
		doModxFill();
		console.debug("changeArrSection MODX " + sectionChange);			
	}
}

function dokeyUp() {
    keyChange++;
    if (keyChange > 11) keyChange = 0	
    dokeyChange();
}

function dokeyDown() {
    keyChange--;
    if (keyChange < 0) keyChange = 11
    dokeyChange();	
}

function dokeyChange() {
    keyChange = (keyChange % 12);

    console.debug("Received 'key change (" + KEYS[keyChange] + ")");

    orinayo.innerHTML = KEYS[keyChange];
    key = KEYS[keyChange];
    base = BASE + keyChange;

    if (forward) forward.playNote(84 + keyChange, 1, {velocity: 0.5, duration: 1000});
}

function doChord() {
  //console.debug("doChord", pad)
  stopChord();

  if (pad.axis[STRUM] == STRUM_LEFT && !pad.buttons[YELLOW] && !pad.buttons[BLUE] && !pad.buttons[ORANGE] && !pad.buttons[RED]  && !pad.buttons[GREEN])
  {
	dokeyDown();
  }

  if (pad.axis[STRUM] == STRUM_RIGHT && !pad.buttons[YELLOW] && !pad.buttons[BLUE] && !pad.buttons[ORANGE] && !pad.buttons[RED]  && !pad.buttons[GREEN])
  {
	dokeyUp();
  }

  if (pad.buttons[START] || pad.buttons[STARPOWER])
  {
	if (pad.buttons[START]) {	// start + button activates pad mode
		padsMode = 0;
		
		if (pad.buttons[GREEN]) padsMode = 1;	// full chord up/down
		if (pad.buttons[RED]) padsMode = 2;		// chord up/root note down	
		if (pad.buttons[YELLOW]) padsMode = 3;	// root note up/down
		if (pad.buttons[BLUE]) padsMode = 4;	// 3rd note up/root note down
		if (pad.buttons[ORANGE]) padsMode = 5;	// 5th note up/root note down
	}
    playSectionCheck()
  }

  if (pad.buttons[LOGO])
  {
	if (pad.buttons[YELLOW] && pad.buttons[BLUE]) {	
		styleStarted = false;	
		resetArrToA();
		playButton.innerText = !styleStarted ? "Play" : "Stop";				
		
	} else {	
		toggleStartStop();
		return;		
	}
  }  

   if (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN) {
		if (styleStarted) checkForTouchArea();
   }

  if ((pad.axis[STRUM] != STRUM_UP && pad.axis[STRUM] != STRUM_DOWN) || pad.buttons[STARPOWER] || pad.buttons[START]) {
	  return;
  }

  // --- F/C

  if (pad.buttons[YELLOW] && pad.buttons[BLUE] && pad.buttons[ORANGE] && pad.buttons[RED])
  {
    playChord([base - 12, base + 5, base + 9, base + 12], 0x34, 0x00, 0x31);
    orinayo.innerHTML = key + " - " + "4/1";
  }
  else

  // --- G/C

  if (pad.buttons[YELLOW] && pad.buttons[BLUE] && pad.buttons[ORANGE] && pad.buttons[GREEN])
  {
    playChord([base - 12, base + 7, base + 11, base + 14], 0x35, 0x00, 0x31);
    orinayo.innerHTML = key + " - " + "5/1";
  }
  else

  // -- B

  if (pad.buttons[RED] && pad.buttons[YELLOW] && pad.buttons[BLUE] && pad.buttons[GREEN])
  {
    playChord([base - 1, base + 3, base + 6], 0x37, 0x00, 0x37);
    orinayo.innerHTML = key + " - " + "7";
  }
  else

  if (pad.buttons[RED] && pad.buttons[YELLOW] && pad.buttons[GREEN])     // Ab
  {
    playChord([base - 4, base, base + 3], 0x26, 0x00, 0x26);
    orinayo.innerHTML = key + " - " + "6b";
  }
  else

  if (pad.buttons[RED] && pad.buttons[YELLOW] && pad.buttons[BLUE])     // A
  {
    playChord([base - 3, base + 13, base + 16], 0x36, 0x00, 0x36);
    orinayo.innerHTML = key + " - " + "6";
  }
  else

  if (pad.buttons[BLUE] && pad.buttons[YELLOW] && pad.buttons[GREEN])     // E
  {
    playChord([base - 8, base + 8, base + 11], 0x33, 0x00, 0x33);
    orinayo.innerHTML = key + " - " + "3";
  }
  else


  if (pad.buttons[BLUE] && pad.buttons[RED] && pad.buttons[ORANGE])     // Eb
  {
    //playChord([base - 29, base + 9, base + 12, base + 16]);
    //orinayo.innerHTML = key + " - " + "Am/G";
    playChord([base - 9, base + 7, base + 10], 0x23, 0x00, 0x23);
    orinayo.innerHTML = key + " - " + "3b";  
  }
  else

  if (pad.buttons[YELLOW] && pad.buttons[BLUE] && pad.buttons[ORANGE])    // F/G
  {
    playChord([base - 17, base + 5, base + 9, base + 12], 0x34, 0x00, 0x35);
    orinayo.innerHTML = key + " - " + "4/5";
  }
  else

  if (pad.buttons[RED] && pad.buttons[YELLOW])     // Bb
  {
    playChord([base - 2, base + 2, base + 5], 0x27, 0x00, 0x27);
    orinayo.innerHTML = key + " - " + "7b";
  }
  else

  if (pad.buttons[GREEN] && pad.buttons[YELLOW])     // Gsus
  {
    playChord([base - 5, base + 12, base + 14], 0x35, 0x20, 0x35);
    orinayo.innerHTML = key + " - " + "5sus";
  }
  else

  if (pad.buttons[ORANGE] && pad.buttons[YELLOW])     // Csus
  {
    playChord([base, base + 5, base + 7], 0x31, 0x20, 0x31);
    orinayo.innerHTML = key + " - " + "1sus";
  }
  else

  if (pad.buttons[YELLOW] && pad.buttons[BLUE])    // C/E
  {
    playChord([base - 20, base, base + 4, base + 7], 0x31, 0x00, 0x33);
    orinayo.innerHTML = key + " - " + "1/3";
  }
  else

  if (pad.buttons[GREEN] && pad.buttons[RED])     // G/B
  {
    playChord([base - 13, base + 7, base + 11, base + 14], 0x35, 0x00, 0x37);
    orinayo.innerHTML = key + " - " + "5/7";
  }
  else

  if (pad.buttons[BLUE] && pad.buttons[ORANGE])     // F/A
  {
    playChord([base - 15, base + 5, base + 9, base + 12], 0x34, 0x00, 0x36);
    orinayo.innerHTML = key + " - " + "4/6";
  }
  else

  if (pad.buttons[GREEN] && pad.buttons[BLUE])     // Em
  {
    playChord([base - 8, base + 7, base + 11], 0x33, 0x08, 0x33);
    orinayo.innerHTML = key + " - " + "3m";
  }
  else

   if (pad.buttons[ORANGE] && pad.buttons[RED])   // Fm
   {
     playChord([base - 7, base + 8, base + 12], 0x34, 0x08, 0x34);
     orinayo.innerHTML = key + " - " + "4m";
   }
   else

   if (pad.buttons[GREEN] && pad.buttons[ORANGE])     // Gm
   {
     playChord([base - 5, base + 10, base + 14], 0x35, 0x08, 0x35);
     orinayo.innerHTML = key + " - " + "5m";
   }
  else

  if (pad.buttons[RED] && pad.buttons[BLUE])     // D
  {
    playChord([base + 2, base + 6, base + 9], 0x32, 0x00, 0x32);
    orinayo.innerHTML = key + " - " + "2";
  }
  else

  if (pad.buttons[YELLOW])    // C
  {
    playChord([base, base + 4, base + 7], 0x31, 0x00, 0x31);
    orinayo.innerHTML = key + " - " + "1";
  }
  else

  if (pad.buttons[BLUE])      // Dm
  {
    playChord([base + 2, base + 5, base + 9], 0x32, 0x08, 0x32);
    orinayo.innerHTML = key + " - " + "2m";
  }
  else

  if (pad.buttons[ORANGE])   // F
  {
    playChord([base - 7, base + 9, base + 12], 0x34, 0x00, 0x34);
    orinayo.innerHTML = key + " - " + "4";
  }
  else

  if (pad.buttons[GREEN])     // G
  {
    playChord([base - 5, base + 11, base + 14], 0x35, 0x00, 0x35);
    orinayo.innerHTML = key + " - " + "5";
  }
  else

  if (pad.buttons[RED])     // Am
  {
    playChord([base - 3, base + 12, base + 16], 0x36, 0x08, 0x36);
    orinayo.innerHTML = key + " - " + "6m";
  }
}

function toggleStartStop() {
		
	if (!styleStarted) resetArrToA();
		
	if ((forward && realGuitarStyle != "none" && window[realGuitarStyle]) || songSequence || (arrSequence && arranger == "sff")) 
	{
		if (playButton.innerText != "On") {
			startStopSequencer();

			if (!songSequence || arranger == "sff") {				
				return;	
			}				
		}			
	}
		
	if (arranger == "webaudio") {				
		if (drumLoop && realdrumLoop) {
			if (!styleStarted) {
				orinayo_section.innerHTML = ">Arr A";
				setTempo(realdrumLoop.bpm);	

				if (songSequence) {
					drumLoop.start('arra');
					if (bassLoop) bassLoop.start("key" + (keyChange % 12));
					if (chordLoop) chordLoop.start("key" + (keyChange % 12));
						
				} else {
					drumLoop.start('int1');
					//if (bassLoop) bassLoop.start('int1');
					//if (chordLoop) chordLoop.start('int1');					
					
					setTimeout(() => {
						if (bassLoop) bassLoop.start("key" + (keyChange % 12));
						if (chordLoop) chordLoop.start("key" + (keyChange % 12));			
					}, realdrumLoop.drums.int1.stop);
					
				}
				
			} else {
				if (pad.buttons[YELLOW]) {	
					orinayo_section.innerHTML = ">End 1";					
					drumLoop.update('end1', false);	
				} else {
					orinayo_section.innerHTML = "End 1";						
					drumLoop.stop();
				}
				
				if (bassLoop) bassLoop.stop();			
				if (chordLoop) chordLoop.stop();				
			}

			styleStarted = !styleStarted;	
		}
			
	}
	else

	if (output) { 			
		if (arranger == "ketron") {		
			outputPlayNote(firstChord, [4], {velocity: 0.5});
				
			let startEndType = 0x12; // default start/stop
		
			if (pad.buttons[YELLOW]) startEndType = 0x0F;	// INTRO/END-1
			if (pad.buttons[RED]) startEndType = 0x10;		// INTRO/END-2
			if (pad.buttons[GREEN]) startEndType = 0x11;	// INTRO/END-3		
			if (pad.buttons[BLUE]) startEndType = 0x17;		// TO END
			if (pad.buttons[ORANGE]) startEndType = 0x35;	// FADE			
			
			sendKetronSysex(startEndType);
			console.debug("toggle start/stop", startEndType);
			styleStarted = !styleStarted;				
		}
		else

		if (arranger == "modx" || arranger == "montage") 
		{		
			if (!styleStarted)
			{
				console.debug("start key pressed");  
				outputPlayNote(firstChord, [4], {velocity: 0.5});				
				outputSendControlChange (92, 0, 4);  				    
				styleStarted = true;
			}
			else {
				console.debug("stop key pressed");				
				outputSendControlChange (92, 96, 4); 			
				setTimeout(() => outputSendControlChange (92, 112, 4), 2000);        
				styleStarted = false;
			}
		}	
		else

		if (arranger == "aeroslooper") 
		{				
			if (!styleStarted) {				
				console.debug("Aeros looper start key pressed");  
				
				if (output) {
					aerosAux = true;
						
					if (pad.buttons[YELLOW] || pad.buttons[ORANGE] || pad.buttons[GREEN] || pad.buttons[RED] || pad.buttons[BLUE]) {
						aerosChordTrack = 1;
						aerosPart = 1;
						console.debug("Aeros intro start"); 
						outputSendControlChange (113, 73, 4);	// switch to aux part	
						setTimeout(() => outputSendControlChange (39, aerosChordTrack, 4), 500);						
						setTimeout(() => outputSendControlChange (113, 90 + aerosChordTrack, 4), 1000);
						
					} else {	
						console.debug("Aeros main start"); 
						outputSendControlChange (113, 71, 4);	// switch to main part													
					}										
					
				}     
				styleStarted = true;
			}
			else {				
				console.debug("Aeros looper stop key pressed");
				
				if (output) {
					if (pad.buttons[YELLOW] || pad.buttons[ORANGE] || pad.buttons[GREEN] || pad.buttons[RED] || pad.buttons[BLUE]) {
						aerosChordTrack = 6;
						aerosAux = true
						outputSendControlChange (113, 73, 4);	// switch to aux part

					} else {
						outputSendControlChange (43, 0, 4);	// stop all						
					}
										
				}	      
				styleStarted = false;
			}			
		}
		else

		if (arranger == "rclooper") {		
			outputSendControlChange (68, 127, 4);						
			console.debug("RC looper start/stop key pressed"); 
			styleStarted = !styleStarted; 			
		}
		else

		if (arranger == "giglad") 
		{		
			if (!styleStarted)
			{
				console.debug("start key pressed");  
				
				if (output) {
					outputPlayNote(firstChord, [4], {velocity: 0.5});
				
					if (pad.buttons[YELLOW]) {
						outputSendControlChange (102, 127, 4); 	// INTRO 1
						sectionChange = 0;						
					} else if (pad.buttons[RED]) {
						outputSendControlChange (103, 127, 4); 	// INTRO 2	
						sectionChange = 1;							
					} else if (pad.buttons[GREEN]){
						outputSendControlChange (104, 127, 4); 	// INTRO 3
						sectionChange = 2;							
					} else if (pad.buttons[ORANGE]){
						outputSendControlChange (85, 127, 4); 		// FADE IN				
					}
					orinayo_section.innerHTML = SECTIONS[sectionChange];						
					outputSendControlChange (87, 127, 4);			// START
					
				}     
				styleStarted = true;
			}
			else {
				console.debug("stop key pressed");
				
				if (output) {
					if (pad.buttons[YELLOW]) {
						outputSendControlChange (105, 127, 4); 
					} else if (pad.buttons[RED]) {
						outputSendControlChange (106, 127, 4); 						
					} else  if (pad.buttons[GREEN]) {
						outputSendControlChange (107, 127, 4); 	
					} else if (pad.buttons[ORANGE]){
						outputSendControlChange (86, 127, 4); 		// FADE OUT						
					} else {
						outputSendControlChange (88, 127, 4);		// STOP
					}				
				}	      
				styleStarted = false;
			}
		}		
		else

		if (arranger == "psrsx") 
		{		
			if (!styleStarted)
			{
				console.debug("start key pressed"); 
				outputPlayNote(firstChord, [4], {velocity: 0.5});
				
				let startEndType = 0x00;
				if (pad.buttons[YELLOW]) startEndType = 0x00;	// INTRO-1
				if (pad.buttons[RED]) startEndType = 0x01;		// INTRO-2
				if (pad.buttons[GREEN]) startEndType = 0x02;	// INTRO-3		
				if (pad.buttons[BLUE]) startEndType = 0x01;		// INTRO-2		
				if (pad.buttons[ORANGE]) startEndType = 0x02;	// INTRO-3	
				
				sendYamahaSysEx(0x10);							// ARRA		
				sendYamahaSysEx(startEndType);	
				output.sendSysex(0x43, [0x60, 0x7A]);			// Yamaha Sysex for Accomp start
		
				styleStarted = true;
			}
			else {
				console.debug("stop key pressed");				
				let startEndType = -1;
				if (pad.buttons[YELLOW]) startEndType = 0x20;	// END-1
				if (pad.buttons[RED]) startEndType = 0x21;		// END-2
				if (pad.buttons[GREEN]) startEndType = 0x22;	// END-3		
				if (pad.buttons[BLUE]) startEndType = 0x21;		// END-2	
				if (pad.buttons[ORANGE]) startEndType = 0x22;	// END-3
				
				if (startEndType == -1) {
					output.sendSysex(0x43, [0x60, 0x7D]);	// Yamaha Sysex for Accomp stop
				} else {
					sendYamahaSysEx(startEndType);						
				}
   
				styleStarted = false;
			}
		}
		else

		if (arranger == "qy100") 
		{		
			if (!styleStarted)
			{
				console.debug("start key pressed");  
				outputPlayNote(firstChord, [4], {velocity: 0.5});				
				sendYamahaSysEx(0x08);	
				output.sendSysex(0x43, [0x60, 0x7A]);			// Yamaha Sysex for Accomp start				
				styleStarted = true;
			}
			else {
				console.debug("stop key pressed");					

				if (!pad.buttons[YELLOW]) {
					output.sendSysex(0x43, [0x60, 0x7D]);	// Yamaha Sysex for Accomp stop
				} else {
					sendYamahaSysEx(0x0D);						
				}
				
				styleStarted = false;
			}
		}		
		else

		if (arranger == "microarranger") 
		{		
			if (!styleStarted)
			{
				console.debug("start key pressed");  				
				
				if (output) {
					outputPlayNote(firstChord, [4], {velocity: 0.5});
				
					if (pad.buttons[YELLOW]) {
						outputSendProgramChange(85, 4);
					} else if (pad.buttons[ORANGE]) {
						outputSendProgramChange(91, 4);							
					} else if (pad.buttons[GREEN]){
						outputSendProgramChange(84, 4);						
					} else {
						output.sendStart();
					}
					
				}     
				styleStarted = true;
			}
			else {
				console.debug("stop key pressed");
				
				if (output) {
					outputPlayNote(firstChord, [4], {velocity: 0.5});
				
					if (pad.buttons[YELLOW]) {
						outputSendProgramChange(89, 4);
					} else if (pad.buttons[ORANGE]) {
						outputSendProgramChange(91, 4);						
					} else  if (pad.buttons[GREEN]) {
						outputSendProgramChange(88, 4);
					} else {
						output.sendStop();						
					}
				}	      
				styleStarted = false;
			}
		}		
	}	

	playButton.innerText = !styleStarted ? "Play" : "Stop";	
}

function updateCanvas() {
	canvas.context.fillStyle = "#080018";
    canvas.context.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);
    canvas.context.strokeStyle = "#000000";
    canvas.context.strokeRect(0, 0, canvas.gameWidth, canvas.gameHeight);
	game.update();
}

function setup() {
  var gameCanvas = document.getElementById('gameCanvas');
  canvas.context = gameCanvas.getContext('2d');
  canvas.gameWidth = gameCanvas.width;
  canvas.gameHeight = gameCanvas.height;

  game = new GameBoard(canvas.context, canvas.gameWidth / 4, 0,  canvas.gameWidth / 2, canvas.gameHeight);
}

function enableSequencer(flag) {
	console.debug("enableSequencer", flag);
	
	document.querySelector("#sequencer").style.display = flag ? "" : "none";
	document.querySelector("#sequencer2").style.display = flag ? "" : "none";	
	document.querySelector("#tempoCanvas").style.display = flag ? "" : "none";

	if (!canvasContext && flag) {
		canvasContext = tempoCanvas.getContext( '2d' );    
		canvasContext.strokeStyle = "#ffffff";
		canvasContext.lineWidth = 2;

		window.onorientationchange = resetCanvas;
		window.onresize = resetCanvas;

		requestAnimFrame(draw);    // start the drawing loop.

		timerWorker = new Worker("./js/metronome-worker.js");

		timerWorker.onmessage = function(e) {
			if (e.data == "tick") {
				// console.debug("tick!");
				guitarScheduler();
			}
			else
				console.debug("message: " + e.data);
		};
		timerWorker.postMessage({"interval":lookahead});	
	}
}

function startStopSequencer() {
	//console.debug("startStopSequencer", styleStarted);
	
	if (!audioContext) audioContext = new AudioContext();	
		
	if (songSequence) 
	{
		if (!unlocked) {
		  // play silent buffer to unlock the audio
		  var buffer = audioContext.createBuffer(1, 1, 22050);
		  var node = audioContext.createBufferSource();
		  node.buffer = buffer;
		  node.start(0);
		  unlocked = true;
		}
	}
	else
		
	if (arrSequence) 	
	{		
		if (!styleStarted) 	
		{
			if (arrSequence.name && !arrSequence.data) {
				getArrSequence(arrSequence.name, doStartStopSequencer);
			}
			else {
				doStartStopSequencer();
			}
		} else {
			doStartStopSequencer();			
		}
	}
}

function sendProgramChange(event) {
	const channel = getCasmChannel(currentSffVar, event.channel);
		
	if (output) {
		outputSendProgramChange(event.programNumber, channel + 1);
		
		if (midiSynth) {
			const eventTypeByte = 0xC0 | channel;
			const evt = {data: "midi," + eventTypeByte + "," + event.programNumber};
			midiSynth.onmessage(evt);
		}		
	}
	else 
		
	if (arrSynth) {
		const eventTypeByte = 0xC0 | channel;
		const evt = {data: "midi," + eventTypeByte + "," + event.programNumber};
		arrSynth.onmessage(evt);
	}	
}

function sendControlChange(event) {
	const channel = getCasmChannel(currentSffVar, event.channel);
	//console.debug("sendControlChange",  event.channel, channel, currentSffVar, event);
	
	if (output) {
		if (event.controllerType < 120) {
			outputSendControlChange(event.controllerType, event.value, channel + 1);
		} else  {
			outputSendChannelMode(event.controllerType, event.value, channel + 1);			
		}
		
		if (midiSynth) {
			const eventTypeByte = 0xB0 | channel;
			const evt = {data: "midi," + eventTypeByte + "," + event.controllerType + "," + event.value};
			midiSynth.onmessage(evt);
		}		
	}
	else
		
	if (arrSynth) {
		const eventTypeByte = 0xB0 | channel;
		const evt = {data: "midi," + eventTypeByte + "," + event.controllerType + "," + event.value};
		arrSynth.onmessage(evt);
	}	
}

function doStartStopSequencer() {
	//console.debug("doStartStopSequencer", styleStarted);
	
	if (!styleStarted) 	
	{
		if (arrSequence) 
		{	
			if (requestArrEnd) {
				styleStarted = !styleStarted;	
				playButton.innerText = !styleStarted ? "Play" : "Stop";	
				orinayo_section.innerHTML = currentSffVar;				
				return;
			}
			
			doSffSInt();	
		}

		const introEnd = document.querySelector("#introEnd").checked;

		if (introEnd) {
			currentSffVar = "Intro A";	
			if (pad.buttons[BLUE]) currentSffVar = "Intro B";	
			if (pad.buttons[ORANGE]) currentSffVar = "Intro C";
		} else {
			currentSffVar = "Main A";	
		}
		
		if (!arrSequence.data[currentSffVar] || arrSequence.data[currentSffVar].length == 0) currentSffVar = "Main A";
		orinayo_section.innerHTML = currentSffVar;			
		
		arrangerBeat = 0;
        current16thNote = 0;
		currentPlayNote = 0;
        nextNoteTime = audioContext.currentTime;
		nextBeatTime = nextNoteTime;
		playStartTime = nextNoteTime;		
        if (timerWorker) timerWorker.postMessage("start");	
	} else {		
		requestArrEnd = true;
		requestedEnd = "Ending A";
		
		if (pad.buttons[BLUE]) requestedEnd = "Ending B";	
		if (pad.buttons[ORANGE]) requestedEnd = "Ending C";		
		
		if (songSequence) {
			if (timerWorker) timerWorker.postMessage("stop");	
			notesInQueue = []; 	
		} 
		else 
		
		if (arrSequence) {
			orinayo_section.innerHTML = "Ending";	
		}			
	}
	
	styleStarted = !styleStarted;	
	playButton.innerText = !styleStarted ? "Play" : "Stop";			
}

function resetCanvas (e) {
    // resize the canvas - but remember - this clears the canvas too.
    tempoCanvas.width = 1100;
    tempoCanvas.height = 50;

    //make sure we scroll to the top left.
    window.scrollTo(0,0); 
}

function draw() {
    var currentNote = last16thNoteDrawn;
    if (audioContext) {
        var currentTime = audioContext.currentTime;

        while (notesInQueue.length && notesInQueue[0].time < currentTime) {
            currentNote = notesInQueue[0].note;
            notesInQueue.splice(0,1);   // remove note from queue
        }

        // We only need to draw if the note has moved.
        if (last16thNoteDrawn != currentNote) {
            var x = Math.floor( tempoCanvas.width / 18 );
            canvasContext.clearRect(0,0,tempoCanvas.width, tempoCanvas.height); 
            for (var i=0; i<16; i++) {
                canvasContext.fillStyle = ( currentNote == i ) ? 
                    ((currentNote%4 === 0)?"red":"blue") : "black";
                canvasContext.fillRect( x * (i), 5, x/2, x/2 );
            }
            last16thNoteDrawn = currentNote;
        }
    }
    // set up to draw again
    requestAnimFrame(draw);
}

function nextGuitarNote() {	
	currentPlayNote++;	
	const tempRatio = tempo / window[realGuitarStyle][rgIndex].header.bpm ;
	//console.debug("nextGuitarNote", currentPlayNote, tempRatio, tempo);	
	
    if (currentPlayNote == window[realGuitarStyle][rgIndex].tracks[1].notes.length) {			
        currentPlayNote = 0;
		playStartTime = playStartTime + (window[realGuitarStyle][rgIndex].tracks[1].duration / tempRatio);	

		if (rgIndex != nextRgIndex) {
			rgIndex = nextRgIndex;
			orinayo_strum.innerHTML = "Strum " + (nextRgIndex + 1) + "/" + window[realGuitarStyle].length;				
		}		
    }
	
	const timestamp = window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].time / tempRatio;
	nextNoteTime = playStartTime + timestamp;		
}

function scheduleGuitarNote() {
		
	if (forward && window[realGuitarStyle][rgIndex]?.tracks[1]?.notes[currentPlayNote]) {
		const velocity = window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].velocity;
		const duration = window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].duration * 1000;
		
		forward.playNote(window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].midi, 1, {velocity, duration});
		//console.debug("scheduleGuitarNote", window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].midi);			
	}
}

function guitarScheduler() {
	//console.debug("guitarScheduler", nextNoteTime, currentPlayNote);

    var secondsPerBeat = 60.0 / tempo;
    nextBeatTime += (0.25 * secondsPerBeat); 	
	
    current16thNote++;   
	
    if (current16thNote == 16) {
        current16thNote = 0;
    }	

	notesInQueue.push( { note: current16thNote, time: nextBeatTime } );	
	
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleGuitarNote();
        nextGuitarNote();
    }
}

function nextSongNote() {	
	let offset = 0;
	currentPlayNote++;	
	
	if (songSequence) {
		if (currentPlayNote >= songSequence.music.length) {			
			toggleStartStop();
			return;
		}
		
		const timestamp = songSequence.music[currentPlayNote].tick * (60 / (tempo * 1920));
		nextNoteTime = playStartTime + timestamp;	
	}
	else
		
	if (arrSequence) {
		//console.debug("nextSongNote old", currentSffVar);
			
		if (currentPlayNote >= arrSequence.data[currentSffVar].length) {			
			currentPlayNote = 0;
			// TODO HACK
			// KST files need padding at end of loop
			if (arrSequence.name.toLowerCase().endsWith(".kst") || arrSequence.name.toLowerCase().endsWith(".ac6")) {
				offset = arrSequence.data.Hdr.setTempo.microsecondsPerBeat / 1000000;;
			}

			if ("Intro A" == currentSffVar) currentSffVar = "Main A";
			if ("Intro B" == currentSffVar) currentSffVar = "Main B";			
			if ("Intro C" == currentSffVar) currentSffVar = "Main C";
			
			if ("Fill In AA" == currentSffVar) currentSffVar = "Main A";
			if ("Fill In BB" == currentSffVar) currentSffVar = "Main B";			
			if ("Fill In CC" == currentSffVar) currentSffVar = "Main C";			
			if ("Fill In DD" == currentSffVar) currentSffVar = "Main D";			
			if ("Fill In BA" == currentSffVar) currentSffVar = "Main A";
			
			orinayo_section.innerHTML = currentSffVar;				
			
			//console.debug("nextSongNote new", currentSffVar);

			if (currentSffVar.startsWith("Ending")) {
				endSffStyle();
			}	

			if (requestArrEnd) {
				const introEnd = document.querySelector("#introEnd").checked;

				if (introEnd) {					
					currentSffVar = requestedEnd;
					orinayo_section.innerHTML = currentSffVar;	
				} else {
					endSffStyle();
				}					
			}				
			
		}
		
		if (arrSequence.data[currentSffVar]) {
			const timestamp = (offset + arrSequence.data[currentSffVar][currentPlayNote].deltaTime) * (60 / (tempo * arrSequence.header.ticksPerBeat));
			nextNoteTime = nextNoteTime + timestamp;
		}			
	}
}

function endSffStyle() {
	requestArrEnd = false;

	timerWorker.postMessage("stop");	
	notesInQueue = [];				

	setTimeout(() => {
		console.debug("nextSongNote clear notes", currentSffVar);
		
		for (let i=0; i<16; i++) 
		{
			if (arrSynth) {						
				const eventTypeByte = 0xB0 | i;
				
				const evt1 = {data: "midi," + eventTypeByte + ",120"};
				arrSynth.onmessage(evt1);
				
				const evt2 = {data: "midi," + eventTypeByte + ",121"};	
			}
			else
				
			if (output) {
				outputSendChannelMode (120, 0, i + 1);
				outputSendChannelMode (121, 0, i + 1);							
			}
		}

		clearAllSffNotes();		
	}, 1000);
}

function scheduleSongNote() {

	if (songSequence?.music[currentPlayNote]) {
		const message = songSequence.music[currentPlayNote].message;
		console.debug("scheduleSongNote", message);		
		
		if (message.id == "Chord") {
			let chord = [];
			let note = BASE;
			
			if (false) note = BASE;	
			
			else if (message.element.chordRoot == 33) note = BASE - 1;	// b
			else if (message.element.chordRoot == 34) note = BASE + 1;	// db	
			else if (message.element.chordRoot == 35) note = BASE + 3;	// eb
			else if (message.element.chordRoot == 36) note = BASE + 4;	// e				
			else if (message.element.chordRoot == 37) note = BASE + 6;	// gb				
			else if (message.element.chordRoot == 38) note = BASE + 8;	// ab			
			else if (message.element.chordRoot == 39) note = BASE + 10;	// bb				
			
			else if (message.element.chordRoot == 49) note = BASE;		// c
			else if (message.element.chordRoot == 50) note = BASE + 2;	// d	
			else if (message.element.chordRoot == 51) note = BASE + 4;	// e
			else if (message.element.chordRoot == 52) note = BASE + 5;	// f	
			else if (message.element.chordRoot == 53) note = BASE + 7;	// g	
			else if (message.element.chordRoot == 54) note = BASE + 9;	// a
			else if (message.element.chordRoot == 55) note = BASE + 11;	// b			

			else if (message.element.chordRoot == 65) note = BASE + 1;	// c#
			else if (message.element.chordRoot == 66) note = BASE + 3;	// d#	
			else if (message.element.chordRoot == 67) note = BASE + 5;	// f
			else if (message.element.chordRoot == 68) note = BASE + 6;	// f#				
			else if (message.element.chordRoot == 69) note = BASE + 8;	// g#				
			else if (message.element.chordRoot == 70) note = BASE + 10;	// a#			
			
			chord = [note, note + 4, note + 7];
			
			if (message.element.chordType == 0) 			// maj
				chord = [note, note + 4, note + 7];
			
			else if (message.element.chordType == 8)		// min
				chord = [note, note + 3, note + 7];	

			else if (message.element.chordType == 32)		// sus
				chord = [note, note + 5, note + 7];			
			
			if (chord.length > 0) {
				activeChord = null;
				pad.axis[STRUM] = STRUM_UP;
				orinayo.innerHTML = message.element.elementText;				
				playChord(chord, message.element.chordRoot,  message.element.chordType, message.element.chordBass);
			}
		}
	}
	else
		
	if (arrSequence) {
		let event = arrSequence.data[currentSffVar][currentPlayNote];
		//console.debug("scheduleSongNote", event);
				
		// TODO implement CASM
		const channel = getCasmChannel(currentSffVar, event.channel); 

		const instrumentNode = document.getElementById("arr-instrument-" + channel);				
		if (!instrumentNode?.checked) return;
			
		if (event?.type == "noteOn") {
			const note = harmoniseNote(event, channel);
				
			if (output) {
				outputPlayNote(note, channel + 1, {velocity: event.velocity / 127});
				
				if (midiSynth && instrumentNode) {
					instrumentNode.parentNode.parentNode.parentNode.parentNode.querySelector("tbody > tr:nth-child(" + (parseInt(channel) + 1) + ") > td:nth-child(" + (4 + parseInt(note) + 1) + ")").classList.add("note-on");
				}				
			}
			else
				
			if (arrSynth) {
				const eventTypeByte = 0x90 | channel;
				const evt = {data: "midi," + eventTypeByte + "," + note + "," + event.velocity}
				arrSynth.onmessage(evt);
			}	
		}
		else
			
		if (event?.type == "noteOff") {	
			const note = tempVariation[channel + "-" + event.noteNumber]?.note;
			
			if (note) {	
				delete tempVariation[channel + "-" + event.noteNumber];
				
				if (output) {		
					outputStopNote(note, channel + 1, {velocity: event.velocity / 127});

					if (midiSynth && instrumentNode) {
						instrumentNode.parentNode.parentNode.parentNode.parentNode.querySelector("tbody > tr:nth-child(" + (parseInt(channel) + 1) + ") > td:nth-child(" + (4 + parseInt(note) + 1) + ")").classList.remove("note-on");
					}					
				}
				else
					
				if (arrSynth) {
					const eventTypeByte = 0x80 | channel;
					const evt = {data: "midi," + eventTypeByte + "," + note + "," + event.velocity}
					arrSynth.onmessage(evt);						
				}
			}				
		}
		else
			
		if (event?.type == "programChange") {
			sendProgramChange(event);	
		}
		else
			
		if (event?.type == "controller") {
			sendControlChange(event);	
		}			
	}
}

function balanceNote(root) {
	if (root > 5) {
		return (root - 12);
	} else {
		return root;
	}	
}

function harmoniseNote(event, channel) {
	const root = (firstChord.length == 4 ? firstChord[1] : firstChord[0]) % 12;
	const bass = firstChord[0] % 12;
	
	let note = event.noteNumber;

	if (channel != 9) 
	{	
		if (!currentSffVar.startsWith("Ending") && !currentSffVar.startsWith("Intro")) {
			if (arrChordType != "7" && (note % 12) == 9) note = note + 3;	// change A to C unless 7
			if (arrChordType != "maj7" && (note % 12) == 11) note = note + 1;	// change B to C unless maj7
			if (arrChordType == "min" && (note % 12) == 4) note = note - 1;	// change E to D# when min
			if (arrChordType == "sus" && (note % 12) == 4) note = note + 1;	// change E to F when sus4	
			if (arrChordType == "maj" && (note % 12) == 3) note = note + 1;	// change D# to E when maj	

			if (channel == 10) 
			{
				if ((note % 12) == 0) {
					note = note + bass;
				} else {
					note += balanceNote(root);
				}				
			} else {
				note += balanceNote(root);
			}
			note = note % 128
		} else {
			note += keyChange;
		}
	}
	
	tempVariation[channel + "-" + event.noteNumber] = {note, event};	
		
	//console.debug("harmoniseNote", arrChordType, root, bass, note, event.noteNumber, event.channel, channel);	
	return note;
}

function songScheduler() {
	//console.debug("songScheduler", nextNoteTime, currentPlayNote);

    var secondsPerBeat = 60.0 / tempo; 
    nextBeatTime += (0.25 * secondsPerBeat); 	
	
    current16thNote++; 
	if (current16thNote == 16) current16thNote = 0;
	notesInQueue.push( { note: current16thNote, time: nextBeatTime } );	
	
	if (songSequence) 
	{
		while ((nextNoteTime < audioContext.currentTime + scheduleAheadTime) && currentPlayNote < songSequence.music.length ) {
			scheduleSongNote();
			nextSongNote();
		}
	} 
	else 
	
	if (arrSequence && arrSequence?.data && arrSequence.data[currentSffVar]) {
		arrangerBeat++;	
		
		if (arrangerBeat >=  9600 / tempo) {
			arrangerBeat = 0;
			playStartTime = audioContext.currentTime;
		}	
		
		while ((nextNoteTime < audioContext.currentTime + scheduleAheadTime) && currentPlayNote < arrSequence.data[currentSffVar].length ) {
			scheduleSongNote();
			nextSongNote();
			if (!arrSequence.data[currentSffVar]) break;
		}		
	}
}

function setupSongSequence() {
	const flag = songSequence || arrSequence;
	
	//if (!songSequence && !arrSequence) return;
	
	if (songSequence) {
		console.debug("setupSongSequence", flag, songSequence);	
		
		playButton.innerText = "Wait..";
		setTempo(songSequence.bpm);
		keyChange = songSequence.key;
	} 
	else
		
	if (arrSequence.data.Hdr) {
		const bpm = Math.floor(60 /(arrSequence.data.Hdr.setTempo.microsecondsPerBeat / 1000000))
		setTempo(bpm);

		if (arrSequence.data[currentSffVar]?.length) {
			console.debug("setupSongSequence", flag, currentSffVar, arrSequence.data[currentSffVar]);						
		}			
	}
	
    dokeyChange();

	document.querySelector("#sequencer").style.display = flag ? "" : "none";
	document.querySelector("#sequencer2").style.display = flag ? "" : "none";
	document.querySelector("#tempoCanvas").style.display = flag ? "" : "none";

	if (!canvasContext && flag) {
		canvasContext = tempoCanvas.getContext( '2d' );    
		canvasContext.strokeStyle = "#ffffff";
		canvasContext.lineWidth = 2;

		window.onorientationchange = resetCanvas;
		window.onresize = resetCanvas;

		requestAnimFrame(draw);    // start the drawing loop.

		timerWorker = new Worker("./js/metronome-worker.js");

		timerWorker.onmessage = function(e) {
			if (e.data == "tick") {
				// console.debug("tick!");
				songScheduler();
			}
			else
				console.debug("message: " + e.data);
		};
		timerWorker.postMessage({"interval":lookahead});	
	}	
		
	playButton.innerText = "Play";		
}

function setupRealDrums() {
	playButton.innerText = "Wait..";	
	setTempo(realdrumLoop.bpm);
	
	drumLoop = new AudioLooper("drum");
	drumLoop.callback(soundsLoaded, eventStatus);				
	drumLoop.addUri(realdrumLoop.drums, realdrumDevice, realdrumLoop.bpm);
	
	bassLoop = null;
	chordLoop = null;
	
	if (realdrumLoop.bass) {
		bassLoop = new AudioLooper("bass");
		bassLoop.callback(soundsLoaded, eventStatus);		
		bassLoop.addUri(realdrumLoop.bass, realdrumDevice, realdrumLoop.bpm);		
	}
	
	if (realdrumLoop.chords) {
		chordLoop = new AudioLooper("chord");
		chordLoop.callback(soundsLoaded, eventStatus);		
		chordLoop.addUri(realdrumLoop.chords, realdrumDevice, realdrumLoop.bpm);		
	}	
}

function soundsLoaded() {
	console.debug("audio loaded ok");
	playButton.innerText = "Play";	
}

function eventStatus(event, id) {
	console.debug(event, id);

	if (event == "_eventPlaying") {
		if (id == "arra") orinayo_section.innerHTML = SECTIONS[0];
		if (id == "arrb") orinayo_section.innerHTML = SECTIONS[1];
		if (id == "arrc") orinayo_section.innerHTML = SECTIONS[2];
		if (id == "arrd") orinayo_section.innerHTML = SECTIONS[3];		
		
		if (id == "int1") orinayo_section.innerHTML = SECTIONS[4];
		if (id == "end1") orinayo_section.innerHTML = SECTIONS[5];			
/*			
		if (id == "end1") {
			if (bassLoop) bassLoop.stop();			
			
			setTimeout(() => {
				drumLoop.stop();				
			}, realdrumLoop["end1"].drums.duration - 1000);
		}
*/		
	}
}

function outputSendProgramChange(program, channel) {
	output.sendProgramChange(program, channel);	
}

function outputSendControlChange(cc, value, channel) {
	output.sendControlChange(cc, value, channel);	
}

function outputSendChannelMode(cc, value, channel) {
	output.sendChannelMode(cc, value, channel);	
}

function outputPlayNote(chord, channel, options) {
	output.playNote(chord, channel, options);	
}

function outputStopNote(chord, channel, options) {
	output.stopNote(chord, channel, options)	
}

function getCasmChannel(style, source) {
	let found = null;
	let destination = source;
	
	if (arrSequence.casm) for (casm of arrSequence.casm) 
	{
		if (casm.styles.indexOf(style) > -1) {
			found = casm;
			break;
		}
	}
	
	if (found) 
	{
		for (ctab of found.ctabs) 
		{	
			if (ctab.source == source) {
				destination = ctab.destination;
				break;
			}
		}	
	}
	//console.debug("getCasmChannel", style, source, destination, found);
	if (destination == 8) destination = 9;
	return destination;
}