export class Grid {

  constructor(identifier, container, options) {
    this._identifier = identifier;
    this._container = container;
    this._sizeX = Object.keys(options).includes('sizeX') ? options.sizeX : 10;
    this._sizeY = Object.keys(options).includes('sizeY') ? options.sizeY : 10;

    this._width = this._container.offsetWidth;
    this._height = this._container.offsetHeight;

    this._debug = Object.keys(options).includes('debug') ? options.debug : false;
    this._pile = Object.keys(options).includes('pile') ? options.pile : false;

    if (this._debug) this.showDebug();

    this._grid = [];

    for (let y = 0; y < this._height; y += (this._height / this._sizeY))
      for (let x = 0; x < this._width; x += (this._width / this._sizeX))
        this._grid.push([x + 0.5, y + 0.5]);

    this.placeWidgets(identifier)
  }

  placeWidgets(identifier) {
    var elements = document.querySelectorAll(identifier);
    var self = this;

    Array.prototype.forEach.call(elements, function(el, i) {
      var posX = el.getAttribute('data-posX'), posY = el.getAttribute('data-posY'),
          x = el.getAttribute('data-x'), y = el.getAttribute('data-y');

      el.setAttribute("style","position: absolute; width:" + ((self._width / self._sizeX) * x - 1) + "px;\
                      height:" + ((self._height / self._sizeY) * y - 1) + "px;\
                      left:" + ((self._width / self._sizeX) * posX + 0.5) + "px;\
                      top:" + ((self._height / self._sizeY) * posY + 0.5) + "px;");
    });
  }

  calculateLocation(posX, posY, wwidth, wheight) {

    var val = [];
    var elements = document.querySelectorAll(self._identifier);

    Array.prototype.forEach.call(elements, function(el, i) {
      if (posX !== parseFloat(el.style.left) || posY !== parseFloat(el.style.top)) {
        val.push({
          top: parseFloat(el.style.top),
          left: parseFloat(el.style.left),
          width: parseFloat(el.offsetWidth),
          height: parseFloat(el.offsetHeight),
        });
      }
    });

    var tmp = 0, tmpX = 0, tmpY = 0, min = this._height + this._width, check = false;

    for (let x in this._grid) {
      tmp = Math.abs(posX - this._grid[x][0]) + Math.abs(posY - this._grid[x][1]);
      check = false;

      if (tmp >= 0 && tmp < min && (this._grid[x][0] + wwidth) <= this.width && (this._grid[x][1] + wheight) <= this.height) {
        if (!this._pile) {
          for (let y = 0; y < val.length; ++y) {

            if (!(this._grid[x][0] >= (val[y].left + val[y].width)) && !((this._grid[x][0] + wwidth) <= val[y].left)
            && !(this._grid[x][1] >= (val[y].top + val[y].height)) && !((this._grid[x][1] + wheight) <= val[y].top)) {
              check = true;
            }
          }
        }
        if (!check) {
          min = tmp;
          tmpX = this._grid[x][0];
          tmpY = this._grid[x][1];
        }
      }
    }

    return {x: tmpX, y: tmpY};
  }

  showDebug() {
    var canvas = document.createElement('canvas');
    canvas.width = this._width;
    canvas.height = this._height;

    this._container.appendChild(canvas);

    var context = canvas.getContext("2d");

    for (let x = 0; x <= this._width; x += (this._width / this._sizeX)) {
       context.moveTo(0.5 + x, 0);
       context.lineTo(0.5 + x, this._height);
   }


   for (let x = 0; x <= this._height; x += (this._height / this._sizeY)) {
       context.moveTo(0, 0.5 + x);
       context.lineTo(this._width, 0.5 + x);
   }

   context.strokeStyle = "black";
   context.stroke();
  }

  hideDebug() {

  }

  get debug() { return this._debug; }
  set debug(debug) {
    this._debug = debug;
    this._debug ? this.showDebug() : this.hideDebug();
  }

  get sizeX() { return this._sizeX; }
  set sizeX(x) { this._sizeX = x; }

  get sizeY() { return this._sizeY; }
  set sizeY(y) { this._sizeY = y; }

  get width() { return this._width; }
  set width(width) { this._width = width; }

  get height() { return this._height; }
  set height(height) { this._height = height; }
}