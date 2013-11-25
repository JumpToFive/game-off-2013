/*jshint bitwise: false*/
/*globals define*/
define([
  'box2d',
  'entities/physics-entity',
  'config/material',
  'config/colors',
  'world'
], function( Box2D, PhysicsEntity, Material, Colors, world ) {
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
        var target = fixture.GetBody().GetUserData();
        if ( !( target.material & this.material ) ) {
          return 1;
        }

        this.target = target;
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

    ctx.globalCompositeOperation = 'lighter';

    ctx.beginPath();
    ctx.moveTo( this.x, this.y );
    ctx.lineTo( this.endpoint.x, this.endpoint.y );

    var material = this.material;
    if ( material & Material.MATTER ) {
      ctx.strokeStyle = Colors.Glow.MATTER;
    } else if ( material & Material.ANTIMATTER ) {
      ctx.strokeStyle = Colors.Glow.ANTIMATTER;
    }

    ctx.lineWidth = 0.4 + Math.random() * 0.2;
    ctx.stroke();

    ctx.lineWidth = 0.1 + Math.random() * 0.1;
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';
  };

  return Laser;
});
