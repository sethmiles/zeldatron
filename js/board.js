
var Board = function(app) {
  this.app = app;
  this.init();
}

Board.prototype = {

  elString: '<div id="board"></div>',

  margins: [20, 20, 20, 20],

  duration: 1000,

  init: function() {
    this.createEl();
    this.setBindings();
  },

  setBindings: function() {
    this.onWindowSizeChange = this.onWindowSizeChange.bind(this);
    this.onDocChange = this.onDocChange.bind(this);
    this.onNewDocChange = this.onNewDocChange.bind(this);
  },

  buildExisting: function() {
    this.app.doc.getModel().getRoot().addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.onDocChange);
    this.data = this.app.doc.getModel().getRoot().get('boardState');
    this.build();
  },

  buildDemo: function() {
    this.data = this.defaultBoard;
    this.build();
  },

  buildNew: function() {
    var that = this;
    this.data = this.emptyData;
    this.updateAll();
    setTimeout(function(){
      that.app.doc.getModel().getRoot().addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, that.onNewDocChange);
    }, this.duration);
    
  },

  onNewDocChange: function() {
    this.app.doc.getModel().getRoot().removeEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.onNewDocChange);
    this.data = this.app.doc.getModel().getRoot().get('boardState');
    this.app.doc.getModel().getRoot().addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.onDocChange);
    this.updateAll();
  },

  destroy: function() {
    this.app.doc.getModel().getRoot().removeEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.onDocChange);
  },

  build: function() {
    window.addEventListener('resize', this.onWindowSizeChange);
    this.setScales();
    this.svgContainer = d3.select(this.el)
        .append('svg')
      .attr('width', this.svgSize.width)
      .attr('height', this.svgSize.height)
      .style('margin', this.margins.join(' '));

    this.cellsContainer = this.svgContainer.append('g');

    this.characterContainer = d3.select(this.el).append('div')
      .attr('class', 'character-container')
      .style('width', this.svgSize.width)
      .style('height', this.svgSize.height)
      .style('margin', this.margins.join(' '));

    this.healthBar = this.svgContainer.append('g');

    this.el.setAttribute('style', 'width:' + (this.svgSize.width + this.margins[1] + this.margins[3]) + 'px;');
    
    this.createCells();
    this.createCharacters();
    this.setHealth();
  },

  onDocChange: function() {
    var data = this.app.doc.getModel().getRoot().get('boardState');
    if (data.Version > this.data.Version) {
      this.data = data;
      this.createCharacters();
      if (data.GameState == 'dead') {
        this.gameEnded();
      }
      console.log('updating according to brix');
    } else {
      console.log('brix is out of data, ignoring event');
    }
    
  },

  updateAll: function() {
    this.createCharacters();
    this.createCells();
  },

  setData: function(data) {
    if (data.Version > this.data.Version) {
      this.data = data;
      this.createCharacters();
      if (data.GameState == 'dead') {
        this.gameEnded();
      }
      console.log('applying immediate change');
    } else {
      console.log('brix is more updated than immediate change');
    }
  },

  gameEnded: function() {
    this.app.game.hasEnded();
    this.destroy();
  },

  createCharacters: function() {
    var that = this;

    this.characters = this.characterContainer.selectAll('div')
      .data(this.data.Objects, function(d) {
        return d.Id.toString();
      })

      this.characters
          .enter()
        .append('div')
        .attr('class', function(d) {
          return 'character ' + that.getCharacterClass(d.Type);
        })
        .style('left', function(d) {
          return that.scales.x(that.getRandomInt(0, that.data.Height));
        })
        .style('right', function(d) {
          return that.scales.y(that.getRandomInt(0, that.data.Height));
        })
        .style('width', 0)
        .style('height', 0);

      this.characters.transition().duration(75)
        .style('left', function(d) {
          return that.scales.x(d.Pos.X);
        })
        .style('top', function(d) {
          return that.scales.y(d.Pos.Y);
        })
        .style('width', this.squareWidth)
        .style('height', this.squareHeight);

      this.characters
          .exit().transition().duration(this.duration)
        .style('left', function(d) {
          return that.scales.x(that.getRandomInt(0, that.data.Height));
        })
        .style('right', function(d) {
          return that.scales.y(that.getRandomInt(0, that.data.Height));
        })
        .style('width', 0)
        .style('height', 0)
        .remove();
  },

  createCells: function() {
    var that = this;
    // Enter
    this.cells = this.cellsContainer.selectAll('rect')
        .data(this.getCellData());

    this.cells
        .enter()
      .append('rect')
      .attr('class', 'tile')
      .attr('x', function(d) {
        return that.scales.x(that.getRandomInt(0, that.data.Width));
      })
      .attr('y', function(d) {
        return that.scales.y(that.getRandomInt(0, that.data.Height));
      })
      .attr('width', 0)
      .attr('height', 0);

    // Update
    this.cells.transition().duration(this.duration)
      .attr('x', function (d) { return that.scales.x(d.x); })
      .attr('y', function (d) { return that.scales.y(d.y); })
      .attr('width', that.squareWidth)
      .attr('height', that.squareHeight);

    // Exit
    this.cells
        .exit().transition().duration(this.duration)
      .attr('x', function(d) {
        return that.scales.x(that.getRandomInt(0, that.data.Width));
      })
      .attr('y', function(d) {
        return that.scales.y(that.getRandomInt(0, that.data.Height));
      })
      .attr('width', 0)
      .attr('height', 0)
      .remove();
  },

  setHealth: function() {
    var that = this;

    var health = that.data.Health;
    this.hearts = this.healthBar.selectAll('heart').data([0, 1, 2, 3, 4]);
    this.hearts
      .enter()
      .append('li')
      .attr('class', 'heart')
      .attr('x', function (d) { return that.scales.x(d.x); })
      .attr('y', function (d) { return that.scales.y(d.y); })
      .attr('width', this.squareWidth)
      .attr('height', this.squareHeight);;
    var emptyHearts = [];
    for (var i = 5; i > health; i--)
      emptyHearts[i] = "empty";
    this.empty = this.healthBar.selectAll('heart').data(emptyHearts);
    this.empty
      .enter()
      .select('li')
      .attr('class', 'empty');
  },

  getCharacterClass: function(serverType) {
    switch(serverType) {
      case 'p':
        return 'player';
      case 'm':
        return 'monster';
      case 't':
        return 'tree';
      case 'r':
        return 'rock';
    }
  },

  updateContainers: function() {
    this.svgContainer[0][0].setAttribute('width', this.svgSize.width);
    this.svgContainer[0][0].setAttribute('height', this.svgSize.height);
    this.characterContainer[0][0].setAttribute('width', this.svgSize.width);
    this.characterContainer[0][0].setAttribute('height', this.svgSize.height);
    this.el.setAttribute('style', 'width:' + (this.svgSize.width + this.margins[1] + this.margins[3]) + 'px;');
  },

  onWindowSizeChange: function() {
    this.setScales();
    this.createCells();
    this.updateContainers();
    this.createCharacters();
  },

  setScales: function() {
    var that = this;
    // Requires a more complicated algorithm to subtract height of elemnts in the header
    var availableHeight = function() {
      var height = window.innerHeight - that.margins[0] - that.margins[2];
      Array.prototype.forEach.call(document.querySelectorAll('.game')[0].children, function(element) {
        if (element.id != 'board') {
          height -= element.offsetHeight;
        }
      });
      return height;
    }();

    var availableWidth = window.innerWidth - this.margins[1] - this.margins[3];

    this.squareWidth = availableWidth / this.data.Width;
    this.squareHeight = availableHeight / this.data.Height;

    this.squareWidth = this.squareWidth > this.squareHeight ? this.squareHeight : this.squareWidth;
    this.squareHeight = this.squareHeight > this.squareWidth ? this.squareWidth : this.squareHeight;

    this.svgSize = {
      width: this.squareWidth * this.data.Width,
      height: this.squareHeight * this.data.Height
    }

    this.scales = {
      x: d3.scale.linear().domain([0, this.data.Width]).range([0, this.svgSize.width]),
      y: d3.scale.linear().domain([0, this.data.Height]).range([0, this.svgSize.height])
    }
  },

  getRandomInt: function(lowerBound, uppderBound) {
    return Math.floor(Math.random() * (uppderBound + 1));
  },

  getCellData: function() {
    var data = [];
    for (var i = 0; i < this.data.Width; i++) {
      for (var j = 0; j < this.data.Height; j++ ) {
        data.push({
          x: i,
          y: j
        });
      }
    }
    return data;
  },

  createEl: function() {
    var div = document.createElement('div');
    div.innerHTML = this.elString;
    this.el = div.children[0];
  },

  emptyData: {
    "Width": 0,
    "Height": 0,
    "Version": -1,
    "Objects": []
  },

  defaultBoard: {
      "Width": 15,
      "Height": 15,
      "Version": -1,
      "Objects": [
          {
              "Pos": {
                  "X": 10,
                  "Y": 10
              },
              "Type": "p",
              "Id": 0
          },
          {
              "Pos": {
                  "X": 6,
                  "Y": 13
              },
              "Type": "m",
              "Id": 1
          },
          {
              "Pos": {
                  "X": 7,
                  "Y": 14
              },
              "Type": "m",
              "Id": 2
          },
          {
              "Pos": {
                  "X": 2,
                  "Y": 8
              },
              "Type": "m",
              "Id": 3
          },
          {
              "Pos": {
                  "X": 10,
                  "Y": 8
              },
              "Type": "m",
              "Id": 4
          },
          {
              "Pos": {
                  "X": 6,
                  "Y": 4
              },
              "Type": "m",
              "Id": 5
          }
      ]
  }
}



