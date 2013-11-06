/*globals define*/
define([
  'utils'
], function( Utils ) {
  'use strict';

  // Filter all physics entities that may be colliding.
  function broadphase( entities ) {
    var potentials = [];

    var aabb0,
        aabb1;

    entities.forEach(function( entity ) {
      entity.fill.set({
        red: 255,
        green: 0
      });
    });

    entities.forEach(function( a ) {
      aabb0 = a.aabb();

      entities.forEach(function( b ) {
        if ( a === b ) {
          return;
        }

        aabb1 = b.aabb();

        if ( Utils.aabbIntersect( aabb0, aabb1 ) ) {
          a.fill.set({
            red: 0,
            green: 255
          });

          b.fill.set({
            red: 0,
            green: 255
          });

        }
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
