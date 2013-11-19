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

    var particleJSON = JSON.stringify( this.particle );

    var entity = new PhysicsEntity( this.x, this.y, this.properties );
    entity.add( GeometryFactory.create( particleJSON ) );

    entity.accelerate(
      Math.cos( -this.angle ) * this.speed,
      Math.sin( -this.angle ) * this.speed
    );

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
