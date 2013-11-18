/*globals define*/
define([
  'object2d',
  'utils'
], function( Object2D, Utils ) {
  'use strict';

  function Polygon( x, y ) {
    Object2D.call( this, x, y );

    this.vertices = [];
  }

  Polygon.prototype = new Object2D();
  Polygon.prototype.constructor = Polygon;

  Polygon.prototype.draw = function( ctx ) {
    if ( !this.vertices.length ) {
      return;
    }

    Object2D.prototype.draw.call( this, ctx );
  };

  Polygon.prototype.drawPath = function( ctx ) {
    var vertexCount = this.vertexCount();

    this.drawNormals( ctx );

    ctx.beginPath();

    ctx.moveTo( this.vertices[0], this.vertices[1] );
    for ( var i = 1; i < vertexCount; i++ ) {
      ctx.lineTo( this.vertices[ 2 * i ], this.vertices[ 2 * i + 1 ] );
    }

    ctx.closePath();
  };

  Polygon.prototype.drawNormals = function( ctx ) {
    var vertexCount = this.vertexCount();

    ctx.beginPath();

    var x0, y0, x1, y1;
    var mx, my;
    var normal;
    for ( var i = 0; i < vertexCount; i++ ) {
      x0 = this.vertices[ 2 * i ];
      y0 = this.vertices[ 2 * i + 1 ];
      x1 = this.vertices[ 2 * ( ( i + 1 ) % vertexCount ) ];
      y1 = this.vertices[ 2 * ( ( i + 1 ) % vertexCount ) + 1 ];

      mx = 0.5 * ( x0 + x1 );
      my = 0.5 * ( y0 + y1 );

      normal = Utils.lineNormal( x0, y0, x1, y1 );
      if ( !normal ) {
        continue;
      }

      ctx.moveTo( mx, my );
      ctx.lineTo( mx + normal.x * 1, my + normal.y * 1 );
    }

    ctx.lineWidth = 0.2;
    ctx.strokeStyle = '#0f0';
    ctx.stroke();
  };

  Polygon.prototype.vertexCount = function() {
    return 0.5 * this.vertices.length;
  };

  return Polygon;
});
