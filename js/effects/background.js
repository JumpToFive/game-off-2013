/*globals define*/
define([
  'object2d',
  'utils'
], function( Object2D, Utils ) {
  'use strict';

  function Background( width, height ) {
    Object2D.call( this, 0, 0 );

    this.parallax = 0.25;

    this.spread = {
      hue: 50,
      saturation: 15,
      lightness: 25
    };

    this.canvas = document.createElement( 'canvas' );
    this.ctx = this.canvas.getContext( '2d' );

    this.width  = width || 0;
    this.height = height || 0;

    this.count = 100;

    this.game = null;
    this.camera = null;
  }

  Background.prototype = new Object2D();
  Background.prototype.constructor = Background;

  Background.prototype.prerender = function() {
    var hsl = this.fill.hslObject();

    var hue        = hsl.hue,
        saturation = hsl.saturation,
        lightness  = hsl.lightness;

    var width  = this.width,
        height = this.height;

    var rects = [];
    var rectCount = this.count;

    var rectHue, rectSaturation, rectLightness;
    while ( rectCount-- ) {
      rectHue = this.spread.hue ? Utils.intSpread( hue, this.spread.hue ) : hue;
      rectSaturation = this.spread.saturation ? Utils.intSpread( saturation, this.spread.saturation ) : saturation;
      rectLightness = this.spread.lightness ? Utils.intSpread( lightness, this.spread.lightness ): lightness;

      rects.push({
        x: Math.random() * width,
        y: Math.random() * height,
        width: Utils.randomFloat( 0.05, 0.3 ) * width,
        height: Utils.randomFloat( 0.05, 0.3 ) * height,
        hue: rectHue,
        saturation: rectSaturation + '%',
        lightness: rectLightness + '%'
      });
    }

    var ctx = this.ctx;
    ctx.fillStyle = this.fill.rgba();
    ctx.fillRect( 0, 0, width, height );

    rects.forEach(function( rect ) {
      ctx.save();
      ctx.translate( rect.x, rect.y );

      ctx.beginPath();
      ctx.rect( -0.5 * rect.width, -0.5 * rect.height, rect.width, rect.height );
      ctx.fillStyle = 'hsla(' +
        rect.hue + ', ' +
        rect.saturation + ', ' +
        rect.lightness + ', ' +
        Math.random() +
      ')';

      ctx.fill();

      ctx.restore();
    });
  };

  Background.prototype.draw = function( ctx ) {
    if ( !this.game || !this.camera ) {
      return;
    }

    ctx.save();
    ctx.translate( this.camera.x * this.parallax, this.camera.y * this.parallax );
    ctx.scale( this.parallax, this.parallax );

    var prevAlpha = ctx.globalAlpha;
    ctx.globalAlpha = this.fill.alpha;
    ctx.drawImage( this.canvas, -0.5 * this.width, -0.5 * this.height );
    ctx.globalAlpha = prevAlpha;

    ctx.restore();
  };

  Object.defineProperty( Background.prototype, 'width', {
    get: function() {
      return this.canvas.width;
    },

    set: function( width ) {
      this.canvas.width = width || 0;
    }
  });

  Object.defineProperty( Background.prototype, 'height', {
    get: function() {
      return this.canvas.height;
    },

    set: function( height ) {
      this.canvas.height = height || 0;
    }
  });

  return Background;
});
