/*globals define*/
define([
  'entities/physics-entity',
  'geometry/geometry-factory'
], function( PhysicsEntity, GeometryFactory ) {
  'use strict';

  function Emitter( x, y ) {
    PhysicsEntity.call( this, x, y );

    this.rate = 0;
    this.speed = 0;
    this.particle = null;
    this.lifeTime = 0;

    // Any custom particle physics properties go here.
    this.properties = {};

    this.interval = null;
  }

  Emitter.prototype.start = function( when ) {
    if ( this.interval ||
         !this.particle ) {
      return;
    }

    when = when || 0;

    setTimeout(function() {
      var particleJSON = JSON.stringify( this.particle );

      this.interval = setInterval(function() {
        var entity = new PhysicsEntity( this.x, this.y );
        entity.set( this.properties );
        entity.add( GeometryFactory.create( particleJSON ) );

        entity.set({
          vx: Math.cos( -this.rotation ) * this.speed,
          vy: Math.sin( -this.rotation ) * this.speed
        });

        this.world.add( entity );

        setTimeout(function() {
          this.world.remove( entity );
        }.bind( this ), this.lifeTime );

      }.bind( this ), this.rate );
    }.bind( this ), when );
  };

  Emitter.prototype.stop = function( when ) {
    when = when || 0;

    setTimeout(function() {
      clearInterval( this.interval );
      this.interval = null;
    }.bind( this ), when );
  };

  return Emitter;
});
