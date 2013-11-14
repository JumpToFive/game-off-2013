/*globals define*/
define([
  'input',
  'entities/camera',
  'physics/collision',
  'physics/intersection',
  'utils'
], function( Input, Camera, Collision, Intersection, Utils ) {
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

    this.debug = {};

    this.debug.segments = [
      [ 600, 150, 500, 150 ],
      [ 500, 150, 300, 250 ],
      [ 300, 250,  40, 200 ],
      [  40, 200,  40, 100 ]
    ];
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

    this.updateDebug( dt );

    Collision.broadphase( this.entities );

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
    this.drawDebug();

    ctx.restore();
  };

  function isCircle( shape ) {
    return shape.type === 'Circle';
  }

  Game.prototype.updateDebug = function( dt ) {
    var circleEntities = this.entities.filter(function( entity ) {
      return entity.shapes.some( isCircle );
    });

    var collision = this.debug.collision = [];

    this.debug.segments.forEach(function( segment ) {
      var x0 = segment[0],
          y0 = segment[1],
          x1 = segment[2],
          y1 = segment[3];

      var normal = Utils.lineNormal( x0, y0, x1, y1 );

      // Get intersection points.
      circleEntities.forEach(function( circleEntity ) {
        var x = circleEntity.x,
            y = circleEntity.y,
            radius = circleEntity.shapes[0].radius;

        var circles = circleEntity.shapes.filter( isCircle );

        var intersections = circles.map(function( circle ) {
          return Intersection.segmentCircle( x0, y0, x1, y1, circle.x + x, circle.y + y, circle.radius );
        })[0];

        var xi = 0, yi = 0;
        intersections.forEach(function( intersection, index, array ) {
          xi += intersection.x / array.length;
          yi += intersection.y / array.length;
        });

        if ( intersections.length === 1 ) {
          var point = Intersection.closestPointOnSegment( x, y, x0, y0, x1, y1 );
          xi = point.x;
          yi = point.y;
        }

        if ( intersections.length ) {
          var dx = xi - x,
              dy = yi - y;
          var distance = Math.sqrt( dx * dx + dy * dy );

          var moveDistance = radius - distance;
          // If the circle is penetrating the line segment and it's velocity is
          // against the segment normal.
          if ( moveDistance <= 0 ) {
            return;
          }

          collision.push( segment );

          // Move entity along normal direction.
          moveDistance *= dx * normal.x + dy * normal.y < 0 ? 1 : -1;

          circleEntity.x += moveDistance * normal.x;
          circleEntity.y += moveDistance * normal.y;
        }
      });
    });

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

  Game.prototype.drawDebug = function() {
    var ctx = this.ctx;

    var circleEntities = this.entities.filter(function( entity ) {
      return entity.shapes.some( isCircle );
    });


    this.debug.collision.forEach(function( segment ) {
      var x0 = segment[0],
          y0 = segment[1],
          x1 = segment[2],
          y1 = segment[3];

      ctx.beginPath();
      ctx.moveTo( x0, y0 );
      ctx.lineTo( x1, y1 );
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'blue';
      ctx.stroke();
    });

    this.debug.segments.forEach(function( segment ) {
      var x0 = segment[0],
          y0 = segment[1],
          x1 = segment[2],
          y1 = segment[3];

      // Draw segment.
      ctx.beginPath();
      ctx.moveTo( x0, y0 );
      ctx.lineTo( x1, y1 );
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#f00';
      ctx.stroke();

      // Draw normals.
      var mx = 0.5 * ( x0 + x1 ),
          my = 0.5 * ( y0 + y1 );

      var normal = Utils.lineNormal( x0, y0, x1, y1 );
      ctx.beginPath();
      ctx.moveTo( mx, my );
      ctx.lineTo( mx + normal.x * 10, my + normal.y * 10 );
      ctx.strokeStyle = '#0f0';
      ctx.stroke();

      // Get intersection points.
      var points = circleEntities.map(function( circleEntity ) {
        var x = circleEntity.x,
            y = circleEntity.y;

        var circles = circleEntity.shapes.filter( isCircle );

        return circles.map(function( circle ) {
          return Intersection.segmentCircle( x0, y0, x1, y1, circle.x + x, circle.y + y, circle.radius );
        })[0];
      }).reduce(function( array, points ) {
        return array.concat( points );
      }, [] );

      // Draw intersection points.
      points.forEach(function( point ) {
        ctx.beginPath();
        ctx.rect( point.x - 5, point.y - 5, 10, 10 );
        ctx.fillStyle = '#0f0';
        ctx.fill();
      });
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
