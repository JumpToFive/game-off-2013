/*jshint bitwise: false*/
/*globals define*/
define([
  'box2d',
  'entities/physics-entity',
  'config/material',
  'config/colors',
  'utils',
  'world'
], function( Box2D, PhysicsEntity, Material, Colors, Utils, world ) {
  'use strict';

  var PI2 = Utils.PI2;

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
    this.normal = null;
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
        this.normal = normal;

        return fraction;
      }.bind( this ),
      new Vec2( this.x + cos, this.y + sin ),
      new Vec2( this.x + 1e4 * cos, this.y + 1e4 * sin )
    );
  };

  Laser.prototype.draw = function( ctx ) {
    PhysicsEntity.prototype.draw.call( this, ctx );

    // Only render if there is no endpoint and target, or if the target has not
    // been removed from the game.
    if ( !this.endpoint || !this.target ||
        ( this.target && !this.target.game ) ) {
      return;
    }

    ctx.globalCompositeOperation = 'lighter';

    var cos = Math.cos( -this.angle ),
        sin = Math.sin( -this.angle );

    var x0 = this.x + cos,
        y0 = this.y + sin,
        x1 = this.endpoint.x,
        y1 = this.endpoint.y;

    ctx.beginPath();
    ctx.moveTo( x0, y0 );
    ctx.lineTo( x1, y1 );

    var material = this.material;
    var glowColor;
    if ( material & Material.MATTER ) {
      glowColor = Colors.Glow.MATTER;
    } else if ( material & Material.ANTIMATTER ) {
      glowColor = Colors.Glow.ANTIMATTER;
    }

    var outerWidth = 0.4 + Math.random() * 0.2,
        innerWidth = 0.1 + Math.random() * 0.1;

    // Draw beam.
    ctx.lineWidth = outerWidth;
    ctx.strokeStyle = glowColor;
    ctx.stroke();

    ctx.lineWidth = innerWidth;
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // Draw endpoint glows.
    ctx.beginPath();
    ctx.arc( x0, y0, innerWidth * 2, 0, PI2 );
    ctx.moveTo( x1, y1 );
    ctx.arc( x1, y1, innerWidth * 2, 0, PI2 );

    ctx.lineWidth = outerWidth;
    ctx.strokeStyle = glowColor;
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
  };

  Laser.prototype.drawNormals = function( ctx ) {
    if ( !this.endpoint || !this.normal ) {
      return;
    }

    ctx.save();

    // Counteract transofmrs in draw.
    ctx.rotate( this.angle );
    ctx.translate( -this.x, -this.y );

    ctx.beginPath();
    ctx.moveTo( this.endpoint.x, this.endpoint.y );
    ctx.lineTo( this.endpoint.x + this.normal.x, this.endpoint.y + this.normal.y );
    ctx.lineWidth = 0.2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.restore();
  };

  return Laser;
});
