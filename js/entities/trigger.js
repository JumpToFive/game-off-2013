/*jshint camelcase: false*/
/*globals define*/
define([
  'entities/physics-entity'
], function( PhysicsEntity ) {
  'use strict';

  function Trigger( x, y, radius, material ) {
    PhysicsEntity.call( this, {
      shape: 'circle',
      radius: radius,
      fixture: {
        isSensor: true,
        filter: {
          categoryBits: material
        }
      },
      body: {
        position: {
          x: x,
          y: y
        }
      }
    });

    this.object = null;
    // If there is an object AND the trigger has caught it.
    this.active = false;
  }

  Trigger.prototype = new PhysicsEntity();
  Trigger.prototype.constructor = Trigger;

  Trigger.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    // When the correct trash object enters the trigger,
    // set its lifeTime to infinite.
    if ( this.object && !this.active ) {
      this.object.x = this.x;
      this.object.y = this.y;
      this.object.vx = 0;
      this.object.vy = 0;
      this.object.fixture.SetSensor( true );
      if ( typeof this.object.lifeTime !== 'undefined' ) {
        this.object.lifeTime = Number.POSITIVE_INFINITY;
      }

      this.active = true;
    }
  };

  Trigger.prototype.draw = function( ctx ) {
    PhysicsEntity.prototype.draw.call( this, ctx );

    ctx.save();

    ctx.translate( this.x, this.y );
    ctx.rotate( -this.angle );

    // Draw sensor.

    // Draw frame/border.

    ctx.restore();
  };

  return Trigger;
});
