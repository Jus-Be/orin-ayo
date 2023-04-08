function HitRegion(top, height) {
  var _top = top;
  var _height = height;
  
  return {
    checkNoteInRegion: function(note) {
      return (note.getY() < this.getBottom()) && (note.getBottom() > _top);
    },
    
    getTop: function() { return _top; },
    getBottom: function() { return _top + _height; },
    getHeight: function() { return _height; }
  };
}