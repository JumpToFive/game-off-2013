/*globals define*/
define(function( require ) {
  'use strict';

  var Color = require( 'color' );
  var Level = require( 'level' );
  var Utils = require( 'utils' );

  var Laser = require( 'entities/laser' );
  var TractorBeam = require( 'entities/tractor-beam' );

  var Trail = require( 'effects/trail' );

  var Material = require( 'config/material' );

  var DEG_TO_RAD = Utils.DEG_TO_RAD;

  var level01Data = require( 'text!../../json/level-01.json' );

  return function( game ) {
    game.clear();
    game.debug = true;

    game.player.x = -65;
    game.player.y = 15;

    var trail = new Trail();
    trail.fill = new Color( 255, 255, 255, 0.2 );
    trail.target = game.player;
    game.add( trail );

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

    var tractorBeam = new TractorBeam( -55, 14, 40, 14, {
      particleCount: 15,
      particleHeight: 8
    });
    tractorBeam.angle = -25 * DEG_TO_RAD;
    tractorBeam.force = 3000;
    game.add( tractorBeam );

    var laser0 = new Laser( -17, 46, Material.ANTIMATTER );
    laser0.angle = 60 * DEG_TO_RAD;
    game.add( laser0 );
  };
});
