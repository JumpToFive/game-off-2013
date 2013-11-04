/*globals define*/
define([
  'object2d'
], function( Object2D ) {
  'use strict';

  function Level() {
    Object2D.call( this );
  }

  Level.prototype = new Object2D();
  Level.prototype.constructor = Level;

  Level.prototype.fromJSON = function() {};

  return Level;
});
