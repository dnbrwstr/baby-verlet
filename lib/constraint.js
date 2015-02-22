var Constraint = function (opts) {
  if (!('particles' in opts) || opts.particles.length < 2) {
    throw new Error('Constraint requires two particles');
  }

  if (opts.stiffness && (opts.stiffness > 1 || opts.stiffness < 0)) {
    throw new Error('Stiffness must be a number between 0 and 1');
  }

  this.particles = opts.particles;
  this.stiffness = opts.stiffness || 1;
  this.length = opts.length || this.particles[0].distanceFrom(this.particles[1]);
};

Constraint.prototype.solve = function () {
  var p1 = this.particles[0].position;
  var p2 = this.particles[1].position;

  var delta = p2.subtract(p1);
  var deltaLength = Math.sqrt(delta.dotProduct(delta));
  var diff = (deltaLength - this.length) / deltaLength;
  diff = diff * this.stiffness;

  this.particles[0].position = p1.add(delta.scale(0.5).scale(diff));
  this.particles[1].position = p2.subtract(delta.scale(0.5).scale(diff));
};

module.exports = Constraint;
