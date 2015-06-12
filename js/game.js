var Game = function(app) {
  this.app = app;
  this.init();
}

Game.prototype = {

  gameInProgress: false,

  init: function() {
    this.setBindings();
  },

  setBindings: function() {
    this.uniKeyDown = this.uniKeyDown.bind(this);
    this.move = this.move.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onResetResponse = this.onResetResponse.bind(this);
    this.onEndResponse = this.onEndResponse.bind(this);
  },

  uniKeyDown: function(e) {
    switch (e.keyCode) {
      
      case 87: // w
        this.move('w');
        break;
      case 38: // up arrow
        this.move('w');
        break;

      case 65: // a
        this.move('a');
        break;
      case 37: // left arrow
        this.move('a');
        break;


      case 83: // s
        this.move('s');
        break;
      case 40: // down arrow
        this.move('s');
        break;

      case 68: // d
        this.move('d');
        break;
      case 39: // right arrow
        this.move('d');
        break;

      case 32:
        this.move('h');
        this.app.board.showHatchet();
        break;
    }
  },

  toggle: function() {
    if(this.gameInProgress) {
      this.endGame();
    } else {
      this.startNewGame();
    }
  },

  startDemo: function() {
    this.app.el.querySelector('#toggleButton').textContent = "Start";
    this.gameInProgress = false;
    this.app.board.buildDemo();
  },

  startExistingGame: function() {
    this.app.el.querySelector('#toggleButton').textContent = "End";
    this.app.board.buildExisting();
    this.gameInProgress = true;
    window.addEventListener("keyup", this.uniKeyDown);
  },

  startNewGame: function() {
    var that = this;
    this.app.el.querySelector('#toggleButton').textContent = "Starting...";
    var httpReq = new XMLHttpRequest();
    httpReq.onload = function() {
      that.onResetResponse(httpReq);
    }
    httpReq.open('POST', 'http://craigdh.bld.corp.google.com:8080/reset');
    httpReq.send(JSON.stringify({
      Token: gapi.auth.getToken().access_token,
      DocId: this.app.docId
    }));
  },

  endGame: function() {
    var that = this;
    var httpReq = new XMLHttpRequest();
    httpReq.onload = function() {
      that.onEndResponse(httpReq);
    }
    httpReq.open('GET', 'http://craigdh.bld.corp.google.com:8080/end');
    httpReq.send();
  },

  hasEnded: function() {
    // Brix document notifying us of a game ending
    console.log('brix acked an edned game');
    this.gameInProgress = false;
    this.app.el.querySelector('#toggleButton').textContent = "Start";
    window.removeEventListener("keyup", this.uniKeyDown);
  },

  move: function(dir) {
    var that = this;
    var httpReq = new XMLHttpRequest();
    httpReq.onload = function() {
      that.onMoveResponse(httpReq);
    }
    httpReq.open('POST', 'http://craigdh.bld.corp.google.com:8080/move');
    httpReq.send(JSON.stringify({ "Dir": dir }));
  },

  onMoveResponse: function(xhr) {
    this.app.board.setData(JSON.parse(xhr.responseText))
  },

  onResetResponse: function(xhr) {
    console.log(xhr.responseText);
    this.gameInProgress = true;
    this.app.board.buildNew();
    window.addEventListener("keyup", this.uniKeyDown);
    this.app.el.querySelector('#toggleButton').textContent = "End";
  },

  onEndResponse: function(xhr) {
    console.log(xhr.responseText);
  }
}
