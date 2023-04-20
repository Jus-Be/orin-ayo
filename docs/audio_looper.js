function AudioLooper() {
	this.cb_loaded = null;
	this.cb_status = null;
    this.audioContext = new AudioContext();	
		
	this.doLoop = function(id, beginTime, howLong) {			
		if (id != this.id) return;

		console.log("doLoop starts", id, this.id, howLong);
				
		this.source = this.audioContext.createBufferSource();
		this.source.loop = false;		
		this.source.buffer = this.sample;	
		this.gainNode = this.audioContext.createGain()
		this.gainNode.gain.value = 1;
		this.gainNode.connect(this.audioContext.destination)		
		this.source.connect(this.gainNode);
		this.startTime = this.audioContext.currentTime - this.offset;			
		this.source.start(this.startTime, (beginTime + this.offset), (howLong - this.offset));		
		
		if (this.cb_status) this.cb_status("_eventPlaying", id);
		if (id == "end1") this.looping = false;			
		
		this.source.addEventListener("ended", () => {
			console.log("doLoop ends", id, this.id);	
			if (this.cb_status) this.cb_status("_eventEnded", id);	
			
			const beginTime =  this.loop[this.id].start /1000;
			const endTime = this.loop[this.id].stop / 1000;
			const howLong = endTime - beginTime;
	
			if (this.looping && this.offset == 0) this.doLoop(this.id, beginTime, howLong);	
			this.offset = 0;			
		});		
	};
}


AudioLooper.prototype.update = function(id, sync) {
	if (id == this.id) return;
	
	this.id = id;

	const beginTime =  this.loop[this.id].start /1000;
	const endTime = this.loop[this.id].stop / 1000;
	const howLong = endTime - beginTime;
	
	const cycle = howLong * 1000;
	const duration = ((this.audioContext.currentTime - this.startTime ) * 1000);
	
	console.debug("update", id, cycle, duration);
		
	if (this.source) {
		
		if (sync || duration == cycle || duration == 0) {	
			this.offset = 0;
		} else {
			this.offset = (duration  / 1000) + 0.000;

			const old = this.source;
			const gain = this.gainNode.gain;			
			
			this.doLoop(id, beginTime, howLong);

			gain.value = 0;			
			old.stop();
		}
	}
};

AudioLooper.prototype.start = function(id) {
	this.looping = true;
	this.offset = 0;
	this.id = id;	

	const beginTime =  this.loop[this.id].start /1000;
	const endTime = this.loop[this.id].stop / 1000;
	const howLong = endTime - beginTime;	
	
	console.debug("AudioLooper start");

	if (this.sample) this.doLoop(id, beginTime, howLong);
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