/*globals define*/
define([
  'object2d',
  'utils'
], function( Object2D, Utils ) {
  'use strict';

  function Segment( x0, y0, x1, y1 ) {
    Object2D.call( this, 0, 0 );

    this.x0 = x0 || 0;
    this.y0 = y0 || 0;
    this.x1 = x1 || 0;
    this.y1 = y1 || 0;
  }

  Segment.prototype = new Object2D();
  Segment.prototype.constructor = Segment;

  Segment.prototype.drawPath = function( ctx ) {
    this.drawNormals( ctx );

    ctx.beginPath();
    ctx.moveTo( this.x0, this.y0 );
    ctx.lineTo( this.x1, this.y1 );
    ctx.closePath();
  };

  Segment.prototype.drawNormals = function( ctx ) {
    ctx.beginPath();

    var x0 = this.x0,
        y0 = this.y0,
        x1 = this.x1,
        y1 = this.y1;

    var mx = 0.5 * ( x0 + x1 ),
        my = 0.5 * ( y0 + y1 );

    var normal = Utils.lineNormal( x0, y0, x1, y1 );
    if ( !normal ) {
      return;
    }

    ctx.moveTo( mx, my );
    ctx.lineTo( mx + normal.x * 10, my + normal.y * 10 );

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0f0';
    ctx.stroke();
  };

  return Segment;
});
