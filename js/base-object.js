/*globals define*/
define(function() {
  'use strict';

  function BaseObject() {}

  BaseObject.prototype.set = function( attrs ) {
    for ( var key in attrs ) {
      if ( this.hasOwnProperty( key ) ) {
        this[ key ] = attrs[ key ];
      }
    }
  };

  return BaseObject;
});
