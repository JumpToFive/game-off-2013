/*globals define*/
define([
  'entities/physics-entity',
  'geometry/geometry-factory',
  'world'
], function( PhysicsEntity, GeometryFactory, world ) {
  'use strict';

  function Emitter( x, y ) {
    PhysicsEntity.call( this, x, y );

    this.fixture.SetSensor( true );

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
    if ( !this.particle || !this.world ) {
      return;
    }

    var particleJSON = JSON.stringify( this.particle );

    var entity = new PhysicsEntity( this.x, this.y, {
      type: 'dynamic',
      shapeOptions: [ 1 ],
      fixture: {
        density: 1.0,
        friction: 0.5,
        restitution: 0.2
      }
    });
    entity.set( this.properties );
    entity.add( GeometryFactory.create( particleJSON ) );

    entity.accelerate(
      Math.cos( -this.angle ) * this.speed,
      Math.sin( -this.angle ) * this.speed
    );

    entity.va = 3 * Math.PI;
    // TODO: Make linearDamping settable in PhysicsEntity.
    entity.body.SetLinearDamping(0.2);

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
