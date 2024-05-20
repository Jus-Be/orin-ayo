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
const WHAMMY = 2;
const LOGO = 12;
const CONTROL = 100;

var registration = 0;
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
var arrangerGroup = "imported";
var inputDeviceType = "logitech-gh";
var realGuitarStyle = "none";
var midiOutput = null;
var input = null;
var midiRealGuitar = null;
var padsDevice = null;
var padsInitialised = false;
var chordTracker = null;
var orinayo = null;
var orinayo_section = null;
var orinayo_strum = null;
var orinayo_pad = null;
var orinayo_reg = null;
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
var currentPlayNote = 0;
var currentSongNote = 0;
var startofVariation;
var tempoCanvas = null;
var nextBeatTime = 0;
var playStartTime = 0;
var songStartTime = 0;
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
var nextNoteTime = 0.0;     		// when the next arranger note is due.
var nextSongNoteTime = 0.0;     	// when the next song note is due.
var canvasContext;          		// canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; 		// the last "box" we drew on the screen
var notesInQueue = [];      		// the notes that have been put into the web audio,
									// and may or may not have played yet. {note, time}
var timerWorker = null;     		// The Web Worker used to fire timer messages
var strum1 = "3-2-1-2";
var strum2 = "[3+2+1]";
var strum3 = "3-2-4-1-4-2-4";
var guitarName = "none";
var player = new WebAudioFontPlayer();
var midiGuitar = null;
var guitarVolume = 0.25;
var guitarReverb = null;
var guitarContext = new window.AudioContext();
var guitarSource = guitarContext.destination;
var seqIndex = 0;

var O = 12;
var C = 0, Cs = 1, Db = 1, D = 2, Ds = 3, Eb = 3, E = 4, F = 5, Fs = 6, Gb = 6, G = 7, Gs = 8, Ab = 8, A = 9, As = 10, Bb = 10, B = 11;
var __6th = E +O*3, __5th = A +O*3, __4th = D +O*4, __3rd = G +O*4, __2nd = B +O*4, __1st = E +O*5;

var chordChart = [
	[{base:  C +O*2, strings: [ 3,  3, 2, 0, 1, 0]}, {base:  C +O*2, strings: [-1,  3, 5, 5, 4, 3]}, {base:  C +O*2, strings: [-1, -1, 3, 0, 1, 3]}],
	[{base: Cs +O*2, strings: [-1, -1, 3, 1, 2, 1]}, {base: Cs +O*2, strings: [-1, -1, 2, 1, 2, 0]}, {base: Cs +O*2, strings: [-1, -1, 3, 3, 4, 1]}],
	[{base:  D +O*2, strings: [-1, -1, 0, 2, 3, 2]}, {base:  D +O*2, strings: [-1, -1, 0, 2, 3, 1]}, {base:  D +O*2, strings: [-1, -1, 0, 2, 3, 3]}],
	[{base: Ds +O*2, strings: [-1, -1, 5, 3, 4, 3]}, {base: Ds +O*2, strings: [-1, -1, 4, 3, 4, 2]}, {base: Ds +O*2, strings: [-1, -1, 1, 3, 4, 4]}],
	[{base:  E +O*2, strings: [ 0,  2, 2, 1, 0, 0]}, {base:  E +O*2, strings: [ 0,  2, 2, 0, 0, 0]}, {base:  E +O*2, strings: [ 0,  2, 2, 2, 0, 0]}],
	[{base:  F +O*2, strings: [ 1,  3, 3, 2, 1, 1]}, {base:  F +O*2, strings: [ 1,  3, 3, 1, 1, 1]}, {base:  F +O*2, strings: [-1, -1, 3, 3, 1, 1]}],
	[{base: Fs +O*2, strings: [ 2,  4, 4, 3, 2, 2]}, {base: Fs +O*2, strings: [ 2,  4, 4, 2, 2, 2]}, {base: Fs +O*2, strings: [-1, -1, 4, 4, 2, 2]}],
	[{base:  G +O*2, strings: [ 3,  2, 0, 0, 0, 3]}, {base:  G +O*2, strings: [ 3,  5, 5, 3, 3, 3]}, {base:  G +O*2, strings: [-1, -1, 0, 0, 1, 3]}],
	[{base: Gs +O*2, strings: [ 4,  6, 6, 5, 4, 4]}, {base: Gs +O*2, strings: [ 4,  6, 6, 4, 4, 4]}, {base: Gs +O*2, strings: [-1, -1, 1, 1, 2, 4]}],
	[{base:  A +O*2, strings: [-1,  0, 2, 2, 2, 0]}, {base:  A +O*2, strings: [-1,  0, 2, 2, 1, 0]}, {base:  A +O*2, strings: [-1,  0, 2, 2, 3, 0]}],
	[{base: As +O*2, strings: [-1,  1, 3, 3, 3, 1]}, {base: As +O*2, strings: [-1,  1, 3, 3, 2, 1]}, {base: As +O*2, strings: [-1, -1, 3, 3, 4, 1]}],
	[{base:  B +O*2, strings: [-1,  2, 4, 4, 4, 2]}, {base:  B +O*2, strings: [-1,  2, 4, 4, 3, 2]}, {base:  B +O*2, strings: [-1, -1, 4, 4, 5, 2]}]
]
			
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
window.addEventListener("beforeunload", () => {if (!registration) saveConfig();});
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

	setupPedalBoard(guitarContext);
  
	playButton = document.querySelector(".play");
	gamePadModeButton = document.querySelector(".gamepad_mode");
	styleType = document.querySelector(".style_type");
	tempoCanvas = orinayo = document.querySelector('#tempoCanvas');	
	orinayo = document.querySelector('#orinayo');
	orinayo_section = document.querySelector('#orinayo-section');
	orinayo_strum = document.querySelector('#orinayo-strum');
	orinayo_pad = document.querySelector('#orinayo-pad');
	orinayo_reg = document.querySelector('#orinayo-reg');	
	statusMsg = document.querySelector('#statusMsg');
	guitarReverb = document.querySelector("#reverb");
	
	guitarReverb.addEventListener('click', function(event) 
	{
		if (guitarReverb.checked) {		

		} else {
			
		}
	});		
	

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

	const deleteStyle = document.querySelector(".delete_style");
	
	deleteStyle.addEventListener('click', function(event) {
		if (arrSequence?.name) {
			indexedDB.deleteDatabase(arrSequence.name);
			setTimeout(() => {
				location.reload();	
			}, 1000)				
		}
	});		

	const pedalBoard = document.querySelector(".pedal_board");
	
	pedalBoard.addEventListener('click', function(event) {
		const board = document.querySelector(".pedalboard");
		const settings = document.querySelector("#settings");		
		
		if (settings.style.display == "none") {
			settings.style.display = "";
			board.style.display = "none";	
			
		} else if (guitarReverb.checked) {
			board.style.display = "";
			settings.style.display = "none";			
		}
	});	
	
	const chordaBluetooth = document.querySelector(".chorda_bluetooth");
	
	chordaBluetooth.addEventListener('click', function(event) {
		onChordaConnect(event);
	});		

	const saveReg = document.querySelector(".save_reg")
		
	saveReg.addEventListener('click', function(event) {
		const slot = prompt("Enter save slot number");
		
		if (slot && slot != "") {
			saveRegistration(slot);
		}
	});
	
	resetApp = document.querySelector(".reset_app")
		
	resetApp.addEventListener('click', function(event) {
		registration = 0;
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
			
			if (drumLoop || chordLoop || bassLoop) {
				toggleStartStop();
			} else {
				setupRealDrums();	
			}
		} else {
			toggleStartStop();					
		}
	});	

	document.querySelector("#volume").addEventListener("input", function(event) {
		guitarVolume = +event.target.value / 100; 
	});
	
	document.querySelector("#tempo").addEventListener("input", function(event) {
		tempo = +event.target.value; 
		document.getElementById('showTempo').innerText = tempo;
		saveConfig();
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

		reader.onload = function(event)	
		{
			if (file.name.toLowerCase().endsWith(".mid") || file.name.toLowerCase().endsWith(".sf2") || file.name.toLowerCase().endsWith(".kst") || file.name.toLowerCase().endsWith(".sty") || file.name.toLowerCase().endsWith(".prs") || file.name.toLowerCase().endsWith(".bcs") || file.name.toLowerCase().endsWith(".ac7") || file.name.toLowerCase().endsWith(".sas")) {
				handleBinaryFile(file, event.target.result);
			}						
			else {
				alert("Only soundfonts, midi file or style files supported");
			}
		};

		reader.onerror = function(event) {
			console.error("handleFileContent - error", event);
		};

		reader.readAsArrayBuffer(file);
		break;
	}
}

function handleBinaryFile(file, data) {
	console.debug("handleBinaryFile", file, data);
	
	const store = new idbKeyval.Store(file.name, file.name);

	idbKeyval.set(file.name, data, store).then(function () {
		console.debug("handleBinaryFile set", file.name, data);
		
		if (file.name.toLowerCase().endsWith(".sf2")) {		
			arrSynth = {name: file.name};
		}
		else
			
		if (file.name.toLowerCase().endsWith(".mid")) {		
			songSequence = {name: file.name};
		}
		else {
			arrSequence = {name: file.name};
			arrangerGroup = "imported";				
		}

		saveConfig();
		location.reload();			
		
	}).catch(function (err) {
		console.error('handleBinaryFile set failed!', err)
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
	if (midiRealGuitar) midiRealGuitar.playNote(artiphonStrumUp ? 122 : 121, 1, {velocity: getVelocity(), duration: 1000});				
	artiphonStrumUp = !artiphonStrumUp;
}

function handleNoteOff(note, device, velocity, channel) {	
	//console.debug("handleNoteOff", inputDeviceType, note);
	
	if (inputDeviceType == "chorda" && device != "INSTRUMENT1") {
		//console.debug("chorda handleNoteOff", note.number, device, velocity, channel);
		translateChordaToI1(handleNoteOff, false, note.number, velocity, channel) 	// calls handleNoteOff again with device == INSTRUMENT1			
	}
	else
		
	if (inputDeviceType == "instrument1" || device == "INSTRUMENT1") {
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
			
			if (midiRealGuitar) midiRealGuitar.stopNote(fwdChord, 1, {velocity});	
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
			if (midiRealGuitar) midiRealGuitar.stopNote(fwdChord, 1, {velocity});
			stopPads();			
		}			
						
		if (note.number < artiphonI1Base + 10 && note.number >= artiphonI1Base) {
			pad.axis[STRUM] = 0;
			pad.buttons[CONTROL] = false;	
			pad.buttons[START] = false;	
			pad.buttons[STARPOWER] = false;	
			pad.axis[TOUCH] = 0;	

			if (padFretButton && midiRealGuitar) {
				const fwdChord = [119];
				fwdChord.push(padFretButton);	
				midiRealGuitar.stopNote(fwdChord, 1, {velocity});	
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
	//console.debug("handleNoteOn", inputDeviceType, note, device, velocity, channel);
	
	if (inputDeviceType == "chorda" && device != "INSTRUMENT1") {
		//console.debug("chorda handleNoteOn", note.number, device, velocity);		
		translateChordaToI1(handleNoteOn, true, note.number, velocity, channel) 	// calls handleNoteOn again with device == INSTRUMENT1	
	}
	else
		
	if (inputDeviceType == "instrument1" || device == "INSTRUMENT1") {
		
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
				
				if (!styleStarted && midiRealGuitar) {						
					if (note.number == artiphonI1Base) {
						padFretButton = (127);
						padsMode = 0;	
						seqIndex = 0;	
						orinayo_pad.innerHTML = "None";	
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
					
					if (padsMode != 0) orinayo_pad.innerHTML = "Pad " + padsMode;						

					if (padFretButton) {
						if (padsDevice?.stopNote || padsDevice?.name == "soundfont") stopPads();
						const fwdChord = [119];
						fwdChord.push(padFretButton);	
						midiRealGuitar.playNote(fwdChord, 1, {velocity});	
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
				
				midiRealGuitar.playNote(fwdChord, 1, {velocity});	
				
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
				midiRealGuitar.playNote(fwdChord, 1, {velocity});					
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
		
		if (midiRealGuitar && gamePadModeButton.innerText == "Color Tabs") {
			const fwdChord = [];
			if (pad.buttons[GREEN]) fwdChord.push(127);						
			if (pad.buttons[RED]) fwdChord.push(126);
			if (pad.buttons[YELLOW]) fwdChord.push(125);						
			if (pad.buttons[BLUE]) fwdChord.push(124);
			if (pad.buttons[ORANGE]) fwdChord.push(123);
			if (pad.axis[STRUM] == STRUM_UP) fwdChord.push(122);								
			if (pad.axis[STRUM] == STRUM_DOWN) fwdChord.push(121);						
			
			if (fwdChord.length > 0) midiRealGuitar.playNote(fwdChord, 1, {velocity});
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

			if (pad.axis[WHAMMY] != guitar.axes[WHAMMY].toFixed(1)) {
				//console.debug("whammy", guitar.axes[WHAMMY].toFixed(1));							
				pad.axis[WHAMMY] = guitar.axes[WHAMMY].toFixed(1);
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
	const config = JSON.parse(data);
	
	console.debug("letsGo", config, WebMidi);		
	
	
    WebMidi.enable(async function (err)
    {
      if (err) {
        alert("Orin Ayo - " + err);
	  }
	  
	  setupUI(config, err);	
    }, true);
}

function normaliseSffStyle() {
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
		if (!registration) setTempo(bpm);	
		
		const initHdr = arrSequence.data["SFF1"] || arrSequence.data["SFF2"];
		
		if (initHdr && midiOutput) 
		{
			for (let event of initHdr) 
			{			
				if (event.type == "sysEx") {
					const params = new Uint8Array(event.data);
					const manufacturer = params[0];
					const ops = [];
					for (let i=1; i<params.length - 1; i++) ops.push(params[i]);
					
					console.debug("SFF sysEx", manufacturer, ops)	
					midiOutput.sendSysex(manufacturer, ops);				
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
	realguitar.options[1] = new Option("Internal Guitar", "Internal_Guitar", config.realguitar == "Internal_Guitar");			
	realguitar.options[2] = new Option("Funk One - 16th (90-120 BPM)", "Funk1_S_16th_90_120", config.realguitar == "Funk1_S_16th_90_120");			
	realguitar.options[3] = new Option("Funk Three - 16th (90-120 BPM)", "Funk3_S_16th_90_120", config.realguitar == "Funk3_S_16th_90_120");
	realguitar.options[4] = new Option("4'4 Basic Strum 8th (100-200 BPM)", "Basic_B44_8th_100_200", config.realguitar == "Basic_B44_8th_100_200");
	realguitar.options[5] = new Option("4'4 Basic Picking 16th (50-90 BPM)", "Basic_P44_16T_50_90", config.realguitar == "Basic_P44_16T_50_90");

	realGuitarIndex = config.realGuitarStyle == "Internal_Guitar" 		? 1 : realGuitarIndex;
	realGuitarIndex = config.realGuitarStyle == "Funk1_S_16th_90_120" 	? 2 : realGuitarIndex;
	realGuitarIndex = config.realGuitarStyle == "Funk3_S_16th_90_120" 	? 3 : realGuitarIndex;				
	realGuitarIndex = config.realGuitarStyle == "Basic_B44_8th_100_200" ? 4 : realGuitarIndex;			
	realGuitarIndex = config.realGuitarStyle == "Basic_P44_16T_50_90" 	? 5 : realGuitarIndex;			
	realguitar.selectedIndex = realGuitarIndex;			
	realGuitarStyle = config.realGuitarStyle || "none";	
	
	if (window[realGuitarStyle]) {
		rgIndex = config.rgIndex || rgIndex;
		nextRgIndex = rgIndex;
		orinayo_strum.innerHTML = "Strum " + (rgIndex + 1) + "/" + window[realGuitarStyle].length;	
	}	

	const arrangerStyle =  document.getElementById("arrangerStyle");
	const arrangerGrp = document.getElementById("arrangerGroup");
	arrangerGroup = config.arrangerGroup || "yamaha";	
	
	arrangerGrp.options[0] = new Option("Imported Styles", "imported", arrangerGroup == "imported", arrangerGroup == "imported");
	arrangerGrp.options[1] = new Option("Yamaha PSR", "yamaha", arrangerGroup == "yamaha", arrangerGroup == "yamaha");
	arrangerGrp.options[2] = new Option("Ketron KST", "ketron", arrangerGroup == "ketron", arrangerGroup == "ketron");
	arrangerGrp.options[3] = new Option("Casio AC7", "casio", arrangerGroup == "casio", arrangerGroup == "casio");	
	arrangerGrp.options[4] = new Option("JJazzLab Community", "jjazzlab", arrangerGroup == "jjazzlab", arrangerGroup == "jjazzlab");
	arrangerGrp.options[5] = new Option("Soft Arranger", "sas", arrangerGroup == "sas", arrangerGroup == "sas");
	
	arrangerGrp.addEventListener("click", function()
	{
		createStyleList(config, arrangerStyle, arrangerGrp);
		if (arrangerGrp.selectedIndex == 0) arrangerGroup = "imported";
		if (arrangerGrp.selectedIndex == 1) arrangerGroup = "yamaha";
		if (arrangerGrp.selectedIndex == 2) arrangerGroup = "ketron";
		if (arrangerGrp.selectedIndex == 3) arrangerGroup = "casio";
		if (arrangerGrp.selectedIndex == 4) arrangerGroup = "jjazzlab";	
		if (arrangerGrp.selectedIndex == 5) arrangerGroup = "sas";		
		saveConfig();			
	});		
	
	createStyleList(config, arrangerStyle, arrangerGrp);
		
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
				
			if (db.name.toLowerCase().endsWith(".mid")) {
				song_sequences.unshift("*" + db.name);
			}				
		});
		
		songSeq.options[0] = new Option("**UNUSED**", "songSeq");

		for (var i=0; i<song_sequences.length; i++) {
			let selectedSong = false;
			const url = song_sequences[i];
			const songName = url.substring(url.lastIndexOf("/") + 1);	
			
			if (config?.songName == url) {
				selectedSong = true;
				songSequence = {name: url};				
			}
			songSeq.options[i + 1] = new Option(songName, url, selectedSong, selectedSong);
		}			
	})		
		
	const guitarStrum = [];
	
	for (let i=1; i<4; i++) {
		guitarStrum[i] = document.getElementById("guitarStrum" + i);		
		guitarStrum[i].options[0] = new Option("3-2-1-2", "3-2-1-2", config["strum" + i] == "3-2-1-2", config["strum" + i] == "3-2-1-2");			
		guitarStrum[i].options[1] = new Option("3-2-1-B2-3-2-1-B1", "3-2-1-B2-3-2-1-B1", config["strum" + i] == "3-2-1-B2-3-2-1-B1", config["strum" + i] == "3-2-1-B2-3-2-1-B1");	
		guitarStrum[i].options[2] = new Option("4-3-2-1-2-3", "4-3-2-1-2-3", config["strum" + i] == "4-3-2-1-2-3", config["strum" + i] == "4-3-2-1-2-3");
		guitarStrum[i].options[3] = new Option("4-3-4-2-4-3-1-3-2", "4-3-4-2-4-3-1-3-2", config["strum" + i] == "4-3-4-2-4-3-1-3-2", config["strum" + i] == "4-3-4-2-4-3-1-3-2");
		guitarStrum[i].options[4] = new Option("1-2-3-1-3-2 ", "1-2-3-1-3-2", config["strum" + i] == "1-2-3-1-3-2", config["strum" + i] == "1-2-3-1-3-2");
		guitarStrum[i].options[5] = new Option("1-3-1-2-3-1-2-1-3-2", "1-3-1-2-3-1-2-1-3-2", config["strum" + i] == "1-3-1-2-3-1-2-1-3-2", config["strum" + i] == "1-3-1-2-3-1-2-1-3-2");
		guitarStrum[i].options[6] = new Option("1-3-4-2", "1-3-4-2", config["strum" + i] == "1-3-4-2", config["strum" + i] == "1-3-4-2");
		guitarStrum[i].options[7] = new Option("1-3-4-2-3-1-3", "1-3-4-2-3-1-3", config["strum" + i] == "1-3-4-2-3-1-3", config["strum" + i] == "1-3-4-2-3-1-3");
		guitarStrum[i].options[8] = new Option("3-2-1-2-3-4-3-2", "3-2-1-2-3-4-3-2", config["strum" + i] == "3-2-1-2-3-4-3-2", config["strum" + i] == "3-2-1-2-3-4-3-2");
		guitarStrum[i].options[9] = new Option("3-2-1-2-3-1-2-3-1-2", "3-2-1-2-3-1-2-3-1-2", config["strum" + i] == "3-2-1-2-3-1-2-3-1-2", config["strum" + i] == "3-2-1-2-3-1-2-3-1-2");
		guitarStrum[i].options[10] = new Option("3-2-4-1-4-2-4", "3-2-4-1-4-2-4", config["strum" + i] == "3-2-4-1-4-2-4", config["strum" + i] == "3-2-4-1-4-2-4");
		guitarStrum[i].options[11] = new Option("3-2-4-2-3-1-3-1", "3-2-4-2-3-1-3-1", config["strum" + i] == "3-2-4-2-3-1-3-1", config["strum" + i] == "3-2-4-2-3-1-3-1");
		guitarStrum[i].options[12] = new Option("3-2-4-1-2-3-1-2-1", "3-2-4-1-2-3-1-2-1", config["strum" + i] == "3-2-4-1-2-3-1-2-1", config["strum" + i] == "3-2-4-1-2-3-1-2-1");
		guitarStrum[i].options[13] = new Option("3-[2+1]", "3-[2+1]", config["strum" + i] == "3-[2+1]", config["strum" + i] == "3-[2+1]");
		guitarStrum[i].options[14] = new Option("3-[2+1]-3-B2-3-[2+1]-3-B1", "3-[2+1]-3-B2-3-[2+1]-3-B1", config["strum" + i] == "3-[2+1]-3-B2-3-[2+1]-3-B1", config["strum" + i] == "3-[2+1]-3-B2-3-[2+1]-3-B1");  
		guitarStrum[i].options[15] = new Option("3-[2+1]-B2-[2+1]-B1", "3-[2+1]-B2-[2+1]-B1", config["strum" + i] == "3-[2+1]-B2-[2+1]-B1", config["strum" + i] == "3-[2+1]-B2-[2+1]-B1");
		guitarStrum[i].options[16] = new Option("4-[1+2+3]", "4-[1+2+3]", config["strum" + i] == "4-[1+2+3]", config["strum" + i] == "4-[1+2+3]");
		guitarStrum[i].options[17] = new Option("3-2-1-B2-3-[2+1]-3-B1", "3-2-1-B2-3-[2+1]-3-B1", config["strum" + i] == "3-2-1-B2-3-[2+1]-3-B1", config["strum" + i] == "3-2-1-B2-3-[2+1]-3-B1");
		guitarStrum[i].options[18] = new Option("2-str.chord", "[3+2]", config["strum" + i] == "[3+2]", config["strum" + i] == "[3+2]");
		guitarStrum[i].options[19] = new Option("3-str.chord", "[3+2+1]", config["strum" + i] == "[3+2+1]", config["strum" + i] == "[3+2+1]");
		guitarStrum[i].options[20] = new Option("lower 3-str.chord", "[4+3+2]", config["strum" + i] == "[4+3+2]", config["strum" + i] == "[4+3+2]");
		guitarStrum[i].options[21] = new Option("3-str.chord,BassII", "[3+2+1]-B2-[3+2+1]-B1", config["strum" + i] == "[3+2+1]-B2-[3+2+1]-B1", config["strum" + i] == "[3+2+1]-B2-[3+2+1]-B1");
		guitarStrum[i].options[22] = new Option("3-str.chord,4th", "[3+2+1]-4-[3+2]", config["strum" + i] == "[3+2+1]-4-[3+2]", config["strum" + i] == "[3+2+1]-4-[3+2]");	
		guitarStrum[i].options[22] = new Option("Bass", "B1", config["strum" + i] == "B1", config["strum" + i] == "B1");
	}
	
		
	strum1 = config.strum1 || strum1;
	strum2 = config.strum2 || strum2;
	strum3 = config.strum3 || strum3;
	
	guitarStrum[1].addEventListener("click", function()
	{
		strum1 = guitarStrum[1].value;
		console.debug("selected guitar strum1", strum1, guitarStrum[1].value);				
		saveConfig();
	});		

	guitarStrum[2].addEventListener("click", function()
	{
		strum2 = guitarStrum[2].value;
		console.debug("selected guitar strum2", strum2, guitarStrum[2].value);				
		saveConfig();
	});	

	guitarStrum[3].addEventListener("click", function()
	{
		strum3 = guitarStrum[3].value;
		console.debug("selected guitar strum3", strum3, guitarStrum[3].value);				
		saveConfig();
	});	

	const guitarType = document.getElementById("guitarType");
	guitarType.options[0] = new Option("**UNUSED**", "none", config.guitarName == "none");	
	guitarType.options[1] = new Option("RG Acoustic", "0250_RG_Acoustic_SF2_file", config.guitarName == "0250_RG_Acoustic_SF2_file", config.guitarName == "0250_RG_Acoustic_SF2_file");	
	guitarType.options[2] = new Option("Acoustic Guitar", "0253_Acoustic_Guitar_sf2_file", config.guitarName == "0253_Acoustic_Guitar_sf2_file", config.guitarName == "0253_Acoustic_Guitar_sf2_file");	
	guitarType.options[3] = new Option("Aspirin", "0250_Aspirin_sf2_file", config.guitarName == "0250_Aspirin_sf2_file", config.guitarName == "0250_Aspirin_sf2_file");	
	guitarType.options[4] = new Option("Chaos Steel", "0250_Chaos_sf2_file", config.guitarName == "0250_Chaos_sf2_file", config.guitarName == "0250_Chaos_sf2_file");	
	guitarType.options[5] = new Option("LK Acoustic Steel", "0250_LK_AcousticSteel_SF2_file", config.guitarName == "0250_LK_AcousticSteel_SF2_file", config.guitarName == "0250_LK_AcousticSteel_SF2_file");	
	guitarType.options[6] = new Option("Electric Bass Guitar (pick)", "0341_Aspirin_sf2_file", config.guitarName == "0341_Aspirin_sf2_file", config.guitarName == "0341_Aspirin_sf2_file");	
	guitarType.options[7] = new Option("Electric Guitar FSBS", "0270_EGuitar_FSBS_SF2_file", config.guitarName == "0270_EGuitar_FSBS_SF2_file", config.guitarName == "0270_EGuitar_FSBS_SF2_file");	
	guitarType.options[8] = new Option("Gibson Les Paul", "0270_Gibson_Les_Paul_sf2_file", config.guitarName == "0270_Gibson_Les_Paul_sf2_file", config.guitarName == "0270_Gibson_Les_Paul_sf2_file");	

	guitarType.addEventListener("click", function() {
		guitarStrum[1].style.display = "none";		
		guitarStrum[2].style.display = "none";		
		guitarStrum[3].style.display = "none";	
		
		guitarName = guitarType.value;
		
		if (guitarName != "none") {
			guitarStrum[1].style.display = "";		
			guitarStrum[2].style.display = "";		
			guitarStrum[3].style.display = "";			
				
			if (guitarReverb.checked) {		

			} else {
		
			}	

			midiGuitar = window["_tone_" + guitarName];		
			player.loader.decodeAfterLoading(guitarContext, '_tone_' + guitarName);				
		}			
		console.debug("selected guitar", guitarName, guitarType.value);				
		saveConfig();
	});

	guitarName = config.guitarName || guitarName;
	
	if (guitarName == "none") {
		for (let i=1; i<4; i++) guitarStrum[i].style.display = "none";
	}		
	
	if (guitarName != "none") 
	{			
		if (guitarReverb.checked) {		

		} else {
		
		}

		midiGuitar = window["_tone_" + guitarName];				
		player.loader.decodeAfterLoading(guitarContext, '_tone_' + guitarName);
		padsMode = config.padsMode || 2;
		orinayo_pad.innerHTML = "Pad " + padsMode;			
	}	
	
	
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
	arranger = config.arranger || "sff";	
	
	const midiInType = document.getElementById("midiInType");	
	midiInType.options[0] = new Option("Logitech Guitar Hero", "logitech-gh", config.inputDeviceType == "logitech-gh");		
	midiInType.options[1] = new Option("Artiphon Instrument 1", "instrument1", config.inputDeviceType == "instrument1");		
	midiInType.options[2] = new Option("Artiphon Chorda", "chorda", config.inputDeviceType == "chorda");		

	let deviceIndex = 0;
	deviceIndex = config.inputDeviceType == "logitech-gh" ? 0 : deviceIndex;
	deviceIndex = config.inputDeviceType == "instrument1" ? 1 : deviceIndex;
	deviceIndex = config.inputDeviceType == "chorda" ? 2 : deviceIndex;	
	midiInType.selectedIndex = deviceIndex;			
	inputDeviceType = config.inputDeviceType;

	setGigladUI();
   
	midiOut.options[0] = new Option("**UNUSED**", "midiOutSel");
	midiFwd.options[0] = new Option("**UNUSED**", "midiFwdSel");
	midiPads.options[0] = new Option("**UNUSED**", "midiPadsSel");	

	midiChordTracker.options[0] = new Option("**UNUSED**", "midiChordTrackerSel");
	midiIn.options[0] = new Option("**UNUSED**", "midiInSel");
	realDrumsDevice.options[0] = new Option("**UNUSED**", "realDrumsDevice");
	realDrumsLoop.options[0] = new Option("**UNUSED**", "realDrumsLoop");	

	midiPads.options[1] = new Option("Sound Font", "soundfont");	
	
	if (config.padsDevice == "soundfont") {
		padsDevice = {name : "soundfont"};	
		midiPads.options[1] = new Option("Sound Font", "soundfont", true, true);		
	}	

	if (!err) for (var i=0; i<WebMidi.outputs.length; i++) 	{
		let outSelected = false;		
		
		if (config.midiOutput && config.midiOutput == WebMidi.outputs[i].name) {
			outSelected = true;
			midiOutput = WebMidi.outputs[i];
		}
		midiOut.options[i + 1] = new Option(WebMidi.outputs[i].name, WebMidi.outputs[i].name, outSelected, outSelected);

		let padsSelected = false;
		
		if (config.padsDevice && config.padsDevice == WebMidi.outputs[i].name) {
			padsSelected = true;
			padsDevice = WebMidi.outputs[i];
		}
		midiPads.options[i + 2] = new Option(WebMidi.outputs[i].name, WebMidi.outputs[i].name, padsSelected, padsSelected);

		let fwdSelected = false;
		
		if (config.midiRealGuitar && config.midiRealGuitar == WebMidi.outputs[i].name) {
			fwdSelected = true;
			midiRealGuitar = WebMidi.outputs[i];
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
		midiOutput = null;

		if (midiOut.value != "midiOutSel") {
			midiOutput = WebMidi.getOutputByName(midiOut.value);
			saveConfig();			
			console.debug("selected midiOutput midi port", midiOutput, midiOut.value);
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
		midiRealGuitar = null;
		enableSequencer(guitarName != "none" && realGuitarStyle != "none");

		if (midiFwd.value != "midiFwdSel") {
			midiRealGuitar = WebMidi.getOutputByName(midiFwd.value);
			saveConfig();			
			enableSequencer((!!midiRealGuitar || guitarName != "none" ) && realGuitarStyle != "none");
			console.debug("selected midiRealGuitar midi port", midiRealGuitar, midiFwd.value);
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
	
	midiInType.addEventListener("click", function()
	{
		inputDeviceType = midiInType.value;
		console.debug("selected midi device type", inputDeviceType, midiInType.value);				
		saveConfig();
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
		
		if (arrangerStyle.value != "arrangerStyle") {		
			arrSequence = {name: arrangerStyle.value};
		}
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

	songSeq.addEventListener("click", function()
	{
		songSequence = null;

		if (songSeq.value != "songSeq") {
			songSequence = {name: songSeq.value};			
			console.debug("selected song sequence", songSequence, songSeq.value);
		}
		saveConfig();		
	});	
	
	normaliseAudioStyle();
	
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

	console.debug("WebMidi devices", input, midiOutput, midiRealGuitar, chordTracker);
	
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
			(e.note, midiIn.value, e.velocity, e.channel);
		});

		input.addListener("noteoff", "all", function (e) {
			//debug("Received noteoff message", e);
			handleNoteOff(e.note, midiIn.value, e.velocity, e.channel);			
		});	
		
		input.addListener("keyaftertouch", "all", function (e) {
			//console.debug("Received after touch message", e);
		});		
		
		input.addListener("programchange", "all", function (e) {
			console.debug("Received program change message", e.value);
			recallRegistration(e.value + 1);
		});		

		
		input.addListener("pitchbend", "all", function (e) {
			//console.debug("Received pitchbend", e);
		});		

		input.addListener('controlchange', "all", function (e) {
			console.debug("Received control-change (CC)", e?.controller?.number, e.value);	
					
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

	registration = config.registration || registration;
	orinayo_reg.innerHTML = "Slot " + registration;
	if (registration) setTempo(config.tempo || tempo); 	
	
	document.querySelector("#autoFill").checked = config.autoFill;	
	document.querySelector("#introEnd").checked = config.introEnd;
	document.querySelector("#reverb").checked = config.reverb;
	document.querySelector("#program-change").checked = config.programChange;	
	document.querySelector("#volume").value = (config.guitarVolume || guitarVolume) * 100;
	
	enableSequencer((!!midiRealGuitar || guitarName != "none" ) && realGuitarStyle != "none");	

	if (config.songName) {	
		songSequence = {name: config.songName};
		getSongSequence(config.songName);		
	}

	if (config.arrName) {	
		window.tempConfig = config; // store config for later access
		arrSynth = {name: config.sf2Name};	
		getArrSequence(config.arrName, arrSequenceLoaded);	
		document.querySelector(".delete_style").style.display = "";		
	}
};

function createStyleList(config, arrangerStyle, arrangerGrp) {
	arrangerStyle.innerHTML = "<select id='arrangerStyle' type='text' class='form-control input'></select>";
	arrangerStyle.options[0] = new Option("**UNUSED**", "arrangerStyle");	
	let styleSelected = false;
	let iStyle = 0;
	
	if (arrangerGrp.selectedIndex == 0) 
	{
		indexedDB.databases().then(function (databases) 
		{
			databases.forEach(function (db) {
				console.debug("found database", db.name);
					
				if (db.name.toLowerCase().endsWith(".kst") || db.name.toLowerCase().endsWith(".sty") || db.name.toLowerCase().endsWith(".prs")  || db.name.toLowerCase().endsWith(".bcs") || db.name.toLowerCase().endsWith(".ac7") || db.name.toLowerCase().endsWith(".sas")) {
					iStyle++;
					styleSelected = config.arrName == db.name;
					arrangerStyle.options[iStyle] = new Option(db.name, db.name, styleSelected, styleSelected);				
				}
			})	
		});
		
	} else {
	
		for (internalStyle of internal_styles[arrangerGrp.selectedIndex - 1]) {
			iStyle++;
			const styleName = internalStyle.substring(internalStyle.lastIndexOf("/") + 1);
			styleSelected = config.arrName == internalStyle;
			arrangerStyle.options[iStyle] = new Option(styleName, internalStyle, styleSelected, styleSelected);			
		}	
	}		
}

function arrSequenceLoaded() {
	
	if (realdrumLoop) {
		setupRealDrums()
	}	
	
	if (arrSynth?.name) {					
		getArrSynth(arrSynth.name);	// load sf2 file
	}
	else

	if (arranger == "sff") {	// use gmgsx.sf2 as dummy midiSynth
		loadMidiSynth();
	}	
	
	setupSongSequence();
	setupMidiChannels();	
}

function setupMidiChannels() {
	if (!document.getElementById("arr-instrument-0")) {
		setTimeout(setupMidiChannels, 1000);
		return;
	}
	
	for (let i=0; i<19; i++) {
		document.getElementById("arr-instrument-" + i).checked = window.tempConfig["channel" + i];
		if (i < 16) document.getElementById("midi-channel-" + i).selectedIndex = window.tempConfig["instrument" + i];		
	}
	
	delete window.tempConfig;
}

function getSongSequence(songName, callback) {
	console.debug("getSongSequence", songName);

	if (songName.startsWith("assets/songs/")) {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', escape(songName), true);
		xhr.responseType = 'arraybuffer';

		xhr.addEventListener('load', function(ev) {
			const data = new Uint8Array(ev.target.response);
			console.debug("getSongSequence", songName, data);

			songSequence = parseMidi(data, songName);	
			songSequence.name = songName;	
			
			if (callback) callback();							
		});

		xhr.send();			
		
	} else {
		const dbName = songName.substring(1);	// remove *
		const store = new idbKeyval.Store(dbName, dbName);		

		idbKeyval.get(dbName, store).then(function (data) 
		{
			if (data) {
				console.debug("getSongSequence", dbName, data);
				songSequence = parseMidi(data, dbName);	
				songSequence.name = songName;	
				
				if (callback) callback();				
			}			
		}).catch(function (err) {
			console.error('getSongSequence failed!', err)
		});	
	}	
}

function getArrSequence(arrName, callback) {
	console.debug("getArrSequence", arrName);
	arrSequence = {name: arrName};
	
	if (arrName.startsWith("assets/styles/")) {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', escape(arrName), true);
		xhr.responseType = 'arraybuffer';

		xhr.addEventListener('load', function(ev) {
			const data = ev.target.response;
			console.debug("getArrSequence", arrName, data);

			arrSequence = parseMidi(data, arrName);
			normaliseSffStyle();	
			arrSequence.name = arrName;	
			
			if (callback) callback();							
		});

		xhr.send();			
		
	} else {	
		const store = new idbKeyval.Store(arrName, arrName);		

		idbKeyval.get(arrName, store).then(function (data) 
		{
			if (data) {
				console.debug("getArrSequence", arrName, data);
				arrSequence = parseMidi(data, arrName);
				normaliseSffStyle();	
				arrSequence.name = arrName;	
				
				if (callback) callback();				
			}			
		}).catch(function (err) {
			console.error('getArrSequence failed!', err)
		});	
	}
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
	config.registration = registration;
	config.tempo = tempo;
	config.guitarVolume = guitarVolume;
	config.guitarName = guitarName;
	config.strum1 = strum1;
	config.strum2 = strum2;	
	config.strum3 = strum3;	
	config.padsMode = padsMode;
	config.keyChange = keyChange;
    config.midiOutput = midiOutput ? midiOutput.name : null;
    config.midiRealGuitar = midiRealGuitar ? midiRealGuitar.name : null;
    config.padsDevice = padsDevice ? padsDevice.name : null;	
	config.chordTracker = chordTracker ? chordTracker.name : null;
    config.input = input ? input.name : null;
	config.arranger = arranger;
	config.inputDeviceType = inputDeviceType;
	config.realGuitarStyle = realGuitarStyle;
	config.realdrumLoop = realdrumLoop ? realdrumLoop.name : null;
	config.realdrumDevice = realdrumDevice ? realdrumDevice.deviceId : null;
	config.songName = songSequence ? songSequence.name : null;
	config.arrName = arrSequence ? arrSequence.name : null;
	config.sf2Name = arrSynth ? arrSynth.name : null;
	config.arrangerGroup = arrangerGroup;
	config.rgIndex = rgIndex;
	config.autoFill = document.querySelector("#autoFill").checked;
	config.introEnd = document.querySelector("#introEnd").checked;
	config.reverb = document.querySelector("#reverb").checked;
	config.programChange = document.querySelector("#program-change").checked;	
	
	for (let i=0; i<19; i++) {
		config["channel" + i] = document.getElementById("arr-instrument-" + i)?.checked;
		if (i < 16) config["instrument" + i] = document.getElementById("midi-channel-" + i)?.selectedIndex;
	}	
	
	console.debug("saveConfig", config);

    localStorage.setItem("orin.ayo.config", JSON.stringify(config));
	
	if (!bluetoothDevice) {
		return config;
	}
	console.debug('Disconnecting from Artiphone Bluetooth Chorda Device...');
	
	if (bluetoothDevice.gatt.connected) {
		bluetoothDevice.gatt.disconnect();
	}	
	return config;
}

function doBreak() {
	console.debug("doBreak " + arranger);	

	if (drumLoop && realdrumLoop && (!arranger == "sff" || document.getElementById("arr-instrument-18")?.checked)) 	
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
	
	if (arranger == "sff") {
	
	} 	
	else 	
		
	if (arranger == "ketron") {
		sendKetronSysex(0x0B + sectionChange);		
	} 	
	else 
		
	if (arranger == "microarranger") {
        if (midiOutput) outputSendProgramChange(90, 4);
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
	
	
	if (drumLoop && realdrumLoop && (!arranger == "sff" || document.getElementById("arr-instrument-18")?.checked)) {
		if (sectionChange == 0) drumLoop.update('fila', false);
		if (sectionChange == 1) drumLoop.update('filb', false);
		if (sectionChange == 2) drumLoop.update('filc', false);
		if (sectionChange == 3) drumLoop.update('fild', false);
	}
	
	if (arranger == "sff") {
		doSffFill(false);
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
	if (!midiOutput) return;
	
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
	if (!midiOutput) return;	
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
	if (!midiOutput) return;	
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
	if (!midiOutput) return;	
	console.debug("doKorgFill " + arranger);			
	const tempArr = sectionChange % 2;
	
	if (tempArr == 0) {
		if (midiOutput) outputSendProgramChange(86, 4);
		setTimeout(() => outputSendProgramChange(80 + sectionChange, 4), 1000);			
		console.debug("doKorgFill A");		
	} else {
		if (midiOutput) outputSendProgramChange(87, 4);
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
	if (!styleStarted || !arrSequence?.data) return;
	
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
	console.debug("checkForTouchArea", pad.axis[TOUCH]);	
	
	if (pad.axis[TOUCH] == -0.7 || pad.axis[TOUCH] == -0.8) { 
		console.debug("GREEN Touch");		

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
	console.debug("playPads", chords, channel, opts);
	
	if (!styleStarted || realGuitarStyle != "none") 
	{	
		if (!padsInitialised) {
			padsInitialised = true;
			sendProgramChange({programNumber: 89, channel: channel - 1});
		}
		
		if (arrSynth?.onmessage && padsDevice?.name == "soundfont") 
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
	console.debug("stopPads");
	
	if (!styleStarted || realGuitarStyle != "none") 
	{
		if (arrSynth?.onmessage && padsDevice?.name == "soundfont") 
		{
			if (firstChord instanceof Array) 
			{
				for (note of firstChord) {
					stopPadSynthNote(note, 1, getVelocity() * 127);
				}
				
				stopPadSynthNote(firstChord[0] + 12, 1, getVelocity() * 127);		
				stopPadSynthNote(firstChord[0] - 12, 1, getVelocity() * 127);						
							
			} else {
				stopPadSynthNote(firstChord, 1, getVelocity() * 127);
			}			

		} 
		else 
			
		if (padsDevice?.stopNote) {
			padsDevice.stopNote(firstChord, 2, {velocity: getVelocity()}); 
			if (firstChord instanceof Array && firstChord.length == 4) padsDevice.stopNote(firstChord[0] + 24, 2, {velocity: getVelocity()}); 		
		}
	}
}

function getVelocity() {
	//return 0.5;	
	//return 1.00 - pad.axis[WHAMMY];
	return 0.5 + (Math.random() * 0.5);
}

function getPitches(seq) {
	const p = [];
	const arrChord = (firstChord.length == 4 ? firstChord[1] : firstChord[0]) % 12;
	const chordType = (arrChordType == "sus" ? 2 : (arrChordType == "min" ? 1 : 0));	
	const frets = chordChart[arrChord][chordType].strings;
	const stringFrets = [__6th,__5th,__4th,__3rd,__2nd,__1st];

	if (!seq) seq = "6+5+4+3+2+1"; // full strum	
	if (seq.startsWith("[")) seq = seq.substring(1, seq.length - 1);
	
	const seqList = seq.split("+");
	//console.debug("getPitches", arrChord, arrChordType, seqList, frets);
	
	for(var i=0;i<seqList.length;i++){
		const z = 6 - parseInt(seqList[i]);
		
		if(frets[z]>-1){
			p.push(stringFrets[z] + frets[z]);
		}
	}
	return p;
}

function playChord(chord, root, type, bass) {	
	console.debug("playChord", chord, root, type, bass);
	
	const guitarDuration = 240 / tempo; 
	const bassNote = (chord.length == 4 ? chord[0] : chord[0] - 12);
	const rootNote = (chord.length == 4 ? chord[0] + 12 : chord[0]);			
	const thirdNote = (chord.length == 4 ? chord[2] : chord[1]);	
	const fifthNote = (chord.length == 4 ? chord[3] : chord[2]);
	
	firstChord = chord;
	arrChordType = (type == 0x20 ? "sus" : (type == 0x08 ? "min" : (type == 0x13 ? "maj7" : "maj")));	
	
	if (!activeChord) {
		const arrChord = (firstChord.length == 4 ? firstChord[1] : firstChord[0]) % 12;
		const key = "key" + arrChord + "_" + arrChordType + "_" + SECTION_IDS[sectionChange];
		const bassKey = "key" + (chord[0] % 12) + "_" + arrChordType + "_" + SECTION_IDS[sectionChange];

		if (guitarName != "none") 
		{	
			if (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN)	
			{
				if (padsMode == 1) {
					if (pad.axis[STRUM] == STRUM_UP) player.queueStrumUp(guitarContext, guitarSource, midiGuitar, 0, getPitches(), guitarDuration, guitarVolume);
					if (pad.axis[STRUM] == STRUM_DOWN) player.queueStrumDown(guitarContext, guitarSource, midiGuitar, 0, getPitches(), guitarDuration, guitarVolume);
				}		
				else
					
				if (padsMode == 2) {
					if (pad.axis[STRUM] == STRUM_UP) player.queueStrumUp(guitarContext, guitarSource, midiGuitar, 0, getPitches(), guitarDuration, guitarVolume);
					if (pad.axis[STRUM] == STRUM_DOWN) 	player.queueWaveTable(guitarContext, guitarSource, midiGuitar, 0, bassNote, guitarDuration, guitarVolume);
				}	
				else
					
				if (padsMode == 3 || padsMode == 4 || padsMode == 5) {			
					const guitarSeq = window["strum" + (padsMode - 2)].split("-"); 
					const arpChord = guitarSeq[seqIndex++];							
					if (seqIndex >= guitarSeq.length) seqIndex = 0;
					console.debug("playChord arps", arpChord, seqIndex);				
					
					if (arpChord) 
					{				
						if (pad.axis[STRUM] == STRUM_UP) 
						{
							if (arpChord.startsWith("B")) {
								player.queueWaveTable(guitarContext, guitarSource, midiGuitar, 0, bassNote, guitarDuration, guitarVolume);
							} else {						
								player.queueStrum(guitarContext, guitarSource, midiGuitar, 0, getPitches(arpChord), guitarDuration, guitarVolume);
							}
						}
						else
							
						if (pad.axis[STRUM] == STRUM_DOWN) {
							player.queueWaveTable(guitarContext, guitarSource, midiGuitar, 0, arpChord.startsWith("B") ? bassNote : rootNote, guitarDuration, guitarVolume);
							seqIndex = 0;					
						}
					}
				}
			}
		}

		if (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN)
		{
			if (padsDevice?.stopNote || padsDevice?.name == "soundfont") {
				//console.debug("playChord pads", chord);
			
				if (padsMode == 1) {
					if (pad.axis[STRUM] == STRUM_UP) playPads(rootNote, 2, {velocity: getVelocity()});		// up root
					if (pad.axis[STRUM] == STRUM_DOWN) playPads(rootNote, 2, {velocity: getVelocity()});   // down	root				
				}		
				else
					
				if (padsMode == 2) {
					if (pad.axis[STRUM] == STRUM_DOWN) playPads(chord, 2, {velocity: getVelocity()});		// down chord
					if (pad.axis[STRUM] == STRUM_UP) playPads(rootNote, 2, {velocity: getVelocity()});     // up	root				
				}	
				else
					
				if (padsMode == 3) {
					if (pad.axis[STRUM] == STRUM_UP) playPads(thirdNote, 2, {velocity: getVelocity()});	// up third
					if (pad.axis[STRUM] == STRUM_DOWN) playPads(rootNote, 2, {velocity: getVelocity()});   // down	root				
				}
				else
					
				if (padsMode == 4) {
					if (pad.axis[STRUM] == STRUM_UP) playPads(fifthNote, 2, {velocity: getVelocity()});	// up fifth
					if (pad.axis[STRUM] == STRUM_DOWN) playPads(rootNote, 2, {velocity: getVelocity()});   // down	root				
				}
				else
					
				if (padsMode == 5) {
					if (pad.axis[STRUM] == STRUM_UP) playPads(chord, 2, {velocity: getVelocity()});		// up chord
					if (pad.axis[STRUM] == STRUM_DOWN) playPads(chord, 2, {velocity: getVelocity()});   	// down	chord				
				}			
			}
			
			if (styleType.innerText == "Normal" && (styleStarted  || (arranger != "aeroslooper" && arranger != "rclooper"))) {		
				console.debug("playChord output", chord, key, bassKey);
									
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
					
				if ((arranger == "aeroslooper" || arranger == "rclooper") && midiOutput) {
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
						if (realdrumLoop) {				
							if (bassLoop && document.getElementById("arr-instrument-17")?.checked) bassLoop.update(bassKey, false);
							if (chordLoop && document.getElementById("arr-instrument-18")?.checked) chordLoop.update(key, false);		
						}					
						if (styleStarted) setTimeout(clearAllSffNotes);
						
					} else if (midiOutput) {
						if (pad.axis[STRUM] == STRUM_UP) outputPlayNote(chord, [4], {velocity: getVelocity()});		// up
						if (pad.axis[STRUM] == STRUM_DOWN) outputPlayNote(chord, [4], {velocity: getVelocity()});   	// down	
					}
					
					if (!guitarAvailable && midiRealGuitar) 
					{
						if (gamePadModeButton.innerText != "Color Tabs") {					
							midiRealGuitar.playNote(chord, 1, {velocity: getVelocity()});
						}
					}					
				}
				
			} else {
				if (arranger == "aeroslooper" && aerosPart < 3) aerosChordTrack = root - 48;
			}		
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
		
		if (midiOutput) {						
			outputStopNote(note, channel + 1, {velocity: event.velocity});
			
			if (midiSynth) {
				const instrumentNode = document.getElementById("arr-instrument-" + channel);
				if (instrumentNode) instrumentNode.parentNode.parentNode.parentNode.parentNode.querySelector("tbody > tr:nth-child(" + (parseInt(channel) + 1) + ") > td:nth-child(" + (4 + parseInt(note) + 1) + ")").classList.remove("note-on");				
			}
		}
		else
			
		if (arrSynth?.onmessage) {
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
    if (midiOutput) { 
        console.debug("sendYamahaSysEx", code)	
		midiOutput.sendSysex(0x43, [0x7E, 0x00, code, 0x7F]);	
		
		setTimeout(() => {
			midiOutput.sendSysex(0x43, [0x7E, 0x00, code, 0x00]);	
		}, 500);		
	}	
}

function sendKetronSysex(code) {
    if (midiOutput) { 
        console.debug("sendKetronSysex", code)	
		midiOutput.sendSysex(0x26, [0x79, 0x05, 0x00, code, 0x7F]);
		
		setTimeout(() => {
			midiOutput.sendSysex(0x26, [0x79, 0x05, 0x00, code, 0x00]);	
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
		
	if (arranger == "aeroslooper" && midiOutput) {
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
		
	if (arranger == "rclooper" && midiOutput) {
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
	
    if (midiOutput && arranger == "ketron") { 
		midiOutput.sendSysex(0x26, [0x7C, 0x05, 0x01, 0x55 + code, 0x7F]);
		
		setTimeout(() => {
			midiOutput.sendSysex(0x26, [0x7C, 0x05, 0x01, 0x55 + code, 0x00]);	
		}, 500);		
	}	
}

function resetArrToA() {
	sectionChange = 0;
	//rgIndex = 0;
	//nextRgIndex = 0;
	
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
		if (midiOutput) outputSendProgramChange(80, 4);	
		console.debug("resetArrToA Micro Arranger " + sectionChange);			
	} 	
	else	
	
	if (arranger == "aeroslooper") {
		if (midiOutput) {
			aerosPart = 1;	
			aerosChordTrack = 1;
			//outputSendControlChange (113, 70 + aerosPart, 4);				// switch to main part	
		}
		console.debug("resetArrToA Aeros Looper " + sectionChange);			
	}
	else	
	
	if (arranger == "rclooper") {
		if (midiOutput) outputSendControlChange (64, 127, 4);
		console.debug("resetArrToA RC Looper " + sectionChange);			
	}	
	else	
	
	if (arranger == "giglad") {
		if (midiOutput) outputSendControlChange (108, 127, 4);
		console.debug("resetArrToA Giglad " + sectionChange);			
	}	
	else	
	
	if (arranger == "modx") {
		if (midiOutput) outputSendControlChange (92, 16, 4);
		console.debug("resetArrToA MODX " + sectionChange);			
	}
	else
		
	if (arranger == "montage") {
		if (midiOutput) outputSendControlChange (92, 16, 4);
		console.debug("resetArrToA Montage " + sectionChange);			
	}
	
	orinayo_section.innerHTML = SECTIONS[sectionChange];
	
	if (window[realGuitarStyle]) {
		//orinayo_strum.innerHTML = "Strum " + (rgIndex + 1) + "/" + window[realGuitarStyle].length;	
	}		
}

function stopChord() {			
	if (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN) {
		
		if (activeChord) {
			console.debug("stopChord", pad);
			
			if (midiOutput) outputStopNote(activeChord, [4], {velocity: getVelocity()}); 
			if (!guitarAvailable && midiRealGuitar) midiRealGuitar.stopNote(activeChord, 1, {velocity: getVelocity()});		
			if (padsDevice?.stopNote || padsDevice?.name == "soundfont") stopPads();
			if (guitarName != "none") player.cancelQueue(guitarContext);
			
			if (!guitarAvailable && midiRealGuitar) 
			{
				if (gamePadModeButton.innerText != "Color Tabs") {					
					midiRealGuitar.stopNote(activeChord, 1);
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
		
	if (pad.buttons[START]) {		// prev variation. do nothing if button pressed (used by guitar and realguitar)
	
		if (!pad.buttons[YELLOW] && !pad.buttons[BLUE] && !pad.buttons[ORANGE] && !pad.buttons[RED]  && !pad.buttons[GREEN]) {
			sectionChange--;		
			if (sectionChange < 0) sectionChange = 3;

			if (window[realGuitarStyle]) {			
				nextRgIndex--;				
				if (nextRgIndex < 0) nextRgIndex = window[realGuitarStyle].length - 1;		
			}
			arrChanged = true;		
			
		} else {	// guitar - do nothing with style
			return;
		}		
	}	
	
	orinayo_section.innerHTML = SECTIONS[sectionChange];		
			
	if (drumLoop && realdrumLoop && (arranger != "sff" || document.getElementById("arr-instrument-18")?.checked)) {
		console.debug("playSectionCheck pressed " + arrChanged, sectionChange);		
		orinayo_section.innerHTML = ">" + orinayo_section.innerHTML;	
		
		if (sectionChange == 0) drumLoop.update(arrChanged ? 'arra': 'fila', false);
		if (sectionChange == 1) drumLoop.update(arrChanged ? 'arrb': 'filb', false);
		if (sectionChange == 2) drumLoop.update(arrChanged ? 'arrc': 'filc', false);
		if (sectionChange == 3) drumLoop.update(arrChanged ? 'arrd': 'fild', false);		
	}
	
	if (realGuitarStyle == "none") changeArrSection(arrChanged);		

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

    if (midiRealGuitar) midiRealGuitar.playNote(84 + keyChange, 1, {velocity: getVelocity(), duration: 1000});
}

function doChord() {
  //console.debug("doChord", pad)
  stopChord();

  if (!pad.buttons[YELLOW] && !pad.buttons[BLUE] && !pad.buttons[ORANGE] && !pad.buttons[RED]  && !pad.buttons[GREEN]) 
  {
	  if (pad.axis[STRUM] == STRUM_LEFT)
	  {
		dokeyDown();
	  }
	  else
		  
	  if (pad.axis[STRUM] == STRUM_RIGHT)
	  {
		dokeyUp();
	  }
	  
	  if (guitarName != "none" && (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN) && padsMode != 0 && padsMode != 3 && padsMode != 4 && padsMode != 5) {
		const arrChord = (firstChord.length == 4 ? firstChord[1] : firstChord[0]) % 12;
		const guitarDuration = 240 / tempo;
		player.queueSnap(guitarContext, guitarSource, midiGuitar, 0, getPitches(), guitarDuration, guitarVolume/4);					  
	  }
  }
  else
	  
  if (pad.axis[STRUM] == STRUM_RIGHT && !styleStarted) {
	if (pad.buttons[GREEN]) recallRegistration(1);	
	if (pad.buttons[RED]) recallRegistration(2);	
	if (pad.buttons[YELLOW]) recallRegistration(3);	
	if (pad.buttons[BLUE]) recallRegistration(4);	
	if (pad.buttons[ORANGE]) recallRegistration(5);	
  }
  else
	  
  if (pad.axis[STRUM] == STRUM_LEFT && !styleStarted)  {
	if (pad.buttons[GREEN]) recallRegistration(6);	
	if (pad.buttons[RED]) recallRegistration(7);	
	if (pad.buttons[YELLOW]) recallRegistration(8);	
	if (pad.buttons[BLUE]) recallRegistration(9);	
	if (pad.buttons[ORANGE]) recallRegistration(10);	
  }  
  
  if (pad.buttons[START] || pad.buttons[STARPOWER])
  {
	if (pad.buttons[START]) {	// start + button activates pad mode
	
		if (!styleStarted) { // ignore while beat is playing. prev style is being selected
			padsMode = 0;
			seqIndex = 0;
			orinayo_pad.innerHTML = "None"; 				
		}
		
		if (pad.buttons[GREEN]) padsMode = 1;	// full chord up/down
		if (pad.buttons[RED]) padsMode = 2;		// chord up/root note down	
		if (pad.buttons[YELLOW]) padsMode = 3;	// root note up/down
		if (pad.buttons[BLUE]) padsMode = 4;	// 3rd note up/root note down
		if (pad.buttons[ORANGE]) padsMode = 5;	// 5th note up/root note down
		
		if (padsMode != 0) orinayo_pad.innerHTML = "Pad " + padsMode;			
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
		
	if (((midiRealGuitar || guitarName != "none") && realGuitarStyle != "none" && window[realGuitarStyle]) || songSequence || (arrSequence && arranger == "sff")) 
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
				if (!registration) setTempo(realdrumLoop.bpm);	

				if (songSequence) {
					orinayo_section.innerHTML = ">Arr A";					
					drumLoop.start('arra');
					if (bassLoop) bassLoop.start("key" + (keyChange % 12));
					if (chordLoop) chordLoop.start("key" + (keyChange % 12));
						
				} else {
					orinayo_section.innerHTML = ">Arr A";					
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

	if (midiOutput) { 			
		if (arranger == "ketron") {		
			outputPlayNote(firstChord, [4], {velocity: getVelocity()});
				
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
				outputPlayNote(firstChord, [4], {velocity: getVelocity()});				
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
				
				if (midiOutput) {
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
				
				if (midiOutput) {
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
				
				if (midiOutput) {
					outputPlayNote(firstChord, [4], {velocity: getVelocity()});
				
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
				
				if (midiOutput) {
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
				outputPlayNote(firstChord, [4], {velocity: getVelocity()});
				
				let startEndType = 0x00;
				if (pad.buttons[YELLOW]) startEndType = 0x00;	// INTRO-1
				if (pad.buttons[RED]) startEndType = 0x01;		// INTRO-2
				if (pad.buttons[GREEN]) startEndType = 0x02;	// INTRO-3		
				if (pad.buttons[BLUE]) startEndType = 0x01;		// INTRO-2		
				if (pad.buttons[ORANGE]) startEndType = 0x02;	// INTRO-3	
				
				sendYamahaSysEx(0x10);							// ARRA		
				sendYamahaSysEx(startEndType);	
				midiOutput.sendSysex(0x43, [0x60, 0x7A]);			// Yamaha Sysex for Accomp start
		
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
					midiOutput.sendSysex(0x43, [0x60, 0x7D]);	// Yamaha Sysex for Accomp stop
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
				outputPlayNote(firstChord, [4], {velocity: getVelocity()});				
				sendYamahaSysEx(0x08);	
				midiOutput.sendSysex(0x43, [0x60, 0x7A]);			// Yamaha Sysex for Accomp start				
				styleStarted = true;
			}
			else {
				console.debug("stop key pressed");					

				if (!pad.buttons[YELLOW]) {
					midiOutput.sendSysex(0x43, [0x60, 0x7D]);	// Yamaha Sysex for Accomp stop
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
				
				if (midiOutput) {
					outputPlayNote(firstChord, [4], {velocity: getVelocity()});
				
					if (pad.buttons[YELLOW]) {
						outputSendProgramChange(85, 4);
					} else if (pad.buttons[ORANGE]) {
						outputSendProgramChange(91, 4);							
					} else if (pad.buttons[GREEN]){
						outputSendProgramChange(84, 4);						
					} else {
						midiOutput.sendStart();
					}
					
				}     
				styleStarted = true;
			}
			else {
				console.debug("stop key pressed");
				
				if (midiOutput) {
					outputPlayNote(firstChord, [4], {velocity: getVelocity()});
				
					if (pad.buttons[YELLOW]) {
						outputSendProgramChange(89, 4);
					} else if (pad.buttons[ORANGE]) {
						outputSendProgramChange(91, 4);						
					} else  if (pad.buttons[GREEN]) {
						outputSendProgramChange(88, 4);
					} else {
						midiOutput.sendStop();						
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
	
	document.querySelector("#sequencer").style.display = flag ? "" : "none";
	document.querySelector("#sequencer2").style.display = flag ? "" : "none";	
	document.querySelector("#tempoCanvas").style.display = flag ? "" : "none";

	if (!canvasContext && flag) {
		console.debug("enableSequencer", flag);		
		canvasContext = tempoCanvas.getContext( '2d' );    
		canvasContext.strokeStyle = "#ffffff";
		canvasContext.lineWidth = 2;

		window.onorientationchange = resetCanvas;
		window.onresize = resetCanvas;

		requestAnimFrame(draw);    // start the drawing loop.

		timerWorker = new Worker("./js/metronome-worker.js");
		
		if (!midiRealGuitar && window[realGuitarStyle][rgIndex]) {			
			window[realGuitarStyle][rgIndex].restart();
		}

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
	console.debug("startStopSequencer", styleStarted);
	
	if (!audioContext) audioContext = new AudioContext();	
		
	if (songSequence) 
	{
		if (!styleStarted) 	
		{		
			if (!unlocked) {
			  // play silent buffer to unlock the audio
			  var buffer = audioContext.createBuffer(1, 1, 22050);
			  var node = audioContext.createBufferSource();
			  node.buffer = buffer;
			  node.start(0);
			  unlocked = true;
			}
			getSongSequence(songSequence.name, doStartStopSequencer);

		} else {
			if (timerWorker) timerWorker.postMessage("stop");	
			notesInQueue = []; 		
		}		
	}
	else
		
	if (arrSequence && realGuitarStyle == "none") 	
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
	else doStartStopSequencer();	
}

function sendProgramChange(event) {
	const channel = getCasmChannel(currentSffVar, event.channel);
	
	if (document.querySelector("#program-change").checked) event.programNumber = document.getElementById("midi-channel-" + channel).selectedIndex;	
		
	if (midiOutput) {
		outputSendProgramChange(event.programNumber, channel + 1);
		
		if (midiSynth) {
			const eventTypeByte = 0xC0 | channel;
			const evt = {data: "midi," + eventTypeByte + "," + event.programNumber};
			midiSynth.onmessage(evt);
		}		
	}
	else 
		
	if (arrSynth?.onmessage) {
		const eventTypeByte = 0xC0 | channel;
		const evt = {data: "midi," + eventTypeByte + "," + event.programNumber};
		arrSynth.onmessage(evt);
	}	
}

function sendControlChange(event) {
	const channel = getCasmChannel(currentSffVar, event.channel);
	//console.debug("sendControlChange",  event.channel, channel, currentSffVar, event);
	
	if (midiOutput) {
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
		
	if (arrSynth?.onmessage) {
		const eventTypeByte = 0xB0 | channel;
		const evt = {data: "midi," + eventTypeByte + "," + event.controllerType + "," + event.value};
		arrSynth.onmessage(evt);
	}	
}

function doStartStopSequencer() {
	console.debug("doStartStopSequencer", styleStarted);
	
	if (!styleStarted) 	
	{
		if (arrSequence && realGuitarStyle == "none") 
		{	
			if (requestArrEnd) {
				requestArrEnd = false;
				styleStarted = !styleStarted;	
				playButton.innerText = !styleStarted ? "Play" : "Stop";	
				orinayo_section.innerHTML = currentSffVar;	
				endAudioStyle();
				return;
			}
			
			doSffSInt();	

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
		}			
		
		arrangerBeat = 0;
        current16thNote = 0;
		currentPlayNote = 0;
		currentSongNote = 0;
		
        nextNoteTime = audioContext.currentTime;
		nextBeatTime = nextNoteTime;
		playStartTime = nextNoteTime;
		
		nextSongNoteTime = audioContext.currentTime;
		songStartTime = nextSongNoteTime;
		
        if (timerWorker) timerWorker.postMessage("start");	
	} else {		
		requestArrEnd = true;
		requestedEnd = "Ending A";
		
		if (pad.buttons[BLUE]) requestedEnd = "Ending B";	
		if (pad.buttons[ORANGE]) requestedEnd = "Ending C";		
			
		if (arrSequence && realGuitarStyle == "none") {
			orinayo_section.innerHTML = "Ending";	
		} else {
			if (timerWorker) timerWorker.postMessage("stop");	
			notesInQueue = []; 
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

	if (midiRealGuitar) {	
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
		
	} else {
		var secondsPerBeat = 60 / tempo / 4;
		nextNoteTime += secondsPerBeat; 
		
		if (rgIndex != nextRgIndex) {
			rgIndex = nextRgIndex;
			orinayo_strum.innerHTML = "Strum " + (nextRgIndex + 1) + "/" + window[realGuitarStyle].length;				
		}
		
	}
}

function scheduleGuitarNote() {
		
	if (midiRealGuitar) 
	{	
		if (window[realGuitarStyle][rgIndex]?.tracks[1]?.notes[currentPlayNote]) {
			const note = window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].midi;
			const velocity = window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].velocity;
			const duration = window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].duration * 1000;	
			midiRealGuitar.playNote(note, 1, {velocity, duration});
			//console.debug("scheduleGuitarNote", window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].midi);			
		}
	} else {
		const pattern = window[realGuitarStyle][rgIndex];
		const beat = pattern.next();
		
		if (beat) {
			const strumDuration = beat.duration * 60 / tempo / 4;
			const arrChord = (firstChord.length == 4 ? firstChord[1] : firstChord[0]) % 12;

			if (beat.element == _V){
				player.queueStrumDown(guitarContext, guitarContext.destination, midiGuitar, 0, getPitches(), strumDuration, guitarVolume / 3);				
			}
			else

			if (beat.element == _A){
				player.queueStrumUp(guitarContext, guitarContext.destination, midiGuitar, 0, getPitches(), strumDuration, guitarVolume / 3);				
			} 
			else
				
			if (beat.element == _X){
				player.queueSnap(guitarContext, guitarContext.destination, midiGuitar, 0, getPitches(), strumDuration, guitarVolume / 3);								
			}
		}
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

	if (songSequence) {
		currentSongNote++;			
		console.debug("nextSongNote", currentSongNote, nextSongNoteTime);	
		
		if (currentSongNote >= songSequence.data.music.length) {			
			toggleStartStop();
			//if (timerWorker) timerWorker.postMessage("stop");
			//notesInQueue = [];
			
		} else {		
			const timestamp = songSequence.data.music[currentSongNote].deltaTime * (60 / (tempo * songSequence.header.ticksPerBeat));
			nextSongNoteTime = nextSongNoteTime + timestamp;	
		}
	}
}

function nextArrNote() {			

	if (arrSequence) {
		let offset = 0;		
		currentPlayNote++;		
		//console.debug("nextArrNote old", currentSffVar);

		const introEnd = document.querySelector("#introEnd").checked;
			
		if (currentPlayNote >= arrSequence.data[currentSffVar].length) {			
			currentPlayNote = 0;
			// TODO HACK
			// KST files need padding at end of loop
			if (arrSequence.name.toLowerCase().endsWith(".kst") || arrSequence.name.toLowerCase().endsWith(".ac7")) {
				offset = arrSequence.data.Hdr.setTempo.microsecondsPerBeat / 1000000;
			}
			else if ( arrSequence.name.toLowerCase().endsWith(".sas")) {
				offset = (15 - current16thNote) * arrSequence.data.Hdr.setTempo.microsecondsPerBeat / 1000000;				
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
			
			//console.debug("nextArrNote new", currentSffVar);

			if (currentSffVar.startsWith("Ending")) {
				endSffStyle();
			}	

			if (requestArrEnd && introEnd) 	{			
				currentSffVar = requestedEnd;
				orinayo_section.innerHTML = currentSffVar;						
			}				
			
		}
		
		if (requestArrEnd && !introEnd) {
			endSffStyle();				
		}		
		
		if (arrSequence.data[currentSffVar]) {
			const timestamp = (offset + arrSequence.data[currentSffVar][currentPlayNote].deltaTime) * (60 / (tempo * arrSequence.header.ticksPerBeat));
			nextNoteTime = nextNoteTime + timestamp;
		}			
	}
}

function endAudioStyle() {

	if (chordLoop) {
		chordLoop.finished = true;		
		chordLoop.stop();
	}

	if (bassLoop) {	
		bassLoop.finished = true;
		bassLoop.stop();
	}
	
	if (drumLoop) {
		drumLoop.finished = true;		
		drumLoop.stop();
	}

}

function endSffStyle() {
	requestArrEnd = false;
	
	endAudioStyle();	
	timerWorker.postMessage("stop");	
	notesInQueue = [];				

	setTimeout(() => {
		console.debug("nextSongNote clear notes", currentSffVar);
		
		for (let i=0; i<16; i++) 
		{
			if (arrSynth?.onmessage) {						
				const eventTypeByte = 0xB0 | i;
				
				const evt1 = {data: "midi," + eventTypeByte + ",120"};
				arrSynth.onmessage(evt1);
				
				const evt2 = {data: "midi," + eventTypeByte + ",121"};	
			}
			else
				
			if (midiOutput) {
				outputSendChannelMode (120, 0, i + 1);
				outputSendChannelMode (121, 0, i + 1);							
			}
		}

		clearAllSffNotes();		
	}, 1000);
}

function getChordType(type) {
    if (type == 0x00)  return ""	
    if (type == 0x01)  return "6";	
    if (type == 0x02)  return "7";
    if (type == 0x03)  return "7#11";
    if (type == 0x04)  return "9";
    if (type == 0x05)  return "7-9";
    if (type == 0x06)  return "6-9";
    if (type == 0x07)  return "aug";
    if (type == 0x08)  return "min";		
    if (type == 0x09)  return "min6";
    if (type == 0x0A)  return "min7";
    if (type == 0x0B)  return "min7b5";
	if (type == 0x0C)  return "min9";
    if (type == 0x0D)  return "min7-9";
    if (type == 0x0E)  return "min7-11";	
    if (type == 0x0F)  return "minmaj7";
    if (type == 0x10)  return "minmaj7-9";	
    if (type == 0x11)  return "dim";		
    if (type == 0x12)  return "dim7";	
    if (type == 0x13)  return "7";
    if (type == 0x14)  return "7sus4";
    if (type == 0x15)  return "7b5";
    if (type == 0x16)  return "7-9";
    if (type == 0x17)  return "7#11";
    if (type == 0x18)  return "7-13";
    if (type == 0x19)  return "7b9";
    if (type == 0x1A)  return "7b13";
    if (type == 0x1B)  return "7#9";
    if (type == 0x1D)  return "7aug";
    if (type == 0x1E)  return "8";
    if (type == 0x1F)  return "5";
    if (type == 0x20)  return "sus4";
    if (type == 0x21)  return "sus2";
}

function getNoteName(chordRoot) {	
	let note = BASE;
	let shape = "C";
	
	if (false) note = BASE;	
	else if (chordRoot == 33) { note = BASE - 1;  shape = "B"; } // b
	else if (chordRoot == 34) { note = BASE + 1;  shape = "Db"; } // db	
	else if (chordRoot == 35) { note = BASE + 3;  shape = "Eb"; } // eb
	else if (chordRoot == 36) { note = BASE + 4;  shape = "E"; } // e				
	else if (chordRoot == 37) { note = BASE + 6;  shape = "Gb"; } // gb				
	else if (chordRoot == 38) { note = BASE + 8;  shape = "Ab"; } // ab			
	else if (chordRoot == 39) { note = BASE + 10; shape = "Bb"; } // bb				
	
	else if (chordRoot == 49) { note = BASE;  	  shape = "C"; } // c
	else if (chordRoot == 50) { note = BASE + 2;  shape = "D"; } // d	
	else if (chordRoot == 51) { note = BASE + 4;  shape = "E"; } // e
	else if (chordRoot == 52) { note = BASE + 5;  shape = "F"; } // f	
	else if (chordRoot == 53) { note = BASE + 7;  shape = "G"; } // g	
	else if (chordRoot == 54) { note = BASE + 9;  shape = "A"; } // a
	else if (chordRoot == 55) { note = BASE + 11; shape = "B"; } // b			

	else if (chordRoot == 65) { note = BASE + 1;  shape = "C#"; } // c#
	else if (chordRoot == 66) { note = BASE + 3;  shape = "D#"; } // d#	
	else if (chordRoot == 67) { note = BASE + 5;  shape = "F"; } // f
	else if (chordRoot == 68) { note = BASE + 6;  shape = "F#"; } // f#				
	else if (chordRoot == 69) { note = BASE + 8;  shape = "G#"; } // g#				
	else if (chordRoot == 70) { note = BASE + 10; shape = "A#"; } // a#	
	
	return {note, shape};
}

function scheduleSongNote() {

	if (songSequence?.data.music[currentSongNote]) {
		const event = songSequence.data.music[currentSongNote];	
		
		if (event?.sysexType == "section-control") 
		{		
			if (event.section == 0x08) {
				 sectionChange = 0; 
				 changeArrSection(true);
			}
			else 
				
			if (event.section == 0x09) {
				sectionChange = 1;
				 changeArrSection(true);				
			}			
			else 
				
			if (event.section == 0x0A) {
				sectionChange = 2;
				 changeArrSection(true);				
			}	
			else 
				
			if (event.section == 0x0B) {
				sectionChange = 3;
				 changeArrSection(true);				
			}
			else 
				
			if (event.section == 0x10 || event.section == 0x11 || event.section == 0x12 || event.section == 0x13) {
				 doFill();				
			}						
			else 
				
			if (event.section == 0x18) {
				 doBreak();				
			}
			
			if (event.section == 0x20 || event.section == 0x21 || event.section == 0x22 || event.section == 0x23) {			
				toggleStartStop()
			}	
		}
		else
		
		if (event?.sysexType == "chord") {
			console.debug("scheduleSongNote - chord", event);				
			let chord = [];
			const chordShape = getNoteName(event.chordRoot);	
			const bassShape = getNoteName(event.chordBass);
			
			const note = chordShape.note;
			
			chord = [note, note + 4, note + 7];
			
			if (event.chordType == 0) 			// maj
				chord = [note, note + 4, note + 7];
			
			else if (event.chordType == 8)		// min
				chord = [note, note + 3, note + 7];	

			else if (event.chordType == 32)		// sus
				chord = [note, note + 5, note + 7];	
				
			let displayShape = chordShape.shape +  " " + getChordType(event.chordType);

			if (event.chordRoot != event.chordBass) {
				chord.unshift(bassShape.note);
				displayShape = displayShape + "/" + bassShape.shape;
			}
			
			if (chord.length > 0) {
				activeChord = null;
				pad.axis[STRUM] = STRUM_UP;
				orinayo.innerHTML = displayShape;				
				playChord(chord, event.chordRoot,  event.chordType, event.chordBass);
			}
		}
		else
			
		if (event.type == "lyrics") {
			const cntrl = document.getElementById("lyrics");
			let lyrics = cntrl.innerHTML + event.text;
			
			if (cntrl.innerHTML.length > 80) {
				lyrics = event.text;
			}

			cntrl.innerHTML = lyrics;
		}		
	}
}

function scheduleArrNote() {
	
	if (arrSequence) {
		let event = arrSequence.data[currentSffVar][currentPlayNote];
		//console.debug("scheduleSongNote", event);
			
		if (drumLoop && !drumLoop.looping && document.getElementById("arr-instrument-16")?.checked) {
			drumLoop.start("arra");
		}	

		if (bassLoop && !bassLoop.looping && document.getElementById("arr-instrument-17")?.checked) {
			bassLoop.start("key" + (keyChange % 12));
		}
		
		if (chordLoop && !chordLoop.looping && document.getElementById("arr-instrument-18")?.checked) {
			chordLoop.start("key" + (keyChange % 12));
		}		
				
		// TODO implement CASM
		const channel = getCasmChannel(currentSffVar, event.channel); 

		const instrumentNode = document.getElementById("arr-instrument-" + channel);				
		if (!instrumentNode?.checked) return;
			
		if (event?.type == "noteOn") {
			const note = harmoniseNote(event, channel);
				
			if (midiOutput) {
				outputPlayNote(note, channel + 1, {velocity: event.velocity / 127});
				
				if (midiSynth && instrumentNode) {
					instrumentNode.parentNode.parentNode.parentNode.parentNode.querySelector("tbody > tr:nth-child(" + (parseInt(channel) + 1) + ") > td:nth-child(" + (4 + parseInt(note) + 1) + ")").classList.add("note-on");
				}				
			}
			else
				
			if (arrSynth?.onmessage) {
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
				
				if (midiOutput) {		
					outputStopNote(note, channel + 1, {velocity: event.velocity / 127});

					if (midiSynth && instrumentNode) {
						instrumentNode.parentNode.parentNode.parentNode.parentNode.querySelector("tbody > tr:nth-child(" + (parseInt(channel) + 1) + ") > td:nth-child(" + (4 + parseInt(note) + 1) + ")").classList.remove("note-on");
					}					
				}
				else
					
				if (arrSynth?.onmessage) {
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

	if (channel != 9 && channel != 8) 
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
	//console.debug("songScheduler", nextNoteTime, currentPlayNote, currentSongNote);

    var secondsPerBeat = 60.0 / tempo; 
    nextBeatTime += (0.25 * secondsPerBeat); 	
	
    current16thNote++; 
	if (current16thNote == 16) current16thNote = 0;
	notesInQueue.push( { note: current16thNote, time: nextBeatTime } );	
			
	if (arrSequence && arrSequence?.data && arrSequence.data[currentSffVar]) {
		arrangerBeat++;	
		
		if (arrangerBeat >=  9600 / tempo) {
			arrangerBeat = 0;
			playStartTime = audioContext.currentTime;
		}	
		
		while ((nextNoteTime < audioContext.currentTime + scheduleAheadTime) && currentPlayNote < arrSequence.data[currentSffVar].length ) {
			scheduleArrNote();
			nextArrNote();
			if (!arrSequence.data[currentSffVar]) break;
		}		
	}
	
	if (songSequence) 
	{
		while ((nextSongNoteTime < audioContext.currentTime + scheduleAheadTime) && currentSongNote < songSequence.data.music.length ) {
			scheduleSongNote();
			nextSongNote();
		}
	} 
	
}

function setupSongSequence() {
	const flag = songSequence || arrSequence;
	
	//if (!songSequence && !arrSequence) return;
	
	if (songSequence) {
		console.debug("setupSongSequence", flag, songSequence);	
		
		playButton.innerText = "Wait..";
		const bpm = Math.floor(60 /(songSequence.data.Hdr.setTempo.microsecondsPerBeat / 1000000))
		if (!registration) setTempo(bpm);	
	} 
		
	if (arrSequence.data?.Hdr) {
		
		if (realdrumLoop) {
			if (!registration) setTempo(realdrumLoop.bpm);	
		} else {
			const bpm = Math.floor(60 /(arrSequence.data.Hdr.setTempo.microsecondsPerBeat / 1000000))
			if (!registration) setTempo(bpm);			
		}

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
	if (!registration) setTempo(realdrumLoop.bpm);

	drumLoop = null;	
	bassLoop = null;
	chordLoop = null;
	
	if (realdrumLoop.drums) {	
		drumLoop = new AudioLooper("drum");
		drumLoop.callback(soundsLoaded, eventStatus);				
		drumLoop.addUri(realdrumLoop.drums, realdrumDevice, realdrumLoop.bpm);
	}
	
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
	midiOutput.sendProgramChange(program, channel);	
}

function outputSendControlChange(cc, value, channel) {
	midiOutput.sendControlChange(cc, value, channel);	
}

function outputSendChannelMode(cc, value, channel) {
	midiOutput.sendChannelMode(cc, value, channel);	
}

function outputPlayNote(chord, channel, options) {
	midiOutput.playNote(chord, channel, options);	
}

function outputStopNote(chord, channel, options) {
	midiOutput.stopNote(chord, channel, options)	
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
	return destination;
}

function normaliseAudioStyle() {
	for (drum_loop of drum_loops) 
	{
		if (drum_loop?.chords && !drum_loop.chords.key0) {
			const size = drum_loop.chords.duration / 36;
			let start = 0;
			let stop = size;
			
			for (let i=0; i<3; i++) 
			{
				for (let j=0; j<12; j++) {
					let key = "key" + j;
					if (i ==1) key = "key" + j + "_min";
					if (i ==2) key = "key" + j + "_sus";	
				
					drum_loop.chords[key] = {start, stop};
					start += size;
					stop += size;
				}				
			}
			
		}
	}		
}

function recallRegistration(slot) {
	console.debug("recallRegistration", slot);
	
	let data = localStorage.getItem("orin.ayo.slot." + slot);	
	
	if (data) {
		registration = slot;		
		localStorage.setItem("orin.ayo.config", data);
		setTimeout(() => location.reload(), 500 );		
	}

}

function saveRegistration(slot) {
	console.debug("saveRegistration", slot);
	registration = slot;
	const config = saveConfig();
	localStorage.setItem("orin.ayo.slot." + slot, JSON.stringify(config));
}

function midiProgramChangeEvent(target) {
	console.debug("midiProgramChangeEvent", target.selectedIndex, target.id);
}
