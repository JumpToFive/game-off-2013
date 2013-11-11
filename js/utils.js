/*globals define*/
define(function() {
  'use strict';

  var EPSILON = 1e-5;

  function lerp( a, b, t ) {
    return a + t * ( b - a );
  }

  return {
    EPSILON: EPSILON,
    lerp: lerp
  };
});
