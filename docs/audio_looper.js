function AudioLooper() {
	this.cb_loaded = null;
	this.cb_status = null;
    this.audioContext = new AudioContext();	
		
	this.doLoop = function() {	
		console.log("doLoop starts", this.id);
		
		const start =  this.loop[this.id].start /1000;
		const end = this.loop[this.id].stop / 1000;
		const duration = end - start;
		
		this.source = this.audioContext.createBufferSource();
		this.source.loop = false;		
		this.source.buffer = this.sample;	
		this.gainNode = this.audioContext.createGain()
		this.gainNode.gain.value = 1;
		this.gainNode.connect(this.audioContext.destination)		
		this.source.connect(this.gainNode);
		this.source.start(this.audioContext.currentTime, start, duration);		
		this.startTime = this.audioContext.currentTime;	
		
		if (this.cb_status) this.cb_status("_eventPlaying", this.id);
		if (this.id == "end1") this.looping = false;			
		
		this.source.addEventListener("ended", () => {
			console.log("doLoop ends", this.id, this.loop[this.id].start /1000, this.loop[this.id].stop / 1000);	
			if (this.cb_status) this.cb_status("_eventEnded", this.id);
			this.source.stop();	
						
			if (this.looping) this.doLoop();				
		});		
	};
}


AudioLooper.prototype.update = function(id, sync) {
	this.prevId = this.id;
	this.id = id;
	this.sync = sync;
	
	const cycle = this.loop.arra.stop - this.loop.arra.start;
	const duration = ((this.audioContext.currentTime - this.startTime ) * 1000) - this.loop.int1.stop;
	const beat = duration % cycle;
	const ratio = beat / cycle;	
	
	console.debug("update", id, this.source.buffer.duration, duration, beat, cycle, ratio, this.loop[this.id].start, this.loop[this.id].stop);
		
	if (this.source) {
		
		if (sync || true) {	

		} else {
			
		}
	}
};

AudioLooper.prototype.start = function(id) {
	this.looping = true;	
	console.debug("AudioLooper start");
	
	this.id = id;
	if (this.sample) this.doLoop();
};

AudioLooper.prototype.volume = function(vol) {
	if(typeof vol != "undefined") {
		
		if (this?.gainNode) {
			this.gainNode.gain.value = vol;
		}
	}
	
	return vol;
};

AudioLooper.prototype.stop = function() {
	this.looping = false;
	console.debug("AudioLooper stop");
	
	if (this.source) {
		this.source.loop = false;	
		this.source.stop();	
	}
};

AudioLooper.prototype.callback = function(cb_loaded, cb_status) {
	this.cb_status = cb_status;
	this.cb_loaded = cb_loaded;
};

AudioLooper.prototype.addUri = function(loop, output) {
	this.loop = loop;
	if (output) this.audioContext.setSinkId(output.deviceId);
	
	fetch(loop.url)
		.then(response => response.arrayBuffer())
		.then(buffer => this.audioContext.decodeAudioData(buffer))
		.then(sample => {
			this.sample = sample;
			if (this.cb_loaded) this.cb_loaded();
		});
};