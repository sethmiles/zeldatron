
var App = function() {
  this.init();
}

App.prototype = {

  elString: '<div id="app"></div>',

  init: function() {
    this.board = new Board();
    // Create new instance of Game
    // this.game = new Game();
    this.createEl();
  },

  createEl: function() {
    var div = document.createElement('div');
    div.innerHTML = this.elString;
    this.el = div.children[0];
  }

}