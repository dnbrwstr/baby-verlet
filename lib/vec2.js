var Vec2 = function (x, y) {
  this.x = x || 0; 
  this.y = y || 0;
};

Vec2.prototype.add = function (v) {
  return new Vec2(this.x + v.x, this.y + v.y);
};

Vec2.prototype.subtract = function (v) {
  return new Vec2(this.x - v.x, this.y - v.y);
};

Vec2.prototype.dotProduct = function (v) {
  return this.x * v.x + this.y * v.y;
};

Vec2.prototype.scale = function (i) {
  return new Vec2(this.x * i, this.y * i);
};

Vec2.prototype.clone = function () {
  return new Vec2(this.x, this.y);
};

Vec2.prototype.normalize = function () {
  var length = this.getLength();
  return new Vec2(this.x / length, this.y / length);
};

Vec2.prototype.getLength = function () {
  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

Vec2.prototype.set = function (arr) {
  this.x = arr[0];
  this.y = arr[1];
};

Vec2.from = function (input) {
  if (input && input.constructor === Array) {
    if (0 in input && 1 in input) {
      return new Vec2(input[0], input[1]);
    } else {
      throw new Error('Vector input missing required property');
    }
  } else if (input instanceof Vec2) {
    return input;
  } else if (typeof input === "object") {
    if ('x' in input && 'y' in input) {
      return new Vec2(input.x, input.y);
    } else {
      throw new Error('Vector input missing required property');
    }
  } else if (!input) {
    return new Vec2();
  }
};

module.exports = Vec2;
