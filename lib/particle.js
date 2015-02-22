var Vec2 = require('./vec2'),
  util = require('./util');

var Particle = function (opts) {
  opts = opts || {};
  this.previousPosition = Vec2.from(opts.previousPosition || opts.position);
  this.position = Vec2.from(opts.position);
  this.fixed = ('fixed' in opts) ? opts.fixed : false;
};

Particle.prototype.distanceFrom = function (p2) {
  return util.pointDistance(this.position, p2.position);
};

module.exports = Particle;