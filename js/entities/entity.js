/*globals define*/
define([
  'object2d'
], function( Object2D ) {
  'use strict';

  function Entity( x, y ) {
    Object2D.call( this, x, y );

    this.shapes = [];
    this.world = null;
  }

  Entity.prototype = new Object2D();
  Entity.prototype.constructor = Entity;

  Entity.prototype.update = function() {};

  Entity.prototype.drawPath = function( ctx ) {
    this.shapes.forEach(function( shape ) {
      shape.draw( ctx );
    });
  };

  Entity.prototype.add = function( shape ) {
    this.shapes.push( shape );
  };

  Entity.prototype.remove = function( shape ) {
    var index = this.shapes.indexOf ( shape );
    if ( index !== -1 ) {
      this.shapes.splice( index, 1 );
    }
  };

  Entity.prototype.aabb = function() {
    var xmin = Number.POSITIVE_INFINITY,
        ymin = Number.POSITIVE_INFINITY,
        xmax = Number.NEGATIVE_INFINITY,
        ymax = Number.NEGATIVE_INFINITY;

    this.shapes.forEach(function( shape ) {
      var aabb = shape.aabb();

      if ( aabb.xmin < xmin ) { xmin = aabb.xmin; }
      if ( aabb.xmax > xmax ) { xmax = aabb.xmax; }
      if ( aabb.ymin < ymin ) { ymin = aabb.ymin; }
      if ( aabb.ymax > ymax ) { ymax = aabb.ymax; }
    });

    return {
      xmin: xmin + this.x,
      ymin: ymin + this.y,
      xmax: xmax + this.x,
      ymax: ymax + this.y
    };
  };

  return Entity;
});
