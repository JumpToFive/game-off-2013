/*globals define*/
define([
  'box2d',
  'entities/physics-entity',
], function( Box2D, PhysicsEntity ) {
  'use strict';

  function Player( x, y ) {
    PhysicsEntity.call( this, x, y, {
      shape: 'circle',
      radius: 2,
      fixture: {
        density: 0.5,
        friction: 0.5,
        restitution: 0.2
      },
      body: {
        linearDamping: 2,
        type: 'dynamic'
      }
    });
  }

  Player.prototype = new PhysicsEntity();
  Player.prototype.constructor = Player;

  Player.prototype.update = function( dt ) {
    if ( this.game ) {
      var controls = this.game.input.controls;

      var ax = 0,
          ay = 0;

      if ( controls.LEFT   ) { ax -= 15; }
      if ( controls.RIGHT  ) { ax += 15; }
      if ( controls.TOP    ) { ay -= 15; }
      if ( controls.BOTTOM ) { ay += 15; }

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
