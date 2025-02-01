import { SplendidGrandPiano, ElectricPiano, getElectricPianoNames } from "./smplr.mjs"; 

window.setupPianos = function(context, reverberator) {
	console.debug("setupPianos", context);
	
	window.pianoNames = getElectricPianoNames();	
	window.piano = new SplendidGrandPiano(context); 
	piano.output.addEffect('reverb', reverberator, 0.25);	
	
	window.epianos = [];
	window.epianos[0] = new ElectricPiano(context, {instrument: pianoNames[0]});
	window.epianos[0].output.addEffect('reverb', reverberator, 0.25);
	
	window.epianos[1] = new ElectricPiano(context, {instrument: pianoNames[1]});
	window.epianos[1].output.addEffect('reverb', reverberator, 0.25);
	
	window.epianos[2] = new ElectricPiano(context, {instrument: pianoNames[2]});
	window.epianos[2].output.addEffect('reverb', reverberator, 0.25);	
	
	//epiano.tremolo.level(30);		
}
