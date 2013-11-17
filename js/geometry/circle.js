/*globals define*/
define([
  'object2d',
  'box2d',
  'world'
], function( Box2D, Object2D, world ) {
  'use strict';

  var Body = Box2D.Dynamics.b2Body;
  var BodyDef = Box2D.Dynamics.b2BodyDef;
  var FixtureDef = Box2D.Dynamics.b2FixtureDef;
  var CircleShape = Box2D.Collision.Shapes.b2CircleShape;

  function Circle( x, y, radius ) {
    Object2D.call( this, x, y );
  }

  Circle.prototype.initialize = function( options ) {
    options = options || {};

    var density = typeof options.density !== 'undefined' ? options.density : 1.0;
    var friction = typeof options.friction !== 'undefined' ? options.friction : 0.5;
    var restitution = typeof options.restitution !== 'undefined' ? options.restitution : 0.2;

    var fixDef = new FixtureDef();
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    fixDef.shape = new CircleShape( options.radius );

    var bodyDef = new BodyDef();
    bodyDef.type = typeof options.type !== 'undefined' ? options.type : Body.b2_staticBody;
    this.fixture = world.CreateBody( bodyDef ).CreateFixture( FixtureDef );
  };

  Circle.prototype = new Object2D();
  Circle.prototype.constructor = Circle;

  Circle.prototype.drawPath = function( ctx ) {
    ctx.beginPath();
    ctx.arc( 0, 0, this.radius, 0, 2 * Math.PI );
    ctx.closePath();
  };

  Object.defineProperty( Circle.prototype, 'radius', {
    get: function() {
      return this.fixture.GetShape().GetRadius();
    },

    set: function( radius ) {
      this.fixture.GetShape().SetRadius( radius );
    }
  });

  Object.defineProperty( Circle.prototype, 'left', {
    get: function() {
      return this.x - this.radius;
    },

    set: function( left ) {
      this.x = left + this.radius;
    }
  });

  Object.defineProperty( Circle.prototype, 'right', {
    get: function() {
      return this.x + this.radius;
    },

    set: function( right ) {
      this.x = right - this.radius;
    }
  });

  Object.defineProperty( Circle.prototype, 'top', {
    get: function() {
      return this.y - this.radius;
    },

    set: function( top ) {
      this.y = top + this.radius;
    }
  });

  Object.defineProperty( Circle.prototype, 'bottom', {
    get: function() {
      return this.y + this.radius;
    },

    set: function( bottom ) {
      this.y = bottom - this.radius;
    }
  });

  return Circle;
});
