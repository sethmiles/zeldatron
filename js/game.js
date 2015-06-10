var Game = function() {
  this.init();
}

Game.prototype = {
  init: function() {
    var app = document.getElementById("app");
    app.addEventListener("keydown", uniKeyDown(e), false);
  }
  uniKeyDown: function(e) {
    switch (e.keyCode) {
      case 37:
        move('l');
        break;
      case 38:
        move('u');
        break;
      case 39:
        move('r');
        break;
      case 40:
        move('d');
        break;
    }
  }
  move: function(dir) {
   xmlhttp.open('POST', '/move', false);
   xmlhttp.send(dir);
  }
} 
  
