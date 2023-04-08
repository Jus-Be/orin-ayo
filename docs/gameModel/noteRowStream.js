function NoteRowStream(speed, noteHeight, hitRegion, height) {
  var _speed = speed;
  var _hitRegion = hitRegion;
  var _height = height;
  var _noteHeight = noteHeight;
  var notes = [];
  
  return {
    update: function() {
      for (var i = notes.length - 1; i >= 0; i--) {
        var note = notes[i];
        note.update();
        if (note.getY() > _height) {
          notes.splice(0, i + 1);
          break;
        }
      }
    },
    
    checkForNoteHit: function() {
      flag = false;
      
      for (var i = 0; i < notes.length; i++) {
        var note = notes[i];
        if (_hitRegion.checkNoteInRegion(note)) {
          notes.splice(i, 1);
          flag = true;
          break;
        }
      }
      
      return flag;
    },
    
    createNote: function() {
      notes.push(new GameNote(_noteHeight, _speed));
    },
    
    getNotes: function() {
      return notes;
    }
  };
}