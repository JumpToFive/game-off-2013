/*globals define*/
define(function( require ) {
  'use strict';

  var Utils = require( 'utils' );
  var LevelUtils = require( 'levels/utils-level' );

  var Door = require( 'entities/door' );
  var Laser = require( 'entities/laser' );
  var Emitter = require( 'entities/emitter' );
  var Trigger = require( 'entities/trigger' );
  var TriggerWire = require( 'effects/trigger-wire' );

  var Material = require( 'config/material' );

  var DEG_TO_RAD = Utils.DEG_TO_RAD;

  var level03Data = require( 'text!../../json/level-03.json' );
  // var level04 = require( 'levels/level-04' );

  return function( game ) {
    game.clear();

    game.player.x = 60;
    game.player.y = -40;

    game.background.hueSpread = 20;

    LevelUtils.playerMaterialOn( game );
    LevelUtils.addTrail( game );
    LevelUtils.addBackground( game, 75, 64, 32, 1 );
    LevelUtils.loadData( game, level03Data );

    game.camera.setHeight( 36, {
      maintainAspectRatio: true
    });
  };
});
