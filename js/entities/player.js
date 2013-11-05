/*globals define*/
define([
  'entities/physics-entity'
], function( PhysicsEntity ) {
  'use strict';

  function Player( x, y ) {
    PhysicsEntity.call( this, x, y );
  }

  Player.prototype = new PhysicsEntity();
  Player.prototype.constructor = Player;

  Player.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    if ( !this.world ) {
      return;
    }

    var keys = this.world.input.keys;
    var ax = 0,
        ay = 0;
    // Left.
    if ( keys[ 37 ] ) { ax -= 1000; }
    // Right.
    if ( keys[ 39 ] ) { ax += 1000; }
    // Top.
    if ( keys[ 38 ] ) { ay -= 1000; }
    // Bottom.
    if ( keys[ 40 ] ) { ay += 1000; }

    this.vx = 0.95 * ( this.vx + ax * dt );
    this.vy = 0.95 * ( this.vy + ay * dt );

    this.vx = Math.abs( this.vx ) > 1e-2 ? this.vx : 0;
    this.vy = Math.abs( this.vy ) > 1e-2 ? this.vy : 0;
  };

  return Player;
});
