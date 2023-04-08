function NoteRow(context, game, x, y, width, height) {
  var _game = game;
  var _x = x;
  var _y = y;
  var _width = width;
  var _height = height;
  
  var rowWidth = _width / 5;
  
  return {
    update: function() {
      context.fillStyle = '#100020';
      context.strokeStyle = "#332266";
      context.lineWidth = 2;
      context.fillRect(_x, _y, _width, _height);
      context.strokeRect(_x, _y, _width, _height);
      
      context.fillStyle = '#332266';
      for (var i = 1; i < 5; i++) {
        context.fillRect(_x + (rowWidth * i) - 1, _y, 2, _height);
      }
      
      noteFillColors = ['#00FF00', '#FF0000', '#FFFF00', '#0000FF', '#FF8800'];
      noteStrokeColors = ['#008800', '#880000', '#888800', '#000088', '#884400'];
      for (i = 0; i < 5; i++) {
        noteStates = _game.getNotesForRow(i);
        for (var j = 0; j < noteStates.length; j++) {
          noteState = noteStates[j];
          note = new Note(
            context,
            _x + (rowWidth * i), noteState.getY(),
            rowWidth - 4, noteState.getHeight(),
            noteStrokeColors[i], noteFillColors[i]);
          note.update();
        }
      }
    }
  };
}