/*globals define*/
define(function( require ) {
  'use strict';

  var Level = require( 'level' );

  var TractorBeam = require( 'entities/tractor-beam' );

  var level01Data = require( 'text!../../json/level-01.json' );

  return function( game ) {
    game.clear();

    game.background.fill.set({
      red: 128,
      green: 96,
      blue: 64,
      alpha: 1
    });

    game.background.prerender();

    var aspectRatio = game.camera.width / game.camera.height;
    game.camera.height = 32;
    game.camera.width  = game.camera.height * aspectRatio;

    game.load({
      entities: Level.loadBatchPhysicsEntities( JSON.parse( level01Data ) )
    });

    var tractorBeam = new TractorBeam( 10, 5, 40, 12, {
      particleCount: 20,
      particleHeight: 6
    });
    tractorBeam.angle = -25 * Math.PI / 180;
    tractorBeam.force = 3000;
    game.add( tractorBeam );
  };
});
