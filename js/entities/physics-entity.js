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

    this.linearDamping = 1;
    this.angularDamping = 0.01;
  }

  PhysicsEntity.prototype = new Entity();
  PhysicsEntity.prototype.constructor = PhysicsEntity;

  PhysicsEntity.prototype.update = function( dt ) {
    if ( this.fixed ) {
      return;
    }

    var linearDamping = Utils.clamp( 1 - this.linearDamping * dt, 0, 1 );

    this.vx *= linearDamping;
    this.vy *= linearDamping;
    this.va *= Utils.clamp( 1  - this.angularDamping * dt, 0, 1 );

    this.vx = Utils.roundNearZero( this.vx );
    this.vy = Utils.roundNearZero( this.vy );
    this.va = Utils.roundNearZero( this.va );

    // TODO: change to verlet integration?
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

  return PhysicsEntity;
});
