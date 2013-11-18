/*globals define*/
define([
  'box2d',
  'entities/physics-entity',
], function( Box2D, PhysicsEntity ) {
  'use strict';

  function Player( x, y ) {
    PhysicsEntity.call( this, x, y, {
      type: 'dynamic',
      shapeOptions: [ 2 ]
    });
  }

  Player.prototype = new PhysicsEntity();
  Player.prototype.constructor = Player;

  Player.prototype.update = function( dt ) {
    if ( this.world ) {
      var controls = this.world.input.controls;

      var ax = 0,
          ay = 0;

      if ( controls.LEFT   ) { ax -= 2; }
      if ( controls.RIGHT  ) { ax += 2; }
      if ( controls.TOP    ) { ay -= 2; }
      if ( controls.BOTTOM ) { ay += 2; }

      this.accelerate( ax, ay );
    }

    PhysicsEntity.prototype.update.call( this, dt );
  };

  Player.prototype.draw = function( ctx ) {
    PhysicsEntity.prototype.draw.call( this, ctx );

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = '3px Helvetica';
    ctx.fillText( this.vx + ', ' +  this.vy, 2, 2 );
    ctx.fillText( this.body.GetWorldCenter().x + ', ' +  this.body.GetWorldCenter().y, 2, 8 );
  };

  return Player;
});
