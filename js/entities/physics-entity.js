/*globals define*/
define([
  'box2d',
  'entities/entity',
  'world'
], function( Box2D, Entity, world ) {
  'use strict';

  var Body = Box2D.Dynamics.b2Body;
  var BodyDef = Box2D.Dynamics.b2BodyDef;
  var FixtureDef = Box2D.Dynamics.b2FixtureDef;
  var CircleShape = Box2D.Collision.Shapes.b2CircleShape;

  function PhysicsEntity( x, y, options ) {
    this.fixture = null;
    this.initialize( options );

    Entity.call( this, x, y );
  }

  PhysicsEntity.prototype = new Entity();
  PhysicsEntity.prototype.constructor = PhysicsEntity;

  PhysicsEntity.prototype.initialize = function( options ) {
    options = options || {};

    var density = typeof options.density !== 'undefined' ? options.density : 1.0;
    var friction = typeof options.friction !== 'undefined' ? options.friction : 0.5;
    var restitution = typeof options.restitution !== 'undefined' ? options.restitution : 0.2;

    var fixDef = new FixtureDef();
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    this.fixtureShape( fixDef, options.shape );

    var bodyDef = new BodyDef();
    bodyDef.type = typeof options.type !== 'undefined' ? options.type : Body.b2_staticBody;
    this.fixture = world.CreateBody( bodyDef ).CreateFixture( fixDef );
  };

  PhysicsEntity.prototype.fixtureShape = function( fixDef, shapeOptions ) {
    shapeOptions = shapeOptions || [];
    fixDef.shape = new ( Function.prototype.bind.apply( CircleShape, shapeOptions ) ) ();
  };

  Object.defineProperty( PhysicsEntity.prototype, 'body', {
    get: function() {
      return this.fixture.GetBody();
    }
  });

  Object.defineProperty( PhysicsEntity.prototype, 'position', {
    get: function() {
      return this.body.GetPosition();
    }
  });

  Object.defineProperty( PhysicsEntity.prototype, 'x', {
    enumerable: true,

    get: function() {
      return this.position.x;
    },

    set: function( x ) {
      this.position.x = x || 0;
    }
  });

  Object.defineProperty( PhysicsEntity.prototype, 'y', {
    enumerable: true,

    get: function() {
      return this.position.y;
    },

    set: function( y ) {
      this.position.y = y || 0;
    }
  });

  Object.defineProperty( PhysicsEntity.prototype, 'angle', {
    enumerable: true,

    get: function() {
      return this.body.GetAngle();
    },

    set: function( angle ) {
      this.body.SetAngle( angle || 0 );
    }
  });

  Object.defineProperty( PhysicsEntity.prototype, 'velocity', {
    get: function() {
      return this.body.GetLinearVelocity();
    },

    set: function( velocity ) {
      this.body.SetLinearVelocity( velocity );
    }
  });

  Object.defineProperty( PhysicsEntity.prototype, 'vx', {
    get: function() {
      return this.velocity.x;
    },

    set: function( vx ) {
      this.velocity.x = vx || 0;
    }
  });

  Object.defineProperty( PhysicsEntity.prototype, 'vy', {
    get: function() {
      return this.velocity.y;
    },

    set: function( vy ) {
      this.velocity.y = vy || 0;
    }
  });

  return PhysicsEntity;
});
