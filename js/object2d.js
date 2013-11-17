/*globals define*/
define([
  'base-object',
  'color'
], function( BaseObject, Color ) {
  'use strict';

  function Object2D( options ) {
    BaseObject.call( this );

    this.fixture = null;

    this.fill   = new Color();
    this.stroke = new Color();

    this.lineWidth = 0;
  }

  Object2D.prototype.initialize = function( options ) {};

  Object2D.prototype = new BaseObject();
  Object2D.prototype.constructor = Object2D;

  Object2D.prototype.update = function() {};
  Object2D.prototype.drawPath = function() {};

  Object2D.prototype.draw = function( ctx ) {
    ctx.save();

    ctx.translate( this.x, this.y );
    ctx.rotate( -this.rotation );

    this.drawPath( ctx );

    ctx.restore();

    if ( this.fill.alpha ) {
      ctx.fillStyle = this.fill.rgba();
      ctx.fill();
    }

    if ( this.lineWidth && this.stroke.alpha ) {
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = this.stroke.rgba();
      ctx.stroke();
    }
  };

  Object.defineProperty( Object2D.prototype, 'body', {
    get: function() {
      return this.fixture.GetBody();
    }
  });

  Object.defineProperty( Object2D.prototype, 'position', {
    get: function() {
      return this.body.GetPosition();
    }
  });

  Object.defineProperty( Object2D.prototype, 'x', {
    enumerable: true,

    get: function() {
      return this.position.x;
    },

    set: function( x ) {
      this.position.x = x || 0;
    }
  });

  Object.defineProperty( Object2D.prototype, 'y', {
    enumerable: true,

    get: function() {
      return this.position.y;
    },

    set: function( y ) {
      this.position.y = y || 0;
    }
  });

  Object.defineProperty( Object2D.prototype, 'angle', {
    enumerable: true,

    get: function() {
      return this.body.GetAngle();
    },

    set: function( angle ) {
      this.body.SetAngle( angle || 0 );
    }
  });

  return Object2D;
});
