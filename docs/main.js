const BASE = 48;
const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const SECTIONS = ["Arr A", "Arr B", "Arr C", "Arr D"];

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

var arranger = "ketron";
var realGuitarStyle = "none";
var output = null;
var input = null;
var forward = null;
var chordTracker = null;
var orinayo = null;
var orinayo_section = null;
var orinayo_strum = null;
var statusMsg = null;
var base = BASE;
var key = "C"
var keyChange = 0;
var sectionChange = 0;
var rgIndex = 0;
var nextRgIndex = 0;
var styleStarted = false;
var activeChord = null;

var currentPlayNote;
var tempoCanvas = null;
var playStartTime = 0;
var audioContext = null;
var unlocked = false;
var isPlaying = false;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var tempo = 100.0;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function 
                            //(in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps 
                            // with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
var noteLength = 0.05;      // length of "beep" (in seconds)
var canvasContext;          // canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; // the last "box" we drew on the screen
var notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages

var canvas = {
  context : null,
  gameWidth : null,
  gameHeight : null
};

var content = [];
var game = null;
var pad = {buttons: [], axis: []};

window.requestAnimFrame = window.requestAnimationFrame;
window.addEventListener("load", onloadHandler);

function onloadHandler() {
	console.debug("onloadHandler");
  
	tempoCanvas = orinayo = document.querySelector('#tempoCanvas');	
	orinayo = document.querySelector('#orinayo');
	orinayo_section = document.querySelector('#orinayo-section');
	orinayo_strum = document.querySelector('#orinayo-strum');	
	statusMsg = document.querySelector('#statusMsg');

	window.addEventListener("gamepadconnected", connectHandler);
	window.addEventListener("gamepaddisconnected", disconnectHandler);

	document.querySelector('#giglad').addEventListener("click", () => {			
		setTimeout(() => output.sendControlChange (85, 127, 4), 10000);	// FADE IN
		setTimeout(() => output.sendControlChange (86, 127, 4), 20000);	// FADE OUT
		setTimeout(() => output.sendControlChange (87, 127, 4), 30000);	// PLAY
		setTimeout(() => output.sendControlChange (88, 127, 4), 40000);	// STOP		
		
		setTimeout(() => output.sendControlChange (102, 127, 4), 50000);	// intro
		setTimeout(() => output.sendControlChange (103, 127, 4), 60000);
		setTimeout(() => output.sendControlChange (104, 127, 4), 70000);
		
		setTimeout(() => output.sendControlChange (108, 127, 4), 80000);	// Main
		setTimeout(() => output.sendControlChange (109, 127, 4), 90000);
		setTimeout(() => output.sendControlChange (110, 127, 4), 100000);
		setTimeout(() => output.sendControlChange (111, 127, 4), 110000);		
			
		setTimeout(() => output.sendControlChange (112, 127, 4), 120000);	// Fill/Break
		setTimeout(() => output.sendControlChange (113, 127, 4), 130000);
		setTimeout(() => output.sendControlChange (114, 127, 4), 140000);
		setTimeout(() => output.sendControlChange (115, 127, 4), 150000);
		setTimeout(() => output.sendControlChange (116, 127, 4), 160000);
		setTimeout(() => output.sendControlChange (117, 127, 4), 170000);
		setTimeout(() => output.sendControlChange (118, 127, 4), 180000);
		setTimeout(() => output.sendControlChange (119, 127, 4), 190000);	

		setTimeout(() => output.sendControlChange (105, 127, 4), 200000);	// End
		setTimeout(() => output.sendControlChange (106, 127, 4), 210000);
		setTimeout(() => output.sendControlChange (107, 127, 4), 220000);
			
	});
	
	document.querySelector(".play").addEventListener("click", function() {
		if (output) { 		
			this.innerText = styleStarted ? "Play" : "Stop";
			toggleStartStop();
		}
	});	
	
	document.querySelector("#tempo").addEventListener("input", function() {
		tempo = event.target.value; 
		document.getElementById('showTempo').innerText = tempo;
	});
	
	letsGo();
}

function connectHandler(e) {
  console.debug("connectHandler", e);	
  
  if (e.gamepad.id.indexOf("Guitar") > -1)
  {
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
	var gamepads = navigator.getGamepads();	
	  
	for (var i = 0; i < gamepads.length; i++) 
	{
		if (gamepads[i] && gamepads[i].id.indexOf("Guitar") > -1)		
		{
		  guitar = gamepads[i];
		  break;
		}
	}
  
	if (guitar)
	{		
		var updated = false;		
		
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
		
		if (updated) {
			doChord();
			updateGame();
			updateCanvas();	
		}				
	}
	
	window.setTimeout(updateStatus);
}

function letsGo() {
	let data = localStorage.getItem("orin.ayo.config");
	if (!data) data = '{"arranger": "ketron"}';
	
	const config = JSON.parse(data);
	
    WebMidi.enable(function (err)
    {
      if (err) {
        statusMsg.innerHTML = "WebMidi could not be enabled.";
      } else {
        statusMsg.innerHTML = "Orin Ayo";
        console.debug("WebMidi enabled!", config, WebMidi);

        if (WebMidi.outputs.length > 0 && WebMidi.inputs.length > 0)
        {
            const midiIn = document.getElementById("midiInSel");
            const midiOut = document.getElementById("midiOutSel");
            const midiFwd = document.getElementById("midiFwdSel");
        	const midiChordTracker = document.getElementById("midiChordTrackerSel");
			
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

			const arrangerType =  document.getElementById("arrangerType");			
			arrangerType.options[0] = new Option("Ketron SD/Event", "ketron", config.arranger == "ketron");
			arrangerType.options[1] = new Option("Yamaha MODX", "modx", config.arranger == "modx");
			arrangerType.options[2] = new Option("Yamaha Montage", "montage", config.arranger == "montage");	
			arrangerType.options[3] = new Option("Yamaha QY100", "qy100", config.arranger == "qy100");	
			arrangerType.options[4] = new Option("Korg Micro Arranger", "microarranger", config.arranger == "microarranger");				
			arrangerType.options[5] = new Option("Giglad Arranger", "giglad", config.arranger == "giglad");				
			let arrangerIndex = 0;
			arrangerIndex = config.arranger == "modx" ? 1 : arrangerIndex;
			arrangerIndex = config.arranger == "montage" ? 2 : arrangerIndex;
			arrangerIndex = config.arranger == "qy100" ? 3 : arrangerIndex;			
			arrangerIndex = config.arranger == "microarranger" ? 4 : arrangerIndex;				
			arrangerIndex = config.arranger == "giglad" ? 5 : arrangerIndex;				
			arrangerType.selectedIndex = arrangerIndex;			
			arranger = config.arranger;					
		   
            midiOut.options[0] = new Option("**UNUSED**", "midiOutSel");
            midiFwd.options[0] = new Option("**UNUSED**", "midiFwdSel");
            midiChordTracker.options[0] = new Option("**UNUSED**", "midiChordTrackerSel");
            midiIn.options[0] = new Option("**UNUSED**", "midiInSel");

            for (var i=0; i<WebMidi.outputs.length; i++)
            {
                let outSelected = false;

                if (config.output && config.output == WebMidi.outputs[i].name)
                {
                    outSelected = true;
                    output = WebMidi.outputs[i];
                }
                midiOut.options[i + 1] = new Option(WebMidi.outputs[i].name, WebMidi.outputs[i].name, outSelected, outSelected);

                let fwdSelected = false;

                if (config.forward && config.forward == WebMidi.outputs[i].name)
                {
                    fwdSelected = true;
                    forward = WebMidi.outputs[i];
                }
                midiFwd.options[i + 1] = new Option(WebMidi.outputs[i].name, WebMidi.outputs[i].name, fwdSelected, fwdSelected);

                let chordTrackerSelected = false;

                if (config.chordTracker && config.chordTracker == WebMidi.outputs[i].name)
                {
                    chordTrackerSelected = true;
                    chordTracker = WebMidi.outputs[i];
                }
                midiChordTracker.options[i + 1] = new Option(WebMidi.outputs[i].name, WebMidi.outputs[i].name, chordTrackerSelected, chordTrackerSelected);
            }

            for (var i=0; i<WebMidi.inputs.length; i++)
            {
                let selected = false;

                if (config.input && config.input == WebMidi.inputs[i].name)
                {
                    selected = true;
                    input = WebMidi.inputs[i];
                }
                midiIn.options[i + 1] = new Option(WebMidi.inputs[i].name, WebMidi.inputs[i].name, selected, selected);
            }

            midiIn.addEventListener("click", function()
            {
                input = null;

                if (midiIn.value != "midiInSel")
                {
                    input = WebMidi.getInputByName(midiIn.value);
                    console.debug("selected input midi port", input, midiIn.value);
                }
                saveConfig();
            });

            midiOut.addEventListener("click", function()
            {
                output = null;

                if (midiOut.value != "midiOutSel")
                {
                    output = WebMidi.getOutputByName(midiOut.value);
                    console.debug("selected output midi port", output, midiOut.value);
                }
                saveConfig();
            });

            arrangerType.addEventListener("click", function()
            {
                arranger = arrangerType.value;
                console.debug("selected arranger type", arranger, arrangerType.value);				
                saveConfig();
            });
			
            realguitar.addEventListener("click", function()
            {
                realGuitarStyle = realguitar.value;
                console.debug("selected realguitar style", realGuitarStyle, realguitar.value);				
                saveConfig();
            });

            midiFwd.addEventListener("click", function()
            {
                forward = null;
				enableSequencer(false);

                if (midiFwd.value != "midiFwdSel")
                {
                    forward = WebMidi.getOutputByName(midiFwd.value);
					enableSequencer(true);
                    console.debug("selected forward midi port", forward, midiFwd.value);
                }
                saveConfig();
            });
            
            midiChordTracker.addEventListener("click", function()
            {
                chordTracker = null;

                if (midiChordTracker.value != "midiChordTrackerSel")
                {
                    chordTracker = WebMidi.getOutputByName(midiChordTracker.value);
                    console.debug("selected chordTracker midi port", chordTracker, midiChordTracker.value);
                }
                saveConfig();
            });

            console.debug("WebMidi devices", input, output, forward, chordTracker);

            if (input)
            {
                input.addListener('noteon', 1, function (e)
                {
                    console.debug("Received 'noteon' message (" + e.note.name + " " + e.note.name + e.note.octave + ").", e.note);
                    orinayo.innerHTML = e.note.name;
                    key = e.note.name;
                    base = BASE + (e.note.number % 12);
                });

                input.addListener('controlchange', "all", function (e)
                {
                  console.debug("Received 'controlchange' message", e);
                });
            }
			
			enableSequencer(!!forward);
        }
        else {
            statusMsg.innerHTML = "NO MIDI devices available";
        }
      }

    }, true);
};

function saveConfig() {
    let config = {};
    config.output = output ? output.name : null;
    config.forward = forward ? forward.name : null;
	config.chordTracker = chordTracker ? chordTracker.name : null;
    config.input = input ? input.name : null;
	config.arranger = arranger;
	config.realGuitarStyle = realGuitarStyle;

    localStorage.setItem("orin.ayo.config", JSON.stringify(config));
}

function doBreak() {
	console.debug("doBreak " + arranger);	
		
	if (arranger == "ketron") {
		sendKetronSysex(0x0B + sectionChange);		
	} 	
	else 
		
	if (arranger == "microarranger") {
        if (output) output.sendProgramChange(90, 4);
	} 
	else 
		
	if (arranger == "qy100") {
		doYamahaFill();		
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

function doFill() {
	console.debug("doFill " + arranger);		
	
	if (arranger == "ketron") {
		sendKetronSysex(0x07 + sectionChange);		
	}
	else 
		
	if (arranger == "microarranger") {
		doKorgFill();	
	} 	
	else 
		
	if (arranger == "qy100") {		
		doYamahaFill();		
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

function doGigladFill() {
	console.debug("doGigladFill " + sectionChange);	

	if (sectionChange == 0) {
		output.sendControlChange (112, 127, 4); 			
		setTimeout(() => output.sendControlChange (108, 127, 4), 2000); 
	}
	if (sectionChange == 1) {
		output.sendControlChange (113, 127, 4); 	
		setTimeout(() => output.sendControlChange (109, 127, 4), 2000);  			
	}
	if (sectionChange == 2) {
		output.sendControlChange (114, 127, 4); 			
		setTimeout(() => output.sendControlChange (110, 127, 4), 2000);  
	}		
	if (sectionChange == 3) {
		output.sendControlChange (115, 127, 4); 			
		setTimeout(() => output.sendControlChange (111, 127, 4), 2000); 
	}	
}

function doModxFill() {
	console.debug("doModxFill " + sectionChange);	
	
	if (arranger == "modx") 
	{
		if (sectionChange == 0) {
			output.sendControlChange (92, 32, 4); 			
			setTimeout(() => output.sendControlChange (92, 16, 4), 2000); 
		}
		if (sectionChange == 1) {
			output.sendControlChange (92, 32, 4); 	
			setTimeout(() => output.sendControlChange (92, 48, 4), 2000);  			
		}
		if (sectionChange == 2) {
			output.sendControlChange (92, 64, 4); 			
			setTimeout(() => output.sendControlChange (92, 80, 4), 2000);  
		}		
		if (sectionChange == 3) {
			output.sendControlChange (92, 96, 4); 			
			setTimeout(() => output.sendControlChange (92, 80, 4), 2000); 
		}	
	} 
	
	else 
		
	if (arranger == "montage") 	{	
		if (sectionChange == 0) {
			output.sendControlChange (92, 64, 4); 			
			setTimeout(() => output.sendControlChange (92, 16, 4), 2000); 
		}
		if (sectionChange == 1) {
			output.sendControlChange (92, 64, 4); 	
			setTimeout(() => output.sendControlChange (92, 32, 4), 2000);  			
		}
		if (sectionChange == 2) {
			output.sendControlChange (92, 80, 4); 			
			setTimeout(() => output.sendControlChange (92, 48, 4), 2000);  
		}		
		if (sectionChange == 3) {
			output.sendControlChange (92, 96, 4); 			
			setTimeout(() => output.sendControlChange (92, 48, 4), 2000); 
		}		
	}
}

function doKorgFill() {
	console.debug("doKorgFill " + arranger);			
	const tempArr = sectionChange % 2;
	
	if (tempArr == 0) {
		if (output) output.sendProgramChange(86, 4);
		setTimeout(() => output.sendProgramChange(80 + sectionChange, 4), 1000);			
		console.debug("doKorgFill A");		
	} else {
		if (output) output.sendProgramChange(87, 4);
		setTimeout(() => output.sendProgramChange(80 + sectionChange, 4), 1000);			
		console.debug("doKorgFill B");					
	}		
}

function doYamahaFill() {
	console.debug("doYamahaFill " + arranger);			
	const tempArr = sectionChange % 2;
	
	if (tempArr == 0) {
		sendYamahaSysex(0x0C);
		setTimeout(() => sendYamahaSysex(0x09), 2000);			
		console.debug("doYamahaFill qy100 A");		
	} else {
		sendYamahaSysex(0x0B);	
		setTimeout(() => sendYamahaSysex(0x0A), 2000);				
		console.debug("doYamahaFill qy100 B");					
	}		
}

function checkForFillOrBreak() {
	if (output) {
		//console.debug("GREEN Touch", pad.axis[TOUCH]);	
		
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
}

function playChord(chord, root, type, bass) {
   if ((pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN) && !activeChord)
   {
        console.debug("playChord", chord);
		
        if (output) {			
			if (pad.axis[STRUM] == STRUM_UP) output.playNote(chord, [4], {velocity: 0.5});	// up
			if (pad.axis[STRUM] == STRUM_DOWN) output.playNote(chord, [4], {velocity: 0.5});   // down					
		}
				
        if (chordTracker) {		
			const trasposedRoot = transposeNote(root);
			const transposedBass = transposeNote(bass);
			chordTracker.sendSysex(0x43, [0x7E, 0x02, trasposedRoot, type, transposedBass, type]);				
		}
		
        activeChord = chord;
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
	return root;
}

function sendYamahaSysex(code) {
    if (output) { 
        console.debug("sendYamahaSysex", code)	
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
    if (output) { 
        console.debug("pressFootSwitch", code)	
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
	
	if (arranger == "ketron") {
		sendKetronSysex(3 + sectionChange);	
		console.debug("resetArrToA Ketron " + sectionChange);		
	} 	
	else 
		
	if (arranger == "qy100") {
		sendYamahaSysex(0x09);	
		console.debug("resetArrToA QY100 " + sectionChange);			
	} 	
	else 
		
	if (arranger == "microarranger") {
		if (output) output.sendProgramChange(80, 4);	
		console.debug("resetArrToA Micro Arranger " + sectionChange);			
	} 	
	else	
	
	if (arranger == "giglad") {
		if (output) output.sendControlChange (108, 127, 4);
		console.debug("resetArrToA Giglad " + sectionChange);			
	}	
	else	
	
	if (arranger == "modx") {
		if (output) output.sendControlChange (92, 16, 4);
		console.debug("resetArrToA MODX " + sectionChange);			
	}
	else
		
	if (arranger == "montage") {
		if (output) output.sendControlChange (92, 16, 4);
		console.debug("resetArrToA Montage " + sectionChange);			
	}
	
	orinayo_section.innerHTML = SECTIONS[sectionChange];
	
	if (window[realGuitarStyle]) {
		orinayo_strum.innerHTML = "Strum " + (rgIndex + 1) + "/" + window[realGuitarStyle].length;	
	}
	
	document.querySelector(".play").innerText = styleStarted ? "Play" : "Stop";	
		
}

function stopChord() {
   if (activeChord && (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN))
   {
        console.debug("stopChord", pad)
        if (output) output.stopNote(activeChord, [4], {velocity: 0.5});     
        activeChord = null;
   }
}

function playSectionCheck() {
	let arrChanged = false;
	
	if (!pad.buttons[YELLOW] && !pad.buttons[BLUE] && !pad.buttons[ORANGE] && !pad.buttons[RED]  && !pad.buttons[GREEN]) {
					
		if (pad.buttons[STARPOWER]) {
			sectionChange++;
			if (sectionChange > 3) sectionChange = 0;	
			
			if (window[realGuitarStyle]) {
				nextRgIndex++;
				if (nextRgIndex ==  window[realGuitarStyle].length) nextRgIndex = 0;
			}

		} else {
			sectionChange--;		
			if (sectionChange < 0) sectionChange = 3;

			if (window[realGuitarStyle]) {			
				nextRgIndex--;				
				if (nextRgIndex < 0) nextRgIndex = window[realGuitarStyle].length - 1;		
			}				
		}
		arrChanged = true;
	}
	
	console.debug("playSectionCheck pressed " + arrChanged);
	changeArrSection();
	orinayo_section.innerHTML = SECTIONS[sectionChange];
	
	if (window[realGuitarStyle]) {
		orinayo_strum.innerHTML = ">Strum " + (nextRgIndex + 1) + "/" + window[realGuitarStyle].length;	
	}

}

function changeArrSection() {
	
	if (arranger == "ketron") {
		sendKetronSysex(3 + sectionChange);	
		console.debug("changeArrSection Ketron " + sectionChange);		
	} 	
	else 
		
	if (arranger == "qy100") {
		doYamahaFill();
		console.debug("changeArrSection QY100 " + sectionChange);			
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
    keyChange--;
    if (keyChange < 0) keyChange = 11
    dokeyChange();
  }

  if (pad.axis[STRUM] == STRUM_RIGHT && !pad.buttons[YELLOW] && !pad.buttons[BLUE] && !pad.buttons[ORANGE] && !pad.buttons[RED]  && !pad.buttons[GREEN])
  {
    keyChange++;
    if (keyChange > 11) keyChange = 0	
    dokeyChange();
  }

  if (pad.buttons[START] || pad.buttons[STARPOWER])
  {
    playSectionCheck()
  }

  if (pad.buttons[LOGO])
  {
	toggleStartStop();
  }  

   if ((pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN)) {
		checkForFillOrBreak();
   }

  if ((pad.axis[STRUM] != STRUM_UP && pad.axis[STRUM] != STRUM_DOWN)) return;

  // --- F/C

  if (pad.buttons[YELLOW] && pad.buttons[BLUE] && pad.buttons[ORANGE] && pad.buttons[RED])
  {
    playChord([base - 36, base + 5, base + 9, base + 12], 0x34, 0x00, 0x31);
    orinayo.innerHTML = key + " - " + "4/1";
  }
  else

  // --- G/C

  if (pad.buttons[YELLOW] && pad.buttons[BLUE] && pad.buttons[ORANGE] && pad.buttons[GREEN])
  {
    playChord([base - 36, base + 7, base + 11, base + 14], 0x35, 0x00, 0x31);
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
    playChord([base + 9, base + 13, base + 16], 0x36, 0x00, 0x36);
    orinayo.innerHTML = key + " - " + "6";
  }
  else

  if (pad.buttons[BLUE] && pad.buttons[YELLOW] && pad.buttons[GREEN])     // E
  {
    playChord([base + 4, base + 8, base + 11], 0x33, 0x00, 0x33);
    orinayo.innerHTML = key + " - " + "3";
  }
  else


  if (pad.buttons[BLUE] && pad.buttons[RED] && pad.buttons[ORANGE])     // Eb
  {
    //playChord([base - 29, base + 9, base + 12, base + 16]);
    //orinayo.innerHTML = key + " - " + "Am/G";
    playChord([base + 3, base + 7, base + 10], 0x23, 0x00, 0x23);
    orinayo.innerHTML = key + " - " + "3b";  
  }
  else

  if (pad.buttons[YELLOW] && pad.buttons[BLUE] && pad.buttons[ORANGE])    // F/G
  {
    playChord([base - 29, base + 5, base + 9, base + 12], 0x34, 0x00, 0x35);
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
    playChord([base + 7, base + 12, base + 14], 0x35, 0x20, 0x35);
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
    playChord([base - 32, base, base + 4, base + 7], 0x31, 0x00, 0x33);
    orinayo.innerHTML = key + " - " + "1/3";
  }
  else

  if (pad.buttons[GREEN] && pad.buttons[RED])     // G/B
  {
    playChord([base - 25, base + 7, base + 11, base + 14], 0x35, 0x00, 0x37);
    orinayo.innerHTML = key + " - " + "5/7";
  }
  else

  if (pad.buttons[BLUE] && pad.buttons[ORANGE])     // F/A
  {
    playChord([base - 27, base + 5, base + 9, base + 12], 0x34, 0x00, 0x36);
    orinayo.innerHTML = key + " - " + "4/6";
  }
  else

  if (pad.buttons[GREEN] && pad.buttons[BLUE])     // Em
  {
    playChord([base + 4, base + 7, base + 11], 0x33, 0x08, 0x33);
    orinayo.innerHTML = key + " - " + "3m";
  }
  else

   if (pad.buttons[ORANGE] && pad.buttons[RED])   // Fm
   {
     playChord([base + 5, base + 8, base + 12], 0x34, 0x08, 0x34);
     orinayo.innerHTML = key + " - " + "4m";
   }
   else

   if (pad.buttons[GREEN] && pad.buttons[ORANGE])     // Gm
   {
     playChord([base + 7, base + 10, base + 14], 0x35, 0x08, 0x35);
     orinayo.innerHTML = key + " - " + "5m";
   }
  else

  if (pad.buttons[RED] && pad.buttons[BLUE])     // D
  {
    //playChord([base + 9, base + 13, base + 16]);
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
    playChord([base + 5, base + 9, base + 12], 0x34, 0x00, 0x34);
    orinayo.innerHTML = key + " - " + "4";
  }
  else

  if (pad.buttons[GREEN])     // G
  {
    playChord([base + 7, base + 11, base + 14], 0x35, 0x00, 0x35);
    orinayo.innerHTML = key + " - " + "5";
  }
  else

  if (pad.buttons[RED])     // Am
  {
    playChord([base + 9, base + 12, base + 16], 0x36, 0x08, 0x36);
    orinayo.innerHTML = key + " - " + "6m";
  }
}

function toggleStartStop() {	
	if (output) { 
		resetArrToA();
		
		if (forward && realGuitarStyle != "none" && window[realGuitarStyle]) {			
			startStopSequencer();
		}
		
		if (arranger == "ketron") {		
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
				output.sendControlChange (92, 0, 4);  				    
				styleStarted = true;
			}
			else {
				console.debug("stop key pressed");				
				output.sendControlChange (92, 96, 4); 			
				setTimeout(() => output.sendControlChange (92, 112, 4), 2000);        
				styleStarted = false;
			}
		}	
		else

		if (arranger == "giglad") 
		{		
			if (!styleStarted)
			{
				console.debug("start key pressed");  
				
				if (output) {
					if (pad.buttons[YELLOW]) {
						output.sendControlChange (102, 127, 4); 	// INTRO 1
						sectionChange = 0;						
					} else if (pad.buttons[RED]) {
						output.sendControlChange (103, 127, 4); 	// INTRO 2	
						sectionChange = 1;							
					} else if (pad.buttons[GREEN]){
						output.sendControlChange (104, 127, 4); 	// INTRO 3
						sectionChange = 2;							
					} else if (pad.buttons[ORANGE]){
						output.sendControlChange (85, 127, 4); 		// FADE IN				
					}
					orinayo_section.innerHTML = SECTIONS[sectionChange];						
					output.sendControlChange (87, 127, 4);			// START
					
				}     
				styleStarted = true;
			}
			else {
				console.debug("stop key pressed");
				
				if (output) {
					if (pad.buttons[YELLOW]) {
						output.sendControlChange (105, 127, 4); 
					} else if (pad.buttons[RED]) {
						output.sendControlChange (106, 127, 4); 						
					} else  if (pad.buttons[GREEN]) {
						output.sendControlChange (107, 127, 4); 	
					} else if (pad.buttons[ORANGE]){
						output.sendControlChange (86, 127, 4); 		// FADE OUT						
					} else {
						output.sendControlChange (88, 127, 4);		// STOP
					}				
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
				sendYamahaSysex(0x08);					      
				styleStarted = true;
			}
			else {
				console.debug("stop key pressed");				
				sendYamahaSysex(0x0D);		   
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
					if (pad.buttons[YELLOW]) {
						output.sendProgramChange(85, 4);
					} else if (pad.buttons[ORANGE]) {
						output.sendProgramChange(91, 4);							
					} else if (pad.buttons[GREEN]){
						output.sendProgramChange(84, 4);						
					} else {
						output.sendStart();
					}
					
				}     
				styleStarted = true;
			}
			else {
				console.debug("stop key pressed");
				
				if (output) {
					if (pad.buttons[YELLOW]) {
						output.sendProgramChange(89, 4);
					} else if (pad.buttons[ORANGE]) {
						output.sendProgramChange(91, 4);						
					} else  if (pad.buttons[GREEN]) {
						output.sendProgramChange(88, 4);
					} else {
						output.sendStop();						
					}
				}	      
				styleStarted = false;
			}
		}		
	}		
}

function updateGame() {
  game.update();
}

function updateCanvas() {
  canvas.context.fillStyle = "#080018";
    canvas.context.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);
    canvas.context.strokeStyle = "#000000";
    canvas.context.strokeRect(0, 0, canvas.gameWidth, canvas.gameHeight);
  for (var i = 0; i < content.length; i++) {
    content[i].update();
  }
}

function setup() {
  var gameCanvas = document.getElementById('gameCanvas');
  canvas.context = gameCanvas.getContext('2d');
  canvas.gameWidth = gameCanvas.width;
  canvas.gameHeight = gameCanvas.height;

  var noteHeight = canvas.gameHeight/8;

  var hitRegion = new HitRegion(
    70,
    noteHeight);

  game = new GameBoardState(3, noteHeight, hitRegion, canvas.gameHeight);

  content.push(new GameBoard(
    canvas.context,
    game,
    canvas.gameWidth / 4, 0,
    canvas.gameWidth / 2, canvas.gameHeight));
}

function enableSequencer(flag) {
	document.querySelector("#sequencer").style.display = flag ? "" : "none";
	document.querySelector("#tempoCanvas").style.display = flag ? "" : "none";

	if (!canvasContext && flag) {
		canvasContext = tempoCanvas.getContext( '2d' );    
		canvasContext.strokeStyle = "#ffffff";
		canvasContext.lineWidth = 2;

		window.onorientationchange = resetCanvas;
		window.onresize = resetCanvas;

		requestAnimFrame(draw);    // start the drawing loop.

		timerWorker = new Worker("metronomeworker.js");

		timerWorker.onmessage = function(e) {
			if (e.data == "tick") {
				// console.debug("tick!");
				scheduler();
			}
			else
				console.debug("message: " + e.data);
		};
		timerWorker.postMessage({"interval":lookahead});	
	}
}

function startStopSequencer() {

    if (!audioContext) audioContext = new AudioContext();	
	
    if (!unlocked) {
      // play silent buffer to unlock the audio
      var buffer = audioContext.createBuffer(1, 1, 22050);
      var node = audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      unlocked = true;
    }	
	
	if (!styleStarted) 	{	
        current16thNote = 0;
		currentPlayNote = 0;
        nextNoteTime = audioContext.currentTime;
		playStartTime = nextNoteTime;		
        timerWorker.postMessage("start");	
	} else {
        timerWorker.postMessage("stop");		
	}
}

function resetCanvas (e) {
    // resize the canvas - but remember - this clears the canvas too.
    tempoCanvas.width = 800;
    tempoCanvas.height = 100;

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
                canvasContext.fillRect( x * (i+1), x, x/2, x/2 );
            }
            last16thNoteDrawn = currentNote;
        }
    }
    // set up to draw again
    requestAnimFrame(draw);
}

function nextNote() {	
	const tempRatio = tempo / window[realGuitarStyle][rgIndex].header.bpm ;
	
    current16thNote++;    // Advance the beat number, wrap to zero
	
    if (current16thNote == 16) {
        current16thNote = 0;
    }	
	
	currentPlayNote++;	
	
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

function scheduleNote( beatNumber, time ) {
	console.debug("scheduleNote",  currentPlayNote, audioContext.currentTime, nextNoteTime);
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );

	if (forward) {
		const velocity = window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].velocity;
		const duration = window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].duration * 1000;
		
		forward.playNote(window[realGuitarStyle][rgIndex].tracks[1].notes[currentPlayNote].midi, 1, {velocity, duration});
	}
}

function scheduler() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote( current16thNote, nextNoteTime );
        nextNote();
    }
}