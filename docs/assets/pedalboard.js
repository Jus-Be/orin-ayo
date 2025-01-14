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
      //window.dispatchEvent(new CustomEvent('MIDI', { detail: data[1] }));
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

  await fetch("./audio/ir/" + guitarIR + ".wav")
    .then(response => response.arrayBuffer())
    .then(data => {
      return ctx.decodeAudioData(data, b => {
		console.debug("pedalboard IR loader", guitarIR, b);
        window.buffer = b;
      });
    })
    .catch(e => onError('Failed to load reverb impulse'));
	
  $pedalboard.innerHTML = `
	<fluent-tabs activeid="wahwah">
		<fluent-tab id="wahwah">Wah Wah</fluent-tab>
		<fluent-tab id="compressor">Compressor</fluent-tab>
		<fluent-tab id="overdrive">Overdrive</fluent-tab>
		<fluent-tab id="boost">Boost</fluent-tab>
		<fluent-tab id="harmonic_tremolo">Harmonic Tremolo</fluent-tab>
		<fluent-tab id="chorus-delay-reverb">Chorus Delay Reverb</fluent-tab>
		<fluent-tab id="multi_head_delay">Multi Head Delay</fluent-tab>
		<fluent-tab id="tremolo">Tremolo</fluent-tab>	

		<fluent-tab-panel id="wahPanel">
		</fluent-tab-panel>
		<fluent-tab-panel id="compressorPanel">
		</fluent-tab-panel>
		<fluent-tab-panel id="overdrivePanel">
		</fluent-tab-panel>
		<fluent-tab-panel id="boostPanel">
		</fluent-tab-panel>
		<fluent-tab-panel id="htPanel">
		</fluent-tab-panel>
		<fluent-tab-panel id="chorusDelayReverbPanel">
		</fluent-tab-panel>  
		<fluent-tab-panel id="mhdPanel">
		</fluent-tab-panel>
		<fluent-tab-panel id="tremoloPanel">
		</fluent-tab-panel>		
   </fluent-tabs>		
  `;
  
  window.pedals = [
    wahPedal,
    compressorPedal,
    overdrivePedal,
    boostPedal,
    harmonicTremoloPedal,
    chorusPedal,
    delayPedal,
    multiHeadDelay,
    tremoloPedal,
    reverbPedal
  ]; 
    
  if (useEffects && guitarName != null && guitarName != "") {  
	window.pedalOutput = pedals.reduce((input, pedal, index) => {
		return pedal(input, index + 1);
	}, pedalInput);

	pedalOutput.connect(ctx.destination);	  	
  } else {
	pedalInput.connect(ctx.destination);	  
  }
}

