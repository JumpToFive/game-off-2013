/*globals define*/
define([
  'entities/physics-entity',
], function( PhysicsEntity ) {
  'use strict';

  function Player( x, y ) {
    PhysicsEntity.call( this, x, y );
  }

  Player.prototype = new PhysicsEntity();
  Player.prototype.constructor = Player;

  Player.prototype.update = function( dt ) {
    if ( this.world ) {
      var controls = this.world.input.controls;

      var ax = 0,
          ay = 0;

      if ( controls.LEFT   ) { ax -= 1000; }
      if ( controls.RIGHT  ) { ax += 1000; }
      if ( controls.TOP    ) { ay -= 1000; }
      if ( controls.BOTTOM ) { ay += 1000; }

      this.vx += ax * dt;
      this.vy += ay * dt;
    }

    PhysicsEntity.prototype.update.call( this, dt );
  };

  return Player;
});
