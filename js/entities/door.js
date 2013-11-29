/*globals define*/
define([
  'entities/physics-entity'
], function( PhysicsEntity ) {
  'use strict';

  function Door( x, y, radius ) {
    PhysicsEntity.call( this, {
      shape: 'circle',
      radius: radius,
      fixture: {
        isSensor: true
      },
      body: {
        position: {
          x: x,
          y: y
        }
      }
    });

    this.active = false;
    this.trigger = null;
  }

  Door.prototype = new PhysicsEntity();
  Door.prototype.constructor = Door;

  Door.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    if ( this.trigger ) {
      this.active = this.trigger.active;
    }
  };

  Door.prototype.draw = function( ctx ) {
    PhysicsEntity.prototype.draw.call( this, ctx );
  };

  return Door;
});
