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
    walk(dir);
    var httpReq = new XMLHttpRequest();
    httpReq.onload = this.reqListener();
    httpReq.open('POST', 'http://craigdh.bld.corp.google.com:8080/move', false);
    httpReq.send(dir);
  },

  walk: function(dir) {
    var walkTime = 800;
    $('.player').removeClass('stand');
    setTimeout(function() { $player.addClass('stand'); }, walkTime);
    $('.player').addClass('walk');
    setTimeout(function() { $player.removeClass('walk'); }, walkTime);
    switch(dir) {
      case 'l':
        $('.player').addClass('left');
        setTimeout(function() { $player.removeClass('left'); }, walkTime);
        break;
      case 't':
        $('.player').addClass('top');
        setTimeout(function() { $player.removeClass('top'); }, walkTime);
        break;
      case 'r':
        $('.player').addClass('right');
        setTimeout(function() { $player.removeClass('right'); }, walkTime);
        break;
      case 'b':
        $('.player').addClass('bottom');
        setTimeout(function() { $player.removeClass('bottom'); }, walkTime);
        break;
      
    }
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
