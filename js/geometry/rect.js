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

  Rect.prototype.random = function() {
    return {
      x: this.y + Math.random() * this.width,
      y: this.y + Math.random() * this.height
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
