function GameBoard(context, game, x, y, width, height) {
  var _game = game;
  
  var _hitRegion = _game.getHitRegion();
  var content = [
    //new NoteRow(context, game, x, y, width, height),
    new HitBar(context, x, _hitRegion.getTop(), width, _hitRegion.getHeight())
  ];
  
  return {
    update: function() {
      for (var i = 0; i < content.length; i++) {
        content[i].update();
      }
    }
  };
}