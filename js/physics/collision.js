define([
], function() {
  'use strict';

  // Filter all physics entities that may be colliding.
  function broadphase( entities ) {
    var potentials = [];

    var aabb0,
        aabb1;

    entities.forEach(function( a ) {
      aabb0 = a.aabb;

      entities.forEach(function( b ) {
        if ( a === b ) {
          return;
        }

        aabb1 = b.aabb;
      });
    });

    return potentials;
  }

  /**
   * Determine all unique pairs of entities.
   */
  function unique( pairsArray ) {
    pairsArray.forEach(function() {
      pairsArray.forEach(function() {
      });
    });
  }

  return {
    broadphase: broadphase
  };
});
