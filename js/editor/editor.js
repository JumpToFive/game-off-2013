/*globals define*/
define([
  'geometry/circle',
  'geometry/polygon',
  'geometry/rect',
  'utils'
], function( Circle, Polygon, Rect, Utils ) {
  'use strict';

  // Utility class to allow for Polygon vertex transforms.
  function Vertex( polygon, index ) {
    this.polygon = polygon;
    this.index = index;
  }

  Object.defineProperty( Vertex.prototype, 'x', {
    get: function() {
      return this.polygon[ 2 * this.index ];
    },

    set: function( x ) {
      this.polygon[ 2 * this.index ] = x;
    }
  });

  Object.defineProperty( Vertex.prototype, 'y', {
    get: function() {
      return this.polygon[ 2 * this.index + 1 ];
    },

    set: function( y ) {
      this.polygon[ 2 * this.index + 1 ] = y;
    }
  });


  Polygon.prototype.verticesContain = function( x, y, radius ) {
    var vertexCount = this.vertexCount();

    x -= this.x;
    y -= this.y;

    var cos, sin;
    var rx, ry;
    if ( this.angle ) {
      cos = Math.cos( this.angle );
      sin = Math.sin( this.angle );

      rx = cos * x - sin * y;
      ry = sin * x + cos * y;

      x = rx;
      y = ry;
    }

    var vertices = [];
    var radiusSquared = radius * radius;

    var xi, yi;
    for ( var i = 0; i < vertexCount; i++ ) {
      xi = this.vertices[ 2 * i ];
      yi = this.vertices[ 2 * i + 1 ];

      if ( Utils.distanceSquared( x, y, xi, yi ) < radiusSquared ) {
        vertices.push( new Vertex( this, i ) );
      }
    }

    return vertices;
  };


  function Editor( options ) {
    options = options || {};

    var el = options.el || '#editor';

    var width  = options.width  || 640;
    var height = options.height || 480;

    this.el = document.querySelector( el );
    if ( !this.el ) {
      this.el = document.createElement( 'div' );
      this.el.id = el;
    }

    this.canvas = document.createElement( 'canvas' );
    this.ctx    = this.canvas.getContext( '2d' );

    this.canvas.width  = width;
    this.canvas.height = height;

    this.el.appendChild( this.canvas );

    this.elements = [];

    this.selection = [];
    this.offsets = [];

    this.mouse = {
      x: 0,
      y: 0,

      down: false
    };

    this.canvas.addEventListener( 'mousedown', this.onMouseDown.bind( this ) );
    this.canvas.addEventListener( 'mousemove', this.onMouseMove.bind( this ) );
    this.canvas.addEventListener( 'mouseup', this.onMouseUp.bind( this ) );
  }

  Editor.prototype.asEntities = function() {
    var string = '';

    string += this.entities.map(function( entity ) {
      return JSON.stringify( entity );
    }).join( ', ');

    return string;
  };

  Editor.prototype.asPhysicsEntities = function() {
    var string = '';

    return string;
  };

  Editor.prototype.onMouseDown = function( event ) {
    this.mouse.x = event.pageX - this.canvas.offsetLeft;
    this.mouse.y = event.pageY - this.canvas.offsetTop;

    this.mouse.down = true;

    this.elements.forEach(function( element ) {
      if ( element.type.toLowerCase() === 'polygon' ) {

      }
    });
  };

  Editor.prototype.onMouseMove = function( event ) {
    this.mouse.x = event.pageX - this.canvas.offsetLeft;
    this.mouse.y = event.pageY - this.canvas.offsetTop;

    if ( this.selection.length ) {
      this.selection.forEach(function( element, index ) {
        var offset = this.offsets[ index ];
      }).bind( this );
    }
  };

  Editor.prototype.onMouseUp = function() {
    this.mouse.down = false;

    this.selection = [];
    this.offsets = [];
  };

  Editor.prototype.draw = function() {
    var ctx = this.ctx;

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

    this.shapes.forEach(function( shape ) {
      shape.draw( ctx );
    });
  };


  return Editor;
});
