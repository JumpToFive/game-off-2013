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

    ctx.rect(
      this.x - 0.5 * this.width, this.y - 0.5 * this.height,
      this.width, this.height
    );

    ctx.closePath();
  };

  return Rect;
});
