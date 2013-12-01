/*globals define*/
define(function( require ) {
  'use strict';

  var Color = require( 'color' );
  var Level = require( 'level' );

  var Trail = require( 'effects/trail' );

  var level02Data = require( 'text!../../json/level-02.json' );

  return function( game ) {
    game.clear();

    game.player.x = 0;
    game.player.y = 0;

    var trail = new Trail();
    trail.fill = new Color( 255, 255, 255, 0.2 );
    trail.target = game.player;
    game.add( trail );

    game.background.fill.set({
      red: 96,
      green: 75,
      blue: 32,
      alpha: 1
    });

    game.background.prerender();

    var aspectRatio = game.camera.width / game.camera.height;
    game.camera.height = 32;
    game.camera.width  = game.camera.height * aspectRatio;

    game.load({
      entities: Level.loadBatchPhysicsEntities( JSON.parse( level02Data ) )
    });
  };
});
