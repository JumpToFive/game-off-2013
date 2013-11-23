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

    var xi, yi, xj, yj;
    var mx, my;
    var normal;
    for ( var i = 0; i < vertexCount; i++ ) {
      xi = this.vertices[ 2 * i ];
      yi = this.vertices[ 2 * i + 1 ];
      xj = this.vertices[ 2 * ( ( i + 1 ) % vertexCount ) ];
      yj = this.vertices[ 2 * ( ( i + 1 ) % vertexCount ) + 1 ];

      mx = 0.5 * ( xi + xj );
      my = 0.5 * ( yi + yj );

      normal = Utils.lineNormal( xi, yi, xj, yj );
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

  Polygon.prototype.contains = function( x, y ) {
    var vertexCount = this.vertexCount();

    x -= this.x;
    y -= this.y;

    var cos, sin;
    var rx, ry;
    if ( this.angle ) {
      cos = Math.cos( this.angle );
      sin = Math.sin( this.angle );

      rx = cos * x - sin * y;
      ry = sin * x + cos * y;

      x = rx;
      y = ry;
    }

    var contains = false;
    var xi, yi, xj, yj;
    for ( var i = 0, j = vertexCount - 1; i < vertexCount; j = i++ ) {
      xi = this.vertices[ 2 * i ];
      yi = this.vertices[ 2 * i + 1 ];
      xj = this.vertices[ 2 * j ];
      yj = this.vertices[ 2 * j + 1 ];

      if ( ( ( yi > y ) !== ( yj > y ) ) &&
           ( x < ( xj - xi ) * ( y - yi ) / ( yj - yi ) + xi ) ) {
        contains = !contains;
      }
    }

    return contains;
  };

  return Polygon;
});
