/*globals requirejs, define*/
requirejs.config({
  paths: {
    'text': 'text'
  }
});


/* globals define*/
define(function( require ) {
  'use strict';

  var Game    = require( 'game' ),
      Level   = require( 'level' ),
      Circle  = require( 'geometry/circle' ),
      Rect    = require( 'geometry/rect' ),
      Polygon = require( 'geometry/polygon'),
      Player  = require( 'entities/player' );

  var game = Game.instance = new Game();
  game.level = new Level();
  game.level.fill.set({
    red: 255,
    green: 255,
    blue: 255,
    alpha: 1.0
  });

  var circle = new Circle( 100, 200, 50 );
  circle.fill.alpha = 0.5;
  game.add( circle );

  var rect = new Rect( 300, 100, 50, 100 );
  rect.fill.alpha = 0.5;
  game.add( rect );

  var rectInterval = setInterval(function() {
    rect.left--;
  }, 16 );

  setTimeout(function() {
    clearInterval( rectInterval );
  }, 600 );

  var polygon = new Polygon( 500, 350 );
  polygon.vertices = [ -100, -50, 100, -50, 0, 100 ];
  polygon.fill.alpha = 0.5;
  game.add( polygon );

  game.player = new Player( 200, 200 );
  game.player.world = game;
  game.player.add( new Circle( 0, 0, 20 ) );
  game.player.shapes[0].fill.alpha = 0.5;

  game.player.set({
    vx: 50,
    vy: 100
  });

  game.element.classList.add( 'game' );
  document.body.appendChild( game.element );

  var input = game.input;
  document.addEventListener( 'keydown', input.onKeyDown.bind( input ) );
  document.addEventListener( 'keyup', input.onKeyUp.bind( input ) );

  game.tick();

  setTimeout(function() {
    game.running = false;
  }, 1500 );
});
