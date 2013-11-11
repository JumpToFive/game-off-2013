/*globals define*/
define([
  'entities/entity',
  'utils'
], function( Entity, Utils ) {
  'use strict';

  function PhysicsEntity( x, y ) {
    Entity.call( this, x, y );

    // Previous position.
    this.px = this.x;
    this.py = this.y;

    this.vx = 0;
    this.vy = 0;

    // Angular velocity.
    this.va = 0;

    this.fixed = false;
    this.collides = true;
  }

  PhysicsEntity.prototype = new Entity();
  PhysicsEntity.prototype.constructor = PhysicsEntity;

  PhysicsEntity.prototype.update = function( dt ) {
    if ( this.fixed ) {
      return;
    }

    this.vx *= 0.95;
    this.vy *= 0.95;
    this.va *= 0.95;

    this.vx = Utils.roundNearZero( this.vx );
    this.vy = Utils.roundNearZero( this.vy );
    this.va = Utils.roundNearZero( this.va );

    // Change to verlet integration.
    var x = this.x + this.vx * dt,
        y = this.y + this.vy * dt;

    this.px = this.x;
    this.py = this.y;

    this.x = x;
    this.y = y;

    this.rotation += this.va * dt;
  };

  PhysicsEntity.prototype.accelerate = function( x, y ) {
    this.vx += x;
    this.vy += y;
  };

  PhysicsEntity.prototype.radialAccelerate = function( ra ) {
    this.va += ra;
  };

  PhysicsEntity.prototype.onCollide = function() {};

  return PhysicsEntity;
});
