/*globals define*/
define([
  'box2d',
  'input',
  'entities/camera',
  'effects/background',
  'world'
], function( Box2D, Input, Camera, Background, world ) {
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

    this.camera.margin = 10;
    this.camera.lineWidth = 0.2;

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

    this.background = new Background( this.WIDTH, this.HEIGHT );
    this.background.fill.set({
      red: 64,
      green: 64,
      blue: 96,
      alpha: 1
    });
    this.background.camera = this.camera;
    this.background.game = this;
    this.background.prerender();

    this.world = world;
    world.GetGravity().SetZero();

    // Initialize debug view.
    this.box2dDebug = false;

    this.debugCanvas = document.createElement( 'canvas' );
    this.debugCtx    = this.debugCanvas.getContext( '2d' );

    this.element.appendChild( this.debugCanvas );

    this.debugCanvas.id = 'box2d-debug-canvas';
    this.debugCanvas.width  = this.WIDTH;
    this.debugCanvas.height = this.HEIGHT;

    var DebugDraw = Box2D.Dynamics.b2DebugDraw;

    var debugDraw = new DebugDraw();
    debugDraw.SetSprite( this.debugCtx );
    debugDraw.SetDrawScale( 1 );
    debugDraw.SetFillAlpha( 0.3 );
    debugDraw.SetLineThickness( 1 );
    debugDraw.SetFlags( DebugDraw.e_shapeBit );
    world.SetDebugDraw( debugDraw );
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

    this.updateDebug( dt );
    this.camera.update( dt );

    this.world.Step( 1 / 60, 8, 3 );

    this.world.ClearForces();
  };

  Game.prototype.draw = function() {
    if ( this.box2dDebug ) {
      this.drawDebug();
    }

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

    this.background.draw( ctx );
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
      this.camera.width = Math.max( this.camera.width - 2, 32 );
      this.camera.height = Math.max( this.camera.height - 1.5, 24 );
    }
    // S. Zoom out.
    if ( this.input.keys[ 83 ] ) {
      this.camera.width += 2;
      this.camera.height += 1.5;
    }
    // A. Rotate left.
    if ( this.input.keys[ 65 ] ) {
      this.camera.angle += dt;
    }
    // D. Rotate right.
    if ( this.input.keys[ 68 ] ) {
      this.camera.angle -= dt;
    }
    // Q. Reset camera.
    if ( this.input.keys[ 81 ] ) {
      this.camera.width = 64;
      this.camera.height = 48;
      this.camera.angle = 0;
    }
  };

  Game.prototype.drawDebug = function() {
    var debugCtx = this.debugCtx;

    var width  = debugCtx.canvas.width,
        height = debugCtx.canvas.height;

    debugCtx.clearRect( 0, 0, width, height );
    debugCtx.save();

    debugCtx.translate( 0.5 * width, 0.5 * height );
    this.world.DrawDebugData();

    debugCtx.restore();
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
    entity.game = this;
  };

  Game.prototype.remove = function( entity ) {
    var index = this.entities.indexOf( entity );
    if ( index !== -1 ) {
      this.entities.splice( index, 1 );
      entity.game = null;
    }
  };

  return Game;
});
