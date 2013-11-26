/*globals define*/
define([
  'base-object',
  'color',
  'geometry/circle',
  'geometry/polygon',
  'geometry/rect',
  'config/material',
  'utils'
], function( BaseObject, Color, Circle, Polygon, Rect, Material, Utils ) {
  'use strict';

  var PI2 = Utils.PI2;

  var DEFAULT_LINE_WIDTH = 4;

  var fills = {
    DEFAULT: [ 0, 0, 0, 0.5 ],
    HIGHLIGHT: [],
    DEBUG: [ 255, 0, 0, 1 ]
  };

  var strokes = {
    DEFAULT: [ 255, 255, 255, 1.0 ]
  };

  var vertexRadius = 10;

  // Convert arrays in the Colors object to objects with RGBA values.
  (function() {
    function arrayToColorObject( colors ) {
      var color;
      var red, green, blue, alpha;
      for ( var key in colors ) {
        color = colors[ key ];
        red   = color[0];
        green = color[1];
        blue  = color[2];
        alpha = color[3];

        colors[ key ] = new Color( red, green, blue, alpha );
      }
    }

    arrayToColorObject( fills );
    arrayToColorObject( strokes );
  }) ();


  // Utility class to allow for Polygon vertex transforms.
  function Vertex( polygon, index ) {
    BaseObject.call( this );
    this.polygon = polygon;
    this.index = index;
  }

  Vertex.prototype = new BaseObject();
  Vertex.prototype.constructor = Vertex;

  Vertex.prototype.draw = function( ctx, radius ) {
    ctx.beginPath();

    var x = this.x,
        y = this.y;

    var cos, sin;
    var rx, ry;
    if ( this.polygon.angle ) {
      cos = Math.cos( -this.polygon.angle );
      sin = Math.sin( -this.polygon.angle );

      rx = cos * x - sin * y;
      ry = sin * x + cos * y;

      x = rx;
      y = ry;
    }

    x += this.polygon.x;
    y += this.polygon.y;

    ctx.arc( x, y, radius, 0, PI2 );

    ctx.fillStyle = fills.DEBUG.rgba();
    ctx.fill();

    ctx.strokeStyle = strokes.DEFAULT.rgba();
    ctx.lineWidth = DEFAULT_LINE_WIDTH;
    ctx.stroke();
  };

  Object.defineProperty( Vertex.prototype, 'x', {
    get: function() {
      return this.polygon.vertices[ 2 * this.index ];
    },

    set: function( x ) {
      this.polygon.vertices[ 2 * this.index ] = x;
    }
  });

  Object.defineProperty( Vertex.prototype, 'y', {
    get: function() {
      return this.polygon.vertices[ 2 * this.index + 1 ];
    },

    set: function( y ) {
      this.polygon.vertices[ 2 * this.index + 1 ] = y;
    }
  });

  /**
   * Return false if no vertices contain the point.
   *
   * Otherwise, return an object containing a vertices array, which consists of
   * Vertex objects containing a reference to the polygon and the vertex index,
   * and an offsets array.
   */
  Polygon.prototype.verticesContain = function( x, y, radius ) {
    var vertexCount = this.vertexCount();

    var px = x,
        py = y;

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

    if ( !vertices.length ) {
      return null;
    }

    // Get world space coordinates of vertices.
    var offsets = [];
    vertices.forEach(function( vertex ) {
      var xi = vertex.x,
          yi = vertex.y;

      if ( this.angle ) {
        rx =  cos * xi + sin * yi;
        ry = -sin * xi + cos * yi;

        xi = rx;
        yi = ry;
      }

      xi += this.x;
      yi += this.y;

      offsets.push({
        x: xi - px,
        y: yi - py
      });
    }.bind( this ));

    return {
      vertices: vertices,
      offsets: offsets
    };
  };

  Polygon.prototype.drawVertices = function( ctx ) {
    var vertexCount = this.vertexCount();

    ctx.fillStyle = fills.DEFAULT.rgba();
    ctx.strokeStyle = strokes.DEFAULT.rgba();
    ctx.lineWidth = DEFAULT_LINE_WIDTH;

    var x, y;
    for ( var i = 0; i < vertexCount; i++ ) {
      x = this.vertices[ 2 * i ];
      y = this.vertices[ 2 * i + 1 ];

      ctx.beginPath();
      ctx.arc( x, y, vertexRadius, 0, PI2 );
      ctx.fill();
      ctx.stroke();
    }
  };

  // Mixin vertices drawing.
  (function() {
    var normalOptions = {
      length: 20,
      lineWidth: 3,
      stroke: '#0a0'
    };

    var drawPathFn = Polygon.prototype.drawPath;
    Polygon.prototype.drawPath = function( ctx ) {
      this.drawVertices( ctx );
      this.drawNormals( ctx, normalOptions );
      drawPathFn.call( this, ctx );
    };
  }) ();

  function Editor( options ) {
    options = options || {};

    var el = options.el || '#editor';

    this.el = document.querySelector( el );
    if ( !this.el ) {
      this.el = document.createElement( 'div' );
      this.el.id = el;
    }

    this.canvas = document.createElement( 'canvas' );
    this.ctx    = this.canvas.getContext( '2d' );

    this.canvas.width  = options.width  || 640;
    this.canvas.height = options.height || 480;

    this.canvas.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';

    this.el.appendChild( this.canvas );

    this.elements = [];

    this.selection = [];
    this.offsets = [];

    this.mouse = {
      x: 0,
      y: 0,

      down: false
    };

    this.keys = [];

    this.translate = {
      x: 0.5 * this.canvas.width,
      y: 0.5 * this.canvas.height
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

    string += this.elements.map(function( element ) {
      return JSON.stringify({
        shape: 'polygon',
        type: 'vector',
        data: element.vertices,
        fixture: {
          density: 1.0,
          friction: 0.5,
          restitution: 0.2,
          filter: {
            categoryBits: Material.BIMATTER
          }
        },
        body: {
          position: {
            x: element.x,
            y: element.y
          },
          angle: element.angle
        },
        shapes: [
          {
            type: element.type,
            vertices: element.vertices,
            fill: {
              alpha: 1
            }
          }
        ]
      });
    }).join( ', ' );

    return string;
  };

  Editor.prototype.mousePosition = function( event ) {
    this.mouse.x = event.pageX - this.canvas.offsetLeft - this.translate.x;
    this.mouse.y = event.pageY - this.canvas.offsetTop  - this.translate.y;
  };

  Editor.prototype.onMouseDown = function( event ) {
    this.mousePosition( event );
    this.mouse.down = true;

    // Add shape.
    if ( this.keys[ 65 ] ) {
      var polygon = new Polygon();
      polygon.x = this.mouse.x;
      polygon.y = this.mouse.y;
      polygon.vertices = [ -100, 50, 100, 50, 0, -100 ];
      this.add( polygon );
      this.draw();
      return;
    }

    // Remove shape.
    if ( this.keys[ 68 ] ) {
      var removed = [];
      this.elements.forEach(function( element ) {
        if ( element.contains( this.mouse.x, this.mouse.y ) ) {
          removed.push( element );
        }
      }.bind( this ));

      removed.forEach(function( element ) {
        this.remove( element );
      }.bind( this ));
      this.draw();
      return;
    }

    // Select shape.
    this.elements.forEach(function( element ) {
      if ( element.type.toLowerCase() === 'polygon' ) {
        var vertices = element.verticesContain( this.mouse.x, this.mouse.y, vertexRadius );
        if ( vertices ) {
          this.selection = this.selection.concat( vertices.vertices );
          this.offsets = this.offsets.concat( vertices.offsets );
          return;
        }
      }

      if ( element.contains( this.mouse.x, this.mouse.y ) ) {
        this.selection.push( element );
        this.offsets.push({
          x: element.x - this.mouse.x,
          y: element.y - this.mouse.y
        });
      }
    }.bind( this ));
  };

  Editor.prototype.onMouseMove = function( event ) {
    this.mousePosition( event );

    // Move selection.
    if ( this.selection.length ) {
      this.selection.forEach(function( element, index ) {
        var offset = this.offsets[ index ];

        var x = this.mouse.x + offset.x,
            y = this.mouse.y + offset.y;

        var cos, sin;
        var rx, ry;
        if ( element.type.toLowerCase() === 'vertex' ) {
          x -= element.polygon.x;
          y -= element.polygon.y;

          if ( element.polygon.angle ) {
            cos = Math.cos( element.polygon.angle );
            sin = Math.sin( element.polygon.angle );

            rx = cos * x - sin * y;
            ry = sin * x + cos * y;

            x = rx;
            y = ry;
          }
        }

        element.x = x;
        element.y = y;
      }.bind( this ));
    } else if ( !this.mouse.down ) {
      // Otherwise, hover over selection.
      var ctx = this.ctx;

      this.elements.forEach(function( element ) {
        if ( element.type.toLowerCase() === 'polygon' ) {
          var vertices = element.verticesContain( this.mouse.x, this.mouse.y, vertexRadius );

          if ( vertices ) {
            vertices.vertices.forEach(function( vertex ) {
              vertex.draw( ctx, vertexRadius );
            });
          }
        }
      }.bind( this ));
    }


    this.draw();
  };

  Editor.prototype.onMouseUp = function() {
    this.mouse.down = false;

    this.selection = [];
    this.offsets = [];
  };

  Editor.prototype.onKeyDown = function( event ) {
    this.keys[ event.which ] = true;

    // Spacebar.
    if ( event.which === 32 ) {
      console.log( this.asPhysicsEntities() );
    }
  };

  Editor.prototype.onKeyUp = function( event ) {
    this.keys[ event.which ] = false;
  };

  Editor.prototype.draw = function() {
    var ctx = this.ctx;

    var width  = ctx.canvas.width,
        height = ctx.canvas.height;

    ctx.clearRect( 0, 0, width, height );

    ctx.save();
    ctx.translate( this.translate.x, this.translate.y );

    this.elements.forEach(function( element ) {
      element.draw( ctx );
    });

    // Now highlight whatever we've selected.
    this.selection.forEach(function( element ) {
      if ( element.type.toLowerCase() === 'vertex' ) {
        element.draw( ctx, vertexRadius );
      }
    });

    ctx.restore();
  };

  Editor.prototype.add = function( element ) {
    if ( element.fill && element.stroke ) {
      element.fill.set( fills.DEFAULT );
      element.stroke.set( strokes.DEFAULT );
      element.lineWidth = DEFAULT_LINE_WIDTH;
    }

    this.elements.push( element );
  };

  Editor.prototype.remove = function( element ) {
    var index = this.elements.indexOf( element );
    if ( index !== -1 ) {
      this.elements.splice( index, 1 );
    }
  };

  return Editor;
});
