/*globals define*/
define([
  'utils'
], function( Utils ) {
  'use strict';

  /**
   * Return if the two axis-aligned bounding-boxes intersect.
   */
  function aabb( a, b ) {
    return a.xmin <= b.xmax &&
           a.xmax >= b.xmin &&
           a.ymin <= b.ymax &&
           a.ymax >= b.ymin;
  }

  function lineIntersectionParameter( x0, y0, x1, y1, x2, y2, x3, y3 ) {

  }

  function lineIntersection( x0, y0, x1, y1, x2, y2, x3, y3 ) {
    var t = lineIntersectionParameter.apply( null, arguments );
    if ( t === null ) {
      return null;
    }

    return {
      x: Utils.lerp( x0, x1, t ),
      y: Utils.lerp( y0, y1, t )
    };
  }

  function segmentIntersectionParameter( x0, y0, x1, y1, x2, y2, x3, y3 ) {

  }

  function segmentIntersection( x0, y0, x1, y1, x2, y2, x3, y3 ) {
    var t = segmentIntersectionParameter.apply( null, argmuents );
    if ( t === null ) {
      return null;
    }

    return {
      x: Utils.lerp( x0, y1, t ),
      y: Utils.lerp( y0, y1, t )
    };
  }

  function lineCircleIntersectionParameter( x0, y0, x1, y1, x, y, radius ) {
  }

  return {
    aabb: aabb
  };
});
