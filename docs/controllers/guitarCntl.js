var GuitarCntl = (function() {
  var STATE_1 = 25;
  var STATE_2 = 76;
  var STATE_3 = 150;
  var STATE_4 = 178;
  var STATE_5 = 229;

  var mainCntl = MainCntl();
  mainCntl.setupButtonsByNames(
    ['green', 'red', 'yellow', 'blue', 'orange',
     'overdrive', 'highFrets', 'strum', 'starpower', 'select', "previous", "next"]);
  mainCntl.buttonMap.state = STATE_1;
  mainCntl.buttonMap.whammy = 127;

  return {
    // public constants:
    STATE_1: STATE_1, STATE_2: STATE_2, STATE_3: STATE_3,
    STATE_4: STATE_4, STATE_5: STATE_5,

    buttonMap: mainCntl.buttonMap,

    parseData: function(data) {
      mainCntl.parseData(data);
      var fret = data[0];
      this.buttonMap.whammy = data[5];
      this.buttonMap.overdrive = data[19];
      var state = data[6];

      mainCntl.mapButton(this.buttonMap.starpower, !!(data[1]&0x01));
      mainCntl.mapButton(this.buttonMap.select, !!(data[1]&0x02));
      mainCntl.mapButton(this.buttonMap.previous, data[9]);
      mainCntl.mapButton(this.buttonMap.next, data[7]);

      mainCntl.mapButton(this.buttonMap.blue,      !!(fret&0x08));
      mainCntl.mapButton(this.buttonMap.green,     !!(fret&0x02));
      mainCntl.mapButton(this.buttonMap.red,       !!(fret&0x04));
      mainCntl.mapButton(this.buttonMap.yellow,    !!(fret&0x01));
      mainCntl.mapButton(this.buttonMap.orange,    !!(fret&0x10));
      //mainCntl.mapButton(this.buttonMap.overdrive, !!(fret&0x20));
      mainCntl.mapButton(this.buttonMap.highFrets, !!(fret&0x40));

      var strum = data[2];
      // mainCntl.UP state is represented by 0,
      // whereas 8, 6, and 2 represent non-strumming states
      if (strum === 8 || strum === 6 || strum === 2) {
        strum = mainCntl.NONE;
      } else if (strum === 0) {
        strum = mainCntl.UP;
      }
      mainCntl.mapButton(this.buttonMap.strum, strum);

      if (state !== 127)
        this.buttonMap.state = state;
    }
  };
})();