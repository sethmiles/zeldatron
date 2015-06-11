
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
  },

  build: function() {
    // this.data = this.app.doc.getModel().getRoot().get('boardState');
    this.app.doc.getModel().getRoot().addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.onDocChange);
    window.addEventListener('resize', this.onWindowSizeChange)
    this.setScales();

    this.svgContainer = d3.select(this.el)
      .append('svg')
      .attr('width', this.svgSize.width)
      .attr('height', this.svgSize.height)
      .style('margin', this.margins.join(' '));

    this.characterContainer = d3.select(this.el).append('div')
      .attr('class', 'character-container')
      .style('width', this.svgSize.width)
      .style('height', this.svgSize.height)
      .style('margin', this.margins.join(' '));

    this.el.setAttribute('style', 'width:' + (this.svgSize.width + this.margins[1] + this.margins[3]) + 'px;');

    this.createCells();
    this.createCharacters();
    this.updateCells();
  },

  onDocChange: function() {
    this.data = this.app.doc.getModel().getRoot().get('boardState');
    this.updateBoard();

  },

  updateBoard: function() {
    this.updateCharacters();
  },

  createCharacters: function() {
    

    this.characters = this.characterContainer.selectAll('div')
        .data(this.data.Objects, function(d) {
          return d.Id;
        })
      .enter()
      .append('div')
      .attr('class', function(d) {
        return 'character ' + d.Type;
      })
      .style('left', 0)
      .style('right', 0)
      .style('width', this.squareWidth)
      .style('height', this.squareHeight);

      this.updateCharacters();
  },

  updateCharacters: function() {
    var that = this;
    this.characters.transition().duration(this.duration)
      .style('left', function(d) {
        return that.scales.x(d.Pos.X);
      })
      .style('top', function(d) {
        return that.scales.y(d.Pos.Y);
      })
      .style('width', this.squareWidth)
      .style('height', this.squareHeight);
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
    this.updateCells();
    this.updateContainers();
    this.updateCharacters();
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

  createCells: function() {
    var that = this;
    this.cellsContainer = this.svgContainer.append('g');
      this.cells = this.cellsContainer.selectAll('rect')
          .data(this.getCellData())
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
  },

  getRandomInt: function(lowerBound, uppderBound) {
    return Math.floor(Math.random() * (uppderBound + 1));
  },

  updateCells: function() {
    var that = this;
    this.cells.transition().duration(this.duration)
      .attr('x', function (d) { return that.scales.x(d.x); })
      .attr('y', function (d) { return that.scales.y(d.y); })
      .attr('width', that.squareWidth)
      .attr('height', that.squareHeight);
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

  data: {
      "Width": 15,
      "Height": 15,
      "Objects": [
          {
              "Pos": {
                  "X": 0,
                  "Y": 0
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



