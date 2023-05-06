function HitBar(context, x, y, width, height) {
  var _x = x;
  var _y = y;
  var _width = width;
  var _height = height;
  
  //console.log(_height);
  //console.log(_x);
  //console.log(_y);
  
  var noteWidth = (width * 2) / 15;
  var notePadding = width / 30;
  
  var gx = _x + notePadding;
  var rx = gx + noteWidth + notePadding + notePadding;
  var yx = rx + noteWidth + notePadding + notePadding;
  var ux = yx + noteWidth + notePadding + notePadding;
  var ox = ux + noteWidth + notePadding + notePadding;
  
  var gNote = new Note(context, gx, _y, noteWidth, height, '#008800', '#000000');
  var rNote = new Note(context, rx, _y, noteWidth, height, '#880000', '#000000');
  var yNote = new Note(context, yx, _y, noteWidth, height, '#888800', '#000000');
  var uNote = new Note(context, ux, _y, noteWidth, height, '#000088', '#000000');
  var oNote = new Note(context, ox, _y, noteWidth, height, '#884400', '#000000');
  
  var notes = [gNote, rNote, yNote, uNote, oNote];
  
  return {
    update: function() {
	  //console.debug("** update**", pad);
      context.fillStyle = '#666666';
      context.fillRect(_x, _y + ((3 * _height) / 8) - 2, _width, (_height / 4) + 4);
      context.fillStyle = '#444444';
      context.fillRect(_x + 2, _y + ((3 * _height) / 8), _width - 4, _height / 4);
      
      gNote.setFill(pad.buttons[GREEN] ? '#00FF00' : '#000000');
      rNote.setFill(pad.buttons[RED] ? '#FF0000' : '#000000');
      yNote.setFill(pad.buttons[YELLOW] ? '#FFFF00' : '#000000');
      uNote.setFill(pad.buttons[BLUE] ? '#0000FF' : '#000000');
      oNote.setFill(pad.buttons[ORANGE] ? '#FF8800' : '#000000');
      
      for (var i = 0; i < notes.length; i++) {
        note = notes[i];
        note.update();
      }
    }
  };
}