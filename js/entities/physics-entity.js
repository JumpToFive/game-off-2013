/*jshint camelcase: false*/
/*globals define*/
define([
  'box2d',
  'entities/entity',
  'utils',
  'world'
], function( Box2D, Entity, Utils, world ) {
  'use strict';

  var Vec2 = Box2D.Common.Math.b2Vec2;
  var Body = Box2D.Dynamics.b2Body;
  var BodyDef = Box2D.Dynamics.b2BodyDef;
  var FixtureDef = Box2D.Dynamics.b2FixtureDef;

  var shapeClasses = {
    'CircleShape': Box2D.Collision.Shapes.b2CircleShape,
    'PolygonShape': Box2D.Collision.Shapes.b2PolygonShape
  };

  var defaultShape = 'CircleShape';

  var bodyTypes = {
    'static': Body.b2_staticBody,
    'dynamic': Body.b2_dynamicBody,
    'kinematic': Body.b2_kinematicBody
  };


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
    this.fixtureShape( fixDef, options.shape, options.shapeOptions );

    var bodyDef = new BodyDef();
    bodyDef.linearDamping = 2;
    bodyDef.type = typeof options.type !== 'undefined' ? bodyTypes[ options.type ] : Body.b2_staticBody;
    this.fixture = world.CreateBody( bodyDef ).CreateFixture( fixDef );
  };

  /**
   * Creates a shape of the class given by the string shape called with a
   * shapeOptions array.
   *
   * Possible values for shape are:
   *  - CircleShape (default)
   *  - PolygonShape
   */
  PhysicsEntity.prototype.fixtureShape = function( fixDef, shape, shapeOptions ) {
    shapeOptions = shapeOptions || [];

    shape = typeof shape !== 'undefined' ? shape : defaultShape;
    var Shape = shapeClasses[ shape ];
    if ( typeof Shape === 'undefined' ) {
      Shape = shapeClasses[ defaultShape ];
    }

    fixDef.shape = new Shape( shapeOptions[0] );
  };

  PhysicsEntity.prototype.accelerate = function( x, y ) {
    this.body.ApplyImpulse(
      new Vec2( x, y ),
      this.body.GetWorldCenter()
    );
  };

  PhysicsEntity.prototype.update = function( dt ) {
    Entity.prototype.update.call( this, dt );
    this.vx = Utils.roundNearZero( this.vx );
    this.vy = Utils.roundNearZero( this.vy );
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

  Object.defineProperty( PhysicsEntity.prototype, 'va', {
    get: function() {
      return this.body.GetAngularVelocity();
    },

    set: function( va ) {
      this.body.SetAngularVelocity( va || 0 );
    }
  });

  return PhysicsEntity;
});
