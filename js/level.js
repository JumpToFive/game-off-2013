/*globals define*/
define([
  'object2d',
  'geometry/geometry-factory',
  'entities/physics-entity'
], function( Object2D, GeometryFactory, PhysicsEntity ) {
  'use strict';

  function Level() {
    Object2D.call( this );

    this.entities = [];
    this.shapes = [];
  }

  Level.prototype = new Object2D();
  Level.prototype.constructor = Level;

  Level.prototype.fromJSON = function( json ) {
    var jsonObject = JSON.parse( json );

    this.entities = [];
    jsonObject.entities.forEach(function( entityData ) {
    });

    jsonObject.physicsEntities.forEach(function( entityData ) {
      this.entities.push( new PhysicsEntity( entityData ) );
    });

  };

  return Level;
});
