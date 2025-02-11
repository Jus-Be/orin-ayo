import { SplendidGrandPiano, ElectricPiano, getElectricPianoNames, Soundfont2Sampler } from "./smplr.mjs"; 
const { SoundFont2 } = window.SoundFont2

window.setupPianos = function(context, reverberator) {
	console.debug("setupPianos", context);
	
	window.pianoNames = getElectricPianoNames();	
	window.piano = new SplendidGrandPiano(context); 
	piano.output.addEffect('reverb', reverberator, 0.25);	
	
	// TODO
	// piano.output.sendEffect("reverb", 0.5);
	
	window.epianos = [];
	window.epianos[0] = new ElectricPiano(context, {instrument: pianoNames[0]});
	window.epianos[0].output.addEffect('reverb', reverberator, 0.25);
	
	window.epianos[1] = new ElectricPiano(context, {instrument: pianoNames[1]});
	window.epianos[1].output.addEffect('reverb', reverberator, 0.25);
	
	window.epianos[2] = new ElectricPiano(context, {instrument: pianoNames[2]});
	window.epianos[2].output.addEffect('reverb', reverberator, 0.25);

	window.warmPad = new Soundfont2Sampler(context, { url: "./assets/pads/glass-pad.sf2",  createSoundfont: (data) => new SoundFont2(data), decayTime: 1.25});

	warmPad.load.then(() => {
	  console.debug("setupPianos warm pad", warmPad.instrumentNames);
	  warmPad.loadInstrument(warmPad.instrumentNames[0]);
	  
		window.stringPad = new Soundfont2Sampler(context, { url: "./assets/pads/ensemble-pad.sf2",  createSoundfont: (data) => new SoundFont2(data), decayTime: 1.25});

		stringPad.load.then(() => {
		  console.debug("setupPianos string pad", stringPad.instrumentNames);
		  stringPad.loadInstrument(stringPad.instrumentNames[0]);
		});		  
	});	
		
	
	// TODO epiano effects. sync with guitar and tempo
	//epiano.tremolo.level(30);		
}
