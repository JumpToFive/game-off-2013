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

    this.open = false;
    this.trigger = null;
    this.player = null;
  }

  Door.prototype = new PhysicsEntity();
  Door.prototype.constructor = Door;

  Door.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    if ( !this.open && this.trigger.active ) {
      this.open = true;
    }

    if ( this.open && this.player ) {
      this.player.x = this.x;
      this.player.y = this.y;
    }
  };

  Door.prototype.draw = function( ctx ) {
    PhysicsEntity.prototype.draw.call( this, ctx );

    if ( this.open && this.shapes[0] ) {
      this.shapes[0].fill.alpha = 1;
    }
  };

  return Door;
});
