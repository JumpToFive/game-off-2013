/*globals define*/
define([
  'box2d',
  'entities/physics-entity',
  'world'
], function( Box2D, PhysicsEntity, world ) {
  'use strict';

  var Vec2 = Box2D.Common.Math.b2Vec2;

  function Laser( x, y ) {
    PhysicsEntity.call( this, {
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

    this.target = null;
    this.endpoint = null;
  }

  Laser.prototype = new PhysicsEntity();
  Laser.prototype.constructor = Laser;

  Laser.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    var cos = Math.cos( -this.angle ),
        sin = Math.sin( -this.angle );

    this.target = null;
    this.endpoint = null;

    world.RayCast(
      function( fixture, point, normal, fraction ) {
        this.target = fixture.GetBody().GetUserData();
        this.endpoint = point;
        return fraction;
      }.bind( this ),
      new Vec2( this.x + cos, this.y + sin ),
      new Vec2( this.x + 1e4 * cos, this.y + 1e4 * sin )
    );
  };

  Laser.prototype.draw = function( ctx ) {
    PhysicsEntity.prototype.draw.call( this, ctx );

    // Only render if there is no endpoint and target or if the target has not
    // been remvoed from the game.
    if ( !this.endpoint || !this.target ||
        ( this.target && !this.target.game ) ) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo( this.x, this.y );
    ctx.lineTo( this.endpoint.x, this.endpoint.y );

    ctx.lineWidth = 0.2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  };


  return Laser;
});
