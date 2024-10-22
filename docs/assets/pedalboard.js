import { multiHeadDelay } from './src/pedals/multihead-delay.js';
import { reverbPedal } from './src/pedals/reverb.js';
import { delayPedal } from './src/pedals/delay.js';
import { wahPedal } from './src/pedals/wah.js';
import { tremoloPedal } from './src/pedals/tremolo.js';
import { harmonicTremoloPedal } from './src/pedals/harmonic-tremolo.js';
import { boostPedal } from './src/pedals/boost.js';
import { compressorPedal } from './src/pedals/compressor.js';
import { overdrivePedal } from './src/pedals/overdrive.js';
import { chorusPedal } from './src/pedals/chorus.js';


window.setupPedalBoard = async function(guitarContext, guitarName, deviceId, useEffects) {
  window.$pedalboard = document.querySelector('.pedalboard');
  window.buffer = null;
  window.ctx = guitarContext; 
  window.pedalInput = ctx.createGain();
	
  if (deviceId) {
    const stream = await navigator.mediaDevices.getUserMedia({deviceId, audio: {
        autoGainControl: false,
		noiseSuppression: false,		
        echoCancellation: {exact: false},
        advanced: [{
            echoCancellation: {exact: false}
          }, 
          {googEchoCancellation: {exact: false}}, 
          {googExperimentalEchoCancellation: {exact: false}}, 
          {googDAEchoCancellation: {exact: false}}, 
          {googAutoGainControl: {exact: false}}, 
          {googExperimentalAutoGainControl: {exact: false}}, 
          {googNoiseSuppression: {exact: false}}, 
          {googExperimentalNoiseSuppression: {exact: false}}, 
          {googHighpassFilter: {exact: false}}, 
          {googTypingNoiseDetection: {exact: false}}, 
          {googAudioMirroring: {exact: false}}, 
          {googNoiseReduction: {exact: false}}
        ],
		channelCount: 2,
		latency: 0,			
		volume: 1.0
	}, video: false});	
	
    const source = ctx.createMediaStreamSource(stream);
	source.connect(pedalInput);
	pedalInput.gain.setValueAtTime(1, ctx.currentTime);	
  }
  
  const onError = (message = '') => {
    const error = document.createElement('div');
    error.innerHTML = message;
    error.classList.add('error');
    document.body.appendChild(error);
  };

  const onMidiMessage = ({ data }) => {
    if (data[0] === 144) {
      window.dispatchEvent(new CustomEvent('MIDI', { detail: data[1] }));
    }

    if (data[0] === 176) {
      window.dispatchEvent(new CustomEvent('MIDIEXP', { detail: data[2] }));
    }
  };
  
  try {
    const midiCtx = await navigator.requestMIDIAccess();

    midiCtx.inputs.forEach(entry => {
      entry.onmidimessage = onMidiMessage;
    });
  } catch (e) {
    console.log('No midi connectivity');
  }

  await fetch('./assets/Conic Long Echo Hall.wav')
    .then(response => response.arrayBuffer())
    .then(data => {
      return ctx.decodeAudioData(data, b => {
        buffer = b;
      });
    })
    .catch(e => onError('Failed to load reverb impulse'));
	
  $pedalboard.innerHTML = "";
  
  const pedals = [
    //wahPedal,
    compressorPedal,
    //overdrivePedal,
    //boostPedal,
    //harmonicTremoloPedal,
    chorusPedal,
    delayPedal,
    //multiHeadDelay,
    //tremoloPedal,
    reverbPedal
  ]; 
    
  if (useEffects) {
	//pedalInput.connect(ctx.destination); 
  
	const output = pedals.reduce((input, pedal, index) => {
		return pedal(input, index + 1);
	}, pedalInput);

	output.connect(ctx.destination);	
	if (recorderDestination) output.connect(recorderDestination);	

  } else {
	pedalInput.connect(ctx.destination); 	  
	if (recorderDestination) pedalInput.connect(recorderDestination);	
  }
}

