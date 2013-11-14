/*globals define*/
define([
  'physics-entity'
], function( PhysicsEntity ) {
  'use strict';

  function Emitter( x, y ) {
    PhysicsEntity.call( this, x, y );

    this.rate = 0;
    this.speed = 0;
    this.particle = null;
    this.lifeTime = 0;

    this.interval = null;
  }

  Emitter.prototype.start = function( when ) {
    if ( this.interval ) {
      return;
    }

    setTimeout(function() {
      this.interval = setInterval(function() {
        var entity = new PhysicsEntity( this.x, this.y );
        // Note that this doesn't copy the shapes.
        entity.set( this.particle );

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
    setTimeout(function() {
      clearInterval( this.interval );
      this.interval = null;
    }.bind( this ), when );
  };
});
