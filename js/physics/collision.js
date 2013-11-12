/*globals define*/
define([
  'physics/intersection'
], function( Intersection ) {
  'use strict';

  // Filter all physics entities that may be colliding.
  function broadphase( entities ) {
    var potentials = [];

    var aabbs = entities.map(function( entity ) {
      return entity.aabb();
    });

    var length = entities.length;
    var i, j;
    var aabb0, aabb1;
    for ( i = 0; i < length; i++ ) {
      aabb0 = aabbs[i];

      for ( j = i + 1; j < length; j++ ) {
        aabb1 = aabbs[j];

        if ( Intersection.aabb( aabb0, aabb1 ) ) {
          potentials.push( [ entities[i], entities[j] ] );
        }
      }
    }

    return potentials;
  }

  function sort2d( a, b ) {
    if ( a.x === b.x ) {
      return a.y - b.y;
    }

    return a.x - b.x;
  }

  /**
   * Taken from Randy Gaul's article series, How to Create a Custom 2D Physics Engine:
   * http://gamedev.tutsplus.com/tutorials/implementation/create-custom-2d-physics-engine-aabb-circle-impulse-resolution/
   */
  function collideCircles( a, b ) {

    var manifold = new Manifold();
  }

  function collideEdgeAndCircle( edge, circle ) {

  }

  function Manifold( a, b, penetration, nx, ny ) {
    this.a = a || null;
    this.b = b || null;
    this.penetration = penetration || 0;

    // Normal.
    this.nx = nx || 0;
    this.ny = ny || 0;
  }

  return {
    broadphase: broadphase,
    sort2d: sort2d
  };
});
