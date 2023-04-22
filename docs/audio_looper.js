function AudioLooper() {
	this.cb_loaded = null;
	this.cb_status = null;
    this.audioContext = new AudioContext();	

	this.getLoop = function(id) {	// key0 OR key0_maj OR key0_min_arra
		const keys = id.split("_");
		
		let key = keys[0] + "_" + keys[1] + "_" + keys[2];
		if (!this.loop[key]) key = keys[0] + "_" + keys[1];
		if (!this.loop[key]) key = keys[0];
		const loop = this.loop[key];
		console.log("getLoop", id, key, loop);		
		return loop;		
	};
		
	this.doLoop = function(id, beginTime, howLong) {		
		//if (id != this.id) return;

		//console.log("doLoop starts", id, this.id, howLong);
		
		if (id == "end1")  this.offset = 0; 
				
		this.source = this.audioContext.createBufferSource();		
		this.source.buffer = this.sample;	
		this.gainNode = this.audioContext.createGain();
		this.gainNode.gain.value = 0.01;		
		this.gainNode.connect(this.audioContext.destination)		
		this.source.connect(this.gainNode);		
		this.startTime = this.audioContext.currentTime - this.offset;

		this.gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime);
		this.gainNode.gain.exponentialRampToValueAtTime(this.vol, this.audioContext.currentTime + 0.01);	
		
		this.source.start(this.audioContext.currentTime, (beginTime + this.offset), (howLong - this.offset));	

		this.gainNode.gain.setValueAtTime(this.vol, this.audioContext.currentTime + howLong - this.offset - 0.01);
		this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + howLong - this.offset);			
		
		if (this.cb_status) this.cb_status("_eventPlaying", id); 		
		
		this.source.addEventListener("ended", () => {
			console.log("doLoop ends", id, id, this.reloop);	
			
			if (this.cb_status) this.cb_status("_eventEnded", id);	
			
			if (this.id == "int1") 	this.id = "arra";	
			
			if (id == "end1") 	{
				this.looping = false;	
				this.mute();
				this.source.stop();
			}
			
			if (this.id.startsWith("fil") || this.id.startsWith("brk")) this.id = "arr" + this.id.substring(3);					
			
			const loop = this.getLoop(this.id);
			const beginTime =  loop.start /1000;
			const endTime = loop.stop / 1000;
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

AudioLooper.prototype.muteToggle = function(id) {

	if (this.vol == 0.0001) {
		this.unmute();
	} else {
		this.mute();
	}
}

AudioLooper.prototype.mute = function(id) {
	this.prevVol = this.vol;	
	this.vol = 0.0001;
	this.gainNode.gain.exponentialRampToValueAtTime(this.vol, this.audioContext.currentTime + 0.5);	
}

AudioLooper.prototype.unmute = function(id) {
	this.vol = this.prevVol;	
	this.gainNode.gain.exponentialRampToValueAtTime(this.vol, this.audioContext.currentTime + 0.5);	
}

AudioLooper.prototype.update = function(id, sync) {
		
	if (this.source) {		
		const loop = this.getLoop(id);
		const beginTime =  loop.start /1000;
		const endTime = loop.stop / 1000;
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
			old.stop();		
		}
	}
};

AudioLooper.prototype.start = function(id) {
	this.looping = true;
	this.reloop = true;
	this.offset = 0;
	this.id = id;
	this.vol = vol = 0.75;
	this.prevVol = this.vol;

	const loop = this.getLoop(this.id);
	const beginTime =  loop.start /1000;
	const endTime = loop.stop / 1000;
	const howLong = endTime - beginTime;	
	
	console.debug("AudioLooper start");

	if (this.sample) this.doLoop(id, beginTime, howLong);
};

AudioLooper.prototype.volume = function(vol) {
	if (typeof vol != "undefined") {
		this.vol = vol;
		
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