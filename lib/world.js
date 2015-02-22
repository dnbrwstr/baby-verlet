var Vec2 = require('./vec2'),
  util = require('./util'),
  Particle = require('./particle'),
  Constraint = require('./constraint'),
  Attractor = require('./attractor');

var World = function (opts) {
  opts = opts || {};

  var width = ('width' in opts) ? opts.width : 100;
  var height = ('height' in opts) ? opts.height : 100;

  this.size = new Vec2(width, height);
  this.particles = opts.particles || [];
  this.constraints = opts.constraints || [];
  this.attractors = opts.attractors || [];
  this.gravity = Vec2.from(opts.gravity);
  this.iterations = ('iterations' in opts) ? opts.iterations : 2;
  this.damping = ('damping' in opts) ? opts.damping : 0.1;
};

World.prototype.setSize = function (width, height) {
  this.size.x = width;
  this.size.y = height;
};

World.prototype.setGravity = function (tuple) {
  this.gravity = Vec2.from(tuple);
};

World.prototype.add = function (objects) {
  for (var i = 0; i < objects.length; ++i) {
    var object = objects[i];
    
    if (object instanceof Particle) {
      this.addParticle(object);
    } else if (object instanceof Constraint) {
      this.addConstraint(object);
    } else if (object instanceof Attractor) {
      this.addAttractor(object);
    }
  }
};

World.prototype.addParticle = function (particle) {
  this.particles.push(particle);
};

World.prototype.addConstraint = function (constraint) {
  this.constraints.push(constraint);
};

World.prototype.addAttractor = function (attractor) {
  this.attractors.push(attractor);
};

World.prototype.remove = function (objects) {
  for (var i = 0; i < objects.length; ++i) {
    var object = objects[i];
    
    if (object instanceof Particle) {
      this.removeParticle(object);
    } else if (object instanceof Constraint) {
      this.removeConstraint(object);
    } else if (object instanceof Attractor) {
      this.removeAttractor(object);
    }
  }
};

World.prototype.removeParticle = function (particle) {
  var index = this.particles.indexOf(particle);
  if (index == -1) return;
  this.particles.splice(index, 1);
};

World.prototype.removeConstraint = function (constraint) {
  var index = this.constraints.indexOf(constraint);
  if (index == -1) return;
  this.constraints.splice(index, 1);
};

World.prototype.removeAttractor = function (attractor) {
  var index = this.attractors.indexOf(attractor);
  if (index == -1) return;
  this.attractors.splice(index, 1);
};

World.prototype.update = function (delta) {
  if (typeof delta === 'undefined') delta = 1;
  var forces = this.collectForces();
  var particlesLength = this.particles.length;

  for (var i = 0; i < particlesLength; ++i) {
    var particle = this.particles[i];

    if (!particle.fixed) {
      var tempPosition = particle.position;

      particle.position = particle.position
        .add(particle.position)
        .subtract(particle.previousPosition)
        .add(forces[i].scale(Math.pow(delta, 2)));

      particle.previousPosition = tempPosition;
    }
  }

  this.satisfyConstraints();
};

World.prototype.collectForces = function() {
  var _this = this;
  var forces = [];
  var particlesLength = this.particles.length;
  var attractorsLength = this.attractors.length;

  for (var i = 0; i < particlesLength; ++i) {
    var p = this.particles[i];
    var force = _this.gravity;

    for (var j = 0; j < attractorsLength; ++j) {
      var a = this.attractors[j];
      var d = util.pointDistance(a.position, p.position);
      var progress =  Math.min(a.radius, d) / a.radius;
      var pointForce = Math.pow(a.strength * (1 - progress), 2);

      var attractorForce = a.position
        .subtract(p.position)
        .normalize()
        .scale(pointForce);

      if (d < a.radius) {
        force = force.add(attractorForce);
      }
    }

    forces.push(force);
  }

  return forces;
};

World.prototype.satisfyConstraints = function () {
  var _this = this;
  var particlesLength = this.particles.length;
  var constraintsLength = this.constraints.length;

  for (var i = 0; i < this.iterations; ++i) {
    // Keep particles inside world
    for (var j = 0; j < particlesLength; ++j) {
      var particle = this.particles[j];
      if (!particle.fixed &&
        particle.position.x > _this.size.x || 
        particle.position.x < 0 ||
        particle.position.y > _this.size.y ||
        particle.position.y < 0) {
        particle.previousPosition = particle.position.clone();
        particle.position.x = Math.min(Math.max(0, particle.position.x), _this.size.x);
        particle.position.y = Math.min(Math.max(0, particle.position.y), _this.size.y);
      }
    }

    for (var j = 0; j < constraintsLength; ++j) {
      var c = this.constraints[j];
      c.solve();
    }

    for (var j = 0; j < particlesLength; ++j) {
      var particle = this.particles[j];
      if (particle.fixed) particle.position = particle.previousPosition;
    }
  }
};

module.exports = World;