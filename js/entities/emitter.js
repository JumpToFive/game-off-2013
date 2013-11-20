/*globals define*/
define([
  'entities/physics-entity',
  'geometry/geometry-factory'
], function( PhysicsEntity, GeometryFactory ) {
  'use strict';

  function Emitter( x, y ) {
    PhysicsEntity.call( this, x, y, {
      fixture: {
        isSensor: true
      }
    });

    this.spawnArea = null;

    this.rate = 0;
    this.speed = 0;
    this.particle = null;
    this.lifeTime = 0;

    // Any custom particle physics properties go here.
    this.properties = {};

    this.time = 0;
    this.firing = false;
  }

  Emitter.prototype = new PhysicsEntity();
  Emitter.prototype.constructor = Emitter;

  Emitter.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    if ( !this.firing ) {
      return;
    }

    this.time += dt;
    if ( this.time > this.rate ) {
      this.time = 0;
      this.fire();
    }
  };

  Emitter.prototype.fire = function() {
    if ( !this.particle || !this.game ) {
      return;
    }

    var x = this.x,
        y = this.y;

    var cos = 1,
        sin = 0;
    if ( this.angle ) {
      cos = Math.cos( -this.angle );
      sin = Math.sin( -this.angle );
    }

    // Spawn inside an area (rect, circle, segment).
    var point;
    var rx, ry;
    if ( this.spawnArea ) {
      point = this.spawnArea.random();
      if ( this.angle ) {
        rx = cos * point.x - sin * point.y;
        ry = sin * point.x + cos * point.y;

        point.x = rx;
        point.y = ry;
      }

      x += point.x;
      y += point.y;
    }

    var particleJSON = JSON.stringify( this.particle );

    var entity = new PhysicsEntity( x, y, this.properties );
    entity.add( GeometryFactory.create( particleJSON ) );

    entity.accelerate( cos * this.speed, sin * this.speed );

    this.game.add( entity );

    setTimeout(function() {
      this.game.remove( entity );
      this.game.world.DestroyBody( entity.body );
    }.bind( this ), this.lifeTime );
  };

  Emitter.prototype.start = function( when ) {
    when = when || 0;

    setTimeout(function() {
      this.firing = true;
      this.time = 0;
    }.bind( this ), when );
  };

  Emitter.prototype.stop = function( when ) {
    when = when || 0;

    setTimeout(function() {
      this.firing = false;
    }.bind( this ), when );
  };

  return Emitter;
});
