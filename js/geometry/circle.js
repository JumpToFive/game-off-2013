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

  return Circle;
});
