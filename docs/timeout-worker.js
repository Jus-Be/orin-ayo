var timers = {};

function fireTimeout(id) {
  this.postMessage({id: id});
  delete timers[id];
}

this.addEventListener("message", function(evt) {
  var data = evt.data;
	console.debug("addEventListener", data);  

  switch (data.command) {
  case "setTimeout":
    var time = parseInt(data.timeout || 0, 10),
        timer = setTimeout(fireTimeout.bind(null, data.id), time);
    timers[data.id] = timer;
    break;
  case "clearTimeout":
    var timer = timers[data.id];
    if (timer) clearTimeout(timer);
    delete timers[data.id];
  }
});