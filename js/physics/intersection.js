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

  function lineParameter( x0, y0, x1, y1, parameter ) {
    if ( parameter === null ) {
      return null;
    }

    return {
      x: Utils.lerp( x0, x1, parameter ),
      y: Utils.lerp( y0, y1, parameter )
    };
  }

  function lineIntersectionParameter( x0, y0, x1, y1, x2, y2, x3, y3 ) {
    var det = ( x1 - x0 ) * ( y3 - y2 ) - ( x3 - x2 ) * ( y1 - y0 );
    if ( !det ) {
      return null;
    }

    return ( ( x3 - x2 ) * ( y0 - y2 ) - ( y3 - y2 ) * ( x0 - x2 ) ) / det;
  }

  function lineIntersection( x0, y0, x1, y1, x2, y2, x3, y3 ) {
    var t = lineIntersectionParameter( x0, y0, x1, y1, x2, y2, x3, y3 );
    return lineParameter( x0, y0, x1, y1, t );
  }

  function segmentIntersectionParameter( x0, y0, x1, y1, x2, y2, x3, y3 ) {
    var s = lineIntersectionParameter( x0, y0, x1, y1, x2, y2, x3, y3 ),
        t = lineIntersectionParameter( x2, y2, x3, y3, x0, y0, x1, y1 );

    if ( s === null || t === null ) {
      return null;
    }

    if ( 0 > s || s > 1 ||
         0 > t || t > 1 ) {
      return null;
    }

    return t;
  }

  function segmentIntersection( x0, y0, x1, y1, x2, y2, x3, y3 ) {
    var t = segmentIntersectionParameter( x0, y0, x1, y1, x2, y2, x3, y3 );
    return lineParameter( x0, y0, x1, y1, t );
  }

  function lineCircleIntersectionParameter( x0, y0, x1, y1, cx, cy, r ) {
    // Transform line to circle space.
    x0 -= cx;
    y0 -= cy;
    x1 -= cx;
    y1 -= cy;
  }

  // Should return an array?
  function lineCircleIntersection( x0, y0, x1, y1, cx, cy, r ) {
    var t = lineCircleIntersectionParameter( x0, y0, x1, y1, cx, cy, r );
    return lineParameter( x0, y0, x1, y1, t );
  }

  function segmentCircleIntersectionParameter( x0, y0, x1, y1, cx, cy, r ) {
    var t = lineCircleIntersectionParameter( x0, y0, x1, y1, cx, cy, r );
    if ( t === null ) {
      return null;
    }

    if ( 0 > t || t > 1 ) {
      return null;
    }

    return t;
  }

  function segmentCircleIntersection( x0, y0, x1, y1, cx, cy, r ) {
    var t = segmentCircleIntersectionParameter( x0, y0, x1, y1, cx, cy, r );
    return lineParameter( x0, y0, x1, y1, t );
  }

  return {
    aabb: aabb,

    lineParameter: lineParameter,

    lineIntersectionParameter: lineIntersectionParameter,
    lineIntersection: lineIntersection,

    segmentIntersectionParameter: segmentIntersectionParameter,
    segmentIntersection: segmentIntersection,

    lineCircleIntersectionParameter: lineCircleIntersectionParameter,
    lineCircleIntersection: lineCircleIntersection,

    segmentCircleIntersectionParameter: segmentCircleIntersectionParameter,
    segmentCircleIntersection: segmentCircleIntersection
  };
});
