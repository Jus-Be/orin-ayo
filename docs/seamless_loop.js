/**
 * SeamlessLoop.js 2.0 - Reproduces seamless loops on HTML5/Javascript
 * https://github.com/Hivenfour/SeamlessLoop
 * 
 * Copyright (c) 2012 Main Software,
 * Written by Darío Tejedor Rico. Contact mail: hivenfour@gmail.com
 * The source code is freely distributable under the terms of LGPL license.
 * License details at http://www.gnu.org/licenses/lgpl-3.0.txt
 * 
 * USAGE:
 * - Create the Seamlessloop object
 * 		var loop = new SeamlessLoop();
 * 
 * - Add as many sounds as you will use, providing duration in miliseconds
 * (sounds must be pre-loaded if you want to update the loop without gaps)
 * 		loop.addUri(uri, length, "sound1");
 * 		loop.addUri(uri, length, "sound2");
 * ...
 * 
 * - Establish your callback function that will be called when all sounds are pre-loaded
 * 		loop.callback(soundsLoaded);
 * 
 * - Start reproducing the seamless loop:
 * 		function soundsLoaded() {
 * 			var n = 1;
 * 			loop.start("sound" + n);
 * 		};
 * 
 * - Update the looping sound, you can do this
 * synchronously (waiting the loop to finish)
 * or asynchronously (change sound immediately):
 * 		n++;
 * 		loop.update("sound" + n, false);
 * 
 * - Modify the seamless loop volume:
 * 		loop.volume(0.5);
 * 		loop.volume(loop.volume() + 0.1);
 * 
 * - Stop the seamless loop:
 * 		loop.stop();
 */

function SeamlessLoop() {
	this._total = 0;
	this._load = 0;
	this.cb_loaded;
	this.cb_loaded_flag = true;
	this.audios = {};
	this._volume = 1;	
    this.audioContext = new AudioContext();	
		
	var t = this;

	this.doLoop = function() {	
		this.startTime = this.audioContext.currentTime;
		console.log("doLoop starts", this.actual, this.filler, this.id);
		
		if (this.cb_status) this.cb_status("_eventPlaying", this.id);			
		
		this.actual.source = this.audioContext.createBufferSource();
		this.actual.source.loop = this.id == "int1" || this.id == "end1" ? false : true;
		//this.actual.source.loopStart = 0;
		//this.actual.source.loopEnd = (this.actual._length / 1000) - this.filler;		
		this.actual.source.buffer = this.actual.sample;	
		this.actual.gainNode = this.audioContext.createGain()
		this.actual.gainNode.gain.value = 1;
		this.actual.gainNode.connect(this.audioContext.destination)		
		this.actual.source.connect(this.actual.gainNode);
		this.actual.source.start(0);
		
		//setTimeout(() => this.actual.source.loopEnd = this.actual._length / 1000, this.actual._length + 1000);
		
		this.filler = 0;
		
		this.actual.source.addEventListener("ended", () => {
			console.log("doLoop ends", this.actual, this.filler, this.id);	
			if (this.cb_status) this.cb_status("_eventEnded", this.id);			
		});		
	};
}

SeamlessLoop.prototype.start = function(id) {
	this.id = id;
	this.actual = this.audios[id];
	this.filler = 0;
	this.doLoop();
};

SeamlessLoop.prototype.volume = function(vol) {
	if(typeof vol != "undefined") {
		this._volume = vol;
	}
	
	return vol;
};

SeamlessLoop.prototype.stop = function() {	
	if (this.actual.source) {
		this.actual.source.loop = false;	
		this.actual.source.stop();	
	}
};

SeamlessLoop.prototype.callback = function(cb_loaded, cb_status) {
	this.cb_status = cb_status;
	this.cb_loaded = cb_loaded;
	
	if (this._load == this._total) cb_loaded();
	else this.cb_loaded_flag = true;
};

SeamlessLoop.prototype.update = function(id, sync) {
	const duration = (this.audioContext.currentTime - this.startTime) * 1000;
	const beat = duration % this.actual._length;
	const ratio = beat / this.actual._length;	
	console.debug("update", id, duration, beat, this.actual._length, ratio);
	
	if (this.actual.source) {
		this.actual.source.loop = false;
		const source = this.actual.source;

		if (sync || ratio > 0.75) {
			this.actual.source.addEventListener("ended", () => {
				console.log(this.id + " ended", this.actual, this.filler, this.id);
				source.stop();			
				this.doLoop();
			});	
			
			this.actual = this.audios[id];
			this.filler = 0;
			this.id = id;			
			
		} else {
			this.actual.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);				
			this.actual = this.audios[id];
			this.filler = (this.actual._length - beat) / 1000;			
			this.id = id;			
			this.doLoop();			
		}
	}
};

SeamlessLoop.prototype.addUri = function(uri, length, id, output) {
	this.audios[id] = {};
	this.audios[id]._length = length;

	this._total++;
	if (output) this.audioContext.setSinkId(output.deviceId);
	
	fetch(uri)
		.then(response => response.arrayBuffer())
		.then(buffer => this.audioContext.decodeAudioData(buffer))
		.then(sample => {
			this.audios[id].sample = sample;
			this._load++;
		});
};