/*globals define*/
define(function() {
  'use strict';

  var EPSILON = 1e-3;

  function lerp( a, b, t ) {
    return a + t * ( b - a );
  }

  function roundNearZero( value ) {
    return Math.abs( value ) > EPSILON ? value : 0;
  }

  /**
   * Assuming the line is CCW, the normal of the line is (dy, -dx).
   */
  function lineNormal( x0, y0, x1, y1 ) {
    var dx = x1 - x0,
        dy = y1 - y0;

    var lengthSquared = dx * dx + dy * dy;
    if ( !lengthSquared ) {
      return null;
    }

    var invLength = 1 / Math.sqrt( lengthSquared );
    return {
      x: -dy * invLength,
      y:  dx * invLength
    };
  }

  return {
    EPSILON: EPSILON,

    lerp: lerp,
    roundNearZero: roundNearZero,
    lineNormal: lineNormal
  };
});
