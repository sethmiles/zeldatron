var Game = function(app) {
  this.app = app;
  this.init();
}

Game.prototype = {

  gameInProgress: false,

  init: function() {
    this.setBindings();
    window.addEventListener("keyup", this.uniKeyDown, false);
  },

  uniKeyDown: function(e) {
    switch (e.keyCode) {
      case 87: // w
        this.move('w');
        break;
      case 65: // a
        this.move('a');
        break;
      case 83: // s
        this.move('s');
        break;
      case 68: // d
        this.move('d');
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

    // this.ping();
  },

  endGame: function() {
    // this.end();
    this.gameInProgress = false;
  },

  move: function(dir) {
    // this.walk(dir);
    var httpReq = new XMLHttpRequest();
    httpReq.onload = this.reqListener;
    httpReq.open('POST', 'http://craigdh.bld.corp.google.com:8080/move');
    httpReq.send({ "Dir": dir });
  },

  ping: function() {
    this.makeCorsRequest('http://craigdh.bld.corp.google.com:8080/ping');
  },

  walk: function(dir) {
    var walkTime = 800;
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
    httpReq.open('POST', 'http://craigdh.bld.corp.google.com:8080/reset');
    httpReq.send(
      JSON.stringify({ Token: gapi.auth.getToken().access_token, DocId: this.app.docId}));
  },

  setBindings: function() {
    this.uniKeyDown = this.uniKeyDown.bind(this);
    this.move = this.move.bind(this);
  },

  // Create the XHR object.
  createCORSRequest: function(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  },

  // Make the actual CORS request.
  makeCorsRequest: function(url) {
    var xhr = this.createCORSRequest('GET', url);
    if (!xhr) {
      alert('CORS not supported');
      return;
    }

    // Response handlers.
    xhr.onload = function() {
      var text = xhr.responseText;
      alert('Response from CORS request to ' + url + ': ' + title);
    };

    xhr.onerror = function() {
      alert('Woops, there was an error making the request.');
    };

    xhr.send();
  }
}
