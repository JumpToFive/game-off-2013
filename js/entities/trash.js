/*globals define*/
define([
  'entities/physics-entity'
], function( PhysicsEntity ) {
  'use strict';

  function Trash( options, lifeTime ) {
    PhysicsEntity.call( this, options );

    // In seconds.
    this.lifeTime = lifeTime || 0;
    this.time = 0;
  }

  Trash.prototype = new PhysicsEntity();
  Trash.prototype.constructor = Trash;

  Trash.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    this.time += dt;
    if ( this.time > this.lifeTime ) {
      this.game.removed.push( this );
    }
  };

  Trash.prototype.draw = function( ctx ) {
    ctx.lineJoin = 'round';
    PhysicsEntity.prototype.draw.call( this, ctx );
    ctx.lineJoin = 'miter';
  };

  return Trash;
});
