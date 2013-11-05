/*globals define*/
define([
  'object2d'
], function( Object2D ) {
  'use strict';

  function Rect( x, y, width, height ) {
    Object2D.call( this, x, y );

    this.width  = width  || 0;
    this.height = height || 0;
  }

  Rect.prototype = new Object2D();
  Rect.prototype.constructor = Rect;

  Rect.prototype.drawPath = function( ctx ) {
    ctx.beginPath();
    ctx.rect( -0.5 * this.width, -0.5 * this.height, this.width, this.height );
    ctx.closePath();
  };

  Rect.prototype.aabb = function() {
    var halfWidth  = 0.5 * this.width,
        halfHeight = 0.5 * this.height;

    var top    = -halfHeight,
        left   = -halfWidth,
        bottom = halfHeight,
        right  = halfWidth;

    var cos = Math.cos( -this.rotation ),
        sin = Math.sin( -this.rotation );

    // Coordinates of rotated extents.
    var x = [],
        y = [];

    // Top left.
    x.push( cos * left - sin * top );
    y.push( sin * left + cos * top );

    // Bottom left.
    x.push( cos * left - sin * bottom );
    y.push( sin * left + cos * bottom );

    // Top right.
    x.push( cos * right - sin * top );
    y.push( sin * right + cos * top );

    // Bottom right.
    x.push( cos * right - sin * bottom );
    y.push( sin * right + cos * bottom );

    return {
      xmin: Math.min.apply( this, x ) + this.x,
      ymin: Math.min.apply( this, y ) + this.y,
      xmax: Math.max.apply( this, x ) + this.x,
      ymax: Math.max.apply( this, y ) + this.y
    };
  };

  Object.defineProperty( Rect.prototype, 'left', {
    get: function() {
      return this.x - 0.5 * this.width;
    },

    set: function( left ) {
      this.x = left + 0.5 * this.width;
    }
  });

  Object.defineProperty( Rect.prototype, 'right', {
    get: function() {
      return this.x + 0.5 * this.width;
    },

    set: function( right ) {
      this.x = right - 0.5 * this.width;
    }
  });

  Object.defineProperty( Rect.prototype, 'top', {
    get: function() {
      return this.y - 0.5 * this.height;
    },

    set: function( top ) {
      this.y = top + 0.5 * this.height;
    }
  });

  Object.defineProperty( Rect.prototype, 'bottom', {
    get: function() {
      return this.y + 0.5 * this.height;
    },

    set: function( bottom ) {
      this.y = bottom - 0.5 * this.height;
    }
  });

  return Rect;
});
