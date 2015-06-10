var Game = function() {
  this.init();
}

Game.prototype = {
  init: function() {
    this.setBindings();
    window.addEventListener("keydown", this.uniKeyDown, false);
  },

  uniKeyDown: function(e) {
    switch (e.keyCode) {
      case 37:
        this.move('l');
        break;
      case 38:
        this.move('t');
        break;
      case 39:
        this.move('r');
        break;
      case 40:
        this.move('b');
        break;
    }
  },

  reqListener: function() {
    console.log(this.responseText);
  },

  move: function(dir) {
    var httpReq = new XMLHttpRequest();
    httpReq.onload = this.reqListener();
    httpReq.open('POST', 'craigdh.bld.corp.google.com:8080/move', false);
    httpReq.send(dir);
  },

  setBindings: function() {
    this.uniKeyDown = this.uniKeyDown.bind(this);
    this.move = this.move.bind(this);
  }
}
