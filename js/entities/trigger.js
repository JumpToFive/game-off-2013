/*globals define*/
define([
  'entities/physics-entity'
], function( PhysicsEntity ) {
  'use strict';

  function Trigger( x, y, width, height, material ) {
    PhysicsEntity.call( this, {
      shape: 'polygon',
      type: 'box',
      data: {
        hx: 0.5 * ( width || 0 ),
        hy: 0.5 * ( height || 0 )
      },
      fixture: {
        isSensor: true,
        filter: {
          categoryBits: material
        }
      },
      body: {
        position: {
          x: x,
          y: y
        }
      }
    });
  }

  Trigger.prototype = PhysicsEntity;
  Trigger.prototype.constructor = Trigger;

  Trigger.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    // When the correct trash object enters the trigger,
    // set its lifeTime to infinite.
  };

  return Trigger;
});
