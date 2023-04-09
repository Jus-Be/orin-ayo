const BASE = 48;
const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

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

var output = null;
var input = null;
var forward = null;
var strum = null;
var orinayo = null;
var statusMsg = null;
var base = BASE;
var key = "C"
var keyChange = 0;
var sectionChange = 0;
var started = false;
var activeChord = null;

var canvas = {
  context : null,
  gameWidth : null,
  gameHeight : null
};

var content = [];
var game = null;
var pad = {buttons: [], axis: []};

window.addEventListener("load", onloadHandler);

function onloadHandler()
{
	console.debug("onloadHandler");
  
	orinayo = document.querySelector('#orinayo');
	statusMsg = document.querySelector('#statusMsg');

	window.addEventListener("gamepadconnected", connectHandler);
	window.addEventListener("gamepaddisconnected", disconnectHandler);

	letsGo();
}

function connectHandler(e) 
{
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

function disconnectHandler(e) 
{
  if (e.gamepad.id.indexOf("Guitar ") > -1)
  {
	  console.debug("removing guitar");	  
  }
}

function updateStatus() 
{
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
				console.debug("strum", guitar.axes[STRUM].toFixed(4));							
				pad.axis[STRUM] = guitar.axes[STRUM].toFixed(4);
				updated = updated || true;
			}

			if (pad.axis[TOUCH] != guitar.axes[TOUCH].toFixed(4)) {
				//console.debug("touch", guitar.axes[TOUCH].toFixed(4));							
				pad.axis[TOUCH] = guitar.axes[TOUCH].toFixed(4);
				//updated = updated || true;				
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

function letsGo()
{
	let data = localStorage.getItem("orin.ayo.config");
	if (!data) data = "{}";
	
	const config = JSON.parse(data);
	
    WebMidi.enable(function (err)
    {
      if (err) {
        statusMsg.innerHTML = "WebMidi could not be enabled.";
      } else {
        statusMsg.innerHTML = "Orin Ayo Ready";
        console.debug("WebMidi enabled!", WebMidi);

        if (WebMidi.outputs.length > 0 && WebMidi.inputs.length > 0)
        {
            const midiIn = document.getElementById("midiInSel");
            const midiOut = document.getElementById("midiOutSel");
            const midiFwd = document.getElementById("midiFwdSel");
        	const midiStrum = document.getElementById("midiStrumSel");

            midiOut.options[0] = new Option("Midi Out **UNUSED**", "midiOutSel");
            midiFwd.options[0] = new Option("Midi Forward **UNUSED**", "midiFwdSel");
            midiStrum.options[0] = new Option("Midi Strum **UNUSED**", "midiStrumSel");
            midiIn.options[0] = new Option("Midi In **UNUSED**", "midiInSel");

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

                let strumSelected = false;

                if (config.strum && config.strum == WebMidi.outputs[i].name)
                {
                    strumSelected = true;
                    strum = WebMidi.outputs[i];
                }
                midiStrum.options[i + 1] = new Option(WebMidi.outputs[i].name, WebMidi.outputs[i].name, strumSelected, strumSelected);
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

            midiFwd.addEventListener("click", function()
            {
                forward = null;

                if (midiFwd.value != "midiFwdSel")
                {
                    forward = WebMidi.getOutputByName(midiFwd.value);
                    console.debug("selected forward midi port", forward, midiFwd.value);
                }
                saveConfig();
            });
            
            midiStrum.addEventListener("click", function()
            {
                strum = null;

                if (midiStrum.value != "midiStrumSel")
                {
                    strum = WebMidi.getOutputByName(midiStrum.value);
                    console.debug("selected strum midi port", strum, midiStrum.value);
                }
                saveConfig();
            });

            console.debug("WebMidi devices", input, output, forward, strum);

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
        }
        else {
            statusMsg.innerHTML = "NO MIDI devices available";
        }
      }

    }, true);
};

function saveConfig()
{
    let config = {};
    config.output = output ? output.name : null;
    config.forward = forward ? forward.name : null;
	config.strum = strum ? strum.name : null;
    config.input = input ? input.name : null;

    localStorage.setItem("orin.ayo.config", JSON.stringify(config));
}

function checkForFillOrBreak()
{
	console.debug("checkForFillOrBreak");
	
	if (output) {
		
		if (!pad.buttons[YELLOW] && !pad.buttons[BLUE] && !pad.buttons[ORANGE] && !pad.buttons[RED]  && !pad.buttons[GREEN]) {
			if (pad.axis[STRUM] == STRUM_UP) sendSysex(0x0B);
			if (pad.axis[STRUM] == STRUM_DOWN) sendSysex(0x07);	
		}				
	}
}

function playChord(chord)
{
   if ((pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN) && !activeChord)
   {
        console.debug("playChord", chord);
		
        if (output) {			
			if (pad.axis[STRUM] == STRUM_UP) output.playNote(chord, [4], {velocity: 0.5});	// up
			if (pad.axis[STRUM] == STRUM_DOWN) output.playNote(chord, [4], {velocity: 0.5});   // down					
		}
				
        if (strum) strum.playNote(chord, [4], {velocity: 0.5});        
        activeChord = chord;
   }
}

function sendSysex(code) {
    if (output) { 
        console.debug("sendSysex", code)	
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

function stopChord()
{
   if (activeChord && (pad.axis[STRUM] == STRUM_UP || pad.axis[STRUM] == STRUM_DOWN))
   {
        console.debug("stopChord", pad)
        if (output) output.stopNote(activeChord, [4], {velocity: 0.5});
        if (strum) strum.stopNote(activeChord, [4], {velocity: 0.5});        
        activeChord = null;
   }
}

function playSectionCheck()
{
	if (!pad.buttons[YELLOW] && !pad.buttons[BLUE] && !pad.buttons[ORANGE] && !pad.buttons[RED]  && !pad.buttons[GREEN])
	{
		if (pad.buttons[STARPOWER]) {
			sectionChange++;
			if (sectionChange > 3) sectionChange = 3;	
		} else {
			sectionChange--;
			if (sectionChange < 0) sectionChange = 0;
		}
	}
	
	console.debug("playSectionCheck pressed " + sectionChange);
	sendSysex(3 + sectionChange);

}
var activeStyle = -1;

function dokeyChange()
{
    keyChange = (keyChange % 12);

    activeStyle++;
    if (activeStyle > 15) activeStyle = 0;

    console.debug("Received 'key change (" + KEYS[keyChange] + ").", activeStyle);

    orinayo.innerHTML = KEYS[keyChange];
    key = KEYS[keyChange];
    base = BASE + keyChange;

    if (forward) forward.playNote(84 + keyChange, 1, {velocity: 0.5, duration: 1000});
        
    if (output)
    {
        //output.sendControlChange(0, 32);
        //output.sendControlChange(32, 0);        
        //output.sendProgramChange(activeStyle, [4]);
	}
    
}

function doChord()
{
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
    playChord([base - 36, base + 5, base + 9, base + 12]);
    orinayo.innerHTML = key + " - " + "4/1";
  }
  else

  // --- G/C

  if (pad.buttons[YELLOW] && pad.buttons[BLUE] && pad.buttons[ORANGE] && pad.buttons[GREEN])
  {
    playChord([base - 36, base + 7, base + 11, base + 14]);
    orinayo.innerHTML = key + " - " + "5/1";
  }
  else

  // -- B

  if (pad.buttons[RED] && pad.buttons[YELLOW] && pad.buttons[BLUE] && pad.buttons[GREEN])
  {
    playChord([base - 1, base + 3, base + 6]);
    orinayo.innerHTML = key + " - " + "7";
  }
  else

  if (pad.buttons[RED] && pad.buttons[YELLOW] && pad.buttons[GREEN])     // Ab
  {
    playChord([base - 4, base, base + 3]);
    orinayo.innerHTML = key + " - " + "6b";
  }
  else

  if (pad.buttons[RED] && pad.buttons[YELLOW] && pad.buttons[BLUE])     // A
  {
    playChord([base + 9, base + 13, base + 16]);
    orinayo.innerHTML = key + " - " + "6";
  }
  else

  if (pad.buttons[BLUE] && pad.buttons[YELLOW] && pad.buttons[GREEN])     // E
  {
    playChord([base + 4, base + 8, base + 11]);
    orinayo.innerHTML = key + " - " + "3";
  }
  else


  if (pad.buttons[BLUE] && pad.buttons[RED] && pad.buttons[ORANGE])     // Eb
  {
    //playChord([base - 29, base + 9, base + 12, base + 16]);
    //orinayo.innerHTML = key + " - " + "Am/G";
    playChord([base + 3, base + 7, base + 10]);
    orinayo.innerHTML = key + " - " + "3b";  
  }
  else

  if (pad.buttons[YELLOW] && pad.buttons[BLUE] && pad.buttons[ORANGE])    // F/G
  {
    playChord([base - 29, base + 5, base + 9, base + 12]);
    orinayo.innerHTML = key + " - " + "4/5";
  }
  else

  if (pad.buttons[RED] && pad.buttons[YELLOW])     // Bb
  {
    playChord([base - 2, base + 2, base + 5]);
    orinayo.innerHTML = key + " - " + "7b";
  }
  else

  if (pad.buttons[GREEN] && pad.buttons[YELLOW])     // Gsus
  {
    playChord([base + 7, base + 12, base + 14]);
    orinayo.innerHTML = key + " - " + "5sus";
  }
  else

  if (pad.buttons[ORANGE] && pad.buttons[YELLOW])     // Csus
  {
    playChord([base, base + 5, base + 7]);
    orinayo.innerHTML = key + " - " + "1sus";
  }
  else

  if (pad.buttons[YELLOW] && pad.buttons[BLUE])    // C/E
  {
    playChord([base - 32, base, base + 4, base + 7]);
    orinayo.innerHTML = key + " - " + "1/3";
  }
  else

  if (pad.buttons[GREEN] && pad.buttons[RED])     // G/B
  {
    playChord([base - 25, base + 7, base + 11, base + 14]);
    orinayo.innerHTML = key + " - " + "5/7";
  }
  else

  if (pad.buttons[BLUE] && pad.buttons[ORANGE])     // F/A
  {
    playChord([base - 27, base + 5, base + 9, base + 12]);
    orinayo.innerHTML = key + " - " + "4/6";
  }
  else

  if (pad.buttons[GREEN] && pad.buttons[BLUE])     // Em
  {
    playChord([base + 4, base + 7, base + 11]);
    orinayo.innerHTML = key + " - " + "3m";
  }
  else

   if (pad.buttons[ORANGE] && pad.buttons[RED])   // Fm
   {
     playChord([base + 5, base + 8, base + 12]);
     orinayo.innerHTML = key + " - " + "4m";
   }
   else

   if (pad.buttons[GREEN] && pad.buttons[ORANGE])     // Gm
   {
     playChord([base + 7, base + 10, base + 14]);
     orinayo.innerHTML = key + " - " + "5m";
   }
  else

  if (pad.buttons[RED] && pad.buttons[BLUE])     // D
  {
    //playChord([base + 9, base + 13, base + 16]);
    playChord([base + 2, base + 6, base + 9]);
    orinayo.innerHTML = key + " - " + "2";
  }
  else

  if (pad.buttons[YELLOW])    // C
  {
    playChord([base, base + 4, base + 7]);
    orinayo.innerHTML = key + " - " + "1";
  }
  else

  if (pad.buttons[BLUE])      // Dm
  {
    playChord([base + 2, base + 5, base + 9]);
    orinayo.innerHTML = key + " - " + "2m";
  }
  else

  if (pad.buttons[ORANGE])   // F
  {
    playChord([base + 5, base + 9, base + 12]);
    orinayo.innerHTML = key + " - " + "4";
  }
  else

  if (pad.buttons[GREEN])     // G
  {
    playChord([base + 7, base + 11, base + 14]);
    orinayo.innerHTML = key + " - " + "5";
  }
  else

  if (pad.buttons[RED])     // Am
  {
    playChord([base + 9, base + 12, base + 16]);
    orinayo.innerHTML = key + " - " + "6m";
  }
}

function toggleStartStop()
{

		if (!pad.buttons[YELLOW] && !pad.buttons[BLUE] && !pad.buttons[ORANGE] && !pad.buttons[RED]  && !pad.buttons[GREEN]) 
		{
			if (started) {			
				console.debug("stop arr pressed");
 				pressFootSwitch(6);	
				started = false;				
			}
			else {
				console.debug("start arr pressed");
 				pressFootSwitch(6);	
				started = true;
			}			
		} else {
			let endType = 0x0F;
			
			if (output) { 
				if (pad.buttons[GREEN]) endType = 0x10;
				if (pad.buttons[RED]) endType = 0x11;				
				if (pad.buttons[BLUE]) endType = 0x12;	
				if (pad.buttons[ORANGE]) endType = 0x35;					
				
				sendSysex(endType);	
			}
			console.debug("toggel start/stop", endType);
			started = !started;			
		}
}

function updateGame()
{
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


function setup()
{
  var gameCanvas = document.getElementById('gameCanvas');
  canvas.context = gameCanvas.getContext('2d');
  canvas.gameWidth = gameCanvas.width;
  canvas.gameHeight = gameCanvas.height;

  var noteHeight = canvas.gameHeight/10;

  var hitRegion = new HitRegion(
    35,
    noteHeight);

  game = new GameBoardState(3, noteHeight, hitRegion, canvas.gameHeight);

  content.push(new GameBoard(
    canvas.context,
    game,
    canvas.gameWidth / 4, 0,
    canvas.gameWidth / 2, canvas.gameHeight));
}

