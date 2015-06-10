
var Board = function() {
  this.init();
}

Board.prototype = {

  elString: '<div id="board"></div>',

  init: function() {
    this.createEl();
  },

  createEl: function() {
    var div = document.createElement('div');
    div.innerHTML = this.elString;
    this.el = div.children[0];
  }

}