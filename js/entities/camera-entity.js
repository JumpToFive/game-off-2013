/*globals define*/
define([
  'entities/entity',
  'utils'
], function( Entity, Utils ) {
  'use strict';

  function CameraEntity( x, y ) {
    Entity.call( this, x, y );

    this.width  = 320;
    this.height = 240;

    this.target = null;
    this.margin = 0;

    this.weight = 0.05;
  }

  CameraEntity.prototype = new Entity();
  CameraEntity.prototype.constructor = CameraEntity;

  CameraEntity.prototype.update = function( dt ) {
    if ( !this.target || !this.world ) {
      return;
    }

    var margin = this.margin;

    var halfWidth  = 0.5 * this.width,
        halfHeight = 0.5 * this.height;

    var left   = -halfWidth,
        top    = -halfHeight,
        right  = halfWidth,
        bottom = halfHeight;

    // Target coordinates in local space.
    var x = this.target.x - this.x,
        y = this.target.y - this.y;

    var cos, sin;
    if ( this.rotation ) {
      cos = Math.cos( this.rotation );
      sin = Math.sin( this.rotation );

      var rx = cos * x - sin * y,
          ry = sin * x + cos * y;

      x = rx;
      y = ry;
    }

    var dx = 0, dy = 0;
    if ( x < left + margin ) {
      dx = x - ( left + margin );
    } else if ( x > right - margin ) {
      dx = x - ( right - margin );
    } else {
      dx = this.weight * x;
    }

    if ( y < top + margin ) {
      dy = y - ( top + margin );
    } else if  ( y > bottom - margin ) {
      dy = y - ( bottom - margin );
    } else {
      dy = this.weight * y;
    }

    if ( this.rotation ) {
      var rdx =  cos * dx + sin * dy,
          rdy = -sin * dx + cos * dy;

      dx = rdx;
      dy = rdy;
    }

    this.x += dx;
    this.y += dy;

    this.rotation += 0.01;
  };

  CameraEntity.prototype.applyTransform = function( ctx ) {
    ctx.translate( 0.5 * this.world.canvas.width, 0.5 * this.world.canvas.height );
    ctx.scale( this.world.canvas.width / this.width, this.world.canvas.height / this.height );
    ctx.rotate( this.rotation );
    ctx.translate( -this.x, -this.y );
  };

  CameraEntity.prototype.drawPath = function( ctx ) {
    var margin = this.margin;

    var width  = this.width,
        height = this.height;

    var halfWidth  = 0.5 * width,
        halfHeight = 0.5 * height;

    ctx.save();

    ctx.rect( -halfWidth, -halfHeight, width, height );
    ctx.rect( -halfWidth + margin, -halfHeight + margin, width - 2 * margin, height - 2 * margin );

    ctx.restore();
  };

  return CameraEntity;
});
