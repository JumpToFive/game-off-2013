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

  Segment.prototype.aabb = function() {
    var xmin, ymin, xmax, ymax;

    var x0 = this.x0,
        y0 = this.y0,
        x1 = this.x1,
        y1 = this.y1;

    if ( this.rotation ) {
      var cos = Math.cos( -this.rotation ),
          sin = Math.sin( -this.rotation );

      var rx0 = cos * x0 - sin * y0,
          ry0 = sin * x0 + cos * y0,

          rx1 = cos * x1 - sin * y1,
          ry1 = sin * x1 + cos * y1;

      x0 = rx0;
      y0 = ry0;
      x1 = rx1;
      y1 = ry1;
    }

    if ( x1 > x0 ) {
      xmin = x0;
      xmax = x1;
    } else {
      xmin = x1;
      xmax = x0;
    }

    if ( y1 > y0 ) {
      ymin = y0;
      ymax = y1;
    } else {
      ymin = y1;
      ymax = y0;
    }

    return {
      xmin: xmin + this.x,
      ymin: ymin + this.y,
      xmax: xmax + this.x,
      ymax: ymax + this.y
    };
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
