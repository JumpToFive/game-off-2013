/*globals define*/
define([
  'base-object',
  'color'
], function( BaseObject, Color ) {
  'use strict';

  function Object2D( x, y ) {
    BaseObject.call( this );

    this.x = x || 0;
    this.y = y || 0;

    this.rotation = 0;

    this.fill   = new Color();
    this.stroke = new Color();

    this.lineWidth = 0;
  }

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

    this.drawDebug( ctx );
  };

  Object2D.prototype.drawDebug = function( ctx ) {
    // Debug draw.
    var aabb = this.aabb();
    if ( !aabb ) {
      return;
    }

    ctx.beginPath();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.strokeRect( aabb.xmin, aabb.ymin, aabb.xmax - aabb.xmin, aabb.ymax - aabb.ymin );
  };

  /**
   * Returns the AABB corresponding to the object in world space.
   */
  Object2D.prototype.aabb = function() {
    return {
      xmin: this.x,
      ymin: this.y,
      xmax: this.x,
      ymax: this.y
    };
  };

  return Object2D;
});
