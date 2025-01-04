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
const JSTICKX = 0;
const JSTICKY = 1;
const WHAMMY = 2;
const LOGO = 12;
const CONTROL = 100;

var _converse;
var recorderDestination = null;
var streamDestination = null;
var publishConnection = null;
var watchConnection = null;
var lavaGenieWaitout = 1000;
var keysSound1 = null;
var keysSound2 = null;
var savedDrumVol = 100;
var savedBassVol = 100;
var savedChordVol = 100;
var midiNotesProceesed = false;
var midiNotes = new Map();
var streamDeckPointer = 0;
var streamDeck = null;
var bluetoothGuitar = null;
var bassVol = 95;
var chordVol = 40;
var drumVol = 85;
var keysSound1Vol = 100;
var keysSound2Vol = 50;
var chordproParser = new ChordSheetJS.ChordProParser();
var lyricsX = 2;
var lyricsY = 18;
var lyricsCanvas = null;
var recorderFilename = null;
var mediaRecorder = null;
var recordMode = false;
var writeCharacteristic = null;
var readCharacteristic = null;
var appliedVelocity = 0;
var microphone = true;
var handledStartStop = true;
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
var isStrumUp = false;
var artiphonI1Base = 36;
var footSwCode7Enabled = false;
var playButton = null;
var gamePadModeButton = null;
var styleType = null;
var keyboard = new Map();
var bassLoop = null;
var drumLoop = null;
var chordLoop = null;
var realInstrument = null;
var songSequence = null;
var arrSequence = null;
var realdrumDevice = null;
var arranger = "webaudio";
var arrangerGroup = "imported";
var inputDeviceType = "games-controller";
var realGuitarStyle = "none";
var midiOutput = null;
var input = null;
var midiRealGuitar = null;
var guitarDeviceId = null;
var padsDevice = null;
var padsInitialised = false;
var chordTracker = null;
var orinayo = null;
var orinayo_section = null;
var orinayo_strum = null;
var orinayo_pad = null;
var orinayo_reg = null;

var base = BASE;
var key = "C"
var keyChange = 0;
var padsMode = 0;
var savedPadsMode = 0;
var sectionChange = 0;
var rgIndex = 0;
var nextRgIndex = 0;
var styleStarted = false;
var activeChord = null;
var forwardChord = null;
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
var audioContext = new AudioContext();
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
var savedGuitarVolume = 0.25;
var guitarReverb = null;
var guitarContext = audioContext; //new AudioContext();
var guitarSource = guitarContext.destination;
var seqIndex = 0;

var liberLive = {drums1: "6/24", drums2: "16/24", chord1: "1/0", chord2: "1/0"};
var lock = {counter: 0, up: 0, down: 0, button: -1};

var O = 12;
var C = 0, Cs = 1, Db = 1, D = 2, Ds = 3, Eb = 3, E = 4, F = 5, Fs = 6, Gb = 6, G = 7, Gs = 8, Ab = 8, A = 9, As = 10, Bb = 10, B = 11;
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
var textDecoder = null;

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
window.addEventListener("beforeunload", () => {if (!registration) saveConfig(); });
window.addEventListener('message', messageHandler);
window.addEventListener('resize', (event) =>	{setup()});	
//document.addEventListener('contextmenu', event => event.preventDefault());
			
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

function handleLiberLive(selected) {
	const bluetooth = document.querySelector("#bluetooth");
	bluetooth.style.display = selected ? "" : "none";	
	let device;
	
	if (selected) bluetooth.addEventListener("click", async (evt) => {

		device = await navigator.bluetooth.requestDevice({		
			filters: [{
			services: ["000000ff-0000-1000-8000-00805f9b34fb"],
		}]});

		if (device) {
			console.debug("found liberlive", device);	
			
			if (bluetoothGuitar) {
				await device.forget();	
				bluetoothGuitar	= null;
				console.debug("forget liberlive", device);
			} else {
				bluetoothGuitar = device;
			}
		}
	});
}

function handleLavaGenie(selected) {
	const bluetooth = document.querySelector("#bluetooth");
	bluetooth.style.display = selected ? "" : "none";	
	let device;
	
	if (selected) bluetooth.addEventListener("click", async (evt) => {
		console.debug('handleLavaGenie - click');	
	
		device = await navigator.bluetooth.requestDevice({		
			filters: [{
			services: ["0000fee0-0000-1000-8000-00805f9b34fb"],		
		}]});

		if (device) {
			console.debug("found lavagenie", device);				
			
			if (bluetoothGuitar) {			
				await device.forget();
				bluetoothGuitar	= null;				
				console.debug("forget lavagenie", device);				
			} else {
				bluetoothGuitar = device;
			}				
		}
	});
}

function handleRecordSong(selected) {
	const recordSong = document.querySelector("#record_song");
	recordSong.style.display = selected ? "" : "none";
	
	recordSong.addEventListener("click", async (evt) => {
		console.debug("Record clicked", recordMode);
		
		if (playButton.innerHTML == "Play") {
			recorderFilename = prompt("Enter File name");
			
			if (recorderFilename) {
				console.debug("Record setup");
				recordMode = true;
			}
		}

	});		
}

function stopRecording() {
	console.debug('stopRecording');	
	
	recordMode = false;	
	mediaRecorder.stop();
}

function startRecording() {
	console.debug('startRecording');

	let blobType = "audio/webm; codecs=opus";
	let fileExtn = ".ogg";

	const gain = audioContext.createGain();	
	recorderDestination = audioContext.createMediaStreamDestination();	
	gain.connect(recorderDestination);	
	
	if (window.pedalOutput) pedalOutput.connect(recorderDestination);	
		
	if (lyricsCanvas.style.display != "none") {	
		recorderDestination.stream.addTrack(lyricsCanvas.captureStream().getVideoTracks()[0]);	
		blobType = 'video/mp4; codecs=mp4a.40.2"';
		fileExtn = ".mp4";		
	}	
	
	mediaRecorder = new MediaRecorder(recorderDestination.stream, { mimeType: blobType });	
	
	mediaRecorder.addEventListener('dataavailable', e => { 
		console.debug("dataavailable", e.data);
		
		const blob = new Blob([e.data], { type: blobType });		
        const anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.style = "display: none;";
        anchor.download = recorderFilename + fileExtn;
        document.body.appendChild(anchor);
        anchor.click();
        window.URL.revokeObjectURL(anchor.href);
		
		recorderFilename = null;	
		recorderDestination	= null;
	})	
	
	mediaRecorder.addEventListener('onstop', e => { 
		 console.debug("onstop", e.data);
	})
	
	mediaRecorder.start();
}

async function onLavaGenieClick() {
	console.debug('onLavaGenieClick');		
	
	let ready, device;
	const devices = await navigator.bluetooth.getDevices();

	if (devices.length > 0) {
		device = devices[0];
		bluetoothGuitar = device;
						
		device.addEventListener('advertisementreceived', (event) => {	
			//console.debug('Bluetooth device advert', event);
			
			if (!ready) {
				ready = true;
				textDecoder = new TextDecoder("utf-8"); 
				doLavaGenieSetup(device);
			}
		});
		
		await device.watchAdvertisements();		
		
	} else {
		device = await navigator.bluetooth.requestDevice({filters: [{services: ["0000fee0-0000-1000-8000-00805f9b34fb"]}]});

		if (device) {
			bluetoothGuitar = device;
			textDecoder = new TextDecoder("utf-8"); 			
			doLavaGenieSetup(device);		
		}
	}
	
	console.debug('onLavaGenieClick', device);		
}

async function onLiberLiveClick() {
	console.debug('onLiberLiveClick');	
	
	//00002902-0000-1000-8000-00805f9b34fb - Client Characteristic Configuration descriptor
	//000000ff-0000-1000-8000-00805f9b34fb	
	//0000FF03-0000-1000-8000-00805F9B34FB
	//0000FF02-0000-1000-8000-00805F9B34FB
	//0000FF01-0000-1000-8000-00805F9B34FB
	
	//000000ff-0000-1000-8000-00805f9b34fb, - Primary Service UUID
	//00001800-0000-1000-8000-00805f9b34fb, - Generic Access UUID
	//00001801-0000-1000-8000-00805f9b34fb	- Generic Attribute UUID
	
	let ready, device;
	const devices = await navigator.bluetooth.getDevices();
	console.debug('onLiberLiveClick - devices', devices);

	if (devices.length > 0) {
		device = devices[0];
		bluetoothGuitar = device;		
		
		device.addEventListener('advertisementreceived', (event) => {	
			console.debug('Bluetooth device advert', event);
			
			if (!ready) {
				ready = true;
				textDecoder = new TextDecoder("utf-8"); 
				doLiberLiveSetup(device);
			}
		});
		
		await device.watchAdvertisements();		
		
	} else {
		device = await navigator.bluetooth.requestDevice({filters: [{services: ["000000ff-0000-1000-8000-00805f9b34fb"]}]});

		if (device) {
			bluetoothGuitar = device;			
			textDecoder = new TextDecoder("utf-8"); 			
			doLiberLiveSetup(device);		
		}
	}
	
	console.debug('onLiberLiveClick', device);	
}

async function doLavaGenieSetup(device) {
	console.debug('doLavaGenieSetup', device);	
	
	if (device) {	
		const ui = document.getElementById("lyrics");

		device.addEventListener('gattserverdisconnected', (event) => {
			console.debug('Bluetooth device ' + device.name + ' is disconnected.', event);
			if (_converse.api.connection) _converse.api.disconnect();
		});
		
		const handlers = {};		
		const server = await device.gatt.connect();
		console.debug('GATT server', server);

		const services = await server.getPrimaryServices();
		
		for (let service of services) {
			console.debug("GATT service", service.uuid, service.isPrimary, service);
			const characteristics = await service.getCharacteristics();
			
			for (let characteristic of characteristics) 
			{
				try {				
					const descriptors = await characteristic.getDescriptors();
				
					for (let descriptor of descriptors) {
						const value = await descriptor.readValue();
						console.debug('Found Descriptor', descriptor.uuid, value);				
					}
				} catch (e) {

				}

				console.debug('Found Characteristic', characteristic.uuid, characteristic.properties, service.uuid);										

				if (characteristic.properties.read) {
					handlers[characteristic.uuid] = characteristic;	
					
					handlers[characteristic.uuid].addEventListener('characteristicvaluechanged',  (evt) => {
						const {buffer}  = evt.target.value;
						const eventData = new Uint8Array(buffer);					
						
						for (let i in eventData) console.debug("Read", eventData.length, i + ":" + eventData[i]);						
					});					

				}
				else
					
				if (characteristic.properties.writeWithoutResponse) {
					writeCharacteristic = characteristic;	
					//setTimeout(setLiberLiveChordMappings);
					setTimeout(setLavaGenieSettings, 1000);
				}
				else
					
				if (characteristic.properties.notify) {
					console.debug('Setup Notifier', characteristic.uuid);					
					handlers[characteristic.uuid] = await characteristic.startNotifications();
					
					let cannotFire = true;
					let haveFired = false;
					let tempoDiv = document.getElementById('showTempo');
					let volDiv = document.getElementById('showVol');					
					
					if (!game) {
						setup();
						resetGuitarHero();
					}	

					document.getElementById("lavagenie").style.display = "";					
					
					handlers[characteristic.uuid].addEventListener('characteristicvaluechanged', (evt) => {
						const {buffer}  = evt.target.value;
						const eventData = new Uint8Array(buffer);
						
						for (let i in eventData) console.debug("Event", eventData.length, i + ":" + eventData[i]);	

						let chordSelected = false;
						let paddleMoved = false;
						resetGuitarHero();
						
						if (eventData[0] == 202 && eventData[1] == 2 && eventData[2] == 101) { // control buttons
								
							if (eventData[3] == 2 && eventData[4] == 103) {	

								if (!styleStarted) {
									pad.buttons[LOGO] = true;		// START
								} else {
									pad.buttons[STARPOWER] = true;	// next style
								}
							}
							else
								
							if (eventData[3] == 0 && eventData[4] == 101) {	
								if (styleStarted) {
									pad.buttons[LOGO] = true;		// STOP
								}
							}							
	
						}
						else

						if (eventData[0] == 202 && eventData[1] == 2 && eventData[2] == 92) { // chord key press	
						
							if (eventData[3] == 27 && eventData[4] == 71) {
								pad.buttons[YELLOW] = true;		// 7b			
								pad.buttons[RED] = true;								
								chordSelected = true;
							}
							else
								
							if (eventData[3] == 26 && eventData[4] == 70) {
								pad.buttons[YELLOW] = true;		// 5b			
								pad.buttons[GREEN] = true;								
								pad.buttons[RED] = true;							
								chordSelected = true;
							}
							else

							if (eventData[3] == 17 && eventData[4] == 77) {
								pad.buttons[YELLOW] = true;		// 7b			
								pad.buttons[RED] = true;								
								chordSelected = true;
							}
							else
								
							if (eventData[3] == 52 && eventData[4] == 104) {
								pad.buttons[RED] = true;		// 6m
								chordSelected = true;
							}
							else
								
							if (eventData[3] == 53 && eventData[4] == 105) {
								pad.buttons[RED] = true;		// 6
								pad.buttons[YELLOW] = true;
								pad.buttons[BLUE] = true;							
								chordSelected = true;
							}
							else
								
							if (eventData[3] == 84 && eventData[4] == 8) {
								pad.buttons[GREEN] = true;		// 5								
								chordSelected = true;
							}
							else
								
							if (eventData[3] == 81 && eventData[4] == 13) {
								pad.buttons[GREEN] = true;		// 5sus							
								pad.buttons[YELLOW] = true;						
								chordSelected = true;
							}
							else
								
							if (eventData[3] == 85 && eventData[4] == 9) {
								pad.buttons[GREEN] = true;		// 5/7
								pad.buttons[RED] = true;							
								chordSelected = true;
							}													
							else
								
							if (eventData[3] == 97 && eventData[4] == 61) {
								pad.buttons[YELLOW] = true;		// 1
								chordSelected = true;
							}
							else
								
							if (eventData[3] == 107 && eventData[4] == 55) {
								pad.buttons[YELLOW] = true;		// 1sus
								pad.buttons[ORANGE] = true;							
								chordSelected = true;
							}
							else

							if (eventData[3] == 106 && eventData[4] == 54) {
								pad.buttons[YELLOW] = true;		// 1/3
								pad.buttons[BLUE] = true;							
								chordSelected = true;
							}
							else						
								
							if (eventData[3] == 129 && eventData[4] == 221) {
								pad.buttons[ORANGE] = true;		// 4								
								chordSelected = true;
							}
							else
								
							if (eventData[3] == 139 && eventData[4] == 215) {
								pad.buttons[ORANGE] = true;		// 3b
								pad.buttons[BLUE] = true;		
								pad.buttons[RED] = true;							
								chordSelected = true;
							}
							else

							if (eventData[3] == 138 && eventData[4] == 214) {
								pad.buttons[ORANGE] = true;		// 4/6
								pad.buttons[BLUE] = true;							
								chordSelected = true;
							}
							else						
								
							if (eventData[3] == 164 && eventData[4] == 248) {
								pad.buttons[BLUE] = true;		// 2m
								chordSelected = true;
							}
							else
								
							if (eventData[3] == 161 && eventData[4] == 253) {
								pad.buttons[BLUE] = true;		// 2
								pad.buttons[RED] = true;							
								chordSelected = true;
							}
							else
								
							if (eventData[3] == 165 && eventData[4] == 249) {
								pad.buttons[ORANGE] = true;		// 4m
								pad.buttons[RED] = true;							
								chordSelected = true;
							}	
							else
								
							if (eventData[3] == 177 && eventData[4] == 237) {
								pad.buttons[GREEN] = true;		// 3m
								pad.buttons[BLUE] = true;								
								chordSelected = true;
							}
							else
								
							if (eventData[3] == 196 && eventData[4] == 152) {
								pad.buttons[GREEN] = true;		// 3
								pad.buttons[YELLOW] = true;								
								pad.buttons[BLUE] = true;								
								chordSelected = true;
							}						
							else
								
							if (eventData[3] == 201 && eventData[4] == 149) {
								pad.buttons[GREEN] = true;		// 5m
								pad.buttons[ORANGE] = true;															
								chordSelected = true;
							} 		
						}
				
						if (chordSelected) { 
							pad.axis[STRUM] = isStrumUp ? STRUM_UP : STRUM_DOWN;			
							isStrumUp = !isStrumUp;							
						}

						if (pad.buttons[LOGO]) {
							toggleStartStop();
						} else {
							updateCanvas();	

							if (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN || pad.buttons[START] || pad.buttons[STARPOWER]) {			
								doChord();				
							}	
						}												
					});					
				}
			}
		}
	}						
}

async function setLavaGenieSettings() {
	// bluetooth.addr==dd:22:33:44:67:fc
	// bluetooth.addr==dd:22:33:44:67:fc && btatt.opcode.method==0x12
	
	/*
	// Startup 
	writeGenie([0xac, 0x2, 0xe6, 0x1, 0xe7]);
	writeGenie([0xac, 0x2, 0x4e, 0x52, 0x1c]);
	writeGenie([0xac, 0x2, 0x4e, 0x4a, 0x4]);
	writeGenie([0xac, 0x2, 0x4e, 0x57, 0x19]);
	writeGenie([0xac, 0x2, 0x4e, 0x59, 0x17]);
	writeGenie([0xac, 0x2, 0x4e, 0x5a, 0x14]);
	writeGenie([0xac, 0x2, 0x44, 0x0, 0x44]);
	writeGenie([0xac, 0x2, 0x44, 0x1, 0x45]);
	writeGenie([0xac, 0x2, 0x44, 0x2, 0x46]);
	writeGenie([0xac, 0x2, 0x44, 0x3, 0x47]);
	writeGenie([0xac, 0x2, 0x44, 0x4, 0x40]);
	writeGenie([0xac, 0x2, 0x44, 0x5, 0x41]);
	writeGenie([0xac, 0x1, 0x46, 0x46]);
	writeGenie([0xac, 0x2, 0x4e, 0x63, 0x2d]);
	writeGenie([0xac, 0x2, 0x4e, 0x4c, 0x2]);
	writeGenie([0xac, 0x2, 0x4e, 0x49, 0x7]);
	writeGenie([0xac, 0x2, 0x4e, 0x4f, 0x1]);
	writeGenie([0xac, 0x1, 0xe2, 0xe2]);
	writeGenie([0xac, 0x2, 0x4e, 0xe8, 0xa6]);
	writeGenie([0xac, 0x2, 0x4e, 0x65, 0x2b]);
	writeGenie([0xac, 0x2, 0x4e, 0x6a, 0x24]);
	writeGenie([0xac, 0x2, 0x4e, 0xe9, 0xa7]);
	writeGenie([0xac, 0x4, 0xee, 0x0, 0x0, 0x0, 0xee]);
	writeGenie([0xad, 0x4, 0xee, 0x0, 0x0, 0x0, 0xee]);

	// song mode
	writeGenie([0xac, 0x2, 0xe6, 0x0, 0xe6]);
	writeGenie([0xad, 0x1a, 0x70, 0x7, 0x1, 0xfb, 0x1, 0xf0, 0x1, 0xef, 0x1, 0xee, 0x1, 0xea, 0x1, 0xe9, 0x1, 0xe8, 0x1, 0xe7, 0x1, 0xe4, 0x1, 0xe3, 0x1, 0xe2, 0x1, 0xe1, 0x75]);
	writeGenie([0xac, 0x2, 0x65, 0x0, 0x65]);
	writeGenie([0xad, 0x4, 0x70, 0x7, 0x1, 0xdc, 0xaa]);
	*/

	// enable key press events
	writeGenie([0xac, 0x2, 0x5d, 0x1, 0x5c]);

	// mapping
	//writeGenie([0xac, 0x2d, 0x67, 0x16, 0x4c, 0x11, 0x34, 0x54, 0x61, 0x81, 0xa4, 0xc7, 0x19, 0x39, 0x59, 0x69, 0x8b, 0xa9, 0xb1, 0x14, 0x31, 0x51, 0x64, 0x84, 0xa1, 0xc4, 0x8, 0x63, 0x11, 0x34, 0x54, 0x61, 0x81, 0xa4, 0xc7, 0x2, 0x49, 0x0, 0x2, 0x4a, 0x0, 0x2, 0x52, 0x4a, 0x2, 0x57, 0x1, 0x69]);

	// key 1 LED 
	//writeGenie([0xac, 0x6, 0x5c, 0x11, 0x1, 0x0, 0x0, 0x2, 0x4e]);
}

function writeGenie(bytes) {
	setTimeout(async () => {
		let dataView = new Uint8Array(bytes);	
		resp = await writeCharacteristic.writeValue(dataView);
		console.debug("writeGenie", bytes, resp);		
	}, lavaGenieWaitout);
	
	lavaGenieWaitout = lavaGenieWaitout + 300;
}

async function setLiberLiveChordMappings() {
	const hdr = packString("b11e");
	console.debug("setLiberLiveChordMappings", hdr, writeCharacteristic);	
	
	const keys = [
		{level: 10, type: 5},	// Bbadd9	
		{level: 9, type: 3},	// Am7	
		{level: 7, type: 5},	// Gadd9	(G/B)	
		{level: 0, type: 5},	// Cadd9	(C/E)
		{level: 5, type: 5},	// Fadd9	(F/A)
		{level: 5, type: 1},	// Fm	
		{level: 7, type: 1},	// Gm		
		
		{level: 10, type: 0},	// Bb				
		{level: 9, type: 1},	// Am
		{level: 7, type: 0},	// G
		{level: 0, type: 0},	// C		
		{level: 5, type: 0},	// F			
		{level: 2, type: 1},	// Dm
		{level: 4, type: 1},	// Em	
		
		{level: 8, type: 0},	// Ab
		{level: 9, type: 0},	// A	
		{level: 7, type: 0},	// G (sus)
		{level: 0, type: 0},	// C (sus)		
		{level: 3, type: 0},	// Eb
		{level: 2, type: 0},	// D			
		{level: 4, type: 0},	// E		
	];
	
	const dataView = new Uint8Array(new ArrayBuffer(26));
	
	dataView[0]  = hdr[0];
	dataView[1]  = hdr[1];	
	dataView[2]  = 31;
	dataView[3]  = 21;
	dataView[4]  = 0;	

	let i = 0;
	
	for (let key of keys) {
		dataView[5+i] = packString(parseChar(key.level) + parseChar(key.type));
		i++;
	}
	
	const resp = await writeCharacteristic.writeValue(dataView);
	console.debug("setLiberLiveChordMappings", resp);	
}

async function setLiberLiveDeviceSettings() {
	const hdr = packString("b11e");	
	console.debug("setLiberLiveDeviceSettings", hdr, writeCharacteristic);	
	const dataView = new Uint8Array(new ArrayBuffer(17));

	let key = 0;
	if (keyChange == 2) key = 1;
	if (keyChange == 4) key = 2;
	if (keyChange == 5) key = 3;
	if (keyChange == 7) key = 4;
	if (keyChange == 9) key = 5;
	if (keyChange == 11) key = 6;
	
	dataView[0]  = hdr[0];
	dataView[1]  = hdr[1];	
	dataView[2]  = 35;
	dataView[3]  = 12;
	dataView[4]  = 0;
	dataView[5]  = 255;			// Song key. Don't change. Let liberlive control and decide
	dataView[6]  = tempo;
	dataView[7]  = 0;
	dataView[8]  = liberLive.drums1.split("/")[0];
	dataView[9]  = liberLive.drums1.split("/")[1];
	dataView[10] = liberLive.drums2.split("/")[0];
	dataView[11] = liberLive.drums2.split("/")[1];
	dataView[12] = liberLive.chord1.split("/")[1];
	dataView[13] = liberLive.chord1.split("/")[0];
	dataView[14] = liberLive.chord2.split("/")[1];
	dataView[15] = liberLive.chord2.split("/")[0];	
	dataView[17] = 0;	
	
	const resp = await writeCharacteristic.writeValue(dataView);
	console.debug("setLiberLiveDeviceSettings", resp);
}

function parseChar(integer) {
	return integer <= 9 ? "" + integer : integer == 10 ? "A" : integer == 11 ? "B" : integer == 12 ? "C" : integer == 13 ? "D" : integer == 14 ? "E" : integer == 15 ? "F" : "0";
}

function packString(str) {
	if (str == null || str == "") {
		return null;
	}
	
	if (str.length == 1) {
		str = "0" + str;
	}
	
	const upperCase = str.toUpperCase();
	const length = upperCase.length / 2;
	const charArray = Array.from(upperCase);
	const bArr = new Uint8Array(new ArrayBuffer(length))
	
	for (let i9 = 0; i9 < length; i9++) {
		const i10 = i9 * 2;
		bArr[i9] = (("0123456789ABCDEF".indexOf(charArray[i10 + 1])) | (("0123456789ABCDEF".indexOf(charArray[i10])) << 4));
	}
	return bArr;
}

async function fetchStreams() {
	console.debug("fetchStreams", _converse);

	const streamSong = document.querySelector("#stream_song");	
	const activeStreams = document.querySelector("#activeStreams");	
	activeStreams.options[0] = new Option("**UNUSED**", "activeStreams", false, false);		

	activeStreams.addEventListener("click", async () => {
		console.debug("fetchStreams refresh streams");
		
		const res = await _converse.api.sendIQ($iq({type: 'get', to: _converse.api.domain}).c('whep', {xmlns: 'urn:xmpp:whep:0'}));
		console.debug('fetchStreams response', res);						
		const items = res.querySelectorAll('item');
		const temp = activeStreams.selectedIndex;
		activeStreams.innerHTML = "";
		activeStreams.options[0] = new Option("**UNUSED**", "activeStreams", false, false);					
		let count = 1;
		
		for (item of items) {		
			const id = item.getAttribute("id");
			activeStreams.options[count++] = new Option(id, id, false, false);	
		}
		
		activeStreams.selectedIndex = temp;
	});
	
	activeStreams.addEventListener("change", async function() {
		console.debug("fetchStreams selected stream", activeStreams.value);
		
		if ("activeStreams" == activeStreams.value) {
			if (watchConnection) {			
				watchConnection.close();
				watchConnection = null;
				
				const streamStarted = streamSong.innerText == "Stop Stream";
				streamSong.style.setProperty("--accent-fill-rest", streamStarted ? "red" : "green");					
			}
			
		} else {
			watchConnection = new RTCPeerConnection()
			watchConnection.addTransceiver('audio', { direction: 'recvonly' })

			watchConnection.ontrack = function (event) {
				document.getElementById('audioPlayer').srcObject = event.streams[0]
			}

			watchConnection.oniceconnectionstatechange = () => {
				console.debug("fetchStreams status", watchConnection.iceConnectionState);
				streamSong.style.setProperty("--accent-fill-rest", "purple");			
			}

			watchConnection.createOffer().then(async (offer) => {
				watchConnection.setLocalDescription(offer);
				console.debug('fetchStreams offer', offer.sdp);					
				
				const res = await _converse.api.sendIQ($iq({type: 'set', to: _converse.api.domain}).c('whep', {id: activeStreams.value, xmlns: 'urn:xmpp:whep:0'}).c('sdp', offer.sdp)); 
				console.debug('fetchStreams whep set response', res);						
				const answer = res.querySelector('sdp').innerHTML;
				watchConnection.setRemoteDescription({sdp: answer,  type: 'answer'});	
				console.debug('fetchStreams whep answer', answer);						
			})		
		}
	});	
	
	const res = await _converse.api.sendIQ($iq({type: 'get', to: _converse.api.domain}).c('whep', {xmlns: 'urn:xmpp:whep:0'})); 
	console.debug('fetchStreams response', res);						
	const items = res.querySelectorAll('item');
	let count = 1;
	
	for (item of items) {		
		const id = item.getAttribute("id");
		activeStreams.options[count++] = new Option(id, id, false, false);	
	}
}

async function handleMediaStream(started) {
	console.debug("handleMediaStream", started);
		
	if (!started) {
		const gain = audioContext.createGain();	
		streamDestination = audioContext.createMediaStreamDestination();	
		gain.connect(streamDestination);	
		
		if (window.pedalOutput) pedalOutput.connect(streamDestination);	

		let mediaOptions = {audio: true, video: false}
		
		publishConnection = new RTCPeerConnection();

		publishConnection.oniceconnectionstatechange = () => {
			console.debug("handleMediaStream - status", publishConnection.iceConnectionState);
		}
		
		streamDestination.stream.getTracks().forEach(t => {
			if (t.kind === 'audio') {
				console.debug('handleMediaStream track', t.kind, t.id, t);				
				publishConnection.addTransceiver(t, {direction: 'sendonly'})
			}
		})		
		
		const offer = await publishConnection.createOffer();
		publishConnection.setLocalDescription(offer);
		console.debug('handleMediaStream offer', offer.sdp);	
		
		const res = await _converse.api.sendIQ($iq({type: 'set', to: _converse.api.domain}).c('whip', {xmlns: 'urn:xmpp:whip:0'}).c('sdp', offer.sdp));
		const answer = res.querySelector('sdp').innerHTML;
		publishConnection.setRemoteDescription({sdp: answer,  type: 'answer'});	
		console.debug('handleMediaStream answer', answer);			
		
	} else {
		if (publishConnection) {			
			publishConnection.close();
			publishConnection = null;
		}
	}		
}

function startXMPP() {
	const streamSong = document.querySelector("#stream_song");	
	const activeStreams = document.querySelector("#active_streams");
	const toggleChat = document.querySelector("#toggle_chat");
	const chatview = document.querySelector("#chatview");		
	
	streamSong.addEventListener("click", async (evt) => {
		const streamStarted = streamSong.innerText == "Stop Stream";
		console.debug("Stream clicked", streamStarted);
		streamSong.innerText = streamStarted ? "Start Stream" : "Stop Stream";		
		await handleMediaStream(streamStarted);
		streamSong.style.setProperty("--accent-fill-rest", !streamStarted ? "red" : "green");			
	});		
	
	let ws = location.protocol.replace("http", "ws") + "//" + location.host;	
	let http = location.origin;		
    let domain = location.hostname;
	
	if (location.hostname == "oeplgfliognafobghehfffbppakffdkc") {
		ws = "ws://localhost:7070";
		http = "http://localhost:7070";			
		domain = "localhost";
	}
	
	converse.plugins.add("orinayo", {
		dependencies: [],

		initialize: function () {
			_converse = this._converse;
			const __ = _converse.__;
			const html = converse.env.html;
			const Strophe = converse.env.Strophe;

			_converse.api.listen.on('getToolbarButtons', function(toolbar_el, buttons)	{
				let color = "fill:var(--chat-toolbar-btn-color);";
				if (toolbar_el.model.get("type") === "chatroom") color = "fill:var(--muc-toolbar-btn-color);";
				
				buttons.push(html`
					<button class="toolbar-utilities-refresh" title="${__('Return to group chat')}" @click=${hideChat}/>
						<converse-icon style="width:18px; height:18px; ${color}" class="fa fa-minus" size="1em"></converse-icon>
					</button>
				`);	
							
				buttons.push(html`
					<button class="toolbar-utilities-scroll" title="${__('Scroll to the bottom')}" @click=${scrollToBottom}/>
						<converse-icon style="width:18px; height:18px; ${color}" class="fa fa-angle-double-down" size="1em"></converse-icon>
					</button>
				`);

				buttons.push(html`
					<button class="toolbar-utilities-thrash" title="${__('Trash chat history')}" @click=${trashHistory}/>
						<converse-icon style="width:18px; height:18px; ${color}" class="far fa-trash-alt" size="1em"></converse-icon>
					</button>
				`);

				buttons.push(html`
					<button class="toolbar-utilities-refresh" title="${__('Refresh chat history')}" @click=${refreshHistory}/>
						<converse-icon style="width:18px; height:18px; ${color}" class="fa fa-sync" size="1em"></converse-icon>
					</button>
				`);			

				return buttons;
			});	

			_converse.api.listen.on('connected', function() {	
				streamSong.style.display = "";
				activeStreams.style.display = "";
				toggleChat.style.display = "";
				streamSong.style.setProperty("--accent-fill-rest", "green");
				setTimeout(fetchStreams);	
			});
			
		}
	});			
		
	converse.initialize({
		discover_connection_methods: false,
		assets_path: "./dist/",	
		sounds_path: "./dist/sounds/",	
		allow_logout: false, 
		allow_muc_invitations: false,                                          
		allow_contact_requests: false, 
		authentication: 'anonymous',
		auto_reconnect: true,			
		auto_login: true,
		auto_join_rooms: [
			'lobby@conference.' + domain,
		],
		notify_all_room_messages: [
			'lobby@conference.' + domain,
		],
		websocket_url: ws + '/ws/', 
		jid: domain,
		keepalive: true,
		hide_muc_server: true, 
		play_sounds: false,
		show_controlbox_by_default: false,			
		strict_plugin_dependencies: false,	
		singleton: true,
		view_mode: 'embedded',	
		theme: 'dracula',
		muc_show_logs_before_join: true,	
		whitelisted_plugins: ['orinayo']					
	});
}

async function doLiberLiveSetup(device) {
	console.debug('doLiberLiveSetup', device);

	if (device) {	
		const ui = document.getElementById("lyrics");

		device.addEventListener('gattserverdisconnected', (event) => {
			console.debug('Bluetooth device ' + device.name + ' is disconnected.', event);
			if (_converse.api.connection) _converse.api.disconnect();
		});
		
		const server = await device.gatt.connect();
		console.debug('GATT server', server);

		const services = await server.getPrimaryServices();
		
		for (let service of services) {
			const characteristics = await service.getCharacteristics();
			
			for (let characteristic of characteristics) 
			{
				try {				
					const descriptors = await characteristic.getDescriptors();
				
					for (let descriptor of descriptors) {
						const value = await descriptor.readValue();
						console.debug('Found Characteristic', service.uuid, characteristic.uuid, characteristic.properties.notify, descriptor.uuid, value);				
					}
				} catch (e) {

				}

				console.debug('Found Characteristic', service.uuid, characteristic.uuid, characteristic.properties.notify);										
				
				if (characteristic.properties.write) {
					writeCharacteristic = characteristic;	
					setTimeout(setLiberLiveChordMappings);
					setTimeout(setLiberLiveDeviceSettings, 1000);
				}
				else
					
				if (characteristic.properties.notify) {
					const handler = await characteristic.startNotifications();
					let cannotFire = true;
					let haveFired = false;
					let tempoDiv = document.getElementById('showTempo');
					let volDiv = document.getElementById('showVol');					
					
					if (!game) {
						setup();
						resetGuitarHero();
					}	

					document.getElementById("liberlive").style.display = "";					
					
					handler.addEventListener('characteristicvaluechanged', (evt) => {
						const {buffer}  = evt.target.value;
						const eventData = new Uint8Array(buffer);					
						
						if (eventData.length != 14 || (eventData.length == 14 && eventData[9] != 49 && eventData[9] != 50 && eventData[10] != 49 && eventData[10] != 50)) {
							//for (let i in eventData) console.debug("Event", eventData.length, i + ":" + eventData[i]);						
						}
						
						if (eventData[7]) {
							tempo = eventData[7];
							volDiv.innerHTML = "Vol: " + Math.trunc(guitarVolume * 100); 
							tempoDiv.innerHTML = tempo;								
						}
						
						/*let html = "<table><tr>";
						
						for (let i in eventData) {
							html += "<td>&nbsp;" + i + "&nbsp;</td>";
						}
						
						html += "</tr><tr>";
						
						for (let byt of eventData) {
							html += "<td>&nbsp;" + byt + "&nbsp;</td>";
						}						
						
						html += "</tr></table>"
						ui.innerHTML = html;*/				
						
						const oldKey = keyChange;
						
						if (eventData[1] == 0) keyChange = 0;	// C
						if (eventData[1] == 1) keyChange = 2;	// D
						if (eventData[1] == 2) keyChange = 4;	// E
						if (eventData[1] == 3) keyChange = 5;	// F
						if (eventData[1] == 4) keyChange = 7;	// G
						if (eventData[1] == 5) keyChange = 9;	// A
						if (eventData[1] == 6) keyChange = 11;	// B
						
						if (oldKey != keyChange) dokeyChange();
						
						let chordSelected = false;
						let paddleMoved = false;
						resetGuitarHero();							
						
						cannotFire = eventData[5] == 0; // paddle in neutral
						
						if (haveFired && cannotFire) {
							haveFired = false;
							resetGuitarHero();	
							stopPads();
						}
						
						if (eventData[4] == 2) {
							pad.buttons[YELLOW] = true;		// 7b			
							pad.buttons[RED] = true;								
							chordSelected = true;
						}
						else
							
						if (eventData[2] == 8) {
							pad.buttons[YELLOW] = true;		// 5b			
							pad.buttons[GREEN] = true;								
							pad.buttons[RED] = true;							
							chordSelected = true;
						}
						else

						if (eventData[3] == 4) {
							pad.buttons[YELLOW] = true;		// 7b			
							pad.buttons[RED] = true;								
							chordSelected = true;
						}
						else
							
						if (eventData[4] == 4) {
							pad.buttons[RED] = true;		// 6m
							chordSelected = true;
						}
						else
							
						if (eventData[2] == 16 || eventData[3] == 8) {
							pad.buttons[RED] = true;		// 6
							pad.buttons[YELLOW] = true;
							pad.buttons[BLUE] = true;							
							chordSelected = true;
						}
						else
							
						if (eventData[4] == 8) {
							pad.buttons[GREEN] = true;		// 5								
							chordSelected = true;
						}
						else
							
						if (eventData[2] == 32) {
							pad.buttons[GREEN] = true;		// 5sus							
							pad.buttons[YELLOW] = true;						
							chordSelected = true;
						}
						else
							
						if (eventData[3] == 16) {
							pad.buttons[GREEN] = true;		// 5/7
							pad.buttons[RED] = true;							
							chordSelected = true;
						}													
						else
							
						if (eventData[4] == 16) {
							pad.buttons[YELLOW] = true;		// 1
							chordSelected = true;
						}
						else
							
						if (eventData[2] == 64) {
							pad.buttons[YELLOW] = true;		// 1sus
							pad.buttons[ORANGE] = true;							
							chordSelected = true;
						}
						else

						if (eventData[3] == 32) {
							pad.buttons[YELLOW] = true;		// 1/3
							pad.buttons[BLUE] = true;							
							chordSelected = true;
						}
						else						
							
						if (eventData[4] == 32) {
							pad.buttons[ORANGE] = true;		// 4								
							chordSelected = true;
						}
						else
							
						if (eventData[2] == 128) {
							pad.buttons[ORANGE] = true;		// 3b
							pad.buttons[BLUE] = true;		
							pad.buttons[RED] = true;							
							chordSelected = true;
						}
						else

						if (eventData[3] == 64) {
							pad.buttons[ORANGE] = true;		// 4/6
							pad.buttons[BLUE] = true;							
							chordSelected = true;
						}
						else						
							
						if (eventData[4] == 64) {
							pad.buttons[BLUE] = true;		// 2m
							chordSelected = true;
						}
						else
							
						if (eventData[3] == 1) {
							pad.buttons[BLUE] = true;		// 2
							pad.buttons[RED] = true;							
							chordSelected = true;
						}
						else
							
						if (eventData[3] == 128) {
							pad.buttons[ORANGE] = true;		// 4m
							pad.buttons[RED] = true;							
							chordSelected = true;
						}	
						else
							
						if (eventData[4] == 128) {
							pad.buttons[GREEN] = true;		// 3m
							pad.buttons[BLUE] = true;								
							chordSelected = true;
						}
						else
							
						if (eventData[3] == 2) {
							pad.buttons[GREEN] = true;		// 3
							pad.buttons[YELLOW] = true;								
							pad.buttons[BLUE] = true;								
							chordSelected = true;
						}						
						else
							
						if (eventData[4] == 1) {
							pad.buttons[GREEN] = true;		// 5m
							pad.buttons[ORANGE] = true;															
							chordSelected = true;
						}						
							
							
						if (eventData[5] == 15) {			// Paddle A+B
							paddleMoved = true;	

							if (eventData[10] < 48) { // UP
								pad.buttons[LOGO] = true;
							}
							else
								
							if (eventData[10] > 58) { // DOWN
								pad.buttons[LOGO] = true;
							}							

						}	
						else							
						
						if (eventData[5] == 12) {			// Paddle A
							paddleMoved = true;	
							
							if (eventData[9] < 48) { // UP
								appliedVelocity = (50 - eventData[9]) / 50;

								if (chordSelected) {
									pad.axis[STRUM] = STRUM_UP; 
								} else {
									pad.buttons[START] = true;	// prev style
									pad.buttons[RED] = false;
									pad.buttons[YELLOW] = false;
									pad.buttons[GREEN] = false;
									pad.buttons[ORANGE] = false;
									pad.buttons[BLUE] = false;									
								}								

							}
							else
								
							if (eventData[9] > 58) { // DOWN
								appliedVelocity = eventData[9] / 50;
								
								if (chordSelected) {
									pad.axis[STRUM] = STRUM_DOWN; 
								} else {
									pad.buttons[STARPOWER] = true;	// next style
									pad.buttons[RED] = false;
									pad.buttons[YELLOW] = false;
									pad.buttons[GREEN] = false;
									pad.buttons[ORANGE] = false;
									pad.buttons[BLUE] = false;									
								}								
							}
								
						}
						else
							
						if (eventData[5] == 3) {			// Paddle B
							paddleMoved = true;	

							if (eventData[10] < 48) { // UP
								appliedVelocity = (50 - eventData[10]) / 50;							
							
								if (chordSelected) {
									pad.axis[STRUM] = STRUM_UP;
								} else {
									pad.axis[STRUM] = STRUM_UP;	// break
									pad.axis[TOUCH] = -0.7;		
									pad.buttons[RED] = false;
									pad.buttons[YELLOW] = false;
									pad.buttons[GREEN] = false;
									pad.buttons[ORANGE] = false;
									pad.buttons[BLUE] = false;																										
								}								
							}
							else
								
							if (eventData[10] > 58) { // DOWN
								appliedVelocity = eventData[9] / 50;

								if (chordSelected) {
									pad.axis[STRUM] = STRUM_DOWN;

								} else {
									pad.axis[STRUM] = STRUM_DOWN;	// fill
									pad.axis[TOUCH] = -0.7;		
									pad.buttons[RED] = false;
									pad.buttons[YELLOW] = false;
									pad.buttons[GREEN] = false;
									pad.buttons[ORANGE] = false;
									pad.buttons[BLUE] = false;																										
								}								
							}							

						}
						else
	
						if (eventData[5] == 64 && !styleStarted) {			// change pads mode only when not paying, otherwise prev variation will trigger
							paddleMoved = true;	
							
							pad.buttons[START] = true;		// set PadsMode/strum style	
							pad.buttons[RED] = false;
							pad.buttons[YELLOW] = false;
							pad.buttons[GREEN] = false;
							pad.buttons[ORANGE] = false;
							pad.buttons[BLUE] = false;	
							
							if (eventData[4] == 2) padsMode = 1;	// full chord up/down
							if (eventData[4] == 4) padsMode = 2;	// chord up/root note down	
							if (eventData[4] == 8) padsMode = 3;	// root note up/down
							if (eventData[4] == 16) padsMode = 4;	// 3rd note up/root note down
							if (eventData[4] == 32) padsMode = 5;	// 5th note up/root note down							
							if (eventData[4] == 64) padsMode = 0;	// reset
							if (eventData[4] == 128) padsMode = 0;	// reset							
						}
						else
	
						if (eventData[1] >= 16 && !styleStarted) {			// Tempo Pad
							if (eventData[4] == 2) recallRegistration(1);	
							if (eventData[4] == 4) recallRegistration(2);		
							if (eventData[4] == 8) recallRegistration(3);	
							if (eventData[4] == 16) recallRegistration(4);	
							if (eventData[4] == 32) recallRegistration(5);								
							if (eventData[4] == 64) recallRegistration(6);	
							if (eventData[4] == 128) recallRegistration(7);	
						}						
							
						if (paddleMoved && !haveFired) {						
							haveFired = true;
							cannotFire = true;
							
							if (pad.buttons[LOGO]) {
								setTimeout(toggleStartStop);
							} else {
								updateCanvas();	

								if (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN || pad.buttons[START] || pad.buttons[STARPOWER]) {			
									doChord();				
								}	
							}								
						}
					});	
				}
			}
		}
	}
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
		document.querySelector("#chorda_bluetooth").innerHTML = "BT ON";
	})
	.catch(error => { 
		console.error('ERRORCODE: ' + error); 
		document.querySelector("#chorda_bluetooth").innerHTML = "BT Error";		
	});	
}

function onChordaDisconnected(event) {
	document.querySelector("#chorda_bluetooth").innerHTML = "BT OFF";	
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

function initLiberLive() {
	console.debug("initLiberLive");
	
	if (inputDeviceType == "liberlivec1" && !textDecoder) {	
		onLiberLiveClick();			
	}	
}

function initLavaGenie() {
	console.debug("initLavaGenie");
	
	if (inputDeviceType == "lavagenie" && !textDecoder) {	
		onLavaGenieClick();			
	}	
}

async function onloadHandler() {
	console.debug("onloadHandler");
	
	let version = "latest";
	if (!!chrome.runtime?.getManifest) version = chrome.runtime.getManifest().version;
	document.title = "Orin Ayo | " + version;
  
	playButton = document.querySelector("#play");
	gamePadModeButton = document.querySelector("#gamepad_mode");
	styleType = document.querySelector("#style_type");
	tempoCanvas = orinayo = document.querySelector('#tempoCanvas');	
	orinayo = document.querySelector('#orinayo');
	orinayo_section = document.querySelector('#orinayo-section');
	orinayo_strum = document.querySelector('#orinayo-strum');
	orinayo_pad = document.querySelector('#orinayo-pad');
	orinayo_reg = document.querySelector('#orinayo-reg');	
	guitarReverb = document.querySelector("#reverb");
	
	document.body.addEventListener('click', function(event) 	{
		// TODO
		if (inputDeviceType == "liberlivec1") initLiberLive();
		if (inputDeviceType == "lavagenie") initLavaGenie();		
	})
	
	
	guitarReverb.addEventListener('click', function(event) 
	{
		if (guitarReverb?.checked) {		

		} else {
			
		}
	});	

	microphone = document.querySelector("#microphone");
	
	microphone.addEventListener('click', function(event) {
		if (microphone?.checked) setupMicrophone();
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

	const deleteStyle = document.querySelector("#delete_style");
	
	deleteStyle.addEventListener('click', function(event) {
		if (arrSequence?.name) {
			indexedDB.deleteDatabase(arrSequence.name);
			setTimeout(() => {
				location.reload();	
			}, 1000)				
		}
	});		
	
	lyricsCanvas = document.querySelector("#lyrics");
	const board = document.querySelector(".pedalboard");
	const chordpro = document.querySelector("#chordpro");
	const chatview = document.querySelector("#chatview");	
	const settings = document.querySelector("#settings");
	const gameCanvas = document.querySelector("#gameCanvas");
	const toggleChat = document.querySelector("#toggle_chat");
	
	toggleChat.addEventListener('click', function(event) {	
		chatview.style.display = "none";	
		board.style.display = "none";
		chordpro.style.display = "none";	
		lyricsCanvas.style.display = "none";		
			
		if (settings.style.display == "none") {
			settings.style.display = "";
			//gameCanvas.style.display = "";
			chatview.style.display = "none";
	
			
		} else {
			chatview.style.display = "";
			settings.style.display = "none";	
			//gameCanvas.style.display = "none";			
		}
	});
	
	const pedalBoard = document.querySelector("#pedal_board");
	
	pedalBoard.addEventListener('click', function(event) {	
		chatview.style.display = "none";		
		board.style.display = "none";
		chordpro.style.display = "none";	
		lyricsCanvas.style.display = "none";		
			
		if (settings.style.display == "none") {
			settings.style.display = "";
			board.style.display = "none";
	
			
		} else if (guitarReverb?.checked) {
			board.style.display = "";
			settings.style.display = "none";			
		}
	});	
	
	const chordPro = document.querySelector("#chord_pro");
	
	chordPro.addEventListener('click', function(event) {
		chatview.style.display = "none";			
		board.style.display = "none";
		chordpro.style.display = "none";	
		lyricsCanvas.style.display = "none";		
		
		if (settings.style.display == "none") {
			settings.style.display = "";
			chordpro.style.display = "none";		
			
		} else {
			chordpro.style.display = "";
			settings.style.display = "none";			
		}
	});	
	
	const showLyrics = document.querySelector("#show_lyrics");
	const lyricsContext = lyricsCanvas.getContext('2d');
	lyricsContext.fillStyle = "#000000";	
    lyricsContext.fillRect(0, 0, lyricsCanvas.width, lyricsCanvas.height);	
	
	showLyrics.addEventListener('click', function(event) {
		if (songSequence == null) return;

		chatview.style.display = "none";		
		board.style.display = "none";
		chordpro.style.display = "none";	
		lyricsCanvas.style.display = "none";	
		
		if (settings.style.display == "none") {
			settings.style.display = "";
			lyricsCanvas.style.display = "none";	
			
		} else {
			lyricsCanvas.style.display = "";
			settings.style.display = "none";			
		}
	});		
	
	
	const chordaBluetooth = document.querySelector("#chorda_bluetooth");
	
	chordaBluetooth.addEventListener('click', function(event) {
		onChordaConnect(event);
	});		

	const saveReg = document.querySelector("#save_reg")
		
	saveReg.addEventListener('click', function(event) {
		const slot = prompt("Enter save slot number");
		
		if (slot && slot != "") {
			saveRegistration(slot);
		}
	});
	
	resetApp = document.querySelector("#reset_app")
		
	resetApp.addEventListener('click', function(event) {
		registration = 0;
		location.reload();
	});	
	
	loadFile = document.querySelector("#load_file")
		
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
		if (arranger == "webaudio" && realInstrument) {
			
			if (drumLoop || chordLoop || bassLoop) {
				toggleStartStop();
			} else {
				setupRealInstruments();	
			}
		} else {
			toggleStartStop();					
		}
	});	

	const showVol = document.querySelector("#showVol");
	showVol.innerHTML = "Vol: " + Math.trunc(guitarVolume * 100);
	
	document.querySelector("#volume").addEventListener("input", function(event) {
		guitarVolume = +event.target.value / 100; 
		savedGuitarVolume = guitarVolume;
		showVol.innerHTML = "Vol: " + Math.trunc(guitarVolume * 100);
	});
	
	document.querySelector("#tempo").addEventListener("input", function(event) {
		const tmpo = +event.target.value; 
		setTempo(tmpo);
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

	document.querySelector("#stream_deck").addEventListener('click', async (event) => {	
		const devices = await navigator.hid.requestDevice({ filters: [{vendorId: 4057}] });	
		
		if (devices.length > 0) {
			navigator.hid.getDevices().then((browserDevices) => {
				browserDevices.map(async (dev) => {
					console.debug("found stream device", dev, streamDeck);
					
					if (dev.vendorId == 4057 && streamDeck) {
						await dev.forget();
						streamDeck = null;
					}					
				});
			});				
		}
	});
	
	getStreamDeck();
	letsGo();
}

async function getStreamDeck() {
	const devices = await (0, window.StreamDeckUI.getStreamDecks)();
	
	for (device of devices) 
	{
		if (device) {
			streamDeck = device;
			openStreamDeckDevice().catch(console.error);
			break;
		}
	}	
}

function closeDevice() {
	if (streamDeck) {
		if (interval) window.clearInterval(interval)
		console.debug('Closing streamDeck');
		try {streamDeck.close()} catch (e) {};
		streamDeck = null;
	}	
}

function handleEncoderRotate(encoder, amount, absolute) {
	if (encoder == 0) {		
		guitarVolume =  adjustVol(absolute, "#volume", amount, 100, 1) / 100;	
		savedGuitarVolume = guitarVolume;
	}
	else
			
	if (encoder == 1) {		
		drumVol =  adjustVol(absolute, "#audio-vol-16", amount, 100, 0.0001);
		if (drumLoop) drumLoop.setVolume(drumVol / 100);				
	}
	else

	if (encoder == 2) {		
		bassVol =  adjustVol(absolute, "#audio-vol-17", amount, 100, 0.0001);			
		if (bassLoop) bassLoop.setVolume(bassVol / 100);	
	}
	else

	if (encoder == 3) {		
		chordVol =  adjustVol(absolute, "#audio-vol-18", amount, 100, 0.0001);				
		if (chordLoop) chordLoop.setVolume(chordVol / 100);				
	}	
}

function adjustVol(absolute, selector, amount, max, min) {
	const vol = document.querySelector(selector);
	
	if (absolute) {
		vol.value = amount;
	} else {
		const oldVol = parseInt(vol.value);
		vol.value = oldVol +  amount;
	}
	if (vol.value < min) vol.value = min;
	if (vol.value > max) vol.value = max;		
	return vol.value;
}

async function openStreamDeckDevice() {
    console.debug(`StreamDeck device opened. Serial: ${await streamDeck.getSerialNumber()} Firmware: ${await streamDeck.getFirmwareVersion()}`);
	
    streamDeck.on('down', (panel) => {
        console.debug(`Key ${panel} down`);
    });
	
    streamDeck.on('up', async (panel) => {
        console.debug(`Key ${panel} up`);	
		
		if (styleStarted) {
			sectionChange = panel % 4;
			
			if (midiNotes.size == 0) {
				changeArrSection(true);
			} else {
				if (panel > 3) doBreak(); else doFill();
			}
			
		} else {
			recallRegistration(panel + streamDeckPointer + 1);	
		}		
		
    });
	
    streamDeck.on('encoderDown', async (encoder) => {
        console.debug(`Encoder ${encoder} down`);				
    });
    streamDeck.on('encoderUp', (encoder) => {
        console.debug(`Encoder ${encoder} up`);
		handleEncoderPress(encoder);				
    });
	
    streamDeck.on('rotateLeft', async (encoder, amount) => {
        console.debug(`Encoder ${encoder} left (${amount})`);
		handleEncoderRotate(encoder, -amount);
    });
	
    streamDeck.on('rotateRight', async (encoder, amount) => {
        console.debug(`Encoder ${encoder} right (${amount})`);
		handleEncoderRotate(encoder, amount);
    });
	
    streamDeck.on('lcdShortPress', (encoder, position) => {
        console.debug(`LCD short press ${encoder} (${position.x},${position.y})`);
		drawButtons(1 + ( streamDeck.NUM_KEYS * encoder));	
    });
	
    streamDeck.on('lcdLongPress', (encoder, position) => {
        console.debug(`LCD long press ${encoder} (${position.x},${position.y})`);
		//handleAction('lcdLongPress', encoder, true);		
    });
	
    streamDeck.on('lcdSwipe', (_fromEncoder, _toEncoder, fromPosition, toPosition) => {
        console.debug(`LCD swipe (${fromPosition.x},${fromPosition.y}) -> (${toPosition.x},${toPosition.y})`);
		sectionChange = 0;
		toggleStartStop();
    });
	
	await streamDeck.clearPanel();	
	drawLogo();	
	drawButtons(1);
}

function clearLcd() {
	const canvas = new OffscreenCanvas(streamDeck.LCD_ENCODER_SIZE.width * 4, streamDeck.LCD_ENCODER_SIZE.height);	
	const background = "#000";
	const context = canvas.getContext('2d', { willReadFrequently: true });
	context.clearRect(0, 0, canvas.width, canvas.height);	
	
	for (let i=0; i<4; i++) {
		const imgData = context.getImageData(i * 200, 0, streamDeck.LCD_ENCODER_SIZE.width, canvas.height);
		streamDeck.fillEncoderLcd(i, Buffer.from(imgData.data), { format: 'rgba' });
	}				
}

function drawLogo() {
	if (streamDeck.PRODUCT_NAME !== 'Streamdeck +') return;
	
	const canvas = new OffscreenCanvas(streamDeck.LCD_ENCODER_SIZE.width * 4, streamDeck.LCD_ENCODER_SIZE.height);	
	const background = "#ffffff";
	const url = "./assets/login_logo.png";
	const context = canvas.getContext('2d', { willReadFrequently: true });
	const img = new Image;

	img.onload = function() {
		context.fillStyle = background;
		context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
				
		for (let i=0; i<4; i++) {
			const imgData = context.getImageData(i * 200, 0, streamDeck.LCD_ENCODER_SIZE.width, canvas.height);
			streamDeck.fillEncoderLcd(i, Buffer.from(imgData.data), { format: 'rgba' });
		}				
	};
	img.src = url;
}

async function drawButtons(c) {
	let slotFound = false;
	const canvas = new OffscreenCanvas(streamDeck.ICON_SIZE, streamDeck.ICON_SIZE); //document.createElement('canvas');	
	const ctx = canvas.getContext('2d', { willReadFrequently: true });

	for (let i = 0; i < streamDeck.NUM_KEYS; i++) {
		const n = c + i;
		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);		
		
		if (localStorage.getItem("orin.ayo.slot." + n)) {
			slotFound = true;
			// Start with a font that's 80% as high as the button. maxWidth
			// is used on the stroke and fill calls below to scale down.
			ctx.font = `${canvas.height * 0.8}px "Arial"`;
			ctx.strokeStyle = 'blue';
			ctx.lineWidth = 1;
			ctx.strokeText(n.toString(), 8, canvas.height * 0.9, canvas.width * 0.8);
			ctx.fillStyle = 'white';
			ctx.fillText(n.toString(), 8, canvas.height * 0.9, canvas.width * 0.8);
		}
		const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
		streamDeck.fillKeyBuffer(i, Buffer.from(id.data), { format: 'rgba' });		
		ctx.restore();		
	}
	if (slotFound) 	streamDeckPointer = c - 1;
}
	
async function setupMicrophone() {
	
	if (microphone.checked) {	
		console.debug("setupMicrophone");
		/*	
		const audioCtx = new AudioContext();	
		let audioMidiConfig = {tempo: 80,  maxTempo: 720,  resolution: 16,  channel: 2,  sampleRate: 32000};		
		const midiCreator = new MidiCreator({audioMidiConfig});
		
		midiCreator.onPreviewNote = (data) => {
			//console.debug("midiCreator.onPreviewNote", data);		
		};	
		*/
		const basicPitch = new basic_pitch.BasicPitch("./model/model.json");		
		const audioCtx = new AudioContext({ sampleRate: 22050 });	
		const frames = [];
		const onsets = [];
		const contours = [];
  
		const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
		console.debug("setupMicrophone", stream);		
			
		const inputNode = audioCtx.createMediaStreamSource(stream);
		await audioCtx.audioWorklet.addModule('/js/audio-midi.js')
		const processorNode = new AudioWorkletNode(audioCtx, 'audio-midi');
		
		processorNode.port.onmessage = async (event) => {
			//console.debug("processorNode.port.onmessage", event.data.channel);
			/*
			let pitchInfo = midiCreator.autoCorrelate(event.data.channel, audioCtx.sampleRate);
			
			if (pitchInfo?.pitch > -1) {	
				//console.debug("processorNode.port.onmessage", pitchInfo);			
				midiCreator.addNote(pitchInfo.pitch, pitchInfo.velocity);				
			}
			*/
			
			/*
			await basicPitch.evaluateModel(event.data.channel,  (frame, onset, contour) => {
				frames.push(...frame);
				onsets.push(...onset);
				contours.push(...contour);
				
			  }, (pct) => {
				console.debug("basicPitch - progress", pct);
			  });

			const onsetThresh = 0.5, frameThresh = 0.3, minNoteLen = 5, inferOnsets = true, maxFreq = null,  minFreq = null,  melodiaTrick = true, energyTolerance = 11;
			const notes = basic_pitch.noteFramesToTime(basic_pitch.addPitchBendsToNoteEvents(contours, basic_pitch.outputToNotesPoly(frames, onsets, onsetThresh, frameThresh, minNoteLen, inferOnsets, maxFreq, minFreq, melodiaTrick, energyTolerance)));
			
			const noteEvents = notes.map((n) => ({
			  pitch: n.pitchMidi,
			  duration: n.durationSeconds,
			  onset: n.startTimeSeconds,
			  pitchBends: n.pitchBends,
			  velocity: n.amplitude,
			}));

			// Sort the note events by onset time and pitch
			noteEvents.sort((a, b) => a.onset - b.onset || a.pitch - b.pitch);	
			console.debug("basicPitch - completed", noteEvents);
			*/
		};
  
		inputNode.connect(processorNode).connect(audioCtx.destination);
		console.debug("setupMicrophone - processorNode active");
	}	
}

function handleFileContent(event) {
	console.debug("handleFileContent", event);	
	var files = event.target.files;

	for (const file of files) {
		var reader = new FileReader();

		reader.onload = function(event)	
		{
			if (file.name.toLowerCase().endsWith(".mid") || file.name.toLowerCase().endsWith(".sf2") || file.name.toLowerCase().endsWith(".kst") || file.name.toLowerCase().endsWith(".sty") || file.name.toLowerCase().endsWith(".prs") || file.name.toLowerCase().endsWith(".bcs") || file.name.toLowerCase().endsWith(".ac7") || file.name.toLowerCase().endsWith(".sas") || file.name.toLowerCase().endsWith(".drum") || file.name.toLowerCase().endsWith(".chord")) {
				handleBinaryFile(file.name, event.target.result);
			}	
			else
				
			if (file.name.toLowerCase().endsWith(".cho")) {
				handleChordPro(file, event.target.result);
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

async function handleChordPro(file, data) {
	const decoder = new TextDecoder("utf-8"); 
	const body = decoder.decode(data); 
	const song = chordproParser.parse(body);	// TODO - Implement server-side chord to midi
	console.debug("handleChordPro", file.name, song);	
	
	let url = location.origin + "/orinayo/cp2midi";
	
	if (location.origin.startWith("chrome-extension") || location.origin.startWith("https://jus-be.github.io/")) {
		url = "https://pade.chat:5443/orinayo/cp2midi";
	}
	
	const response = await fetch(url, {method: "POST", body});
	const blob = await response.blob();	
	const buffer = await blob.arrayBuffer();
	
	handleBinaryFile(file.name.replace(".cho", ".mid"), buffer);	
}

function handleBinaryFile(filename, data) {
	console.debug("handleBinaryFile", filename, data);
	
	const store = new idbKeyval.Store(filename, filename);

	idbKeyval.set(filename, data, store).then(function () {
		console.debug("handleBinaryFile set", filename, data);
		
		if (filename.toLowerCase().endsWith(".sf2")) {		
			arrSynth = {name: filename};
		}
		else
			
		if (filename.toLowerCase().endsWith(".mid")) {		
			songSequence = {name: filename};
		}
		else
			
		if (filename.toLowerCase().endsWith(".drum")) {		
			realInstrument.drumUrl = filename;				
		}
		else
			
		if (filename.toLowerCase().endsWith(".chord")) {		
			realInstrument.drumUrl = filename;				
		}
		else
			
		if (filename.toLowerCase().endsWith(".bass")) {		
			realInstrument.bassUrl = filename;				
		}
		else {
			arrSequence = {name: filename};
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
	if (window.delay) delay.delayTime.value = 60 / tmpo;
	
	if (writeCharacteristic) {	// liberlive sync
		setLiberLiveDeviceSettings() 
	}
}

function handleKeyboard(name, code) {
	console.debug("handleKeyboard", name, code);
	
	if (!game) {
		setup();
		resetGuitarHero();
	}

	var handled = false;	
	
	if (inputDeviceType == "orinayo") {
		handled = handleSevenButtons(name, code);
		updateCanvas();			
	} else {
		handled = handleNumPad(name, code);	
		doChord();
		updateCanvas();
		resetGuitarHero();			
	}
}

function handleSevenButtons(name, code) {
	var handled = false;

	if (keyboard.get("1")) {
		pad.buttons[RED] = true; 
		pad.buttons[YELLOW] = true; 		
		handled = true;		
	}
	else

	if (keyboard.get("2")) {
		pad.buttons[RED] = true; 
		handled = true;		
	}
	else

	if (keyboard.get("3")) {
		pad.buttons[GREEN] = true; 
		handled = true;		
	}
	else

	if (keyboard.get("4")) {
		pad.buttons[YELLOW] = true; 
		handled = true;		
	}
	else

	if (keyboard.get("5")) {
		pad.buttons[ORANGE] = true; 
		handled = true;		
	}
	else

	if (keyboard.get("6")) {
		pad.buttons[BLUE] = true; 
		handled = true;		
	}
	else
		
	if (keyboard.get("7")) {
		pad.buttons[BLUE] = true; 
		pad.buttons[GREEN] = true; 		
		handled = true;		
	}	

	return handled;	
}

function handleNumPad(name, code) {
	var handled = false;	
	
	if (keyboard.get(" ")) {
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
	return handled;
}

function toggleStrumUpDown() {
	pad.axis[STRUM] = isStrumUp ? STRUM_UP : STRUM_DOWN;
	if (midiRealGuitar) midiRealGuitar.playNote(isStrumUp ? 122 : 121, 1, {velocity: getVelocity(), duration: 1000});				
	isStrumUp = !isStrumUp;
}

function handleNoteOff(note, device, velocity, channel) {	
	console.debug("handleNoteOff", inputDeviceType, note);
	
	if (arrSynth?.onmessage) {
		if (keysSound1?.checked) stopSynthNote(note.number, channel - 1, velocity  * 127);		
		if (keysSound2?.checked) stopSynthNote(note.number, channel, velocity  * 127);				
	}
	
	midiNotes.delete(note.number);
	
	if (midiNotes.size == 0) {
		midiNotesProceesed = false;
	}

	if (chordTracker) {
		chordTracker.stopNote(note.number, channel, {velocity});
	}
	
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
	console.debug("handleNoteOn", inputDeviceType, note, device, velocity, channel);
	
	if (arrSynth?.onmessage) {
		if (keysSound1?.checked) playSynthNote(note.number, channel - 1, velocity  * 127);				
		if (keysSound2?.checked) playSynthNote(note.number, channel, velocity  * 127);						
	}

	midiNotes.set(note.number, {inputDeviceType, note, device, velocity, channel});	
	
	if (!midiNotesProceesed && midiNotes.size == 4 || midiNotes.size == 3) {
		const chord = []; 
		for (let [keyNote, value] of midiNotes) chord.push(value.note.number);	
		chord.sort();
		
		const sorted = [];
		for (no of chord)  sorted.push(Tonal.Midi.midiToNoteName(no));		
		const chords = Tonal.Chord.detect(sorted); // multiple indentifications
		
		if (chords.length > 0) {
			const chordName = (midiNotes.size == 4 && chords.length > 1) ? chords[1] : chords[0];			
			let detectedChord = Tonal.Chord.get(chordName);
			let tonic = Tonal.Midi.toMidi(detectedChord.tonic + "1") % 12;  //(midiNotes.size == 4 ? chord[1] : chord[0]) % 12;			
			console.debug("detected chord", detectedChord, midiNotes.size, tonic);
						
			let arrChordType = (detectedChord.type == "suspended fourth" ? "sus" : (detectedChord.type == "minor" ? "min" : (detectedChord.type == "major" ? "maj" : null)));	
			
			if (!arrChordType) {
				arrChordType = "maj";
				detectedChord = Tonal.Chord.get((detectedChord.bass || detectedChord.tonic) + "M");	// use bass otherwise new tonic as root for major chord
				tonic = Tonal.Midi.toMidi(detectedChord.tonic + "1") % 12;
			}
			
			orinayo.innerHTML = key + " - " + detectedChord.symbol;									
			const chordKey = "key" + tonic + "_" + arrChordType + "_" + SECTION_IDS[sectionChange];
			const bassKey = "key" + (chord[0] % 12) + "_" + arrChordType + "_" + SECTION_IDS[sectionChange];		

			if (arranger == "webaudio" && realInstrument && styleStarted) {	
				const bassChecked = document.getElementById("arr-instrument-17")?.checked;
				const chordChecked = document.getElementById("arr-instrument-18")?.checked;
				console.debug("playing chord", bassChecked, bassKey, chordChecked, chordKey);					
				
				if (bassLoop && bassChecked) bassLoop.update(bassKey, false);
				if (chordLoop && chordChecked) chordLoop.update(chordKey, false);
			
				midiNotesProceesed = true;				
			}
		}
	}
	
	if (chordTracker) {
		chordTracker.playNote(note.number, channel, {velocity});
	}
	
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
			console.debug("handleNoteOn - strum up/down", pad.buttons[GREEN], pad.buttons[RED], pad.buttons[YELLOW], pad.buttons[BLUE], pad.buttons[ORANGE]);	

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
				
				if (!styleStarted) {						
					if (note.number == artiphonI1Base) {
						padFretButton = (127);
						padsMode = 0;	
						seqIndex = 0;	
						orinayo_pad.innerHTML = "None";	
					}
					if (note.number == artiphonI1Base + 4) {
						padFretButton =(126);
						padsMode = 2;	
					}
					if (note.number == artiphonI1Base + 5) {
						padFretButton =(125);	
						padsMode = 3;	
					}
					if (note.number == artiphonI1Base + 7) {
						padFretButton =(124);	
						padsMode = 4;
					}
					if (note.number == artiphonI1Base + 9) {
						padFretButton = (123);
						padsMode = 5;
					}
					
					if (padsMode != 0) orinayo_pad.innerHTML = "Pad " + padsMode;						

					if (padFretButton) {
						if (padsDevice?.stopNote || padsDevice?.name == "soundfont") stopPads();
						const fwdChord = [119];
						fwdChord.push(padFretButton);	
						if (midiRealGuitar) midiRealGuitar.playNote(fwdChord, 1, {velocity});	
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
  
  if (e.gamepad.id.indexOf("Guitar") > -1 || (e.gamepad.id.indexOf("248a") > -1 && e.gamepad.id.indexOf("8266") > -1) || e.gamepad.id == "Xbox 360 Controller for Windows (STANDARD GAMEPAD)") {
	console.debug("connectHandler found gamepad " + e.gamepad.id, e.gamepad);
  
	if (!game) setup();
		  
	for (var i=0; i<e.gamepad.buttons.length; i++) {	  
	  pad.buttons[i] = false;
	}
	
	pad.axis[STRUM] = 0;
	
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
	var riffMasterXbox = null;
	var riffMasterPS = null;
	
	var gamepads = navigator.getGamepads();	
	  
	for (var i = 0; i < gamepads.length; i++) {
		//console.debug("found gamepad " + gamepads[i].id, gamepads[i]);

			
		if (gamepads[i] && gamepads[i].id.indexOf("PDP RiffMaster Guitar") > -1) {
		  riffMasterPS = gamepads[i];
		  guitarAvailable = true;
		  break;
		}
		else
			
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
		else
			
		if (gamepads[i] && gamepads[i].id.indexOf("Xbox 360 Controller for Windows (STANDARD GAMEPAD)") > -1) {
		  riffMasterXbox = gamepads[i];
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
				//updated = true;
			}
		}

	}
	else	
		
	if (riffMasterXbox) {
		//console.debug("using riff master" + riffMasterXbox.id, riffMasterXbox);
		
		pad.axis[STRUM] = 0;
		
		for (var i=0; i<riffMasterXbox.buttons.length; i++) {
			var touched = false;	
			var val = riffMasterXbox.buttons[i];		
		  
			if (typeof(val) == "object") 
			{	  			
				if ('touched' in val) {
				  touched = val.touched;
				}			
			}
			
			let j = i;
			if (i == 0) j = GREEN;
			if (i == 1) j = RED;				
			if (i == 3) j = YELLOW;
			if (i == 2) j = BLUE;			
			if (i == 4) j = ORANGE;	
			if (i == 8) j = START;			
			if (i == 9) j = STARPOWER;			
			
			if (i == 12) j = 112;				
			if (i == 13) j = 113;			

			if (pad.buttons[j] != touched) {
				console.debug("button " + j, touched);	
				
				if (i == 12 || i == 13) {			
					if (touched) {
						pad.axis[STRUM] = (i == 12) ? STRUM_UP : STRUM_DOWN;
						updated = true;						
					}
					
				} 
				else
					
				if (i == 10) 
				{
					if (pad.buttons[GREEN]) {
						pad.buttons[LOGO] = touched;
					}
					else

					if (pad.buttons[RED]) {						
						pad.axis[TOUCH] = -0.7;
						pad.axis[STRUM] = STRUM_DOWN;			// fill
					}
					else

					if (pad.buttons[YELLOW]) {						
						pad.axis[TOUCH] = -0.7;
						pad.axis[STRUM] = STRUM_UP;			// break
					}					
					
					updated = true;					
					
					pad.buttons[GREEN] = false;
					pad.buttons[RED] = false;
					pad.buttons[YELLOW] = false;
					pad.buttons[BLUE] = false;
					pad.buttons[ORANGE] = false;					
				} 				
				
				else {
					updated = true;
				}
				
				pad.buttons[j] = touched;				
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
				updated = true;
			}			
		}
		
		if (guitar.axes.length > STRUM) 
		{			
			if (pad.axis[STRUM] != guitar.axes[STRUM].toFixed(4)) {
				//console.debug("strum", guitar.axes[STRUM].toFixed(4));							
				pad.axis[STRUM] = guitar.axes[STRUM].toFixed(4);
				updated = true;
			}

			if (pad.axis[TOUCH] != guitar.axes[TOUCH].toFixed(1)) {
				//console.debug("touch", guitar.axes[TOUCH].toFixed(1));							
				pad.axis[TOUCH] = guitar.axes[TOUCH].toFixed(1);
				updated = true;				
			}	

			if (pad.axis[WHAMMY] != guitar.axes[WHAMMY].toFixed(1)) {
				//console.debug("whammy", guitar.axes[WHAMMY].toFixed(1));							
				pad.axis[WHAMMY] = guitar.axes[WHAMMY].toFixed(1);
				updated = true;				
			}			
		}				
	}
	else
  
	if (riffMasterPS) {				
		//console.debug("using guitar" + riffMasterPS.id, riffMasterPS);
		
		for (var i=0; i<riffMasterPS.buttons.length; i++) 
		{
			var val = riffMasterPS.buttons[i];
			var touched = false;							
		  
			if (typeof(val) == "object") 
			{	  			
				if ('touched' in val) {
				  touched = val.touched;
				}			
			}

			let j = i;
			if (i == BLUE) j = YELLOW;
			if (i == YELLOW) j = BLUE;	
			//if (i == 11) j = LOGO;
			//if (i == LOGO) j = 11;
			
			if (pad.buttons[j] != touched) {
				console.debug("button " + i, j, touched);									
				pad.buttons[j] = touched;
				updated = true;
			}
			
			
			if (i == 10) {
				pad.axis[TOUCH] = 0;
				
				if (pad.buttons[10]) {
					if (pad.buttons[GREEN]) pad.axis[TOUCH] = -0.7;	
					if (pad.buttons[RED]) pad.axis[TOUCH] = -0.4; 	
					if (pad.buttons[YELLOW]) pad.axis[TOUCH] = 0.2;	
					if (pad.buttons[BLUE]) pad.axis[TOUCH] = 0.4; 				
					if (pad.buttons[ORANGE]) pad.axis[TOUCH] = 1.0; 
					
					pad.buttons[GREEN] = false;
					pad.buttons[RED] = false;
					pad.buttons[YELLOW] = false;
					pad.buttons[BLUE] = false;
					pad.buttons[ORANGE] = false;					
				}					
			}			
		}	
		if (riffMasterPS.axes.length > STRUM) 
		{			
			if (pad.axis[STRUM] != riffMasterPS.axes[STRUM].toFixed(4)) {
				//console.debug("strum", riffMasterPS.axes[STRUM].toFixed(4));							
				pad.axis[STRUM] = riffMasterPS.axes[STRUM].toFixed(4);
				updated = true;
			}

			if (pad.axis[JSTICKX] != riffMasterPS.axes[JSTICKX].toFixed(1)) {
				console.debug("joy stick X", riffMasterPS.axes[JSTICKX].toFixed(1));							
				pad.axis[JSTICKX] = riffMasterPS.axes[JSTICKX].toFixed(1);
				
				if (pad.axis[JSTICKX] == 1.0) {
					pad.buttons[LOGO] = true;
					updated = true;				
				}
			}	

			if (pad.axis[JSTICKY] != riffMasterPS.axes[JSTICKY].toFixed(1)) {
				console.debug("joy stick Y", riffMasterPS.axes[JSTICKY].toFixed(1));							
				pad.axis[JSTICKY] = riffMasterPS.axes[JSTICKY].toFixed(1);
				updated = true;				
			}			
		}				
	}	
		
	if (updated) {
		if (styleStarted && songSequence) {
			handleSongMode();
		} else {
			doChord();
		}
		updateCanvas();
		
		if (riffMasterXbox) {
			pad.buttons[LOGO] = false;
			pad.axis[TOUCH] = 0;
		}
		else
			
		if (riffMasterPS) {	
			pad.buttons[LOGO] = false;		
			pad.axis[TOUCH] = 0;
		}	
	}	
	
	window.setTimeout(updateStatus);
}

function handleSongMode() {
	let processed = false;
	
	if ((pad.buttons[YELLOW] || pad.buttons[BLUE] || pad.buttons[ORANGE] || pad.buttons[RED] || pad.buttons[GREEN]) && !pad.buttons[START] && !pad.buttons[STARPOWER]) {		
		processed = true;
	}	
	
	if (!processed) {
		doChord();
	}
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
	  
	  if (!location.origin.startsWith("chrome-extension") && location.hostname != "jus-be.github.io") {
		startXMPP();
	  }	  
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
	
	//guitarDeviceId = config.guitarDeviceId;
	guitarVolume = config.guitarVolume ? config.guitarVolume : guitarVolume;
	savedGuitarVolume = guitarVolume;
	bassVol = config.bassVol ? config.bassVol : bassVol;	
	drumVol = config.drumVol ? config.drumVol : drumVol;
	chordVol = config.chordVol ? config.chordVol : chordVol;
	keysSound1Vol = config.keysSound1Vol ? config.keysSound1Vol : keysSound1Vol;
	keysSound2Vol = config.keysSound2Vol ? config.keysSound2Vol : keysSound2Vol;	

	savedDrumVol = drumVol;
	savedBassVol = bassVol;	
	savedChordVol = chordVol;
	
	keyChange = config.keyChange ? config.keyChange : keyChange;
	dokeyChange();
	
	const midiIn = document.getElementById("midiInSel");
	const midiOut = document.getElementById("midiOutSel");
	const midiFwd = document.getElementById("midiFwdSel");
	const midiPads = document.getElementById("midiPadsSel");	
	const midiChordTracker = document.getElementById("midiChordTrackerSel");
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
	
	arrangerGrp.addEventListener("change", function()
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
				song_sequences.unshift(db.name);
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
	
	const liberLiveChords = [];
	
	for (let i=1; i<3; i++) {
		liberLiveChords[i] = document.getElementById("ll-chord" + i);
		liberLiveChords[i].options[0] = new Option("Basic Single Strum", "1/0", config["liberLiveChrd" + i] == "1/0", config["liberLiveChrd" + i] == "1/0");			
		liberLiveChords[i].options[1] = new Option("Basic Picking 1", "2/0", config["liberLiveChrd" + i] == "2/0", config["liberLiveChrd" + i] == "2/0");					
		liberLiveChords[i].options[2] = new Option("Basic Picking 2", "3/0", config["liberLiveChrd" + i] == "3/0", config["liberLiveChrd" + i] == "3/0");			
		liberLiveChords[i].options[3] = new Option("Basic Column 2", "4/0", config["liberLiveChrd" + i] == "4/0", config["liberLiveChrd" + i] == "4/0");					
		liberLiveChords[i].options[4] = new Option("Basic Column 1", "5/0", config["liberLiveChrd" + i] == "5/0", config["liberLiveChrd" + i] == "5/0");			
		liberLiveChords[i].options[5] = new Option("Picking Subway", "1/1", config["liberLiveChrd" + i] == "1/1", config["liberLiveChrd" + i] == "1/1");					
		liberLiveChords[i].options[6] = new Option("Picking Paper Plane", "2/1", config["liberLiveChrd" + i] == "2/1", config["liberLiveChrd" + i] == "2/1");					
		liberLiveChords[i].options[7] = new Option("Picking Hotel", "3/1", config["liberLiveChrd" + i] == "3/1", config["liberLiveChrd" + i] == "3/1");					
		liberLiveChords[i].options[8] = new Option("Picking Memory", "4/1", config["liberLiveChrd" + i] == "4/1", config["liberLiveChrd" + i] == "4/1");					
		liberLiveChords[i].options[9] = new Option("Picking Remember", "5/1", config["liberLiveChrd" + i] == "5/1", config["liberLiveChrd" + i] == "5/1");					
		liberLiveChords[i].options[10] = new Option("Picking Glance", "6/1", config["liberLiveChrd" + i] == "6/1", config["liberLiveChrd" + i] == "6/1");					
		liberLiveChords[i].options[11] = new Option("Picking Trouble", "7/1", config["liberLiveChrd" + i] == "7/1", config["liberLiveChrd" + i] == "7/1");					
		liberLiveChords[i].options[12] = new Option("Picking Honey", "8/1", config["liberLiveChrd" + i] == "8/1", config["liberLiveChrd" + i] == "8/1");					
		liberLiveChords[i].options[13] = new Option("Picking Obsessed", "9/1", config["liberLiveChrd" + i] == "9/1", config["liberLiveChrd" + i] == "9/1");					
		liberLiveChords[i].options[14] = new Option("Picking Lapse", "11/1", config["liberLiveChrd" + i] == "11/1", config["liberLiveChrd" + i] == "11/1");					
		liberLiveChords[i].options[15] = new Option("Picking Family", "13/1", config["liberLiveChrd" + i] == "13/1", config["liberLiveChrd" + i] == "13/1");					
		liberLiveChords[i].options[16] = new Option("Picking Kid", "14/1", config["liberLiveChrd" + i] == "14/1", config["liberLiveChrd" + i] == "14/1");					
		liberLiveChords[i].options[17] = new Option("Picking Waltz (3/4)", "20/1", config["liberLiveChrd" + i] == "20/1", config["liberLiveChrd" + i] == "20/1");					
		liberLiveChords[i].options[18] = new Option("Picking Mortal (6/8)", "22/1", config["liberLiveChrd" + i] == "22/1", config["liberLiveChrd" + i] == "22/1");					
		liberLiveChords[i].options[19] = new Option("Picking Dairy (6/8)", "23/1", config["liberLiveChrd" + i] == "23/1", config["liberLiveChrd" + i] == "23/1");					
		liberLiveChords[i].options[20] = new Option("Strum Skyline", "1/2", config["liberLiveChrd" + i] == "1/2", config["liberLiveChrd" + i] == "1/2");					
		liberLiveChords[i].options[21] = new Option("Strum Freedom", "2/2", config["liberLiveChrd" + i] == "2/2", config["liberLiveChrd" + i] == "2/2");					
		liberLiveChords[i].options[22] = new Option("Strum Verse", "3/2", config["liberLiveChrd" + i] == "3/2", config["liberLiveChrd" + i] == "3/2");					
		liberLiveChords[i].options[23] = new Option("Strum Away", "4/2", config["liberLiveChrd" + i] == "4/2", config["liberLiveChrd" + i] == "4/2");					
		liberLiveChords[i].options[24] = new Option("Strum Strange", "6/2", config["liberLiveChrd" + i] == "6/2", config["liberLiveChrd" + i] == "6/2");					
		liberLiveChords[i].options[25] = new Option("Strum Wind", "7/2", config["liberLiveChrd" + i] == "7/2", config["liberLiveChrd" + i] == "7/2");					
		liberLiveChords[i].options[26] = new Option("Strum Apart", "8/2", config["liberLiveChrd" + i] == "8/2", config["liberLiveChrd" + i] == "8/2");					
		liberLiveChords[i].options[27] = new Option("Strum Luggage", "9/2", config["liberLiveChrd" + i] == "9/2", config["liberLiveChrd" + i] == "9/2");					
		liberLiveChords[i].options[28] = new Option("Strum Train", "32/2", config["liberLiveChrd" + i] == "32/2", config["liberLiveChrd" + i] == "32/2");					
		liberLiveChords[i].options[29] = new Option("Strum After School", "33/2", config["liberLiveChrd" + i] == "33/2", config["liberLiveChrd" + i] == "33/2");					
		liberLiveChords[i].options[30] = new Option("Strum Rock", "36/2", config["liberLiveChrd" + i] == "36/2", config["liberLiveChrd" + i] == "36/2");					
		liberLiveChords[i].options[31] = new Option("Strum Old Town (6/8)", "38/2", config["liberLiveChrd" + i] == "38/2", config["liberLiveChrd" + i] == "38/2");					
		liberLiveChords[i].options[32] = new Option("Performance Nibble", "1/3", config["liberLiveChrd" + i] == "1/3", config["liberLiveChrd" + i] == "1/3");					
		liberLiveChords[i].options[33] = new Option("Performance Heels", "2/3", config["liberLiveChrd" + i] == "2/3", config["liberLiveChrd" + i] == "2/3");					
		liberLiveChords[i].options[34] = new Option("Performance Juliet", "3/3", config["liberLiveChrd" + i] == "3/3", config["liberLiveChrd" + i] == "3/3");					
		liberLiveChords[i].options[35] = new Option("Performance Garden", "4/3", config["liberLiveChrd" + i] == "4/3", config["liberLiveChrd" + i] == "4/3");					
		liberLiveChords[i].options[36] = new Option("Performance Battle", "5/3", config["liberLiveChrd" + i] == "5/3", config["liberLiveChrd" + i] == "5/3");					
		liberLiveChords[i].options[37] = new Option("Performance Lemon", "6/3", config["liberLiveChrd" + i] == "6/3", config["liberLiveChrd" + i] == "6/3");					
		liberLiveChords[i].options[38] = new Option("Performance Encounter", "7/3", config["liberLiveChrd" + i] == "7/3", config["liberLiveChrd" + i] == "7/3");					
		liberLiveChords[i].options[39] = new Option("Performance Hearbeat", "8/3", config["liberLiveChrd" + i] == "8/3", config["liberLiveChrd" + i] == "8/3");					
		liberLiveChords[i].options[40] = new Option("Performance Journey", "9/3", config["liberLiveChrd" + i] == "9/3", config["liberLiveChrd" + i] == "9/3");					
		liberLiveChords[i].options[41] = new Option("Performance Waiting", "10/3", config["liberLiveChrd" + i] == "10/3", config["liberLiveChrd" + i] == "10/3");					
		liberLiveChords[i].options[42] = new Option("Performance Seasoned", "11/3", config["liberLiveChrd" + i] == "11/3", config["liberLiveChrd" + i] == "11/3");					
		liberLiveChords[i].options[43] = new Option("Performance Tide", "13/3", config["liberLiveChrd" + i] == "13/3", config["liberLiveChrd" + i] == "13/3");					
		liberLiveChords[i].options[44] = new Option("Performance Tipsy", "15/3", config["liberLiveChrd" + i] == "15/3", config["liberLiveChrd" + i] == "15/3");					
		liberLiveChords[i].options[45] = new Option("Performance Bell", "17/3", config["liberLiveChrd" + i] == "17/3", config["liberLiveChrd" + i] == "17/3");					
		liberLiveChords[i].options[46] = new Option("Performance Drug", "18/3", config["liberLiveChrd" + i] == "18/3", config["liberLiveChrd" + i] == "18/3");					
		liberLiveChords[i].options[47] = new Option("Performance Moon", "19/3", config["liberLiveChrd" + i] == "19/3", config["liberLiveChrd" + i] == "19/3");					
		liberLiveChords[i].options[48] = new Option("Performance Wander", "20/3", config["liberLiveChrd" + i] == "20/3", config["liberLiveChrd" + i] == "20/3");					
		liberLiveChords[i].options[49] = new Option("Performance Red Wine", "21/3", config["liberLiveChrd" + i] == "21/3", config["liberLiveChrd" + i] == "21/3");					
		liberLiveChords[i].options[50] = new Option("Performance Sweet Pick", "31/3", config["liberLiveChrd" + i] == "31/3", config["liberLiveChrd" + i] == "31/3");					
		liberLiveChords[i].options[51] = new Option("Piano Column 1", "0/4", config["liberLiveChrd" + i] == "0/4", config["liberLiveChrd" + i] == "0/4");					
		liberLiveChords[i].options[52] = new Option("Piano Column 2", "3/4", config["liberLiveChrd" + i] == "3/4", config["liberLiveChrd" + i] == "3/4");					
		liberLiveChords[i].options[53] = new Option("Piano Arpeggio 1", "4/4", config["liberLiveChrd" + i] == "4/4", config["liberLiveChrd" + i] == "4/4");					
		liberLiveChords[i].options[54] = new Option("Piano Arpeggio 2", "5/4", config["liberLiveChrd" + i] == "5/4", config["liberLiveChrd" + i] == "5/4");					
		liberLiveChords[i].options[55] = new Option("Piano Letter", "7/4", config["liberLiveChrd" + i] == "7/4", config["liberLiveChrd" + i] == "7/4");					
		liberLiveChords[i].options[56] = new Option("Piano Moonlight", "10/4", config["liberLiveChrd" + i] == "10/4", config["liberLiveChrd" + i] == "10/4");					
		liberLiveChords[i].options[57] = new Option("Piano Hesitate", "11/4", config["liberLiveChrd" + i] == "11/4", config["liberLiveChrd" + i] == "11/4");					
		liberLiveChords[i].options[58] = new Option("Piano Footprint", "12/4", config["liberLiveChrd" + i] == "12/4", config["liberLiveChrd" + i] == "12/4");					
		liberLiveChords[i].options[59] = new Option("Piano Chords", "21/4", config["liberLiveChrd" + i] == "21/4", config["liberLiveChrd" + i] == "21/4");					
		liberLiveChords[i].options[60] = new Option("Piano Embrace", "23/4", config["liberLiveChrd" + i] == "23/4", config["liberLiveChrd" + i] == "23/4");					
		liberLiveChords[i].options[61] = new Option("Piano Past", "24/4", config["liberLiveChrd" + i] == "24/4", config["liberLiveChrd" + i] == "24/4");					
		liberLiveChords[i].options[62] = new Option("Piano Cotton", "25/4", config["liberLiveChrd" + i] == "25/4", config["liberLiveChrd" + i] == "25/4");					
		liberLiveChords[i].options[63] = new Option("Piano Cloud Ladder", "26/4", config["liberLiveChrd" + i] == "26/4", config["liberLiveChrd" + i] == "26/4");					
		liberLiveChords[i].options[64] = new Option("Piano Warm Winter", "27/4", config["liberLiveChrd" + i] == "27/4", config["liberLiveChrd" + i] == "27/4");					
		liberLiveChords[i].options[65] = new Option("Piano Courage", "28/4", config["liberLiveChrd" + i] == "28/4", config["liberLiveChrd" + i] == "28/4");					
		liberLiveChords[i].options[66] = new Option("Piano Pipe", "29/4", config["liberLiveChrd" + i] == "29/4", config["liberLiveChrd" + i] == "29/4");					
		liberLiveChords[i].options[67] = new Option("Piano Spark", "30/4", config["liberLiveChrd" + i] == "30/4", config["liberLiveChrd" + i] == "30/4");					
		liberLiveChords[i].options[68] = new Option("Piano Sunshine", "31/4", config["liberLiveChrd" + i] == "31/4", config["liberLiveChrd" + i] == "31/4");					
		liberLiveChords[i].options[69] = new Option("Piano Dance Step (6/8)", "32/4", config["liberLiveChrd" + i] == "32/4", config["liberLiveChrd" + i] == "32/4");					
		liberLiveChords[i].options[70] = new Option("Piano Attached (6/8)", "33/4", config["liberLiveChrd" + i] == "33/4", config["liberLiveChrd" + i] == "33/4");					
		liberLiveChords[i].options[71] = new Option("Bass 1", "1/5", config["liberLiveChrd" + i] == "1/5", config["liberLiveChrd" + i] == "1/5");					
		liberLiveChords[i].options[72] = new Option("Bass 2", "2/5", config["liberLiveChrd" + i] == "2/5", config["liberLiveChrd" + i] == "2/5");					
		liberLiveChords[i].options[73] = new Option("Bass 3", "3/5", config["liberLiveChrd" + i] == "3/5", config["liberLiveChrd" + i] == "3/5");					
		liberLiveChords[i].options[74] = new Option("Bass 4", "4/5", config["liberLiveChrd" + i] == "4/5", config["liberLiveChrd" + i] == "4/5");					
		liberLiveChords[i].options[75] = new Option("Bass 11", "11/5", config["liberLiveChrd" + i] == "11/5", config["liberLiveChrd" + i] == "11/5");					
		liberLiveChords[i].options[76] = new Option("Bass 12", "12/5", config["liberLiveChrd" + i] == "12/5", config["liberLiveChrd" + i] == "12/5");					
		liberLiveChords[i].options[77] = new Option("Bass 13", "13/5", config["liberLiveChrd" + i] == "13/5", config["liberLiveChrd" + i] == "13/5");					
		liberLiveChords[i].options[78] = new Option("Bass 14", "14/5", config["liberLiveChrd" + i] == "14/5", config["liberLiveChrd" + i] == "14/5");					
		liberLiveChords[i].options[79] = new Option("Bass 17", "17/5", config["liberLiveChrd" + i] == "17/5", config["liberLiveChrd" + i] == "17/5");					
		liberLiveChords[i].options[80] = new Option("Bass 19", "19/5", config["liberLiveChrd" + i] == "19/5", config["liberLiveChrd" + i] == "19/5");					
		liberLiveChords[i].options[81] = new Option("Bass 21", "21/5", config["liberLiveChrd" + i] == "21/5", config["liberLiveChrd" + i] == "21/5");					
	}
	
	liberLive.chord1 = config.liberLiveChrd1 || liberLive.chord1;

	liberLiveChords[1].addEventListener("change", function()
	{
		liberLive.chord1 = liberLiveChords[1].value;
		console.debug("selected liberlive chord1", liberLive.chord1, liberLiveChords[1].value);				
		saveConfig();
		setLiberLiveDeviceSettings();
	});	
		
	liberLive.chord2 = config.liberLiveChrd2 || liberLive.chord2;
	
	liberLiveChords[2].addEventListener("change", function()
	{
		liberLive.chord2 = liberLiveChords[2].value;
		console.debug("selected liberlive chord2", liberLive.chord2, liberLiveChords[2].value);				
		saveConfig();
		setLiberLiveDeviceSettings();
	});		
	
	
	const liberLiveDrums = [];
	
	for (let i=1; i<3; i++) {
		liberLiveDrums[i] = document.getElementById("ll-drums" + i);
		liberLiveDrums[i].options[0] = new Option("Pop 1 (4/4)", "222/23", config["liberLiveDrms" + i] == "222/23", config["liberLiveDrms" + i] == "222/23");					
		liberLiveDrums[i].options[1] = new Option("Pop 2 (4/4)", "232/23", config["liberLiveDrms" + i] == "232/23", config["liberLiveDrms" + i] == "232/23");					
		liberLiveDrums[i].options[2] = new Option("Pop 3 (4/4)", "242/23", config["liberLiveDrms" + i] == "242/23", config["liberLiveDrms" + i] == "242/23");			
		liberLiveDrums[i].options[3] = new Option("Pop 4 (4/4)", "252/23", config["liberLiveDrms" + i] == "252/23", config["liberLiveDrms" + i] == "252/23");					
		liberLiveDrums[i].options[4] = new Option("Pop 5 (4/4)", "6/24", config["liberLiveDrms" + i] == "6/24", config["liberLiveDrms" + i] == "6/24");			
		liberLiveDrums[i].options[5] = new Option("Pop 6 (6/8)", "42/28", config["liberLiveDrms" + i] == "42/28", config["liberLiveDrms" + i] == "42/28");					
		liberLiveDrums[i].options[6] = new Option("Pop 7 (6/8)", "52/28", config["liberLiveDrms" + i] == "52/28", config["liberLiveDrms" + i] == "52/28");			
		liberLiveDrums[i].options[7] = new Option("Rock 1 (4/4)", "16/24", config["liberLiveDrms" + i] == "16/24", config["liberLiveDrms" + i] == "16/24");					
		liberLiveDrums[i].options[8] = new Option("Rock 2 (4/4)", "26/24", config["liberLiveDrms" + i] == "26/24", config["liberLiveDrms" + i] == "26/24");			
		liberLiveDrums[i].options[9] = new Option("Rock 3 (4/4)", "36/24", config["liberLiveDrms" + i] == "36/24", config["liberLiveDrms" + i] == "36/24");					
		liberLiveDrums[i].options[10] = new Option("Rock 4 (4/4)", "46/24", config["liberLiveDrms" + i] == "46/24", config["liberLiveDrms" + i] == "46/24");					
		liberLiveDrums[i].options[11] = new Option("Rock 5(4/4)", "136/24", config["liberLiveDrms" + i] == "136/24", config["liberLiveDrms" + i] == "136/24");					
		liberLiveDrums[i].options[12] = new Option("Vocal 1 (4/4)", "56/24", config["liberLiveDrms" + i] == "56/24", config["liberLiveDrms" + i] == "56/24");			
		liberLiveDrums[i].options[13] = new Option("Vocal 2 (4/4)", "66/24", config["liberLiveDrms" + i] == "66/24", config["liberLiveDrms" + i] == "66/24");					
		liberLiveDrums[i].options[14] = new Option("Vocal 3 (4/4)", "76/24", config["liberLiveDrms" + i] == "76/24", config["liberLiveDrms" + i] == "76/24");					
		liberLiveDrums[i].options[15] = new Option("Country (4/4)", "86/24", config["liberLiveDrms" + i] == "86/24", config["liberLiveDrms" + i] == "86/24");			
		liberLiveDrums[i].options[16] = new Option("Jazz (4/4)", "96/24", config["liberLiveDrms" + i] == "96/24", config["liberLiveDrms" + i] == "96/24");					
		liberLiveDrums[i].options[17] = new Option("Blues 1 (4/4)", "106/24", config["liberLiveDrms" + i] == "106/24", config["liberLiveDrms" + i] == "106/24");					
		liberLiveDrums[i].options[18] = new Option("Blues 2 (4/4)", "116/24", config["liberLiveDrms" + i] == "116/24", config["liberLiveDrms" + i] == "116/24");					
		liberLiveDrums[i].options[19] = new Option("Soul (4/4)", "126/24", config["liberLiveDrms" + i] == "126/24", config["liberLiveDrms" + i] == "126/24");			
		liberLiveDrums[i].options[20] = new Option("Waltz (3/4)", "82/28", config["liberLiveDrms" + i] == "82/28", config["liberLiveDrms" + i] == "82/28");					
	}
	
	liberLive.drums1 = config.liberLiveDrms1 || liberLive.drums1;

	liberLiveDrums[1].addEventListener("change", function()
	{
		liberLive.drums1 = liberLiveDrums[1].value;
		console.debug("selected liberlive drums1", liberLive.drums1, liberLiveDrums[1].value);				
		saveConfig();
		setLiberLiveDeviceSettings();
	});	
		
	liberLive.drums2 = config.liberLiveDrms2 || liberLive.drums2;
	
	liberLiveDrums[2].addEventListener("change", function()
	{
		liberLive.drums2 = liberLiveDrums[2].value;
		console.debug("selected liberlive drums2", liberLive.drums2, liberLiveDrums[2].value);				
		saveConfig();
		setLiberLiveDeviceSettings();
	});		
	
		
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
	
	const effectsPreset =  document.getElementById("effectsPreset");
	const guitarPosition = document.getElementById("guitarPosition");
	guitarPosition.selectedIndex = config.strumPos
	
	guitarStrum[1].addEventListener("change", function()
	{
		strum1 = guitarStrum[1].value;
		console.debug("selected guitar strum1", strum1, guitarStrum[1].value);				
		saveConfig();
	});		

	guitarStrum[2].addEventListener("change", function()
	{
		strum2 = guitarStrum[2].value;
		console.debug("selected guitar strum2", strum2, guitarStrum[2].value);				
		saveConfig();
	});	

	guitarStrum[3].addEventListener("change", function()
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
	guitarType.options[8] = new Option("JC Live", "0260_JCLive_sf2_file", config.guitarName == "0260_JCLive_sf2_file", config.guitarName == "0260_JCLive_sf2_file");	

	guitarType.addEventListener("change", function() {
		guitarStrum[1].style.display = "none";		
		guitarStrum[2].style.display = "none";		
		guitarStrum[3].style.display = "none";	
		guitarPosition.style.display = "none";
		effectsPreset.style.display = "none";
		
		guitarName = guitarType.value;
		
		if (guitarName != "none") {
			guitarStrum[1].style.display = "";		
			guitarStrum[2].style.display = "";		
			guitarStrum[3].style.display = "";	
			guitarPosition.style.display = "";	
			effectsPreset.style.display = "";
				
			if (guitarReverb.checked) {		

			} else {
		
			}	

			midiGuitar = window["_tone_" + guitarName];		
			player.loader.decodeAfterLoading(guitarContext, '_tone_' + guitarName);	
			enableSequencer(realGuitarStyle != "none");				
		}			
		console.debug("selected guitar", guitarName, guitarType.value);				
		saveConfig();
	});

	guitarName = config.guitarName || guitarName;
	
	if (guitarName == "none") {
		for (let i=1; i<4; i++) guitarStrum[i].style.display = "none";
		guitarPosition.style.display = "none";	
		effectsPreset.style.display = "none";
	}		
	
	if (guitarName != "none") 
	{			
		if (guitarReverb.checked) {		

		} else {
		
		}

		midiGuitar = window["_tone_" + guitarName];				
		player.loader.decodeAfterLoading(guitarContext, '_tone_' + guitarName);
		padsMode = config.padsMode || 3;
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
	handleRecordSong(arranger == "webaudio");	
	
	const midiInType = document.getElementById("midiInType");	
	midiInType.options[0] = new Option("Guitar Games Controller", "games-controller", config.inputDeviceType == "games-controller");		
	midiInType.options[1] = new Option("Orin Ayo Controller", "orinayo", config.inputDeviceType == "orinayo");		
	midiInType.options[2] = new Option("Artiphon Instrument 1", "instrument1", config.inputDeviceType == "instrument1");		
	midiInType.options[3] = new Option("Artiphon Chorda", "chorda", config.inputDeviceType == "chorda");
	midiInType.options[4] = new Option("LiberLive C1", "liberlivec1", config.inputDeviceType == "liberlivec1");
	midiInType.options[5] = new Option("Lava Genie", "lavagenie", config.inputDeviceType == "lavagenie");	
	
	let deviceIndex = 0;
	deviceIndex = config.inputDeviceType == "games-controller" ? 0 : deviceIndex;
	deviceIndex = config.inputDeviceType == "orinayo" ? 1 : deviceIndex;
	deviceIndex = config.inputDeviceType == "instrument1" ? 2 : deviceIndex;
	deviceIndex = config.inputDeviceType == "chorda" ? 3 : deviceIndex;	
	deviceIndex = config.inputDeviceType == "liberlivec1" ? 4 : deviceIndex;		
	deviceIndex = config.inputDeviceType == "lavagenie" ? 5 : deviceIndex;	
	midiInType.selectedIndex = deviceIndex;	
	
	inputDeviceType = config.inputDeviceType;
	
	if (inputDeviceType == "liberlivec1") {
		initLiberLive();	
		handleLiberLive(inputDeviceType == "liberlivec1");
		
	} else if (inputDeviceType == "lavagenie") {
		initLavaGenie();
		handleLavaGenie(inputDeviceType == "lavagenie");		
	}	
	
	midiInType.addEventListener("change", function()
	{
		inputDeviceType = midiInType.value;
		console.debug("selected midi device type", inputDeviceType, midiInType.value);				
		saveConfig();
		
		if (inputDeviceType == "liberlivec1") {
			handleLiberLive(inputDeviceType == "liberlivec1");
			
		} else if (inputDeviceType == "lavagenie") {
			handleLavaGenie(inputDeviceType == "lavagenie");		
		}
	});	

	setGigladUI();
   
	midiOut.options[0] = new Option("**UNUSED**", "midiOutSel");
	midiFwd.options[0] = new Option("**UNUSED**", "midiFwdSel");
	midiPads.options[0] = new Option("**UNUSED**", "midiPadsSel");	

	midiChordTracker.options[0] = new Option("**UNUSED**", "midiChordTrackerSel");
	midiIn.options[0] = new Option("**UNUSED**", "midiInSel");
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
		midiOut.options[i + 1] = new Option(WebMidi.outputs[i].name.trim(), WebMidi.outputs[i].name.trim(), outSelected, outSelected);

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
		midiFwd.options[i + 1] = new Option(WebMidi.outputs[i].name.trim(), WebMidi.outputs[i].name.trim(), fwdSelected, fwdSelected);

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

	if (!err) midiIn.addEventListener("change", function()
	{
		input = null;

		if (midiIn.value != "midiInSel") {
			input = WebMidi.getInputByName(midiIn.value);
			saveConfig();			
			console.debug("selected input midi port", input, midiIn.value);
		}
	});

	if (!err) midiOut.addEventListener("change", function()
	{
		midiOutput = null;

		if (midiOut.value != "midiOutSel") {
			midiOutput = WebMidi.getOutputByName(midiOut.value);
			saveConfig();			
			console.debug("selected midiOutput midi port", midiOutput, midiOut.value);
		}
	});
	
	if (!err) midiPads.addEventListener("change", function()
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

	if (!err) midiFwd.addEventListener("change", function()
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
	
	if (!err) midiChordTracker.addEventListener("change", function()
	{
		chordTracker = null;

		if (midiChordTracker.value != "midiChordTrackerSel") {
			chordTracker = WebMidi.getOutputByName(midiChordTracker.value);
			saveConfig();			
			console.debug("selected chordTracker midi port", chordTracker, midiChordTracker.value);
		}
	});

	
	arrangerType.addEventListener("change", function()
	{
		arranger = arrangerType.value;
		setGigladUI(); // reset. remove if no more giglad
		console.debug("selected arranger type", arranger, arrangerType.value);				
		saveConfig();
		handleRecordSong(arranger == "webaudio");
	});
	
	arrangerStyle.addEventListener("change", function()
	{
		arrSequence = null
		
		if (arrangerStyle.value != "arrangerStyle") {		
			arrSequence = {name: arrangerStyle.value};
		}
		saveConfig();			
	});	
	
	arrangerSf2.addEventListener("change", function()
	{
		arrSynth = null;
		if (arrangerSf2.value == "arrangerSf2") return;	
		
		arrSynth = {name: arrangerSf2.value};
		saveConfig();			
	});
	
	realguitar.addEventListener("change", function()
	{
		realGuitarStyle = realguitar.value;
		console.debug("selected realguitar style", realGuitarStyle, realguitar.value);				
		saveConfig();
	});

	songSeq.addEventListener("change", function()
	{
		songSequence = null;

		if (songSeq.value != "songSeq") {
			songSequence = {name: songSeq.value};			
			console.debug("selected song sequence", songSequence, songSeq.value);
		}
		saveConfig();		
	});	

	const guitarDevice = document.getElementById("inputAudioDevice");						
	const realDrumsDevice = document.getElementById("outputAudioDevice");	
	const realDrumsLoop = document.getElementById("realdrumLoop");	
	const realBassLoop = document.getElementById("realbassLoop");		
	const realChordsLoop = document.getElementById("realchordLoop");

	guitarDevice.options[0] = new Option("**UNUSED**", "guitarDevice", false, false);	
	realDrumsDevice.options[0] = new Option("**UNUSED**", "realDrumsDevice", false, false);
	realDrumsLoop.options[0] = new Option("**UNUSED**", "realDrumsLoop", false, false);		
	realBassLoop.options[0] = new Option("**UNUSED**", "realBassLoop", false, false);		
	realChordsLoop.options[0] = new Option("**UNUSED**", "realChordsLoop", false, false);
			
	for (var i=0; i<drum_loops.length; i++) {
		const drumLoop = drum_loops[i];
		let selectedDrum = false;	
		const loopData = drumLoop.substring(drumLoop.lastIndexOf("/") + 1).replace(".drum", "");
		const metaData = loopData.split("_");		
		const drumName = metaData[0] + " (" + metaData[1] + ")";			
		
		if (config.realDrum && config.realDrum == drumLoop) {
			if (!realInstrument) realInstrument = {};			
			selectedDrum = true;
			realInstrument.drum = metaData;				
			realInstrument.drumUrl = drumLoop;		
		}
		realDrumsLoop.options[i + 1] = new Option(drumName, drumLoop, selectedDrum, selectedDrum);
	}

	for (var i=0; i<bass_loops.length; i++) {
		const bassLoop = bass_loops[i];
		let selectedBass = false;	
		const loopData = bassLoop.substring(bassLoop.lastIndexOf("/") + 1).replace(".bass", "");
		const metaData = loopData.split("_");		
		const bassName = metaData[0] + " (" + metaData[1] + ")";		
		
		if (config.realBass && config.realBass == bassLoop) {
			if (!realInstrument) realInstrument = {};			
			selectedBass = true;
			realInstrument.bass = metaData;	
			realInstrument.bassUrl = bassLoop;				
		}
		realBassLoop.options[i + 1] = new Option(bassName, bassLoop, selectedBass, selectedBass);
	}
	
	for (var i=0; i<chord_loops.length; i++) {
		const chordLoop = chord_loops[i];
		let selectedChord = false;	
		const loopData = chordLoop.substring(chordLoop.lastIndexOf("/") + 1).replace(".chord", "");
		const metaData = loopData.split("_");		
		const chordName = metaData[0] + " (" + metaData[1] + ")";		
		
		if (config.realChord && config.realChord == chordLoop) {
			if (!realInstrument) realInstrument = {};			
			selectedChord = true;
			realInstrument.chord = metaData;	
			realInstrument.chordUrl = chordLoop;				
		}
		realChordsLoop.options[i + 1] = new Option(chordName, chordLoop, selectedChord, selectedChord);
	}

	let drumIndex = drum_loops.length + 1;
	let chordIndex = chord_loops.length + 1;
	let bassIndex = bass_loops.length + 1;
	
	indexedDB.databases().then(function (databases) 
	{
		databases.forEach(function (db) {				
			const loop = db.name;
			let selectedLoop = false;			
		
			if (db.name.toLowerCase().endsWith(".drum")) {
				selectedLoop = db.name == config.realDrum;
				const loopData = loop.replace(".drum", "");
				const metaData = loopData.split("_");		
				const drumName = metaData[0] + " (" + metaData[1] + ")";
				
				if (selectedLoop) {
					if (!realInstrument) realInstrument = {};					
					realInstrument.drum = metaData;				
					realInstrument.drumUrl = loop;	
				}

				realDrumsLoop.options[drumIndex++] = new Option("*" + drumName, loop, selectedLoop, selectedLoop);
			}
			else
				
			if (db.name.toLowerCase().endsWith(".chord")) {
				selectedLoop = db.name == config.realChord;
				const loopData = loop.replace(".chord", "");
				const metaData = loopData.split("_");		
				const chordName = metaData[0] + " (" + metaData[1] + ")";
				
				if (selectedLoop) {
					if (!realInstrument) realInstrument = {};
					realInstrument.chord = metaData;	
					realInstrument.chordUrl = loop;	
				}

				realChordsLoop.options[chordIndex++] = new Option("*" + chordName, loop, selectedLoop, selectedLoop);
			}
			else
				
			if (db.name.toLowerCase().endsWith(".bass")) {
				selectedLoop = db.name == config.realBass;
				const loopData = loop.replace(".bass", "");
				const metaData = loopData.split("_");		
				const bassName = metaData[0] + " (" + metaData[1] + ")";
				
				if (selectedLoop) {
					if (!realInstrument) realInstrument = {};
					realInstrument.bass = metaData;	
					realInstrument.bassUrl = loop;	
				}

				realBassLoop.options[bassIndex++] = new Option("*" + bassName, loop, selectedLoop, selectedLoop);
			}			
		})	
	});	
	

	realBassLoop.addEventListener("change", function() {
		if (styleStarted) return;		
		bassLoopChanged(realBassLoop);		
	});	
	
	realDrumsLoop.addEventListener("change", function() {
		if (styleStarted) return;		
		drumLoopChanged(realDrumsLoop);		
	});		

	realChordsLoop.addEventListener("change", function() {
		if (!realInstrument) realInstrument = {};		
		realInstrument.chord = null;
		realInstrument.chords = null;
		realInstrument.chordUrl = null;		
				
		if (realChordsLoop.value != "realChordsLoop") {
			realInstrument.chordUrl = realChordsLoop.value;				
			const loopData = realChordsLoop.value.replace(".chord", "");
			realInstrument.chord = loopData.split("_");			
			if (!styleStarted) setupRealInstruments();
			saveConfig();	

			createDrumList(config, realDrumsLoop, realChordsLoop);					
			createBassList(config, realBassLoop, realChordsLoop);			
		}
		
		console.debug("selected real chord loop", realInstrument, realChordsLoop.value);		
	});	

	console.debug("WebMidi devices", input, midiOutput, midiRealGuitar, chordTracker);
	
	if (guitarDevice.value != "guitarDevice") {	
		const audioMedia = await navigator.mediaDevices.getUserMedia({audio:true});
		audioMedia.getTracks().forEach( (track) => track.stop());				
	}
	
	const devices = await navigator.mediaDevices.enumerateDevices();
	const outputs = devices.filter(({ kind }) => kind === 'audiooutput');			
	const inputs = devices.filter(({ kind }) => kind === 'audioinput');

	for (var i=0; i<inputs.length; i++) 	{
		let selectedDevice = false;			
		
		if (config.guitarDeviceId && config.guitarDeviceId == inputs[i].deviceId) {
			selectedDevice = true;
			guitarDeviceId = inputs[i].deviceId;			
		}
		guitarDevice.options[i + 1] = new Option(inputs[i].label, inputs[i].deviceId, selectedDevice, selectedDevice);
	}
	
	guitarDevice.addEventListener("change", async function()
	{
		guitarDeviceId = null;

		if (guitarDevice.value != "guitarDevice") {
			const audioMedia = await navigator.mediaDevices.getUserMedia({audio:true});
			audioMedia.getTracks().forEach( (track) => track.stop());				
			const devices = await navigator.mediaDevices.enumerateDevices();
			const inputs = devices.filter(({ kind }) => kind === 'audioinput');
			
			for (let input of inputs) 
			{
				if (guitarDevice.value == input.deviceId) {
					guitarDeviceId = input.deviceId;
					saveConfig();					
					break;
				}						
			}
			console.debug("selected guitar device ", guitarDevice, guitarDevice.value);
		}
	});		
	
	for (var i=0; i<outputs.length; i++) 	{
		let selectedDevice = false;			
		
		if (config.realdrumDevice && config.realdrumDevice == outputs[i].deviceId) {
			selectedDevice = true;
			realdrumDevice = outputs[i];
			guitarContext.setSinkId(realdrumDevice.deviceId);
			audioContext.setSinkId(realdrumDevice.deviceId);			
		}
		realDrumsDevice.options[i + 1] = new Option(outputs[i].label, outputs[i].deviceId, selectedDevice, selectedDevice);
	}	

	realDrumsDevice.addEventListener("change", async function()
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
					guitarContext.setSinkId(realdrumDevice.deviceId);
					audioContext.setSinkId(realdrumDevice.deviceId);					
					setupRealInstruments();
					saveConfig();					
					break;
				}						
			}
			console.debug("selected real drums device ", realdrumDevice, realDrumsDevice.value);
		}
	});		


	registration = parseInt(config.registration || registration);
	orinayo_reg.innerHTML = "Slot " + registration;	
	if (registration) setTempo(config.tempo || tempo); 	
	
	if (input)
	{
		input.addListener('noteon', "all", function (e) {		
			//console.debug("Received 'noteon' message (" + e.note.name + " " + e.note.name + e.note.octave + ").", e.note, e);
			handleNoteOn(e.note, midiIn.value, e.velocity, e.channel);
			if (midiIn.value == "X-TOUCH MINI") handleXTouchNoteEvent(e);			
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
				
			} else {
				// CC 12 - Keyboard piano volume
				// CC 13 - Keyboard pads volume				
				// CC 1 - All Audio loops vol
				// CC 14 - prev variation
				// CC 15 - start/stop
				// CC 16 - next variation

				const keysSound1El = document.querySelector("#audio-vol-0");
				const keysSound2El = document.querySelector("#audio-vol-1");
				
				const drumEl = document.querySelector("#audio-vol-16");
				const bassEl = document.querySelector("#audio-vol-17");
				const chordEl = document.querySelector("#audio-vol-18");				
				
				if (e?.controller.number == 14 && e.value == 127) 
				{					
					if (midiNotes.size == 0) {
						sectionChange--;
						if (sectionChange < 0) sectionChange = 3;						
						changeArrSection(true);
					} else {
						doFill();
					}					
				}
				else
					
				if (e?.controller.number == 16 && e.value == 127) {

					if (midiNotes.size == 0) {
						sectionChange++;
						if (sectionChange > 3) sectionChange = 0;						
						changeArrSection(true);
					} else {
						doBreak();
					}					
				}
				else

				if (e?.controller.number == 15 && e.value == 127) {
					sectionChange = 0;				
					toggleStartStop();
				}
				else 

				if (e?.controller.number == 12) {
					if (keysSound1El) {
						keysSound1El.value = (e.value / 127) * 100;
						keysSound1Vol = keysSound1El.value;
					}
				}					
				else 

				if (e?.controller.number == 13) 
				{
					if (keysSound2El) {
						keysSound2El.value = (e.value / 127) * 100;
						keysSound2Vol = keysSound2El.value;						
					}						
				}
				else 

				if (e?.controller.number == 1) {
					setGuitarVolume(e.value);	
					
					if (drumLoop) {
						drumEl.value = (e.value / 127) * savedDrumVol;
						drumLoop.setVolume(drumEl.value / 100);
						drumVol = drumEl.value;
					}
					
					if (bassLoop) {
						bassEl.value = (e.value / 127) * savedBassVol;
						bassLoop.setVolume(bassEl.value / 100);
						bassVol = bassEl.value;
					}

					if (chordLoop) {
						chordEl.value = (e.value / 127) * savedChordVol;
						chordLoop.setVolume(chordEl.value / 100);
						chordVol = chordEl.value;
					}					
				}	

				if (midiIn.value == "X-TOUCH MINI") handleXTouchControlEvent(e);
			}
		});
		

		if (midiIn.value == "X-TOUCH MINI") {	
			resetXTouch();	

			if (registration && parseInt(registration) > 0 && midiOutput && midiOutput.name == "X-TOUCH MINI") {
				const slot = registration > 8 ? registration - 1 : registration;
				//setXTouchButton(slot, "flash");
			}					
		}			
	}									
	
	document.querySelector("#autoFill").checked = config.autoFill;	
	document.querySelector("#introEnd").checked = config.introEnd;
	
	guitarReverb.checked = config.reverb;
	setupPedalBoard(guitarContext, guitarName, guitarDeviceId, guitarReverb.checked);
	
	microphone.checked = config.microphone;	
	setupMicrophone();	
	document.querySelector("#program-change").checked = config.programChange;	
	document.querySelector("#volume").value = (config.guitarVolume || guitarVolume) * 100;
	
	enableSequencer((!!midiRealGuitar || guitarName != "none" ) && realGuitarStyle != "none");	

	if (config.songName) {	
		songSequence = {name: config.songName};
		getSongSequence(config.songName);		
	}

	window.tempConfig = config; // store config for later access

	if (config.arrName) {	
		arrSynth = {name: config.sf2Name};	
		getArrSequence(config.arrName, arrSequenceLoaded);	
		document.querySelector("#delete_style").style.display = "";		
	}
	else {

		if (arranger != "sff") {

			if (config.sf2Name) {
				arrSynth = {name: config.sf2Name};	
				getArrSynth(arrSynth.name);	// load sf2 file				
			} else {
				// use gmgsx.sf2 as dummy midiSynth
				loadMidiSynth();
				
				if (arranger != "webaudio") {
					playButton.innerText = "Play";				
					playButton.style.setProperty("--accent-fill-rest", "green");
				}
			}
			
			if (arranger == "webaudio" && realInstrument) {
				setupRealInstruments();				
			}			
		}			
		setupMidiChannels();		
	}	
};

function setGuitarVolume(value) {
	const guitarVol = document.querySelector("#volume");
	guitarVol.value = (value / 127) * (savedGuitarVolume * 100);					
	showVol.innerHTML = "Vol: " + guitarVol.value;	
	guitarVolume = guitarVol.value / 100;	
}

function bassLoopChanged(realBassLoop) {
	if (!realInstrument) realInstrument = {};		
	realInstrument.bass = null;
	realInstrument.basses = null;
	realInstrument.bassUrl = null;
	
	if (realBassLoop.value != "realBassLoop") {
		realInstrument.bassUrl = realBassLoop.value;		
		const loopData = realBassLoop.value.replace(".bass", "");
		realInstrument.bass = loopData.split("_");						
	}
	if (!styleStarted) setupRealInstruments();		
	saveConfig();		
	console.debug("selected real drums loop", realInstrument, realBassLoop.value);		
}

function drumLoopChanged(realDrumsLoop) {
	if (!realInstrument) realInstrument = {};		
	realInstrument.drum = null;
	realInstrument.drums = null;
	realInstrument.drumUrl = null;
	
	if (realDrumsLoop.value != "realDrumsLoop") {
		realInstrument.drumUrl = realDrumsLoop.value;		
		const loopData = realDrumsLoop.value.replace(".drum", "");
		realInstrument.drum = loopData.split("_");							
	}
	if (!styleStarted) setupRealInstruments();		
	saveConfig();	
	console.debug("selected real drums loop", realInstrument, realDrumsLoop.value);		
}

function createDrumList(config, realDrumsLoop, realChordsLoop) {
	realDrumsLoop.innerHTML = "";
	realDrumsLoop.options[0] = new Option("**UNUSED**", "realDrumsLoop");	
	realDrumsLoop.selectedIndex = 0;
	
	let s = 1;
	let selectedIndex = 1; // first style as default match
	
	for (var i=0; i<drum_loops.length; i++) {
		const drumLoop = drum_loops[i];
		let selectedDrum = false;	
		const styleName = realInstrument.chord[0].substring(realInstrument.chord[0].lastIndexOf("/") + 1);
		const loopData = drumLoop.substring(drumLoop.lastIndexOf("/") + 1).replace(".drum", "");		
		const metaData = loopData.split("_");		
		const drumName = metaData[0] + " (" + metaData[1] + ")";			

		if (realInstrument.chord[1] == metaData[1]) 
		{
			if (config.realDrum && config.realDrum == drumLoop) {
				if (!realInstrument) realInstrument = {};			
				selectedDrum = true;			
				realInstrument.drum = metaData;				
				realInstrument.drumUrl = drumLoop;		
			}
			if (styleName == metaData[0]) selectedIndex = s;	// same style name. best match						
			realDrumsLoop.options[s++] = new Option(drumName, drumLoop, selectedDrum, selectedDrum);			
		}
	}	
	
	if (s > 1) {
		realDrumsLoop.selectedIndex = selectedIndex;		
	}

	drumLoopChanged(realDrumsLoop);		
}

function createBassList(config, realBassLoop, realChordsLoop) {
	realBassLoop.innerHTML = "";
	realBassLoop.options[0] = new Option("**UNUSED**", "realBassLoop");	
	realBassLoop.selectedIndex = 0;		
	
	let s = 1;
	let selectedIndex = 1; // first style as default match
	
	for (var i=0; i<bass_loops.length; i++) {
		const bassLoop = bass_loops[i];
		let selectedBass = false;	
		const styleName = realInstrument.chord[0].substring(realInstrument.chord[0].lastIndexOf("/") + 1);
		const loopData = bassLoop.substring(bassLoop.lastIndexOf("/") + 1).replace(".bass", "");		
		const metaData = loopData.split("_");		
		const bassName = metaData[0] + " (" + metaData[1] + ")";			

		if (realInstrument.chord[1] == metaData[1]) 
		{
			if (config.realBass && config.realBass == bassLoop) {
				if (!realInstrument) realInstrument = {};			
				selectedBass = true;			
				realInstrument.bass = metaData;				
				realInstrument.bassUrl = bassLoop;		
			}
			if (styleName == metaData[0]) selectedIndex = s;	// same style name. best match						
			realBassLoop.options[s++] = new Option(bassName, bassLoop, selectedBass, selectedBass);			
		}
	}	
	
	if (s > 1) {
		realBassLoop.selectedIndex = selectedIndex;		
	}

	bassLoopChanged(realBassLoop);		
}

function createStyleList(config, arrangerStyle, arrangerGrp) {
	arrangerStyle.innerHTML = "";
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
	
	if (realInstrument) {
		setupRealInstruments()
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
	if (!document.getElementById("arr-instrument-18")) {
		setTimeout(setupMidiChannels, 1000);
		return;
	}
	
	for (let i=0; i<19; i++) {
		const box = document.getElementById("arr-instrument-" + i);
		if (box) box.checked = !!tempConfig["channel" + i];
	}	
	
	keysSound1 = document.getElementById("arr-instrument-0");
	keysSound2 = document.getElementById("arr-instrument-1");

	const keysSound1Ele = document.querySelector("#audio-vol-0");
	const keysSound2Ele = document.querySelector("#audio-vol-1");

	keysSound1Ele.value = keysSound1Vol;
	keysSound2Ele.value = keysSound2Vol;	

	keysSound1Ele.addEventListener("input", function(event) {
		keysSound1Vol = +event.target.value; 			
	});

	keysSound2Ele.addEventListener("input", function(event) {
		keysSound2Vol = +event.target.value; 			
	});
	
	document.querySelector("#audio-vol-16").addEventListener("input", function(event) {
		drumVol = +event.target.value; 
		savedDrumVol = drumVol;			
		if (drumLoop) drumLoop.setVolume(drumVol / 100);			
	});

	document.querySelector("#audio-vol-17").addEventListener("input", function(event) {
		bassVol = +event.target.value; 
		savedBassVol = bassVol;	
		if (bassLoop) bassLoop.setVolume(bassVol / 100);			
	});
	
	document.querySelector("#audio-vol-18").addEventListener("input", function(event) {
		chordVol = +event.target.value; 
		savedChordVol = chordVol;			
		if (chordLoop) chordLoop.setVolume(chordVol / 100);			
	});	
	
	delete window.tempConfig;	
}

function getSongSequence(songName, callback) {
	console.debug("getSongSequence", songName, styleStarted );

	if (songName.startsWith("assets/songs/")) {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', escape(songName), true);
		xhr.responseType = 'arraybuffer';

		xhr.addEventListener('load', function(ev) {
			const data = new Uint8Array(ev.target.response);
			console.debug("getSongSequence", songName, data);

			songSequence = parseMidi(data, songName);	
			songSequence.name = songName;	

			setupSongSequence();			
			if (callback) callback();							
		});

		xhr.send();			
		
	} else {
		const dbName = songName.substring(0);
		const store = new idbKeyval.Store(dbName, dbName);		

		idbKeyval.get(dbName, store).then(function (raw) 
		{
			if (raw) {
				const data = new Uint8Array(raw);				
				console.debug("getSongSequence", dbName, data);
				songSequence = parseMidi(data, dbName);	
				songSequence.name = songName;	
				
				setupSongSequence();
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
	config.guitarVolume = savedGuitarVolume;
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
	config.realDrum = realInstrument?.drumUrl;	
	config.realChord = realInstrument?.chordUrl;	
	config.realBass = realInstrument?.bassUrl;	
	config.realdrumDevice = realdrumDevice ? realdrumDevice.deviceId : null;
	config.guitarDeviceId = guitarDeviceId;
	config.songName = songSequence ? songSequence.name : null;
	config.arrName = arrSequence ? arrSequence.name : null;
	config.sf2Name = arrSynth ? arrSynth.name : null;
	config.arrangerGroup = arrangerGroup;
	config.rgIndex = rgIndex;
	config.autoFill = document.querySelector("#autoFill").checked;
	config.introEnd = document.querySelector("#introEnd").checked;
	config.reverb = guitarReverb.checked;
	config.microphone = microphone.checked;
	config.programChange = document.querySelector("#program-change").checked;
	config.strumPos = document.getElementById("guitarPosition").selectedIndex;
	config.liberLiveChrd1 = liberLive.chord1;
	config.liberLiveChrd2 = liberLive.chord2;
	config.liberLiveDrms1 = liberLive.drums1;
	config.liberLiveDrms2 = liberLive.drums2;
	config.drumVol = savedDrumVol;
	config.chordVol = savedChordVol;
	config.bassVol = savedBassVol;
	config.keysSound1Vol = keysSound1Vol;
	config.keysSound2Vol = keysSound2Vol;
	
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

	if (((drumLoop || chordLoop) && realInstrument) && document.getElementById("arr-instrument-16")?.checked) 	
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
	console.debug("doFill " + arranger);
	
	
	if (realInstrument && document.getElementById("arr-instrument-16")?.checked) {
		console.debug("doFill webaudio", sectionChange);
		
		if (drumLoop && sectionChange == 0) drumLoop.update('fila', false);
		if (drumLoop && sectionChange == 1) drumLoop.update('filb', false);
		if (drumLoop && sectionChange == 2) drumLoop.update('filc', false);
		if (drumLoop && sectionChange == 3) drumLoop.update('fild', false);
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

function stopSynthNote(note, channel, velocity) {
	const eventTypeByte = 0x80 | channel;
	const evt = {data: "midi," + eventTypeByte + "," + note + "," + velocity}
	arrSynth.onmessage(evt);	
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
					stopSynthNote(note, 1, getVelocity() * 127);
				}
				
				stopSynthNote(firstChord[0] + 12, 1, getVelocity() * 127);		
				stopSynthNote(firstChord[0] - 12, 1, getVelocity() * 127);						
							
			} else {
				stopSynthNote(firstChord, 1, getVelocity() * 127);
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
	let velocity = appliedVelocity;
	if (velocity == 0) velocity = 0.5 + (Math.random() * 0.5);
	return velocity;
}

function getPitches(seq) {
	const pos = parseInt(document.getElementById("guitarPosition").value);
	__6th = E +O*(pos+2), __5th = A +O*(pos+2), __4th = D +O*(pos+2), __3rd = G +O*(pos+2), __2nd = B +O*(pos+2), __1st = E +O*(pos+3);	
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

function playSynthNote(note, channel, velocity) {
	const eventTypeByte = 0x90 | channel;
	const evt = {data: "midi," + eventTypeByte + "," + note + "," + velocity}
	arrSynth.onmessage(evt);	
}

function playPads(chords, opts) {
	console.debug("playPads", chords, opts);
	
	if (!styleStarted || realGuitarStyle != "none") 
	{	
		if (!padsInitialised) {
			padsInitialised = true;
			if (padsDevice?.name == "soundfont") sendProgramChange({programNumber: 89, channel: 1});	// warm pad sound
		}
		
		if (arrSynth?.onmessage && padsDevice?.name == "soundfont") 
		{
			if (chords instanceof Array) 
			{
				for (note of chords) {
					playSynthNote(note, 1, opts.velocity * 127);
				}
				
			} else {
				playSynthNote(chords, 1, opts.velocity * 127);
			}			
		} 
		else 
		
		if (padsDevice?.playNote) {
			padsDevice.playNote(chords, 2, opts);			
		}
	}
}

function playChord(chord, root, type, bass) {	
	console.debug("playChord", chord, root, type, bass);

	const guitarPosition = document.getElementById("guitarPosition").selectedIndex;	
	const guitarDuration = 240 / tempo; 
	const bassNote = (chord.length == 4 ? chord[0] : chord[0] - 12);
	const rootNote = (chord.length == 4 ? chord[0] : chord[0] - 12) + (guitarPosition * 12);	
	const firstNote = (chord.length == 4 ? chord[1] : chord[0]);	
	const thirdNote = (chord.length == 4 ? chord[2] : chord[1]);	
	const fifthNote = (chord.length == 4 ? chord[3] : chord[2]);
	
	firstChord = chord;
	arrChordType = (type == 0x20 ? "sus" : (type == 0x08 ? "min" : (type == 0x13 ? "maj7" : "maj")));	
	
	if (!activeChord) {
		const arrChord = (firstChord.length == 4 ? firstChord[1] : firstChord[0]) % 12;
		const key = "key" + arrChord + "_" + arrChordType + "_" + SECTION_IDS[sectionChange];
		const bassKey = "key" + (bassNote % 12) + "_" + arrChordType + "_" + SECTION_IDS[sectionChange];

		if (guitarName != "none" && !guitarDeviceId) 
		{	
			if (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN)	
			{
				if (padsMode == 1) {
					if (pad.axis[STRUM] == STRUM_UP) player.queueStrumUp(guitarContext, guitarSource, midiGuitar, 0, getPitches(), guitarDuration, guitarVolume, undefined, guitarReverb.checked);
					if (pad.axis[STRUM] == STRUM_DOWN) player.queueStrumDown(guitarContext, guitarSource, midiGuitar, 0, getPitches(), guitarDuration, guitarVolume, undefined, guitarReverb.checked);
				}		
				else
					
				if (padsMode == 2) {
					if (pad.axis[STRUM] == STRUM_UP) player.queueStrumUp(guitarContext, guitarSource, midiGuitar, 0, getPitches(), guitarDuration, guitarVolume / 2, undefined, guitarReverb.checked);
					if (pad.axis[STRUM] == STRUM_DOWN) 	player.queueWaveTable(guitarContext, guitarSource, midiGuitar, 0, bassNote, guitarDuration, guitarVolume, undefined, guitarReverb.checked);
				}	
				else
					
				if (padsMode == 3 || padsMode == 4 || padsMode == 5) {			
					const guitarSeq = window["strum" + (padsMode - 2)].split("-"); 
					
					if (seqIndex >= guitarSeq.length) seqIndex = 0;						
					const arpChord = guitarSeq[seqIndex];												
					//console.debug("playChord arps", arpChord, seqIndex, getPitches(arpChord), rootNote, guitarSeq);				
					
					if (arpChord) 
					{				
						if (pad.axis[STRUM] == STRUM_UP) 
						{
							if (arpChord.startsWith("B")) {
								player.queueWaveTable(guitarContext, guitarSource, midiGuitar, 0, bassNote, guitarDuration, guitarVolume, undefined, guitarReverb.checked);
							} else {						
								player.queueStrum(guitarContext, guitarSource, midiGuitar, 0, getPitches(arpChord), guitarDuration, guitarVolume, undefined, guitarReverb.checked);							
							}							
						}
						else
							
						if (pad.axis[STRUM] == STRUM_DOWN) {
							player.queueWaveTable(guitarContext, guitarSource, midiGuitar, 0, arpChord.startsWith("B") ? bassNote : rootNote, guitarDuration, guitarVolume, undefined, guitarReverb.checked);				
						}
						
						seqIndex++;
						if (seqIndex >= guitarSeq.length) seqIndex = 0;							
					}
				}
			}
		}

		if (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN)	{
			const drumChecked = document.getElementById("arr-instrument-16")?.checked;
			const bassChecked = document.getElementById("arr-instrument-17")?.checked;
			const chordChecked = document.getElementById("arr-instrument-18")?.checked;
			
			if (padsDevice?.stopNote || padsDevice?.name == "soundfont") {
				//console.debug("playChord pads", chord);
			
				if (padsMode == 1) {
					if (pad.axis[STRUM] == STRUM_UP) playPads(rootNote, {velocity: getVelocity()});		// up root
					if (pad.axis[STRUM] == STRUM_DOWN) playPads(rootNote, {velocity: getVelocity()});   // down	root				
				}		
				else
					
				if (padsMode == 2) {
					if (pad.axis[STRUM] == STRUM_DOWN) playPads(chord, {velocity: getVelocity()});		// down chord
					if (pad.axis[STRUM] == STRUM_UP) playPads(rootNote, {velocity: getVelocity()});     // up	root				
				}	
				else
					
				if (padsMode == 3) {
					if (pad.axis[STRUM] == STRUM_UP) playPads(thirdNote, {velocity: getVelocity()});	// up third
					if (pad.axis[STRUM] == STRUM_DOWN) playPads(rootNote, {velocity: getVelocity()});   // down	root				
				}
				else
					
				if (padsMode == 4) {
					if (pad.axis[STRUM] == STRUM_UP) playPads(fifthNote, {velocity: getVelocity()});	// up fifth
					if (pad.axis[STRUM] == STRUM_DOWN) playPads(rootNote, {velocity: getVelocity()});   // down	root				
				}
				else
					
				if (padsMode == 5) {
					if (pad.axis[STRUM] == STRUM_UP) playPads(chord, {velocity: getVelocity()});		// up chord
					if (pad.axis[STRUM] == STRUM_DOWN) playPads(chord, {velocity: getVelocity()});   	// down	chord				
				}			
			}
			
			if (styleType.innerText == "Normal" && (styleStarted  || (arranger != "aeroslooper" && arranger != "rclooper"))) {		
				console.debug("playChord output", chord, key, bassKey);
									
				if (chordTracker) {		
					const trasposedRoot = transposeNote(root);
					const transposedBass = transposeNote(bass);
					chordTracker.sendSysex(0x43, [0x7E, 0x02, trasposedRoot, type, transposedBass, type]);				
				}
				
				if (arranger == "webaudio" && realInstrument && styleStarted) {				
					if (bassLoop && bassChecked) bassLoop.update(bassKey, false);
					if (chordLoop && chordChecked) chordLoop.update(key, false);		
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
						if (realInstrument) {				
							if (bassLoop && bassChecked) bassLoop.update(bassKey, false);
							if (chordLoop && chordChecked) chordLoop.update(key, false);		
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
						} else {
							forwardChord = [];
							if (pad.buttons[GREEN]) forwardChord.push(127);						
							if (pad.buttons[RED]) forwardChord.push(126);
							if (pad.buttons[YELLOW]) forwardChord.push(125);						
							if (pad.buttons[BLUE]) forwardChord.push(124);
							if (pad.buttons[ORANGE]) forwardChord.push(123);
							if (pad.axis[STRUM] == STRUM_UP) forwardChord.push(122);								
							if (pad.axis[STRUM] == STRUM_DOWN) forwardChord.push(121);						
							
							if (forwardChord.length > 0) midiRealGuitar.playNote(forwardChord, 1, {velocity: getVelocity()});							
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
		
	if (arranger == "webaudio" && realInstrument) {
		if (code == 7 && drumLoop?.gainNode) drumLoop.muteToggle();
		if (code == 6 && chordLoop?.gainNode) chordLoop.muteToggle();		
		if (code == 6 && bassLoop?.gainNode) bassLoop.muteToggle();	
		if (code == 9 && chordLoop?.gainNode) chordLoop.muteToggle();		
		if (code == 8 && bassLoop?.gainNode) bassLoop.muteToggle();		
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
			if (guitarName != "none" && !guitarDeviceId) player.cancelQueue(guitarContext);
			
			if (!guitarAvailable && midiRealGuitar) 
			{
				if (gamePadModeButton.innerText != "Color Tabs") {					
					midiRealGuitar.stopNote(activeChord, 1);
				} else if (forwardChord) {
					midiRealGuitar.stopNote(forwardChord, 1);
					forwardChord = null;					
				}
			}			
			
			activeChord = null;
		}	   
	}
}

function playSectionCheck() {
	//console.debug("playSectionCheck", sectionChange);
	
	let arrChanged = false;
	const oldSection = sectionChange;
				
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
			
		} else {	// guitar - do nothing with style
			return;
		}		
	}	
	
	arrChanged = oldSection != sectionChange;	
	if (realGuitarStyle == "none" && styleStarted) changeArrSection(arrChanged);		

	if (window[realGuitarStyle]) {
		orinayo_strum.innerHTML = ">Strum " + (nextRgIndex + 1) + "/" + window[realGuitarStyle].length;	
	}
	
	if (padsDevice?.playNote) padsDevice.sendControlChange(105 + sectionChange, 127, 2);		
	
	orinayo_section.innerHTML = SECTIONS[sectionChange];
}

function changeArrSection(changed) {	
	
	if (arranger == "webaudio") {
		const autoFill = document.querySelector("#autoFill").checked;	
				
		if (realInstrument && drumLoop && document.getElementById("arr-instrument-16")?.checked) {
			console.debug("changeArrSection pressed " + changed, sectionChange);		
			orinayo_section.innerHTML = ">" + orinayo_section.innerHTML;	
			
			if (sectionChange == 0) drumLoop.update(!changed || !autoFill ? 'arra': 'fila', false);
			if (sectionChange == 1) drumLoop.update(!changed || !autoFill ? 'arrb': 'filb', false);
			if (sectionChange == 2) drumLoop.update(!changed || !autoFill ? 'arrc': 'filc', false);
			if (sectionChange == 3) drumLoop.update(!changed || !autoFill ? 'arrd': 'fild', false);		
		}
	}
	else
		
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
	if (padsDevice?.playNote) padsDevice.sendControlChange(104, keyChange, 2);	
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
	  
	  if (guitarName != "none" && !guitarDeviceId && (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN) && padsMode != 0 && padsMode != 3 && padsMode != 4 && padsMode != 5) {
		const arrChord = (firstChord.length == 4 ? firstChord[1] : firstChord[0]) % 12;
		const guitarDuration = 240 / tempo;
		player.queueSnap(guitarContext, guitarSource, midiGuitar, 0, getPitches(), guitarDuration, guitarVolume/4, undefined, guitarReverb.checked);					  
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
	
		if (pad.buttons[YELLOW] && pad.buttons[BLUE]) { // Guitar position C3
 			document.getElementById("guitarPosition").selectedIndex = 2;			
		}
		else 
			
		if (pad.buttons[GREEN] && pad.buttons[RED]) { // Guitar position C4
			document.getElementById("guitarPosition").selectedIndex = 0;
		}
		
		else 
			
		if (pad.buttons[RED] && pad.buttons[YELLOW]) { // Guitar postion C5
			document.getElementById("guitarPosition").selectedIndex = 1;			
		}
		else 
			
		if (pad.buttons[BLUE] && pad.buttons[ORANGE]) { // mute internal guitar
			padsMode = 0;
			seqIndex = 0;
			orinayo_pad.innerHTML = "None";			
		} 
		else {		
			if (pad.buttons[GREEN]) padsMode = 1;	// full chord up/down
			if (pad.buttons[RED]) padsMode = 2;		// chord up/root note down	
			if (pad.buttons[YELLOW]) padsMode = 3;	// root note up/down
			if (pad.buttons[BLUE]) padsMode = 4;	// 3rd note up/root note down
			if (pad.buttons[ORANGE]) padsMode = 5;	// 5th note up/root note down
			
			if (padsMode != 0) orinayo_pad.innerHTML = "Pad " + padsMode;		
		}			
	}
	
	playSectionCheck();

  }

  if (pad.buttons[LOGO])
  {
	if (pad.buttons[YELLOW] && pad.buttons[BLUE]) {	
		styleStarted = false;	
		resetArrToA();
		playButton.innerText = !styleStarted ? "Play" : "Stop";	
		playButton.style.setProperty("--accent-fill-rest", !styleStarted ? "green" : "red");		
		
	} else {		
		if (handledStartStop) 
		{		
			if (arranger == "webaudio" && realInstrument) {
				
				if (drumLoop || chordLoop || bassLoop) {
					toggleStartStop();
				} else {
					setupRealInstruments();	
				}
			} else {
				toggleStartStop();					
			}
		}			
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

function startStopWebAudio() {
	let gapTime = 0.5;
	
	console.debug("startStopWebAudio", styleStarted, pad.buttons[YELLOW]);
	const drumChecked = document.getElementById("arr-instrument-16");
	const bassChecked = document.getElementById("arr-instrument-17");
	const chordChecked = document.getElementById("arr-instrument-18");

	drumChecked.addEventListener("click", function(event) {
		pressFootSwitch(7);
	});

	bassChecked.addEventListener("click", function(event) {
		pressFootSwitch(8);		
	});
	
	chordChecked.addEventListener("click", function(event) {
		pressFootSwitch(9);		
	});
	
	if (!styleStarted) {
		if (recordMode) startRecording();				
		if (!registration) setTempo(realInstrument.bpm);	
		const goTime = audioContext.currentTime + gapTime;				

		if (songSequence) {
			orinayo_section.innerHTML = ">Arr A";					
			if (drumLoop && drumChecked?.checked) drumLoop.start('arra', goTime);
			if (bassLoop && bassChecked?.checked) bassLoop.start("key" + (keyChange % 12), goTime);
			if (chordLoop && chordChecked?.checked) chordLoop.start("key" + (keyChange % 12), goTime);
				
		} else {
			if ((pad.buttons[YELLOW] || midiNotes.size > 2) && introEnd && drumLoop) {		// intro requires drumbeat			
				orinayo_section.innerHTML = ">Arr A";
										
				if (drumLoop && drumChecked?.checked) {
					drumLoop.start('int1', goTime);					
				
					setTimeout(() => {
						if (bassLoop && bassChecked?.checked) bassLoop.start("key" + (keyChange % 12), goTime + (realInstrument.drums.int1.stop / 1000));
						if (chordLoop && chordChecked?.checked) chordLoop.start("key" + (keyChange % 12), goTime + (realInstrument.drums.int1.stop / 1000));			
					}, realInstrument.drums.int1.stop);
				}
			} else {
				if (drumLoop && drumChecked?.checked) drumLoop.start('arra', goTime);						
				if (bassLoop && bassChecked?.checked) bassLoop.start("key" + (keyChange % 12), goTime);
				if (chordLoop && chordChecked?.checked) chordLoop.start("key" + (keyChange % 12), goTime);							
			}
			
		}
		
	} else {
		if ((pad.buttons[YELLOW] || midiNotes.size > 2) && introEnd) {	
			orinayo_section.innerHTML = ">End 1";					
			if (drumLoop) drumLoop.update('end1', false);	
		} else {
			orinayo_section.innerHTML = "End 1";						
			if (drumLoop) drumLoop.stop();
		}
		
		if (bassLoop) bassLoop.stop();			
		if (chordLoop) chordLoop.stop();

		if (recordMode) setTimeout(stopRecording, 20000);				
	}

	return gapTime;
}

function toggleStartStop() {
	console.debug("toggleStartStop", styleStarted);
	audioContext.resume();
	
	handledStartStop = false;
	if (!styleStarted) resetArrToA();
		
	if (((midiRealGuitar || guitarName != "none") && realGuitarStyle != "none" && window[realGuitarStyle]) || songSequence || (arrSequence && arranger == "sff")) 
	{
		if (playButton.innerText != "On") {
			startStopSequencer();

			if (songSequence || arranger == "sff") {
				handledStartStop = true;				
				return;	
			}				
		}			
	}
	
	const introEnd = document.querySelector("#introEnd")?.checked;	
		
	if (arranger == "webaudio") {				
		if ((drumLoop || chordLoop) && realInstrument) {
			startStopWebAudio();
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

		orinayo_section.innerHTML = SECTIONS[sectionChange];			
	}	

	playButton.innerText = !styleStarted ? "Play" : "Stop";
	playButton.style.setProperty("--accent-fill-rest", !styleStarted ? "green" : "red");
	if (midiOutput?.name == "X-TOUCH MINI" && !styleStarted) resetXTouch();	
	handledStartStop = true;
}

function updateCanvas() {
	canvas.context.fillStyle = "#080018";
    canvas.context.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);
    canvas.context.strokeStyle = "#000000";
    canvas.context.strokeRect(0, 0, canvas.gameWidth, canvas.gameHeight);
	game.update();
}

async function setup() {
	var gameCanvas = document.getElementById('gameCanvas');
	gameCanvas.width = window.innerWidth  * 0.88;
	canvas.context = gameCanvas.getContext('2d');
	canvas.gameWidth = gameCanvas.width;
	canvas.gameHeight = gameCanvas.height;

	if (!game) {
		game = new GameBoard(canvas.context, canvas.gameWidth / 4, 0,  canvas.gameWidth / 2, canvas.gameHeight);
		document.addEventListener("pointerlockchange", lockChangeAlert, false);

		if (inputDeviceType == "orinayo") 
		{
		  if (!document.pointerLockElement) {
			await document.body.requestPointerLock({
			  unadjustedMovement: true,
			});
		  } 
		}
	}
}

function lockChangeAlert() {
  if (document.pointerLockElement === document.body) {
    console.debug("The pointer lock status is now locked");
	lock = {counter: 0, up: 0, down: 0, button: -1};
    document.body.addEventListener("mousemove", updatePosition, false);
    document.body.addEventListener("mousedown", updateButton, false); 	

  } else {
	lock = {counter: 0, up: 0, down: 0, button: -1};
    console.debug("The pointer lock status is now unlocked");
    document.body.removeEventListener("mousemove", updatePosition, false); 
    document.body.removeEventListener("mousedown", updateButton, false); 
  }
}

function updateButton(e) {
	let handled = false;
	lock.button = e.buttons;
	console.debug("updateButton", e.buttons);	
	
	if (e.buttons == 3) {
		pad.buttons[LOGO] = true;
		if (keyboard.get("4")) pad.buttons[YELLOW] = true; 
		handled = true;				
	}
	else

	if (e.buttons == 2) {
		pad.buttons[START] = true;
		handled = true;				
	}
	else

	if (e.buttons == 1) {
		pad.buttons[STARPOWER] = true;
		handled = true;				
	}		
	
	if (handled) {
		doChord();
		updateCanvas();			
		resetGuitarHero();	
	}	
}

function updatePosition(e) {
	lock.counter++;
	
	if (e.movementY > 0) lock.down++;
	if (e.movementY < 0) lock.up++;
	
	if (lock.counter > 50) {
		console.debug("updatePosition", lock.down > lock.up ? "DOWN" : "UP");
		
		lock = {counter: 0, up: 0, down: 0, button: -1};		
		pad.axis[STRUM] = lock.down > lock.up ? STRUM_DOWN : STRUM_UP;	

		doChord();
		updateCanvas();			
		resetGuitarHero();	
	}
}

function enableSequencer(flag) {
	
	//document.querySelector("#sequencer").style.display = flag ? "" : "none";
	//document.querySelector("#sequencer2").style.display = flag ? "" : "none";	
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
	console.debug("startStopSequencer", styleStarted, songSequence);

	if (songSequence) 
	{
		if (!styleStarted) 	
		{		
			if (!unlocked && arranger == "sff") {
			  // play silent buffer to unlock the audio
			  var buffer = audioContext.createBuffer(1, 1, 22050);
			  var node = audioContext.createBufferSource();
			  node.buffer = buffer;
			  node.start(0);
			  unlocked = true;
			}
			
			if (songSequence.data?.music) {
				doStartStopSequencer();				
			} else {
				getSongSequence(songSequence.name, doStartStopSequencer);				
			}

		} else {
			if (timerWorker) timerWorker.postMessage("stop");	
			notesInQueue = []; 
			doStartStopSequencer();	
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
	const programChannel = document.getElementById("midi-channel-" + channel);
	
	if (programChannel && document.querySelector("#program-change")?.checked) {
		event.programNumber = programChannel.selectedIndex;	
	}
		
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
	let syncGap = 0;
	
	if (arranger == "webaudio" && songSequence) {
		syncGap = startStopWebAudio() + (songSequence.data.Hdr.setTempo.microsecondsPerBeat / 1000);	
	}
	
	if (!styleStarted) 	
	{
		if (arrSequence && realGuitarStyle == "none") 
		{	
			if (requestArrEnd) {
				requestArrEnd = false;
				styleStarted = !styleStarted;	
				playButton.innerText = !styleStarted ? "Play" : "Stop";	
				playButton.style.setProperty("--accent-fill-rest", !styleStarted ? "green" : "red");	
				orinayo_section.innerHTML = currentSffVar;	
				endAudioStyle();
				return;
			}
			
			doSffSInt();	

			const introEnd = document.querySelector("#introEnd")?.checked;

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
		
        if (timerWorker) setTimeout(() => timerWorker.postMessage("start"), syncGap);
	} else {		
		requestArrEnd = true;
		requestedEnd = "Ending A";
		
		if (pad.buttons[BLUE]) requestedEnd = "Ending B";	
		if (pad.buttons[ORANGE]) requestedEnd = "Ending C";		

		orinayo_section.innerHTML = "Ending";	
			
		if (arrSequence && realGuitarStyle == "none") {

		} else {
			endAudioStyle();			
			
			if (timerWorker) timerWorker.postMessage("stop");	
			notesInQueue = []; 
		}		
	}

	styleStarted = !styleStarted;	
	playButton.innerText = !styleStarted ? "Play" : "Stop";		
	playButton.style.setProperty("--accent-fill-rest", !styleStarted ? "green" : "red");		
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
		const beat = pattern?.next();
		
		if (beat) {
			const strumDuration = beat.duration * 60 / tempo / 4;
			const arrChord = (firstChord.length == 4 ? firstChord[1] : firstChord[0]) % 12;

			if (beat.element == _V){
				player.queueStrumDown(guitarContext, guitarContext.destination, midiGuitar, 0, getPitches(), strumDuration, guitarVolume / 3, undefined, guitarReverb.checked);				
			}
			else

			if (beat.element == _A){
				player.queueStrumUp(guitarContext, guitarContext.destination, midiGuitar, 0, getPitches(), strumDuration, guitarVolume / 3, undefined, guitarReverb.checked);				
			} 
			else
				
			if (beat.element == _X){
				player.queueSnap(guitarContext, guitarContext.destination, midiGuitar, 0, getPitches(), strumDuration, guitarVolume / 3, undefined, guitarReverb.checked);								
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

		const introEnd = document.querySelector("#introEnd")?.checked;
			
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
	console.debug("endAudioStyle");
	
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
		const lyricsContext = lyricsCanvas.getContext('2d');			
		const event = songSequence.data.music[currentSongNote];	
		console.debug("scheduleSongNote", event);		
		
		if (event?.sysexType == "section-control") {
			console.debug("scheduleSongNote section control", event.section);
					
			if (event.section == 0x08) {
				 sectionChange = 0; 
				 changeArrSection(true);	
				 clearLyrics(lyricsContext);					 
			}
			else 
				
			if (event.section == 0x09) {
				sectionChange = 1;
				changeArrSection(true);	
				clearLyrics(lyricsContext);					
			}			
			else 
				
			if (event.section == 0x0A) {
				sectionChange = 2;
				changeArrSection(true);	
				clearLyrics(lyricsContext);					
			}	
			else 
				
			if (event.section == 0x0B) {
				sectionChange = 3;
				changeArrSection(true);
				clearLyrics(lyricsContext);	
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
				pad.axis[STRUM] = isStrumUp ? STRUM_UP : STRUM_DOWN;			
				isStrumUp = !isStrumUp;
				orinayo.innerHTML = displayShape;	

				if (!game) {
					setup();
					resetGuitarHero();
				}				
				playChord(chord, event.chordRoot,  event.chordType, event.chordBass);
				//updateCanvas();				
			}
		}
		else
			
		if (event?.sysexType == "start-sequence") {
			console.debug("scheduleSongNote - start-sequence", event);	
			clearLyrics(lyricsContext);				
		}
		else
			
		if (event?.sysexType == "stop-sequence") {
			console.debug("scheduleSongNote - stop-sequence", event);								
		}			
		else
			
		if (event.type == "lyrics") {
			console.debug("scheduleSongNote lyrics", event.text);
			
			if (lyricsCanvas.style.display == "none") {			
				const cntrl = document.getElementById("lyrics");
				let lyrics = cntrl.innerHTML + event.text;
				
				if (cntrl.innerHTML.length > 80) {
					lyrics = event.text;
				}

				cntrl.innerHTML = lyrics;
			}
			else {
				lyricsContext.font = "14px Arial";				
				const width = lyricsContext.measureText(event.text).width;
				
				if ((lyricsX + width) >= lyricsCanvas.width) {
					lyricsX = 2;
					lyricsY = lyricsY + 18;					
				}
				
				if (lyricsY > lyricsCanvas.height) {
					clearLyrics(lyricsContext);				
				}

				lyricsContext.fillStyle = "#ffffff";
				lyricsContext.fillText(event.text, lyricsX, lyricsY);				
				lyricsX = lyricsX + width;	
			}						
		}			
	}
}

function clearLyrics(lyricsContext) {
	lyricsX = 2;					
	lyricsY = 18;
	lyricsContext.fillStyle = "#000000";
	lyricsContext.fillRect(0, 0, lyricsCanvas.width, lyricsCanvas.height);		
}

function scheduleArrNote() {
	
	if (arrSequence) {
		let event = arrSequence.data[currentSffVar][currentPlayNote];
		//console.debug("scheduleSongNote", event);

		const secondsPerBeat = 60.0 / tempo; 
		const beatTime = (0.25 * secondsPerBeat); 		
		const goTime = audioContext.currentTime + beatTime;
			
		if (drumLoop && !drumLoop.looping && document.getElementById("arr-instrument-16")?.checked) {
			drumLoop.start("arra", goTime);
		}	

		if (bassLoop && !bassLoop.looping && document.getElementById("arr-instrument-17")?.checked) {
			bassLoop.start("key" + (keyChange % 12), goTime);
		}
		
		if (chordLoop && !chordLoop.looping && document.getElementById("arr-instrument-18")?.checked) {
			chordLoop.start("key" + (keyChange % 12), goTime);
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
	
	if (songSequence?.data) {
		console.debug("setupSongSequence", flag, songSequence);	
		
		playButton.innerText = "Wait..";
		playButton.style.setProperty("--accent-fill-rest", "red");
		const bpm = Math.floor(60 /(songSequence.data.Hdr.setTempo.microsecondsPerBeat / 1000000))
		if (!registration) setTempo(bpm);	
	} 
	else
		
	if (arrSequence?.data?.Hdr) {
		
		if (realInstrument) {
			if (!registration) setTempo(realInstrument.bpm);	
		} else {
			const bpm = Math.floor(60 /(arrSequence.data.Hdr.setTempo.microsecondsPerBeat / 1000000))
			if (!registration) setTempo(bpm);			
		}

		if (arrSequence.data[currentSffVar]?.length) {
			console.debug("setupSongSequence", flag, currentSffVar, arrSequence.data[currentSffVar]);						
		}			
	}
	
    dokeyChange();

	//document.querySelector("#sequencer").style.display = flag ? "" : "none";
	//document.querySelector("#sequencer2").style.display = flag ? "" : "none";
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
	playButton.style.setProperty("--accent-fill-rest", "green");	
}

function setupRealInstruments() {
	//document.querySelector("#sequencer").style.display = "";	
	//document.querySelector("#sequencer2").style.display = "";	
	
	console.debug("setupRealInstruments", realInstrument);
	playButton.innerText = "Wait..";
	playButton.style.setProperty("--accent-fill-rest", "red");	

	if (realInstrument.drum && realInstrument.drum.length == 7) {	
		realInstrument.drums = {};
		realInstrument.drums.url = realInstrument.drumUrl;		
		realInstrument.bpm = parseInt(realInstrument.drum[1]);	
		
		let int1Len = parseInt(realInstrument.drum[2]);
		let arrLen = parseInt(realInstrument.drum[3]);
		let fillLen = parseInt(realInstrument.drum[4]);
		let brkLen = parseInt(realInstrument.drum[5]);		
		let end1Len = parseInt(realInstrument.drum[6]);
		
		realInstrument.drums["int1"] = {start: 0, stop: int1Len};		
		realInstrument.drums["arra"] = {start: int1Len, stop: int1Len + arrLen};	
		realInstrument.drums["fila"] = {start: int1Len + arrLen, stop: int1Len + arrLen + fillLen};		
		realInstrument.drums["arrb"] = {start: int1Len + arrLen + fillLen, stop: int1Len + arrLen + fillLen + arrLen};	
		realInstrument.drums["filb"] = {start: int1Len + arrLen + fillLen + arrLen, stop: int1Len + arrLen + fillLen + arrLen + fillLen};			
		realInstrument.drums["arrc"] = {start: int1Len + arrLen + fillLen + arrLen + fillLen, stop: int1Len + arrLen + fillLen + arrLen + fillLen + arrLen};			
		realInstrument.drums["filc"] = {start: int1Len + arrLen + fillLen + arrLen + fillLen + arrLen, stop: int1Len + arrLen + fillLen + arrLen + fillLen + arrLen + fillLen};	
		realInstrument.drums["arrd"] = {start: int1Len + arrLen + fillLen + arrLen + fillLen + arrLen + fillLen, stop: int1Len + arrLen + fillLen + arrLen + fillLen + arrLen + fillLen + arrLen};			
		realInstrument.drums["fild"] = {start: int1Len + arrLen + fillLen + arrLen + fillLen + arrLen + fillLen + arrLen, stop: int1Len + arrLen + fillLen + arrLen + fillLen + arrLen + fillLen + arrLen + fillLen};			
		
		let start = int1Len + arrLen + fillLen + arrLen + fillLen + arrLen + fillLen + arrLen + fillLen;
		let stop = int1Len + arrLen + fillLen + arrLen + fillLen + arrLen + fillLen + arrLen + fillLen + brkLen;
		realInstrument.drums["brka"] = {start, stop};			
		realInstrument.drums["brkb"] = {start, stop};
		realInstrument.drums["brkc"] = {start, stop};
		realInstrument.drums["brkd"] = {start, stop};

		start = stop;
		stop += end1Len;
		realInstrument.drums["end1"] = {start, stop};		
	}

	if (realInstrument.chord && realInstrument.chord.length > 2) {	
		realInstrument.chords = {};	
		realInstrument.chords.url = realInstrument.chordUrl;			
		realInstrument.bpm = parseInt(realInstrument.chord[1]);	
		
		let variations = 1;
		if (realInstrument.chord.length == 5) variations = parseInt(realInstrument.chord[4]);
		
		for (let v=0; v<variations; v++) {				
			let size = parseInt(realInstrument.chord[2]);
			let start = v * (realInstrument.chord.length >= 4 ? ((size * 24) + (parseInt(realInstrument.chord[3] * 12))) : (size * 36));
			let stop = start + size;
			
			for (let i=0; i<3; i++) {
				if (realInstrument.chord.length >= 4 && i == 2) size = parseInt(realInstrument.chord[3]); // SUS4 shorter length
					
				for (let j=0; j<12; j++) {
					let key = "key" + j;
					let variation = "";
					
					if (v == 0) variation = "_arra";
					if (v == 1) variation = "_arrb";
					if (v == 2) variation = "_arrc";
					if (v == 3) variation = "_arrd";
					
					if (i == 0) key = "key" + j + "_maj" + variation;
					if (i == 1) key = "key" + j + "_min" + variation;
					if (i == 2) key = "key" + j + "_sus" + variation;	
				
					realInstrument.chords[key] = {start, stop};
					start += size;
					stop += size;
				}				
			}
		}
		
		// fill missing variations from defined 
		
		let toVariation = "";
		let fromVariation = "_arra";
		
		for (let v=variations; v<4; v++) 
		{	
			if (v == 1) {
				fromVariation = "_arra";				
				toVariation = "_arrb";
			}
			if (v == 2) {
				fromVariation = "_arra";				
				toVariation = "_arrc";
			}
			
			if (v == 3) {
				fromVariation = "_arrb";				
				toVariation = "_arrd";
			}
					
			for (let i=0; i<3; i++) 
			{
				for (let j=0; j<12; j++) {
					realInstrument.chords["key" + j + "_maj" + toVariation] = realInstrument.chords["key" + j + "_maj" + fromVariation];
					realInstrument.chords["key" + j + "_min" + toVariation] = realInstrument.chords["key" + j + "_min" + fromVariation];
					realInstrument.chords["key" + j + "_sus" + toVariation] = realInstrument.chords["key" + j + "_sus" + fromVariation];
				}					
			}
		}		
	}	
	
	if (realInstrument.bass && realInstrument.bass.length > 2) {	
		realInstrument.basses = {};	
		realInstrument.basses.url = realInstrument.bassUrl;			
		realInstrument.bpm = parseInt(realInstrument.bass[1]);	
		
		let variations = 1;
		if (realInstrument.bass.length == 4) variations = parseInt(realInstrument.bass[3]);
		
		for (let v=0; v<variations; v++) {				
			let size = parseInt(realInstrument.bass[2]);
			let start = v * (size * 24);
			let stop = start + size;
			
			for (let i=0; i<2; i++) 
			{				
				for (let j=0; j<12; j++) {
					let key = "key" + j;
					let variation = "";
					
					if (v == 0) variation = "_arra";
					if (v == 1) variation = "_arrb";
					if (v == 2) variation = "_arrc";
					if (v == 3) variation = "_arrd";
					
					if (i == 0) key = "key" + j + "_maj" + variation;
					if (i == 1) key = "key" + j + "_min" + variation;
				
					realInstrument.basses[key] = {start, stop};
					start += size;
					stop += size;
				}				
			}
		}
		
		// fill missing variations from defined 
		
		let toVariation = "";
		let fromVariation = "_arra";
		
		for (let v=variations; v<4; v++) 
		{	
			if (v == 1) {
				fromVariation = "_arra";				
				toVariation = "_arrb";
			}
			if (v == 2) {
				fromVariation = "_arra";				
				toVariation = "_arrc";
			}
			
			if (v == 3) {
				fromVariation = "_arrb";				
				toVariation = "_arrd";
			}
					
			for (let i=0; i<3; i++) 
			{
				for (let j=0; j<12; j++) {
					realInstrument.basses["key" + j + "_maj" + toVariation] = realInstrument.basses["key" + j + "_maj" + fromVariation];
					realInstrument.basses["key" + j + "_min" + toVariation] = realInstrument.basses["key" + j + "_min" + fromVariation];
					realInstrument.basses["key" + j + "_sus" + toVariation] = realInstrument.basses["key" + j + "_sus" + fromVariation];
				}					
			}
		}		
	}		

	drumLoop = null;	
	bassLoop = null;
	chordLoop = null;
	
	let wait = 2000;
	
	if (realInstrument.drums) {	
		drumLoop = new AudioLooper("drum");
		drumLoop.callback(soundsLoaded, eventStatus);				
		drumLoop.addUri(realInstrument.drums, realdrumDevice, realInstrument.bpm);
		wait+=1000;
	}
	
	if (realInstrument.basses) {
		bassLoop = new AudioLooper("bass");
		bassLoop.callback(soundsLoaded, eventStatus);		
		bassLoop.addUri(realInstrument.basses, realdrumDevice, realInstrument.bpm);
		wait+=1000;
	}
	
	if (realInstrument.chords) {
		chordLoop = new AudioLooper("chord");
		chordLoop.callback(soundsLoaded, eventStatus);		
		chordLoop.addUri(realInstrument.chords, realdrumDevice, realInstrument.bpm);
		wait+=1000;		
	}
	
	if (!registration && realInstrument.bpm) setTempo(realInstrument.bpm);	
	
	setTimeout(() => {
		playButton.innerText = "Play";
		playButton.style.setProperty("--accent-fill-rest", "green");	

		if (midiOutput?.name == "X-TOUCH MINI") {
			const slot = registration > 8 ? registration + 1 : (registration == 0 ? 0 : registration);
			setXTouchButton(slot, "flash");
		}		
	}, wait);	
}

function soundsLoaded() {
	console.debug("audio loaded ok");
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
			}, realInstrument["end1"].drums.duration - 1000);
		}
*/		
	}
}

function outputSendProgramChange(program, channel) {
	if (midiOutput?.name == "X-TOUCH MINI") return;	
	midiOutput.sendProgramChange(program, channel);	
}

function outputSendControlChange(cc, value, channel) {
	if (midiOutput?.name == "X-TOUCH MINI") return;	
	midiOutput.sendControlChange(cc, value, channel);	
}

function outputSendChannelMode(cc, value, channel) {
	midiOutput.sendChannelMode(cc, value, channel);	
}

function outputPlayNote(chord, channel, options) {
	if (midiOutput?.name == "X-TOUCH MINI") return;
	midiOutput.playNote(chord, channel, options);	
}

function outputStopNote(chord, channel, options) {
	if (midiOutput?.name == "X-TOUCH MINI") return;	
	midiOutput.stopNote(chord, channel, options)	
}

function getCasmChannel(style, source) {
	let found = null;
	let destination = source;
	
	if (arrSequence?.casm) for (casm of arrSequence.casm) 
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

function recallRegistration(slot) {
	console.debug("recallRegistration", slot);
	
	let data = localStorage.getItem("orin.ayo.slot." + slot);	
	
	if (data) {
		registration = parseInt(slot);		
		localStorage.setItem("orin.ayo.config", data);
		setTimeout(() => location.reload(), 500 );		
	}

}

function saveRegistration(slot) {
	console.debug("saveRegistration", slot);
	registration = parseInt(slot);
	const config = saveConfig();
	localStorage.setItem("orin.ayo.slot." + slot, JSON.stringify(config));
	if (streamDeck) drawButtons(streamDeckPointer + 1);
}

function midiProgramChangeEvent(target) {
	console.debug("midiProgramChangeEvent", target.selectedIndex, target.id);
}

// -------------------------------------------------------
//
//  X-Touch MIDI Controller Device
//
// -------------------------------------------------------

function resetXTouch() {	
	if (!midiOutput) return;
	
	for (let i=0; i<32; i++) setXTouchButton(i, "off");
	for (let i=0; i<16; i++) setXTouchSpeaker(i, "off");

	setTimeout(() => midiOutput.sendProgramChange(0), 1000);
	
	for (let i=0; i<32; i++) {
		const slot = (i > 8) ? i - 1 : i; 
		
		if (localStorage.getItem("orin.ayo.slot." + slot)) {
			console.debug("resetXTouch - found slot", slot);
			setXTouchButton(i, "on");
		}
	}	
}

function setXTouchButton(button, state) {
	if (!midiOutput) return;
	
	const i = button % 16;
	const value = (state == "flash" ? 2: (state == "off" ? 0 : 1));
	
	setTimeout(() => {
		if (button < 16) midiOutput.sendProgramChange(0);		
		if (button > 15) midiOutput.sendProgramChange(1);
	}, 500);
	
	setTimeout(() => {
		midiOutput.playNote(i, "all", {rawVelocity: true, release:value, velocity:value})	
	}, 500);	
}

function setXTouchSpeaker(button, state) {
	if (!midiOutput) return;
	
	const i = button % 8;
	const value = (state == "flash" ? 28: (state == "off" ? 0 : 27));
	
	setTimeout(() => {
		if (button < 8) midiOutput.sendProgramChange(0);		
		if (button > 7) midiOutput.sendProgramChange(1);
	}, 500);

	setTimeout(() => {midiOutput.sendControlChange(i + 9, value, "all")}, 500);	
}

function handleXTouchControlEvent(event) {
	console.debug("handleXTouchControlEvent", event.controller.number, event.value);

	if (event.controller.number == 9 || event.controller.number == 10) // main volume
	{		
		if (drumLoop) {
			const drumEl = document.querySelector("#audio-vol-16");			
			drumEl.value = (event.value / 127) * savedDrumVol;
			drumLoop.setVolume(drumEl.value / 100);
		}
		
		if (bassLoop) {
			const bassEl = document.querySelector("#audio-vol-17");			
			bassEl.value = (event.value / 127) * savedBassVol;
			bassLoop.setVolume(bassEl.value / 100);
		}

		if (chordLoop) {
			const chordEl = document.querySelector("#audio-vol-18");							
			chordEl.value = (event.value / 127) * savedChordVol;
			chordLoop.setVolume(chordEl.value / 100);
		}	
		setGuitarVolume(event.value);
	}
	else

	if (event.controller.number < 5) {	
		handleEncoderRotate(event.controller.number - 1, event.value, true);
	}
}

function handleXTouchNoteEvent(event) {
	console.debug("handleXTouchNoteEvent", event.note.number);
	
	if (event.note.number > 7 && event.note.number < 16) {	// layer A top row
		handleButtonPress(event.note.number - 8);
	}
	else
		
	if (event.note.number > 15 && event.note.number < 24) {	// layer A bottom row
		handleButtonPress(event.note.number - 8);
	}	
	else

	if (event.note.number > 31 && event.note.number < 40) {	// layer B top row
		handleButtonPress(event.note.number - 16);
	}
	else
		
	if (event.note.number > 39 && event.note.number < 48) {	// layer B bottom row
		handleButtonPress(event.note.number - 16);
	}
	else
		
	if (event.note.number > -1 && event.note.number < 8) {	// layer A speakers
		handleEncoderPress(event.note.number);
	}						
	else
		
	if (event.note.number > 23 && event.note.number < 32) {	// layer B speakers
		handleEncoderPress(event.note.number - 16);
	}	
}

function handleButtonPress(panel) {
	console.debug("handleButtonPress", panel);	
	
	if (panel == 0 || panel == 8) {			
		sectionChange = 0;
		
		pad.buttons[YELLOW] = false;		
		if (panel == 8) pad.buttons[YELLOW] = true;	// play intro
		
		toggleStartStop();	
	}
	else
	
	if (styleStarted) 
	{		
		if (panel == 1) {
			doFill();
		}
		else
			
		if (panel == 9) {
			doBreak();
		}
		else
			
		if (panel == 2 || panel == 10 || panel == 3 || panel == 11) {		
			if (panel == 2) sectionChange = 0;
			if (panel == 10) sectionChange = 2;
			if (panel == 3) sectionChange = 1;
			if (panel == 11) sectionChange = 3;
			
			changeArrSection(true);
		}
		
	} else {
		recallRegistration(panel > 8 ? panel - 1 : panel);			
	}		
}

function handleEncoderPress(encoder) {
	console.debug("handleEncoderPress", encoder);	
	
	if (encoder == 0) {	
		savedPadsMode = padsMode == 0 ? savedPadsMode : padsMode;	
		padsMode = padsMode == 0 ? savedPadsMode : 0;		
		orinayo_pad.innerHTML =  padsMode == 0 ? "None" : "Pad " + padsMode;
		if (input?.name == "X-TOUCH MINI") setXTouchSpeaker(encoder, padsMode == 0  ? "flash": "off");		
	}
	else
		
	if (encoder == 1) {		
		const drumChecked = document.getElementById("arr-instrument-16");
		drumChecked.checked = !drumChecked.checked;
		pressFootSwitch(7);
		if (input?.name == "X-TOUCH MINI") setXTouchSpeaker(encoder, !drumChecked.checked ? "flash": "off");			
	}
	else

	if (encoder == 2) {		
		const bassChecked = document.getElementById("arr-instrument-17");
		bassChecked.checked = !bassChecked.checked;	
		pressFootSwitch(8);	
		if (input?.name == "X-TOUCH MINI") setXTouchSpeaker(encoder, !bassChecked.checked ? "flash": "off");		
	}
	else

	if (encoder == 3) {		
		const chordChecked = document.getElementById("arr-instrument-18");
		chordChecked.checked = !chordChecked.checked;	
		pressFootSwitch(9);
		if (input?.name == "X-TOUCH MINI") setXTouchSpeaker(encoder, !chordChecked.checked ? "flash": "off");		
	}	
	else
		
	if (encoder == 4) {
      window.dispatchEvent(new CustomEvent('MIDI', { detail: 2 }));	// compressor effect
	}	
	else
		
	if (encoder == 5) {
      window.dispatchEvent(new CustomEvent('MIDI', { detail: 6 }));	// chorus effect
	}

	if (encoder == 6) {
      window.dispatchEvent(new CustomEvent('MIDI', { detail: 7 }));	// delay effect
	}	
	else
		
	if (encoder == 7) {
      window.dispatchEvent(new CustomEvent('MIDI', { detail: 10 }));	// reverb effect
	}	
}

// -------------------------------------------------------
//
//  Converse
//
// -------------------------------------------------------

function openChatbox(view) {
	let jid = view.model.get("jid");
	let type = view.model.get("type");

	console.debug("openChatbox", jid, type);

	if (jid)
	{
		if (type == "chatbox") _converse.api.chats.open(jid, {'bring_to_foreground': true}, true);
		else
		if (type == "chatroom") _converse.api.rooms.open(jid, {'bring_to_foreground': true}, true);
	}
}
	
function refreshHistory(ev) {
	ev.stopPropagation();
	ev.preventDefault();
	
	const toolbar_el = converse.env.utils.ancestor(ev.target, 'converse-chat-toolbar');
	const chatview = _converse.chatboxviews.get(toolbar_el.model.get('jid'));		
	console.debug("refreshHistory", chatview);

	chatview.close();
	setTimeout(function() { openChatbox(chatview) });
}

async function trashHistory(ev) {
	ev.stopPropagation();
	ev.preventDefault();

	const result = confirm(__('Are you sure you want to clear the messages from this conversation?'));

	if (result === true) {		
		const toolbar_el = converse.env.utils.ancestor(ev.target, 'converse-chat-toolbar');
		await toolbar_el.model.messages.clearStore(); 
		toolbar_el.model.messages.fetched.resolve();		
	}
}

function scrollToBottom(ev) {
	ev.stopPropagation();
	ev.preventDefault();
	
	const toolbar_el = converse.env.utils.ancestor(ev.target, 'converse-chat-toolbar');
	const chatview = _converse.chatboxviews.get(toolbar_el.model.get('jid'));		
	console.debug("scrollToBottom", chatview);

	chatview.scrollDown();
}

function hideChat(ev) {
	ev.stopPropagation();
	ev.preventDefault();

    let domain = location.hostname;
	
	if (location.hostname == "oeplgfliognafobghehfffbppakffdkc") {		
		domain = "localhost";
	}	
	_converse.api.rooms.open('lobby@conference.' + domain, {'bring_to_foreground': true}, true);	
}