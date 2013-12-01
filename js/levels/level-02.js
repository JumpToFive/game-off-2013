/*globals define*/
define(function( require ) {
  'use strict';

  var Color = require( 'color' );
  var Level = require( 'level' );

  var Trail = require( 'effects/trail' );
  var Player = require( 'entities/player' );

  var level02Data = require( 'text!../../json/level-02.json' );

  return function( game ) {
    // Allow player to change material.
    var materialBtn = document.getElementById( 'material-btn' );
    materialBtn.style.display = '';
    game.player.toggleMaterial = Player.prototype.toggleMaterial;

    game.clear();

    game.player.x = 64;
    game.player.y = -45;

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
    game.camera.height = 48;
    game.camera.width  = game.camera.height * aspectRatio;

    game.load({
      entities: Level.loadBatchPhysicsEntities( JSON.parse( level02Data ) )
    });

    // Emitter.


    // Lasers.

  };
});
