function AudioLooper(styleType) {
	this.counter = 6;
	this.styleType = styleType;
	this.cb_loaded = null;
	this.cb_status = null;
    this.audioContext = new AudioContext();	

	this.getLoop = function(id) {	// key0 OR key0_maj OR key0_min_arra
		const keys = id.split("_");
		
		let key = keys[0] + "_" + keys[1] + "_" + keys[2];
		if (!this.loop[key]) key = keys[0] + "_" + keys[1];
		if (!this.loop[key]) key = keys[0];
		const loop = this.loop[key];
		console.debug("getLoop", id, key, loop);		
		return loop;		
	};
		
	this.doLoop = function(id, beginTime, howLong) {		
		//if (id != this.id) return;

		//console.debug("doLoop starts", id, this.id, howLong);
		
		if (id == "end1")  this.offset = 0; 
		
		if (this.source) {
			//this.finished = true;
		}
		
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
			console.debug("doLoop ends", id, id, this.reloop);	
			
			if (this.cb_status) this.cb_status("_eventEnded", id);	
			
			if (this.id == "int1") 	this.id = "arra";	
			
			if (id == "end1" || this.finished) 	{
				this.looping = false;	
				this.finished = false;
				this.mute();
				this.source.stop();
				this.displayUI(false);
			}
			
			if (this.id.startsWith("fil") || this.id.startsWith("brk")) this.id = "arr" + this.id.substring(3);					
			
			const loop = this.getLoop(this.id);
			
			if (loop) {
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
	this.displayUI(true);	
	
	if (this.source) {	
		this.finished = false;	
		this.id = id;		
		const loop = this.getLoop(id);
		
		if (loop) {
			const beginTime =  loop.start /1000;
			const endTime = loop.stop / 1000;
			const howLong = endTime - beginTime;
			const duration = this.audioContext.currentTime - this.startTime;	
			
			if (sync) {	
				this.reloop = true;			
				this.offset = 0;
				console.debug("update sync", id);				
				
			} else {	
				this.reloop = false;	
				this.offset = ((duration * 1000) % (howLong * 1000)) / 1000;							
				console.debug("update demand", id, howLong, duration, this.offset);			

				const gain = this.gainNode.gain;		
				const old = this.source;					
				this.doLoop(id, beginTime, howLong);
				old.stop();		
			}
		}
	}
};

AudioLooper.prototype.start = function(id) {
	this.displayUI(true);	
	this.looping = true;
	this.reloop = true;
	this.finished = false;
	this.offset = 0;
	this.id = id;
	this.vol = this.styleType == "bass" ? 0.95 : ( this.styleType == "chord" ? 0.4 : 0.85);
	this.prevVol = this.vol;

	const loop = this.getLoop(this.id);
	
	if (loop) {
		const beginTime =  loop.start /1000;
		const endTime = loop.stop / 1000;
		const howLong = endTime - beginTime;	
		
		console.debug("AudioLooper " + this.styleType + " start");	

		if (this.sample) this.doLoop(id, beginTime, howLong);
	}
};

AudioLooper.prototype.volume = function(vol) {
	if (typeof vol != "undefined") {
		this.vol = vol;
		
		if (this.gainNode) {
			this.gainNode.gain.value = vol;
		}
	}
	
	return vol;
};

AudioLooper.prototype.displayUI = function(flag) {
	const channel = (this.styleType == "drum" ? "16" : (this.styleType == "bass" ? "17" : "18"));
	const instrumentNode = document.getElementById("arr-instrument-" + channel);
	
	if (instrumentNode) {
		const classList = instrumentNode.parentNode.parentNode.parentNode.parentNode.querySelector("tbody > tr:nth-child(" + (parseInt(channel) + 1) + ") > td:nth-child(" + this.counter + ")").classList;				
		
		if (classList) 
		{
			if (flag) {
				if (!classList.contains("note-on")) classList.add("note-on");
			} else {
				classList.remove("note-on");			
			}
		}
	}
};

AudioLooper.prototype.stop = function() {
	this.displayUI(false);
	this.looping = false;
	
	if (this.source && this.id) {
		const loop = this.getLoop(this.id);
		let when = this.audioContext.currentTime;
		
		if (loop) {
			const beginTime =  loop.start /1000;
			const endTime = loop.stop / 1000;
			const duration = endTime - beginTime;
			const howLong = this.audioContext.currentTime - this.startTime;	
			const fadeOutSeconds = (duration - howLong) / 4;				
			console.debug("AudioLooper " + this.styleType + " stop", fadeOutSeconds);		
			when = this.audioContext.currentTime + fadeOutSeconds;	
		}
		this.finished = true;
		this.gainNode.gain.setValueAtTime(0.01, when);
		this.source.stop(when + 0.01);
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
	
	if (loop.url.startsWith("assets")) 
	{
		fetch(loop.url)
			.then(response => response.arrayBuffer())
			.then(buffer => this.audioContext.decodeAudioData(buffer))
			.then(sample => {
				this.sample = sample;
				console.debug("addUri", loop, sample);
				if (this.cb_loaded) this.cb_loaded();
			});
	} else {
		const dbName = loop.url;
		const store = new idbKeyval.Store(dbName, dbName);		

		idbKeyval.get(dbName, store).then((data) => 
		{
			if (data) {
				console.debug("get ogg file", dbName, data);
				
				this.audioContext.decodeAudioData(data).then(sample => 
				{
					this.sample = sample;
					console.debug("addUri", loop, sample);
				});				
				
			}			
		}).catch(function (err) {
			console.error('getSongSequence failed!', err)
		});		
	}
};