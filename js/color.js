/*globals define*/
define([
  'base-object'
], function( BaseObject ) {
  'use strict';

  function Color( red, green, blue, alpha ) {
    BaseObject.call( this );

    this.red   = red   || 0;
    this.green = green || 0;
    this.blue  = blue  || 0;
    this.alpha = alpha || 0.0;
  }

  Color.prototype = new BaseObject();
  Color.prototype.constructor = Color;

  Color.prototype.rgba = function() {
    return 'rgba(' +
      Math.round( this.red )   + ', ' +
      Math.round( this.green ) + ', ' +
      Math.round( this.blue )  + ', ' +
      this.alpha +
    ')';
  };

  return Color;
});
