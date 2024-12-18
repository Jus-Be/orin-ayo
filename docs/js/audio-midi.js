class AudioMidi extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const input = inputs[0];
	const channel = input[0];

	//console.debug("AudioMidi process", channel);
	this.port.postMessage({channel});	  

    return true;
  }
}

registerProcessor('audio-midi', AudioMidi);