function Note (context, x, y, width, height, stroke, fill) {
  var _x = x;
  var _y = y;
  var _width = width;
  var _height = height;
  var _fill = fill;
  var _stroke = stroke;
  var _ctx = context;
  
  function drawFrame() {
    _ctx.fillStyle = _fill;
    _ctx.strokeStyle = _stroke;
    _ctx.lineWidth = 3;
    _ctx.fillRect(_x, _y, _width, _height);
    _ctx.strokeRect(_x, _y, _width, _height);
  }
  
  return {
    update: function () {
      drawFrame();
    },
    
    setFill: function(color) { _fill = color; },
    setStroke: function(color) { _stroke = color; },
    setX: function(x) { _x = x; },
    setY: function(y) { _y = y; },
    
    x: function() { return _x; },
    y: function() { return _y; }
  };
}