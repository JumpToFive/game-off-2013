/*globals define*/
define([
  'input',
  'physics/collision',
  'physics/intersection'
], function( Input, Collision, Intersection ) {
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

    this.level = null;

    this.input = new Input();
    this.input.game = this;
  }

  Game.instance = null;

  Game.prototype.update = function() {
    this.input.update();

    this.currTime = Date.now();
    var dt = this.currTime - this.prevTime;
    this.prevTime = this.currTime;

    if ( dt > 1e2 ) {
      dt = 1e2;
    }

    dt *= 1e-3;

    this.entities.forEach(function( entity ) {
      entity.update( dt );
    });

    Collision.broadphase( this.entities );
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

    this.entities.forEach(function( entity ) {
      entity.draw( ctx );
    });

    this.drawDebug();
  };

  Game.prototype.drawDebug = function() {
    var ctx = this.ctx;

    function isCircle( shape ) {
      return shape.type === 'Circle';
    }

    var circleEntities = this.entities.filter(function( entity ) {
      return entity.shapes.some( isCircle );
    });

    var x0 = 20,
        y0 = 200,
        x1 = 300,
        y1 = 250;

    ctx.beginPath();
    ctx.moveTo( x0, y0 );
    ctx.lineTo( x1, y1 );
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#f00';
    ctx.stroke();

    var points = circleEntities.map(function( circleEntity ) {
      var x = circleEntity.x,
          y = circleEntity.y;

      var circles = circleEntity.shapes.filter( isCircle );

      return circles.map(function( circle ) {
        return Intersection.segmentCircleIntersection( x0, y0, x1, y1, circle.x + x, circle.y + y, circle.radius );
      });
    }).reduce(function( array, points ) {
      return array.concat( points[0] );
    }, [] );

    // Draw intersection points.
    points.forEach(function( point ) {
      ctx.beginPath();
      ctx.rect( point.x - 5, point.y - 5, 10, 10 );
      ctx.fillStyle = '#0f0';
      ctx.fill();
    });
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
