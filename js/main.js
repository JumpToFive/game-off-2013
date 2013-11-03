(function( window, document, undefined ) {
  'use strict';

  var PI2 = 2 * Math.PI;

  function rgba( red, green, blue, alpha ) {
    return 'rgba(' +
      Math.round( red )   + ', ' +
      Math.round( green ) + ', ' +
      Math.round( blue )  + ', ' +
      alpha +
    ')';
  }

  function Input() {
    this.mouse = {
      x: 0,
      y: 0,

      down: false
    };

    this.keys = [];
  }

  Input.prototype = {
    onKeyDown: function( event ) {
      this.keys[ event.which ] = true;
    },

    onKeyUp: function( event ) {
      this.keys[ event.which ] = false;
    }
  };

  function Object2D( x, y ) {
    this.x = x || 0;
    this.y = y || 0;

    this.red   = 0;
    this.green = 0;
    this.blue  = 0;
    this.alpha = 0.0;

    this.rotation = 0;
  }

  Object2D.prototype.update = function() {};
  Object2D.prototype.drawPath = function() {};
  Object2D.prototype.draw = function( ctx ) {
    this.drawPath( ctx );

    ctx.fillStyle = rgba( this.red, this.green, this.blue, this.alpha );
    ctx.fill();
  };

  Object2D.prototype.set = function( attrs ) {
    for ( var key in attrs ) {
      if ( this.hasOwnProperty( key ) ) {
        this[ key ] = attrs[ key ];
      }
    }
  };

  function Circle( x, y, radius ) {
    Object2D.call( this, x, y );

    this.radius = radius || 0;
  }

  Circle.prototype = new Object2D();
  Circle.prototype.constructor = Circle;

  Circle.prototype.drawPath = function( ctx ) {
    ctx.beginPath();
    ctx.arc( this.x, this.y, this.radius, 0, PI2 );
    ctx.closePath();
  };

  function Polygon( x, y ) {
    Object2D.call( this, x, y );

    this.vertices = [];
  }

  Polygon.prototype = new Object2D();
  Polygon.prototype.cosntructor = Polygon;

  Polygon.prototype.draw = function( ctx ) {
    if ( !this.vertices.length ) {
      return;
    }

    Object2D.prototype.draw.call( this, ctx );
  };

  Polygon.prototype.drawPath = function( ctx ) {
    var vertexCount = 0.5 * this.vertices.length;

    ctx.beginPath();

    ctx.moveTo( this.vertices[0], this.vertices[1] );
    for ( var i = 1; i < vertexCount; i++ ) {
      ctx.lineTo( this.vertices[ 2 * i ], this.vertices[ 2 * i + 1 ] );
    }

    ctx.closePath();
  };

  function Rect( x, y, width, height ) {
    Object2D.call( this, x, y );

    this.width  = width  || 0;
    this.height = height || 0;
  }

  Rect.prototype = new Object2D();
  Rect.prototype.constructor = Rect;

  Rect.prototype.drawPath = function( ctx ) {
    ctx.beginPath();

    ctx.rect(
      this.x - 0.5 * this.width, this.y - 0.5 * this.height,
      this.width, this.height
    );

    ctx.closePath();
  };

  function Level() {
    Object2D.call( this );
  }

  Level.prototype = new Object2D();
  Level.prototype.constructor = Level;

  Level.prototype.fromJSON = function() {};

  function Entity( x, y ) {
    Object2D.call( this, x, y );

    this.shapes = [];
    this.world = null;
  }

  Entity.prototype = new Object2D();
  Entity.prototype.constructor = Entity;

  Entity.prototype.update = function() {};

  Entity.prototype.draw = function( ctx ) {
    ctx.save();

    ctx.translate( this.x, this.y );
    ctx.rotate( this.rotation );

    this.shapes.forEach(function( shape ) {
      shape.draw( ctx );
    });

    ctx.restore();
  };

  Entity.prototype.add = function( shape ) {
    this.shapes.push( shape );
  };

  Entity.prototype.remove = function( shape ) {
    var index = this.shapes.indexOf ( shape );
    if ( index !== -1 ) {
      this.shapes.splice( index, 1 );
    }
  };

  function PhysicsEntity( x, y ) {
    Entity.call( this, x, y );

    // Previous position.
    this.px = this.x;
    this.py = this.y;

    this.vx = 0;
    this.vy = 0;

    // Angular velocity.
    this.va = 0;

    this.fixed = false;
  }

  PhysicsEntity.prototype = new Entity();
  PhysicsEntity.prototype.constructor = PhysicsEntity;

  PhysicsEntity.prototype.update = function( dt ) {
    if ( this.fixed ) {
      return;
    }

    // Change to verlet integration.
    var x = this.x + this.vx * dt,
        y = this.y + this.vy * dt;

    this.px = this.x;
    this.py = this.y;

    this.x = x;
    this.y = y;

    this.rotation += this.va * dt;
  };

  function Player( x, y ) {
    PhysicsEntity.call( this, x, y );
  }

  Player.prototype = new PhysicsEntity();
  Player.prototype.constructor = Player;

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
  }

  Game.instance = null;

  Game.prototype.update = function() {
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

    if ( this.player ) {
      this.player.update( dt );
    }
  };

  Game.prototype.draw = function() {
    var ctx = this.ctx;

    var level = this.level;
    if ( level ) {
      ctx.fillStyle = rgba( level.red, level.green, level.blue, level.alpha );
      ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    } else {
      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    }

    this.entities.forEach(function( entity ) {
      entity.draw( ctx );
    });

    if ( this.player ) {
      this.player.draw( ctx );
    }
  };

  Game.prototype.tick = function() {
    if ( !this.running ) {
      return;
    }

    this.update();
    this.draw();
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

  function tick() {
    Game.instance.tick();

    if ( Game.instance.running ) {
      window.requestAnimationFrame( tick );
    }
  }

  (function() {
    var game = Game.instance = new Game();
    game.add( new Entity() );
    game.level = new Level();
    game.level.set({
      red: 255,
      green: 255,
      blue: 255,
      alpha: 1.0
    });

    var circle = new Circle( 100, 200, 50 );
    circle.alpha = 1.0;
    game.add( circle );

    game.player = new Player( 200, 200 );
    game.player.world = game;
    game.player.add( new Circle( 0, 0, 20 ) );
    game.player.shapes[0].set({
      blue: 240,
      alpha: 1.0
    });

    game.player.set({
      vx: 50,
      vy: 100
    });

    game.element.classList.add( 'game' );
    document.body.appendChild( game.element );

    var input = game.input;
    document.addEventListener( 'keydown', input.onKeyDown.bind( input ) );
    document.addEventListener( 'keyup', input.onKeyUp.bind( input ) );

    setTimeout( tick, 100 );

    setTimeout(function() {
      game.running = false;
    }, 1500 )
  }) ();
}) ( window, document );
