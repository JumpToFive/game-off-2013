/*globals define*/
define([
  'object2d'
], function( Object2D ) {
  'use strict';

  function Circle( x, y, radius ) {
    Object2D.call( this, x, y );

    this.radius = radius || 0;
  }

  Circle.prototype = new Object2D();
  Circle.prototype.constructor = Circle;

  Circle.prototype.drawPath = function( ctx ) {
    ctx.beginPath();
    ctx.arc( 0, 0, this.radius, 0, 2 * Math.PI );
    ctx.closePath();
  };

  Circle.prototype.aabb = function() {
    return {
      xmin: this.left,
      ymin: this.top,
      xmax: this.right,
      ymax: this.bottom
    };
  };

  Object.defineProperty( Circle.prototype, 'left', {
    get: function() {
      return this.x - this.radius;
    },

    set: function( left ) {
      this.x = left + this.radius;
    }
  });

  Object.defineProperty( Circle.prototype, 'right', {
    get: function() {
      return this.x + this.radius;
    },

    set: function( right ) {
      this.x = right - this.radius;
    }
  });

  Object.defineProperty( Circle.prototype, 'top', {
    get: function() {
      return this.y - this.radius;
    },

    set: function( top ) {
      this.y = top + this.radius;
    }
  });

  Object.defineProperty( Circle.prototype, 'bottom', {
    get: function() {
      return this.y + this.radius;
    },

    set: function( bottom ) {
      this.y = bottom - this.radius;
    }
  });

  return Circle;
});
