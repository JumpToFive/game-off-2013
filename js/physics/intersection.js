/*globals define*/
define(function() {
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

  return {
    aabb: aabb
  };
});
