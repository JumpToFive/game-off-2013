/*globals define*/
define([
  'entities/entity'
], function( Entity ) {
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

  PhysicsEntity.prototype.onCollide = function() {};

  return PhysicsEntity;
});
