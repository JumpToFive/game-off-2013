/*globals define*/
define([
  'physics/intersection'
], function( Intersection ) {
  'use strict';

  function Manifold( a, b, penetration, nx, ny ) {
    this.a = a || null;
    this.b = b || null;
    this.penetration = penetration || 0;

    // Normal.
    this.nx = nx || 0;
    this.ny = ny || 0;
  }

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
  function collideCircles( a, aTramsform, b, bTransform ) {
    var dx = a.x - b.x,
        dy = a.y - b.y;

    var distanceSquared = dx * dx + dy * dy;

    var radiusSquared = a.radius + b.radius;
    radiusSquared *= radiusSquared;

    // Not colliding.
    if ( radiusSquared < distanceSquared ) {
      return null;
    }

    var manifold = new Manifold( a, b );

    return manifold;
  }

  function collideEdgeAndCircle( edge, edgeTransform, circle, circleTransform ) {
    var x0 = edge.x0,
        y0 = edge.y0,
        x1 = edge.x1,
        y1 = edge.y1;

    var cos, sin;
    if ( edgeTransform.rotation ) {
      cos = Math.cos( -edgeTransform.rotation );
      sin = Math.sin( -edgeTransform.rotation );

      var rx0 = cos * x0 - sin * y0,
          ry0 = sin * x0 + cos * y0,

          rx1 = cos * x1 - sin * y1,
          ry1 = sin * x1 + cos * y1;

      x0 = rx0;
      y0 = ry0;
      x1 = rx1;
      y1 = ry1;
    }

    x0 += edgeTransform.x;
    y0 += edgeTransform.y;
    x1 += edgeTransform.x;
    y1 += edgeTransform.y;

    var cx = circle.x,
        cy = circle.y,
        cr = circle.radius;

    if ( circleTransform.rotation ) {
      cos = Math.cos( -circleTransform.rotation );
      sin = Math.sin( -circleTransform.rotation );

      var rcx = cos * cx - sin * cy,
          rcy = sin * cx - cos * cy;

      cx = rcx;
      cy = rcy;
    }

    cx += circleTransform.x;
    cy += circleTransform.y;

    var manifold = new Manifold( edgeTransform, circleTransform );

    return manifold;
  }

  return {
    broadphase: broadphase,
    sort2d: sort2d
  };
});
