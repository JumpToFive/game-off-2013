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
    var vx = 0,
        vy = 0;
    // Left.
    if ( keys[ 37 ] ) { vx -= 100; }
    // Right.
    if ( keys[ 39 ] ) { vx += 100; }
    // Top.
    if ( keys[ 38 ] ) { vy -= 100; }
    // Bottom.
    if ( keys[ 40 ] ) { vy += 100; }

    this.vx = vx;
    this.vy = vy;
  };

  return Player;
});
