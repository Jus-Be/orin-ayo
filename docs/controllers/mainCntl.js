var MainCntl = function() {
  
  function mapButton(originalState, newState) {
    // Objective: we want pressed to represent when a state has changed (2),
    //  but only if that state is not an un-pressed one (3),
    //  and only keep this true for one frame (1)
    originalState.pressed = !originalState.pressed &&
                            (originalState.state !== newState) &&
                            !!newState;
    originalState.state = newState;
  }
  
  function setupButtonsByNames(names) {
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      buttonMap[name] = {
        pressed: false,
        state: false
      };
    }
  }
  
  var buttonMap = {};
  
  setupButtonsByNames(['plus', 'minus', 'instrument', 'dpad']);
  
  return {
    // Public constants
    NONE: 0,
    LEFT: 6, RIGHT: 2,
    UP: 8, DOWN: 4,
    
    buttonMap: buttonMap,
    
    setupButtonsByNames: setupButtonsByNames,
    mapButton: mapButton,
    
    parseData: function(data) {
      var extra = data[1];
      var dpad = data[2];
      
      // It's dumb that 8 is the default state. Let's fix that:
      if (dpad === 0) {
        dpad = 8;
      } else if (dpad === 8) {
        dpad = 0;
      }
      mapButton(this.buttonMap.dpad, dpad);
      
      mapButton(this.buttonMap.plus,       !!(extra&0x01));
      mapButton(this.buttonMap.minus,      !!(extra&0x02));
      mapButton(this.buttonMap.instrument, !!(extra&0x10));
    }
  };
};