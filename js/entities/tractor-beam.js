/*globals define*/
define([
  'entities/physics-entity',
  'geometry/rect'
], function( PhysicsEntity, Rect ) {
  'use strict';

  function TractorBeam( x, y, width ) {
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

    // Width of the tractor beam effect.
    this.width = width || 0;
    // Distance to which tractor beam affects other physics entities.
    this.distance = 0;
    // Strength of the tractor beam.
    this.force = 0;

    this.construct();
  }

  TractorBeam.prototype = new PhysicsEntity();
  TractorBeam.prototype.constructor = TractorBeam;

  TractorBeam.prototype.construct = function() {
    var rect = new Rect( 0, 0, 1, this.width );

    rect.fill.set({
      red: 255,
      alpha: 1.0
    });

    rect.stroke.alpha = 1.0;
    rect.lineWidth = 0.2;

    this.shapes.push( rect );
  };

  TractorBeam.prototype.draw = function( ctx ) {
    PhysicsEntity.prototype.draw.call( this, ctx );

    ctx.save();

    ctx.translate( this.x, this.y );
    ctx.rotate( -this.angle );

    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.fillRect( 0, -0.5 * this.width, this.distance, this.width );

    ctx.restore();
  };

  TractorBeam.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    if ( !this.game ) {
      return;
    }

    var force = this.force * dt;

    var cos = Math.cos( -this.angle ),
        sin = Math.sin( -this.angle );

    var halfWidth = 0.5 * this.width;

    // Replace with a sensor.
    var entities = this.game.entities.concat( this.game.player );
    entities.forEach(function( entity ) {
      if ( !( entity instanceof PhysicsEntity ) ||
          entity === this ) {
        return;
      }

      var x = entity.x - this.x,
          y = entity.y - this.y;

      var rx, ry;
      if ( this.angle ) {
        rx =  cos * x + sin * y;
        ry = -sin * x + cos * y;

        x = rx;
        y = ry;
      }

      if ( -halfWidth <= y && y <= halfWidth &&
            0 <= x && x <= this.distance ) {
        entity.accelerate( cos * force, sin * force );
      }

    }.bind( this ));
  };

  return TractorBeam;
});
