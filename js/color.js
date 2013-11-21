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

  // Adapted from: http://stackoverflow.com/a/9493060/2371813
  Color.prototype.hslObject = function() {
    var red   = this.red,
        green = this.green,
        blue  = this.blue;

    red   /= 255;
    green /= 255;
    blue  /= 255;

    var max = Math.max( red, green, blue ),
        min = Math.min( red, green, blue );

    var hue, saturation;
    var lightness = 0.5 * ( max + min );

    var d;
    if ( max === min ) {
      hue = 0;
      saturation = 0;
    } else {
      d = max - min;
      saturation = lightness > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
      switch ( max ) {
        case red:
          hue = ( green - blue ) / d + ( green < blue ? 6 : 0 );
          break;

        case green:
          hue = ( blue - red ) / d + 2;
          break;

        case blue:
          hue = ( red - green ) / d + 4;
          break;
      }

      hue *= 60;
    }

    return {
      hue: hue,
      saturation: saturation * 100,
      lightness: lightness * 100
    };
  };

  return Color;
});
