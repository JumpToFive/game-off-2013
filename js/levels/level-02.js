/*globals define*/
define(function( require ) {
  'use strict';

  var LevelUtils = require( 'level/utils-level' );
  var level02Data = require( 'text!../../json/level-02.json' );

  return function( game ) {
    game.clear();

    game.player.x = 64;
    game.player.y = -45;

    LevelUtils.playerMaterialOn( game );
    LevelUtils.addTrail( game );
    LevelUtils.addBackground( game, 96, 75, 32, 1 );
    LevelUtils.loadData( game, level02Data );

    game.camera.setHeight( 48, {
      maintainAspectRatio: true
    });


    // Emitter.


    // Lasers.

  };
});
