(function( window, document, undefined ) {
  'use strict';

  function Input() {
    this.mouse = {
      x: 0,
      y: 0,

      down: false
    };
  }

  function Object2D( x, y ) {
    this.x = x || 0;
    this.y = y || 0;
  }

  function Polygon( x, y, vertices ) {
    Object2D.call( this );

    this.vertices = vertices || [];
  }

  Polygon.prototype = new Object2D();
  Polygon.prototype.cosntructor = Polygon;

  Polygon.prototype.draw = function( ctx ) {
    var vertexCount = 0.5 * this.vertices.length;
    if ( !vertexCount ) {
      return;
    }

    ctx.beginPath();

    ctx.moveTo( this.vertices[0], this.vertices[1] );
    for ( var i = 1; i < vertexCount; i++ ) {
      ctx.lineTo( this.vertices[ 2 * i ], this.vertices[ 2 * i + 1 ] );
    }

    ctx.closePath();
  };

  function Level() {}

  Level.prototype.fromJSON = function() {};

  function Entity ( x, y ) {
    Object2D.call( this, x, y );

    this.world = null;
  }

  Entity.prototype = new Object2D();
  Entity.prototype.constructor = Entity;

  Entity.prototype.update = function() {};

  Entity.prototype.draw = function( ctx ) {
    ctx.fillStyle = 'black';
    ctx.fillRect( 0, 0, 100, 100 );
  };

  function PhysicsEntity( x, y ) {
    Entity.call( this );
  }

  PhysicsEntity.prototype = Entity;
  PhysicsEntity.prototype.constructor = PhysicsEntity;

  PhysicsEntity.prototype.draw = function( ctx ) {};

  function Player() {
    Entity.call( this );
  }

  Player.prototype.update = function() {};

  function Game() {
    this.prevTime = Date.now();
    this.currTime = this.prevTime;

    this.running = true;

    this.canvas = document.createElement( 'canvas' );
    this.ctx    = this.canvas.getContext( '2d' );

    this.WIDTH  = 640;
    this.HEIGHT = 480;

    this.canvas.width  = this.WIDTH;
    this.canvas.height = this.HEIGHT;

    this.entities = [];
    this.level = null;
  }

  Game.instance = null;

  Game.prototype.update = function() {
    this.currTime = Date.now();
    var dt = this.currTime - this.prevTime;
    this.prevTime =

    this.entities.forEach(function( entity ) {
      entity.update();
    });
  };

  Game.prototype.draw = function() {
    var ctx = this.ctx;

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    this.entities.forEach(function( entity ) {
      entity.draw( ctx );
    });
  };

  Game.prototype.tick = function() {
    this.update();
    this.draw();
  };

  (function() {
    var game = Game.instance = new Game();
    game.entities.push( new Entity() );
    game.tick();

    document.body.appendChild( game.canvas );
  }) ();
}) ( window, document );
