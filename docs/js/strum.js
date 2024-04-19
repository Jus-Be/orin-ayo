var guitar = _tone_0253_Acoustic_Guitar_sf2_file;
var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContextFunc();
var output = audioContext.destination;
var player = new WebAudioFontPlayer();
var now = 0;

var C = 0, Cs = 1, D = 2, Ds = 3, E = 4, F = 5, Fs = 6, G = 7, Gs = 8, A = 9, As = 10, B = 11;
var O = 12;
var _6th = E +O*3, _5th = A +O*3, _4th = D +O*4, _3rd = G +O*4, _2nd = B +O*4, _1st = E +O*5;

var fretsAm = [-1, 0, 2, 2, 1, 0];
var fretsC =  [3, 3, 2, 0, 1, 0];
var fretsE =  [ 0, 2, 2, 1, 0, 0];
var fretsG =  [ 3, 2, 0, 0, 0, 3];
var fretsDm = [-1,-1, 0, 2, 3, 1];

window.addEventListener("load", function() {
	player.loader.decodeAfterLoading(audioContext, '_tone_0253_Acoustic_Guitar_sf2_file');
	
	document.getElementById("fret6").addEventListener("click", function() {
		cancel(); console.log(player.queueWaveTable(audioContext, output, guitar, now, _6th, 1.5));
	});
	document.getElementById("fret5").addEventListener("click", function() {
		cancel(); console.log(player.queueWaveTable(audioContext, output, guitar, now, _5th, 1.5));
	});
	document.getElementById("fret4").addEventListener("click", function() {
		cancel(); console.log(player.queueWaveTable(audioContext, output, guitar, now, _4th, 1.5));
	});		
	document.getElementById("fret3").addEventListener("click", function() {
		cancel(); console.log(player.queueWaveTable(audioContext, output, guitar, now, _3rd, 1.5));
	});
	document.getElementById("fret2").addEventListener("click", function() {
		cancel(); console.log(player.queueWaveTable(audioContext, output, guitar, now, _2nd, 1.5));
	});
	document.getElementById("fret1").addEventListener("click", function() {
		cancel(); console.log(player.queueWaveTable(audioContext, output, guitar, now, _1st, 1.5));
	});		

	document.getElementById("am-strum").addEventListener("click", function() {	
		cancel(); console.log(player.queueChord    (audioContext, output, guitar, now, pitches(fretsC), 1.5));
	});
	document.getElementById("am-strum-mute").addEventListener("click", function() {
		cancel(); console.log(player.queueSnap     (audioContext, output, guitar, now, pitches(fretsC), 1.5));
	});
	document.getElementById("am-strum-down").addEventListener("click", function() {
		cancel(); console.log(player.queueStrumDown(audioContext, output, guitar, now, pitches(fretsC), 1.5));
	});	
	document.getElementById("am-strum-up").addEventListener("click", function() {			
		cancel(); console.log(player.queueStrumUp  (audioContext, output, guitar, now, pitches(fretsC), 1.5));
	});	
});


function pitches(frets) {
	var p = [];
	if (frets[0] > -1) p.push(_6th + frets[0]);
	if (frets[1] > -1) p.push(_5th + frets[1]);
	if (frets[2] > -1) p.push(_4th + frets[2]);
	if (frets[3] > -1) p.push(_3rd + frets[3]);
	if (frets[4] > -1) p.push(_2nd + frets[4]);
	if (frets[5] > -1) p.push(_1st + frets[5]);
	return p;
}

function cancel(){
	player.cancelQueue(audioContext);
}