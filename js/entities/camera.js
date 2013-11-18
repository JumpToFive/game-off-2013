/*globals define*/
define([
  'entities/entity',
  'utils'
], function( Entity, Utils ) {
  'use strict';

  function Camera( x, y ) {
    Entity.call( this, x, y );

    this.width  = 64;
    this.height = 48;

    this.target = null;
    this.margin = 0;

    this.weight = 4;
  }

  Camera.prototype = new Entity();
  Camera.prototype.constructor = Camera;

  Camera.prototype.update = function( dt ) {
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
    if ( this.angle ) {
      cos = Math.cos( this.angle );
      sin = Math.sin( this.angle );

      var rx = cos * x - sin * y,
          ry = sin * x + cos * y;

      x = rx;
      y = ry;
    }

    // Recenter at a rate influenced by weight and dt.
    var dx = this.weight * x * dt,
        dy = this.weight * y * dt;

    // Make sure the target stays within the margins.
    if ( x < left + margin ) {
      dx += x - ( left + margin );
    } else if ( x > right - margin ) {
      dx += x - ( right - margin );
    }

    if ( y < top + margin ) {
      dy += y - ( top + margin );
    } else if  ( y > bottom - margin ) {
      dy += y - ( bottom - margin );
    }

    if ( this.angle ) {
      var rdx =  cos * dx + sin * dy,
          rdy = -sin * dx + cos * dy;

      dx = rdx;
      dy = rdy;
    }

    this.x += dx;
    this.y += dy;
  };

  Camera.prototype.applyTransform = function( ctx ) {
    ctx.translate( 0.5 * this.world.canvas.width, 0.5 * this.world.canvas.height );
    ctx.scale( this.world.canvas.width / this.width, this.world.canvas.height / this.height );
    ctx.rotate( this.angle );
    ctx.translate( -this.x, -this.y );
  };

  Camera.prototype.drawPath = function( ctx ) {
    var margin = this.margin;

    var width  = this.width,
        height = this.height;

    var halfWidth  = 0.5 * width,
        halfHeight = 0.5 * height;

    ctx.beginPath();
    ctx.rect( -halfWidth, -halfHeight, width, height );
    ctx.rect( -halfWidth + margin, -halfHeight + margin, width - 2 * margin, height - 2 * margin );
    ctx.closePath();
  };

  return Camera;
});
