function GameBoard(context, x, y, width, height) {
  
  var content = [
    new HitBar(context, x, 50, width, 100)
  ];
  
  return {
    update: function() {
      for (var i = 0; i < content.length; i++) {
        content[i].update();
      }
    }
  };
}