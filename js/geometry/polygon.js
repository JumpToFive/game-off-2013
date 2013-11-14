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

      ctx.moveTo( mx, my );

      normal = Utils.lineNormal( x0, y0, x1, y1 );
      if ( !normal ) {
        continue;
      }

      ctx.lineTo( mx + normal.x * 10, my + normal.y * 10 );
    }

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0f0';
    ctx.stroke();
  };

  Polygon.prototype.aabb = function() {
    var vertexCount = this.vertexCount();

    var xmin = Number.POSITIVE_INFINITY,
        ymin = Number.POSITIVE_INFINITY,
        xmax = Number.NEGATIVE_INFINITY,
        ymax = Number.NEGATIVE_INFINITY;

    var cos = Math.cos( -this.rotation ),
        sin = Math.sin( -this.rotation );

    var x, y;
    var rx, ry;
    for ( var i = 0; i < vertexCount; i++ ) {
      x = this.vertices[ 2 * i ];
      y = this.vertices[ 2 * i + 1 ];

      rx = cos * x - sin * y;
      ry = sin * x + cos * y;

      if ( rx < xmin ) { xmin = rx; }
      if ( ry < ymin ) { ymin = ry; }
      if ( rx > xmax ) { xmax = rx; }
      if ( ry > ymax ) { ymax = ry; }
    }

    return {
      xmin: xmin + this.x,
      ymin: ymin + this.y,
      xmax: xmax + this.x,
      ymax: ymax + this.y
    };
  };

  Polygon.prototype.vertexCount = function() {
    return 0.5 * this.vertices.length;
  };

  return Polygon;
});
