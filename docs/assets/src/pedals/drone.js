import { updatePot, createRotaryKnob, createPedal, createInputSwitch } from '../dom.js';


export const dronePedal = function(input, index) {
	const samples = {}, sources = {};
	
    const defaults = {
		gain: 0.5,
		active: false
    };
	
	const sum = ctx.createGain();
	const root = ctx.createGain();
	const fifth = ctx.createGain();
	const diatonic = ctx.createGain();
	const high = ctx.createGain();
	const reverse = ctx.createGain();
	const shimmer = ctx.createGain();
	const trempicking = ctx.createGain();	
  
	function fetchMedia(name, callback) {
		fetch("./assets/pads/default/" + name + "_64000.pad")
		.then(response => response.arrayBuffer())
		.then(data => {
		  return ctx.decodeAudioData(data, sample => {
			console.debug("dronePanel loader", name, sample);
			samples[name] = sample;
			callback(sample);
		  });
		})
		.catch(e => console.error('Failed to load drone media', name, e));
	}
	
	function doPlay(name, gainNode) {
		const buffer = samples[name];		
		const source = ctx.createBufferSource();	
		console.debug("doPlay", name, buffer, source, gainNode);
		
		sources[name] = source;	
		source.buffer = buffer;
				
		source.connect(gainNode);
		source.loop = true;		
		source.loopStart = keyChange * 64;
		source.loopEnd = source.loopStart + 64;
		source.start(ctx.currentTime, source.loopStart, source.loopEnd);
		source.addEventListener("ended", () => rePlay(name, gainNode));	
	}
	
	function rePlay(name, gainNode) {
		const buffer = samples[name];
		const source = sources[name];	
		console.debug("rePlay", defaults.active, name, buffer, source, gainNode);
		
		source.stop();			
		if (defaults.active) doPlay(name, gainNode);		
	}	
	
	function myToggle() {
		console.debug("myToggle", defaults.active);	

		if (!defaults.active) {
			doPlay('root', root);
			doPlay('fifth', fifth);
			doPlay('diatonic', diatonic);
			doPlay('high', high);
			doPlay('reverse', reverse);
			doPlay('shimmer', shimmer);
			doPlay('trempicking', trempicking);			
		} else {
			sources['root'].stop();
			sources['fifth'].stop();
			sources['diatonic'].stop();
			sources['high'].stop();
			sources['reverse'].stop();
			sources['shimmer'].stop();
			sources['trempicking'].stop();			
		}
		
		defaults.active = !defaults.active;
		toggle();
	}


	// Create audio nodes
	const [output, toggle] = createInputSwitch(input, sum, defaults.active);
	root.gain.value = defaults.gain;
	fifth.gain.value = defaults.gain;
	diatonic.gain.value = defaults.gain;
	high.gain.value = defaults.gain;
	reverse.gain.value = defaults.gain;
	shimmer.gain.value = defaults.gain;
	trempicking.gain.value = defaults.gain;	
	
	input.connect(output);	// send guitar input directly. not affected by drone
	
	root.connect(sum);
	fifth.connect(sum);
	diatonic.connect(sum);
	high.connect(sum);
	reverse.connect(sum);
	shimmer.connect(sum);
	trempicking.connect(sum);

	// Create the DOM nodes
	const pedal = createPedal({
	name: 'drone',
	label: '',
	toggle : myToggle,
	active: defaults.active,
	index
	});

	createRotaryKnob({
	pedal,
	name: 'volume',
	label: 'Volume',
	max: 5,
	onInput: updatePot(sum.gain),
	value: defaults.gain
	});  

	fetchMedia('root', (buffer) => {
	  createRotaryKnob({
		pedal,
		name: 'root',
		label: 'Root',
		max: 5,
		onInput: updatePot(root.gain),
		value: defaults.gain
	  });
	})

	fetchMedia('fifth', (buffer) => {
	  createRotaryKnob({
		pedal,
		name: 'fifth',
		label: 'Fifth',
		max: 5,
		onInput: updatePot(fifth.gain),
		value: defaults.gain
	  });  
	});

	fetchMedia('diatonic', (buffer) => {
	  createRotaryKnob({
		pedal,
		name: 'diatonic',
		label: 'Diatonic',
		max: 5,
		onInput: updatePot(diatonic.gain),
		value: defaults.gain
	  }); 
	});

	fetchMedia('high', (buffer) => {
	  createRotaryKnob({
		pedal,
		name: 'high',
		label: 'High',
		max: 5,
		onInput: updatePot(high.gain),
		value: defaults.gain
	  });
	});

	fetchMedia('reverse', (buffer) => {
	  createRotaryKnob({
		pedal,
		name: 'reverse',
		label: 'Reverse',
		max: 5,
		onInput: updatePot(reverse.gain),
		value: defaults.gain
	  });  
	});

	fetchMedia('shimmer', (buffer) => {
	  createRotaryKnob({
		pedal,
		name: 'shimmer',
		label: 'Shimmer',
		max: 5,
		onInput: updatePot(shimmer.gain),
		value: defaults.gain
	  });  
	});

	fetchMedia('trempicking', (buffer) => {
	  createRotaryKnob({
		pedal,
		name: 'trempicking',
		label: 'Tremolo Picking',
		max: 5,
		onInput: updatePot(trempicking.gain),
		value: defaults.gain
	  }); 
	});	  

	document.querySelector('#dronePanel').appendChild(pedal);

	return output;
};