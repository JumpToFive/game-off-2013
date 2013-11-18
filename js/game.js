/*globals define*/
define([
  'input',
  'entities/camera',
  'world'
], function( Input, Camera, world ) {
  'use strict';

  function Game() {
    this.prevTime = Date.now();
    this.currTime = this.prevTime;

    this.running = true;

    this.element = document.createElement( 'div' );
    this.canvas  = document.createElement( 'canvas' );
    this.ctx     = this.canvas.getContext( '2d' );

    this.element.appendChild( this.canvas );

    this.WIDTH  = 640;
    this.HEIGHT = 480;

    this.canvas.width  = this.WIDTH;
    this.canvas.height = this.HEIGHT;

    this.entities = [];
    this.player = null;

    this.camera = new Camera( 0.5 * this.WIDTH, 0.5 * this.HEIGHT );
    this.camera.world = this;
    this.camera.stroke.set({
      blue: 255,
      alpha: 1.0
    });

    this.camera.width = this.WIDTH;
    this.camera.height = this.HEIGHT;

    this.camera.margin = 50;
    this.camera.lineWidth = 2;

    this.level = null;

    this.input = new Input();
    this.input.game = this;

    // Minimum of 30 fps.
    this.MAX_FRAME_TIME = 1000 / 30;

    this.debug = {};

    this.debug.objects = [
      [
        [ 600, 150, 500, 150 ],
        [ 500, 150, 300, 250 ],
        [ 300, 250,  40, 200 ],
        [  40, 200,  40, 100 ]
      ],
      [
        // Rectangle.
        [ 100, 0, 200, 0 ],
        [ 200, 0, 200, -50 ],
        [ 200, -50, 100, -50 ],
        [ 100, -50, 100, 0 ]
      ]
    ];

    this.world = world;
  }

  Game.instance = null;

  Game.prototype.update = function() {
    this.input.update();

    this.currTime = Date.now();
    var dt = this.currTime - this.prevTime;
    this.prevTime = this.currTime;

    if ( dt > this.MAX_FRAME_TIME ) {
      dt = this.MAX_FRAME_TIME;
    }

    dt *= 1e-3;

    this.entities.forEach(function( entity ) {
      entity.update( dt );
    });

    this.world.Step( 1 / 60, 10, 10 );
    this.updateDebug( dt );

    this.camera.update( dt );
  };

  Game.prototype.draw = function() {
    var ctx = this.ctx;

    var level = this.level;
    if ( level.fill.alpha ) {
      ctx.fillStyle = level.fill.rgba();
      ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    } else {
      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    }

    ctx.save();
    this.camera.applyTransform( ctx );

    this.entities.forEach(function( entity ) {
      entity.draw( ctx );
    });

    this.camera.draw( ctx );

    ctx.restore();
  };

  Game.prototype.updateDebug = function( dt ) {
       // Basic camera controls.
    // W. Zoom in.
    if ( this.input.keys[ 87 ] ) {
      this.camera.width = Math.max( this.camera.width - 4, 160 );
      this.camera.height = Math.max( this.camera.height - 3, 120 );
    }
    // S. Zoom out.
    if ( this.input.keys[ 83 ] ) {
      this.camera.width += 4;
      this.camera.height += 3;
    }
    // A. Rotate left.
    if ( this.input.keys[ 65 ] ) {
      this.camera.rotation += dt;
    }
    // D. Rotate right.
    if ( this.input.keys[ 68 ] ) {
      this.camera.rotation -= dt;
    }
    // Q. Reset camera.
    if ( this.input.keys[ 81 ] ) {
      this.camera.width = this.WIDTH;
      this.camera.height = this.HEIGHT;
      this.camera.rotation = 0;
    }
  };

  Game.prototype.tick = function() {
    if ( !this.running ) {
      return;
    }

    this.update();
    this.draw();

    window.requestAnimationFrame( this.tick.bind( this ) );
  };

  Game.prototype.add = function( entity ) {
    this.entities.push( entity );
    entity.world = this;
  };

  Game.prototype.remove = function( entity ) {
    var index = this.entities.indexOf( entity );
    if ( index !== -1 ) {
      this.entities.splice( index, 1 );
      entity.world = null;
    }
  };

  return Game;
});
