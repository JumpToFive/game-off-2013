/*globals define*/
define([
  'box2d',
  'entities/physics-entity'
], function( Box2D, PhysicsEntity ) {
  'use strict';

  function Player( x, y ) {
    PhysicsEntity.call( this, x, y, {
      type: 'dynamic'
    });
  }

  Player.prototype = new PhysicsEntity();
  Player.prototype.constructor = Player;

  Player.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    if ( this.world ) {
      var controls = this.world.input.controls;

      var ax = 0,
          ay = 0;

      if ( controls.LEFT   ) { ax -= 5000; }
      if ( controls.RIGHT  ) { ax += 5000; }
      if ( controls.TOP    ) { ay -= 5000; }
      if ( controls.BOTTOM ) { ay += 5000; }

      this.accelerate( ax, ay );
    }
  };

  Player.prototype.draw = function( ctx ) {
    PhysicsEntity.prototype.draw.call( this, ctx );
    ctx.fillStyle = 'black';
    ctx.font = '30px Helvetica';
    ctx.fillText( this.vx + ', ' +  this.vy, 20, 20 );
    ctx.fillText( this.body.GetWorldCenter().x + ', ' +  this.body.GetWorldCenter().y, 20, 80 );
  };

  return Player;
});
