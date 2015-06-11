var Game = function(app) {
  this.app = app;
  this.init();
}

Game.prototype = {

  gameInProgress: false,

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

  toggle: function() {
    if(this.gameInProgress) {
      this.endGame();
    } else {
      this.startGame();
    }
    this.reset();
  },

  startGame: function() {
    this.reset();
    this.gameInProgress = true;
  },

  endGame: function() {
    this.end();
    this.gameInProgress = false;
  },

  move: function(dir) {
    var httpReq = new XMLHttpRequest();
    httpReq.onload = this.reqListener();
    httpReq.open('POST', 'http://craigdh.bld.corp.google.com:8080/move', false);
    httpReq.send(dir);
  },

  reset: function() {
    var httpReq = new XMLHttpRequest();
    httpReq.onload = this.reqListener();
    httpReq.open('POST', 'http://craigdh.bld.corp.google.com:8080/reset', false);
    httpReq.send({ Token: gapi.auth.getToken().access_token, DocId: app.docId});
  },

  setBindings: function() {
    this.uniKeyDown = this.uniKeyDown.bind(this);
    this.move = this.move.bind(this);
  }
}
