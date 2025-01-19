function AudioLooper(styleType) {
	this.styleType = styleType;
	this.cb_loaded = null;
	this.cb_status = null;
    this.audioContext = audioContext; //new AudioContext();	

	this.channel = (this.styleType == "drum" ? "16" : (this.styleType == "bass" ? "17" : "18"));	
	this.counter = 6;	

	this.getLoop = function(id) {	// key0 OR key0_maj OR key0_min_arra
		const keys = id.split("_");

		let key = id;		
		if (!this.loop[key]) key = keys[0] + "_" + keys[1] + "_" + keys[2];
		if (!this.loop[key]) key = keys[0] + "_" + keys[1];
		if (!this.loop[key]) key = keys[0] + "_maj_arra";
		if (!this.loop[key]) key = keys[0] + "_maj";		
		if (!this.loop[key]) key = keys[0];		
		
		const loop = this.loop[key];
		console.debug("getLoop", id, key, loop);		
		return loop;		
	};
		
	this.doLoop = function(id, beginTime, howLong, when) {		
		console.debug("doLoop starts", id, this.id, howLong, when);
		
		if (id == "end1")  this.offset = 0; 
		if (when == undefined) when = this.audioContext.currentTime;
		this.startTime = when - this.offset;
		
		if (this.source) {

		}
		
		this.source = this.audioContext.createBufferSource();		
		this.source.buffer = this.sample;	
		this.source.playbackRate.value = 1;
		this.gainNode = this.audioContext.createGain();
		this.gainNode.gain.value = 0.01;			
			
		if (this.firstTime) {
			this.firstTime = false;
			this.gainNode.gain.setTargetAtTime(this.vol, when, 0.5);			
			
		} else {
			this.gainNode.gain.exponentialRampToValueAtTime(this.vol, when + 0.01);	
		}
		
		this.gainNode.connect(this.audioContext.destination);		
		if (recorderDestination) this.gainNode.connect(recorderDestination);		
		if (streamDestination) this.gainNode.connect(streamDestination);			
		this.source.connect(this.gainNode);			
		
		try {
			this.source.start(when, (beginTime + this.offset), (howLong - this.offset));	
		} catch (e) {
			this.source.start();
		}

		this.gainNode.gain.setValueAtTime(this.vol, when + howLong - this.offset - 0.01);
		this.gainNode.gain.exponentialRampToValueAtTime(0.01, when + howLong - this.offset);			
		
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
				setTimeout(checkStartStopWebAudio, 5000);				
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
	this.gainNode.gain.setTargetAtTime(this.vol, this.audioContext.currentTime, 0.5);	
}

AudioLooper.prototype.unmute = function(id) {
	this.vol = this.prevVol;		
	this.gainNode.gain.setTargetAtTime(this.vol, this.audioContext.currentTime, 0.5);	
}

AudioLooper.prototype.update = function(id, sync) {
	if (id == this.id) return;	
    if (!styleStarted) return;

	this.vol = this.styleType == "bass" ? bassVol/100 : ( this.styleType == "chord" ? chordVol/100 : drumVol/100);
	console.debug("update", id, sync);	
	this.displayUI(true);	
	
	if (this.source) {	
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

AudioLooper.prototype.start = function(id, when) {
    if (styleStarted) return;
	
	this.displayUI(true);	
	this.looping = true;
	this.reloop = true;
	this.firstTime = true;
	this.offset = 0;
	this.id = id;
	this.vol = this.styleType == "bass" ? bassVol/100 : ( this.styleType == "chord" ? chordVol/100 : drumVol/100);
	this.prevVol = this.vol;

	const loop = this.getLoop(this.id);
	
	if (loop) {
		const beginTime =  loop.start /1000;
		const endTime = loop.stop / 1000;
		const howLong = endTime - beginTime;	
		
		console.debug("AudioLooper " + this.styleType + " start", when);	

		if (this.sample) this.doLoop(id, beginTime, howLong, when);
		setTimeout(checkStartStopWebAudio, howLong + 1000);
	}
};

AudioLooper.prototype.setVolume = function(vol) {
	if (typeof vol != "undefined") {
		this.vol = vol;
		
		if (this.gainNode) {
			this.gainNode.gain.value = vol;
		}
	}
	
	return vol;
};

AudioLooper.prototype.displayUI = function(flag) {
	this.instrumentNode = document.getElementById("arr-instrument-" + this.channel);	
	console.debug("displayUI", this.instrumentNode, this.channel);
	
	if (this.instrumentNode && !mobileCheck()) {
		const classList = this.instrumentNode.parentNode.parentNode.parentNode.parentNode.querySelector("tbody > tr:nth-child(" + (parseInt(this.channel) + 1) + ") > td:nth-child(" + this.counter + ")").classList;				
		
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
	this.firstTime = false;	
	
	if (this.source && this.id) {
		const loop = this.getLoop(this.id);
		let when = this.audioContext.currentTime;
		
		if (loop) {
			const beginTime =  loop.start /1000;
			const endTime = loop.stop / 1000;
			const duration = endTime - beginTime;
			const howLong = this.audioContext.currentTime - this.startTime;	
			const fadeOutSeconds = (duration - howLong) / 4;				
			console.debug("AudioLooper " + this.styleType + " stop", fadeOutSeconds, this.finished);		
			when = this.audioContext.currentTime + fadeOutSeconds;	
		}
		this.gainNode.gain.setTargetAtTime(0.01, this.audioContext.currentTime, 0.5);		
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
		this.sample = window.loopCache[loop.url];	
		
		if (this.sample == undefined) {
			fetch(loop.url, {cache: "force-cache"})
				.then(response => response.arrayBuffer())
				.then(buffer => this.audioContext.decodeAudioData(buffer))
				.then(sample => {
					this.sample = sample;
					window.loopCache[loop.url] = sample;
					console.debug("addUri fetched", loop.url, sample);
					if (this.cb_loaded) this.cb_loaded(false);
				});
		} else {
			console.debug("addUri cached", loop.url, this.sample);
			if (this.cb_loaded) this.cb_loaded(true);				
		}
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