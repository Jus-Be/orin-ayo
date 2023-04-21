function AudioLooper() {
	this.cb_loaded = null;
	this.cb_status = null;
    this.audioContext = new AudioContext();	
		
	this.doLoop = function(id, beginTime, howLong) {			
		//if (id != this.id) return;

		//console.log("doLoop starts", id, this.id, howLong);
				
		this.source = this.audioContext.createBufferSource();		
		this.source.buffer = this.sample;	
		this.gainNode = this.audioContext.createGain()
		this.gainNode.gain.value = 1;
		this.gainNode.connect(this.audioContext.destination)		
		this.source.connect(this.gainNode);
		this.startTime = this.audioContext.currentTime - this.offset;			
		this.source.start(this.audioContext.currentTime, (beginTime + this.offset), (howLong - this.offset));
		
		if (this.cb_status) this.cb_status("_eventPlaying", id);
		if (id == "end1") this.looping = false;			
		
		this.source.addEventListener("ended", () => {
			console.log("doLoop ends", id, this.id, this.reloop);	
			if (this.cb_status) this.cb_status("_eventEnded", id);	
			
			const beginTime =  this.loop[this.id].start /1000;
			const endTime = this.loop[this.id].stop / 1000;
			const howLong = endTime - beginTime;
						
			if (this.looping && this.reloop) {
				this.doLoop(this.id, beginTime, howLong);	
			}
			
			if (!this.reloop) {
				this.reloop = true;
				this.offset = 0;
			}
		});		
	};
}


AudioLooper.prototype.update = function(id, sync) {
	if (id == this.id) return;
		
	if (this.source) {
		
		const beginTime =  this.loop[id].start /1000;
		const endTime = this.loop[id].stop / 1000;
		const howLong = endTime - beginTime;
		
		const cycle = howLong * 1000;
		const duration = this.audioContext.currentTime - this.startTime;	
		
		if (sync) {	
			this.reloop = true;			
			this.offset = 0;
			this.id = id;
			console.debug("update sync", id);				
			
		} else {	
			this.reloop = false;	
			this.offset = ((duration * 1000) % (howLong * 1000)) / 1000;			

			this.id = id;				
			console.debug("update demand", id, howLong, duration, this.offset);			

			const gain = this.gainNode.gain;		
			const old = this.source;					
			this.doLoop(id, beginTime, howLong);
			gain.value = 0;
			old.stop();	

			//gain.value = 0;
			//const when = this.audioContext.currentTime + 1;
			//gain.exponentialRampToValueAtTime(0.01,  when);			
			//gain.setTargetAtTime(0, this.audioContext.currentTime, 0.015);		
		}
	}
};

AudioLooper.prototype.start = function(id) {
	this.looping = true;
	this.reloop = true;
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
		this.source.stop();	
	}
};

AudioLooper.prototype.callback = function(cb_loaded, cb_status) {
	this.cb_status = cb_status;
	this.cb_loaded = cb_loaded;
};

AudioLooper.prototype.addUri = function(loop, output, bpm) {
	this.loop = loop;
	this.bpm = bpm;

	if (output) this.audioContext.setSinkId(output.deviceId);
	
	fetch(loop.url)
		.then(response => response.arrayBuffer())
		.then(buffer => this.audioContext.decodeAudioData(buffer))
		.then(sample => {
			this.sample = sample;
			if (this.cb_loaded) this.cb_loaded();
		});
};