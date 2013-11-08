/*globals define*/
define([
  'physics/intersection'
], function( Intersection ) {
  'use strict';

  // Filter all physics entities that may be colliding.
  function broadphase( entities ) {
    var potentials = [];

    var aabb0,
        aabb1;

    entities.forEach(function( a ) {
      aabb0 = a.aabb();

      entities.forEach(function( b ) {
        if ( a === b ) {
          return;
        }

        aabb1 = b.aabb();

        if ( Intersection.aabb( aabb0, aabb1 ) ) {
          potentials.push( [ a, b ] );
        }
      });
    });

    return potentials;
  }

  function sort2d( a, b ) {
    if ( a.x === b.x ) {
      return a.y - b.y;
    }

    return a.x - b.x;
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
    broadphase: broadphase,
    sort2d: sort2d
  };
});
