/*globals define*/
define([
  'object2d',
  'box2d'
], function( Object2D, Box2D ) {
  'use strict';

  var Vec2 = Box2D.Common.Math.b2Vec2;
  var PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;


  function Segment( x0, y0, x1, y1 ) {
    Object2D.call( this, 0, 0 );
  }

  Segment.prototype.initialize = function() {
  };

  Segment.prototype = new Object2D();
  Segment.prototype.constructor = Segment;

  Segment.prototype.drawPath = function( ctx ) {
    this.drawNormals( ctx );

    ctx.beginPath();
    ctx.moveTo( this.x0, this.y0 );
    ctx.lineTo( this.x1, this.y1 );
    ctx.closePath();
  };

  Object.defineProperty( Segment.prototype, 'x0', {
    enumerable: true,

    get: function() {},
    set: function( x0 ) {}
  });

  Object.defineProperty( Segment.prototype, 'y0', {
    enumerable: true,

    get: function() {},
    set: function( y0 ) {}
  });

  Object.defineProperty( Segment.prototype, 'x1', {
    enumerable: true,

    get: function() {},
    set: function( x1 ) {}
  });

  Object.defineProperty( Segment.prototype, 'y1', {
    enumerable: true,

    get: function() {},
    set: function( y1 ) {}
  });

  return Segment;
});
