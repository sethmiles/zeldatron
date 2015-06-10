
var Board = function() {
  this.init();
}

Board.prototype = {

  elString: '<div id="board"></div>',

  margins: [20, 20, 20, 20],

  data: {
    "width":15,
    "height":15,
    "objects":[{
      "pos":{
        "X":0,
        "Y":0
      },
      "type":"p"
    }]
  },

  init: function() {
    this.createEl();
  },

  build: function() {
    this.setScales();

    this.svgContainer = d3.select(this.el)
      .append('svg')
      .attr('width', this.svgSize.width)
      .attr('height', this.svgSize.height)
      .style('margin', this.margins.join(' '));

    this.el.setAttribute('style', 'width:' + (this.svgSize.width + this.margins[1] + this.margins[3]) + 'px;');

    this.createCells();
    this.updateCells();
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

    this.squareWidth = availableWidth / this.data.width;
    this.squareHeight = availableHeight / this.data.height;

    this.squareWidth = this.squareWidth > this.squareHeight ? this.squareHeight : this.squareWidth;
    this.squareHeight = this.squareHeight > this.squareWidth ? this.squareWidth : this.squareHeight;

    this.svgSize = {
      width: this.squareWidth * this.data.width,
      height: this.squareHeight * this.data.height
    }

    this.scales = {
      x: d3.scale.linear().domain([0, this.data.width]).range([0, this.svgSize.width]),
      y: d3.scale.linear().domain([0, this.data.height]).range([0, this.svgSize.height])
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
          return that.scales.x(that.getRandomInt(0, that.data.width));
        })
        .attr('y', function(d) {
          return that.scales.y(that.getRandomInt(0, that.data.height));
        })
        .attr('width', 0)
        .attr('height', 0);
  },

  getRandomInt: function(lowerBound, uppderBound) {
    return Math.floor(Math.random() * (uppderBound + 1));
  },

  updateCells: function() {
    var that = this;
    this.cells.transition().duration(1500)
      .attr('x', function (d) { return that.scales.x(d.x); })
      .attr('y', function (d) { return that.scales.y(d.y); })
      .attr('width', that.squareWidth)
      .attr('height', that.squareHeight);
  },

  getCellData: function() {
    var data = [];
    for (var i = 0; i < this.data.width; i++) {
      for (var j = 0; j < this.data.height; j++ ) {
        data.push({
          x: i,
          y: j
        });
      }
    }
    return data;
  },

  setDoc: function(doc) {
    if (this.doc) {

    }

    this.doc = doc;
    this.doc.getModel().getRoot().addEventListener(gapi.drive.realtime.EventType)

  },

  createEl: function() {
    var div = document.createElement('div');
    div.innerHTML = this.elString;
    this.el = div.children[0];
  }

}



