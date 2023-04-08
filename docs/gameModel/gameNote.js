function GameNote(height, speed) {
  var _height = height;
  var _y = 0;
  var _speed = speed;
  
  return {
    update: function() {
      _y += _speed;
    },
    
    getY: function() { return _y; },
    getBottom: function() { return _y + _height; },
    getHeight: function() { return _height; }
  };
}