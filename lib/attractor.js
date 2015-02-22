var Vec2 = require('baby-verlet/lib/vec2');

var Attractor = function (opts) {
  this.position = Vec2.from(opts.position);
  this.strength = opts.strength || 1;
  this.radius = opts.radius || 300;
};

module.exports = Attractor;
