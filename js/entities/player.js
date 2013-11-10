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

    var controls = this.world.input.controls;

    var ax = 0,
        ay = 0;

    if ( controls.LEFT   ) { ax -= 1000; }
    if ( controls.RIGHT  ) { ax += 1000; }
    if ( controls.TOP    ) { ay -= 1000; }
    if ( controls.BOTTOM ) { ay += 1000; }

    this.vx = 0.95 * ( this.vx + ax * dt );
    this.vy = 0.95 * ( this.vy + ay * dt );

    this.vx = Math.abs( this.vx ) > 1e-2 ? this.vx : 0;
    this.vy = Math.abs( this.vy ) > 1e-2 ? this.vy : 0;
  };

  return Player;
});
