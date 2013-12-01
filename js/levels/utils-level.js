/*globals define*/
define([
  'level',
  'effects/trail',
  'entities/player',
], function( Level, Trail, Player ) {
  'use strict';

  function addTrail( game ) {
    var trail = new Trail();
    trail.fill.set({
      red: 255,
      green: 255,
      blue: 255,
      alpha: 0.2
    });

    trail.target = game.player;
    game.add( trail );
  }

  function addBackground( game, red, green, blue, alpha ) {
    game.background.fill.set({
      red: red,
      green: green,
      blue: blue,
      alpha: alpha
    });

    game.background.prerender();
  }

  function playerMaterialOff( game ) {
    // Prevent player from changing material.
    var materialBtn = document.getElementById( 'material-btn' );
    materialBtn.style.display = 'none';
    game.player.toggleMaterial = function() {};
  }

  function playerMaterialOn( game ) {
    // Allow player to change material.
    var materialBtn = document.getElementById( 'material-btn' );
    materialBtn.style.display = '';
    game.player.toggleMaterial = Player.prototype.toggleMaterial;
  }

  function loadData( game, data ) {
    game.load({
      entitites: Level.loadBatchPhysicsEntities( JSON.parse( data ) )
    });
  }

  return {
    addTrail: addTrail,
    addBackground: addBackground,

    playerMaterialOff: playerMaterialOff,
    playerMaterialOn: playerMaterialOn,

    loadData: loadData
  };
});
