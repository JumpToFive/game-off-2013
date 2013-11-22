/*globals define*/
define([
  'utils',
  'color'
], function( Utils, Color ) {
  'use strict';

  var PI2 = Utils.PI2;

  var defaults = {
  };

  function Trail( options ) {
    this.target = null;
    this.particles = [];
    this.fill = new Color();

    Utils.defaults( this, options, defaults );

    this.time = 0;
  }

  Trail.protoype.update = function( dt ) {
    this.time += dt;
  };

  Trail.prototype.draw = function( ctx ) {
    this.particles.forEach(function( particle ) {
      ctx.beginPath();
      ctx.arc( particle.x, particle.y, particle.radius, 0, PI2 );
    });
  };

  return Trail;
});
