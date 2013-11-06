/*globals define*/
define(function() {
  'use strict';

  function lerp( a, b, t ) {
    return a + t * ( b - a );
  }

  return {
    lerp: lerp
  };
});
