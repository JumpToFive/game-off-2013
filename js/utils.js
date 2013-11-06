/*globals define*/
define(function() {
  'use strict';

  function lerp( a, b, t ) {
    return a + t * ( b - a );
  }

  /**
   * Return if the two axis-aligned bounding-boxes intersect.
   */
  function aabbIntersect( a, b ) {
    return a.xmin <
  }

  return {
    lerp: lerp
  };
});
