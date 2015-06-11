
var App = function() {
  this.init();
}

App.prototype = {

  elString: '<div id="zeldatron" class="unauthenticated">' +
              '<div class="loading">' +
                '<div class="spinner">' +
                  '<div class="double-bounce1"></div>' +
                  '<div class="double-bounce2"></div>' +
                '</div>' +
              '</div>' +
              '<div id="auth-modal" class="invisible">' +
                '<h1>Woah! Looks like you\'re not authenticated!</h1>' +
                '<p>We need to mess with stuff in your drive, click authenticate to let Zelda work his magic!</p>' +
                '<div id="auth-btn" class="btn">Authenticate</div>' +
              '</div>' +
              '<div class="game">' +
                '<div class="title">Zeldatron</div>' +
                '<div class="buttons">' +
                  '<div id="startButton" class="game-btn">Start</div>' +
                '</div>' +
              '</div>' +
            '</div>',

  init: function() {
    this.createEl();
    this.setBindings();

    this.utils = new window.utils.RealtimeUtils({
      clientId: '683860718220-e01o212upndu1ealc33pmi60kj692vaj.apps.googleusercontent.com'
    });

    this.utils.authorize(this.onAuthComplete, false);

    // Create new instance of Game
    this.game = new Game(this);
    this.board = new Board(this);
    this.el.querySelector('.game').appendChild(this.board.el);
    this.el.querySelector('#startButton').addEventListener('click', this.toggleGameState);
  },

  setBindings: function() {
    this.onAuthClick = this.onAuthClick.bind(this);
    this.onAuthComplete = this.onAuthComplete.bind(this);
    this.onFileLoaded = this.onFileLoaded.bind(this);
    this.toggleGameState = this.toggleGameState.bind(this);
  },

  start: function() {
    var that = this;
    var id = this.utils.getParam('id');
    if (id) {
      id = id.replace('/','');
      this.docId = id;
      this.utils.load(id, this.onFileLoaded, this.initializeFile)
    } else {
      this.utils.createRealtimeFile('Zeldatron Game', function(file) {
        if (file.id) {
          that.docId = id;
          history.pushState({}, '', '?id=' + file.id);
          that.utils.load(file.id, that.onFileLoaded, that.initializeFile);
        }
      });
    }
  },

  onFileLoaded: function(doc) {
    var that = this;
    this.doc = doc;
    this.el.classList.remove('unauthenticated');
    // This is used for effect and to ensure that everything is already attached to the DOM
    setTimeout(function(){
      that.board.build();
    }, 500);
  },

  initializeFile: function(model) {
    model.getRoot().set('boardState', {});
  },

  onAuthComplete: function(response) {
    if (gapi.auth.getToken()) {
      this.start();
    } else {
      // prevent memory leaks
      this.el.querySelector('#auth-modal').classList.add('visible');
      this.el.querySelector('#auth-btn').removeEventListener('click', this.onAuthClick);
      this.el.querySelector('#auth-btn').addEventListener('click', this.onAuthClick);
      this.utils.authorize(this.onAuthComplete, true);
    }
  },

  toggleGameState: function() {
    this.game.toggle();
  },

  onAuthClick: function() {
    this.utils.authorize(this.onAuthComplete, true);
  },

  createEl: function() {
    var div = document.createElement('div');
    div.innerHTML = this.elString;
    this.el = div.children[0];
  }

}
