var timerID=null;
var interval=100;

self.onmessage=function(e){
	if (e.data=="start") {
		console.debug("starting");
		timerID=setInterval(function(){postMessage("tick");},interval)
	}
	else if (e.data.interval) {
		console.debug("setting interval");
		interval=e.data.interval;
		console.debug("interval="+interval);
		if (timerID) {
			clearInterval(timerID);
			timerID=setInterval(function(){postMessage("tick");},interval)
		}
	}
	else if (e.data=="stop") {
		console.debug("stopping");
		clearInterval(timerID);
		timerID=null;
	}
};

postMessage('hi there');