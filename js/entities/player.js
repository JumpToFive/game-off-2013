/*globals define*/
define([
  'box2d',
  'entities/physics-entity',
], function( Box2D, PhysicsEntity ) {
  'use strict';

  var Emotion = {
    NORMAL: 0,
    HIT: 1
  };

  function Player( x, y ) {
    PhysicsEntity.call( this, {
      shape: 'circle',
      radius: 4,
      fixture: {
        density: 0.25,
        friction: 0.5,
        restitution: 0.2
      },
      body: {
        position: {
          x: x,
          y: y
        },
        linearDamping: 2,
        angularDamping: 0.1,
        type: 'dynamic'
      }
    });

    this.emotion = Emotion.NORMAL;
    this.emotionTimeout = null;
  }

  Player.Emotion = Emotion;

  Player.prototype = new PhysicsEntity();
  Player.prototype.constructor = Player;

  Player.prototype.update = function( dt ) {
    if ( this.game ) {
      var controls = this.game.input.controls;

      var ax = 0,
          ay = 0;

      if ( controls.LEFT   ) { ax -= 15; }
      if ( controls.RIGHT  ) { ax += 15; }
      if ( controls.TOP    ) { ay -= 15; }
      if ( controls.BOTTOM ) { ay += 15; }

      // Move along camera direction.
      var camera = this.game.camera;
      if ( camera.angle ) {
        var cos = Math.cos( -camera.angle ),
            sin = Math.sin( -camera.angle );

        var rax = cos * ax - sin * ay,
            ray = sin * ax + cos * ay;

        ax = rax;
        ay = ray;
      }

      this.accelerate( ax, ay );
    }

    PhysicsEntity.prototype.update.call( this, dt );
  };

  Player.prototype.draw = function( ctx ) {
    var PI2 = 2 * Math.PI;
    var width = 8, height = 8;

    ctx.save();
    ctx.translate( this.x, this.y );
    if ( this.angle ) {
      ctx.rotate( this.angle );
    }

    // Draw casing.
    ctx.lineWidth = 0.05 * width;

    // Top left.
    ctx.beginPath();
    ctx.arc( 0, 0, 0.22 * width, -Math.PI, -0.5 * Math.PI );
    ctx.strokeStyle = '#fef';
    ctx.stroke();

    // Top right.
    ctx.beginPath();
    ctx.arc( 0, 0, 0.22 * width, -0.5 * Math.PI, 0 );
    ctx.strokeStyle = '#cbe';
    ctx.stroke();

    // Bottom right.
    ctx.beginPath();
    ctx.arc( 0, 0, 0.22 * width, 0, 0.5 * Math.PI );
    ctx.strokeStyle = '#98b';
    ctx.stroke();

    // Bottom left.
    ctx.beginPath();
    ctx.arc( 0, 0, 0.22 * width, 0.5 * Math.PI, Math.PI );
    ctx.strokeStyle = '#658';
    ctx.stroke();

    // Draw main body.
    ctx.beginPath();
    ctx.arc( 0, 0, 0.2 * width, 0, PI2 );
    ctx.fillStyle = '#ecf';
    ctx.fill();

    // Strokes.
    ctx.lineWidth = 0.02 * width;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc( 0, 0, 0.18 * width, 0, PI2 );
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    if ( this.angle ) {
      ctx.save();
      ctx.rotate( -this.angle );
    }

    this.drawFace( ctx, width, height );

    if ( this.angle ) {
      ctx.restore();
    }

    // Draw ring.
    ctx.beginPath();
    ctx.arc( 0, 0, 0.35 * width, 0, PI2 );

    ctx.lineWidth = ( 0.1 + Math.random() * 0.08 ) * width;
    ctx.strokeStyle = '#f33';
    ctx.stroke();

    ctx.lineWidth = 0.07 * width;
    ctx.strokeStyle = '#fff';
    ctx.stroke();


    ctx.restore();
  };

  Player.prototype.drawFace = function( ctx, width, height ) {
    if ( this.emotion === Emotion.NORMAL ) {
      // Draw left eye.
      ctx.beginPath();
      ctx.rect( -0.1 * width, -0.06 * height, 0.04 * width, 0.08 * width );
      ctx.fillStyle = '#448';
      ctx.fill();

      // Draw right eye.
      ctx.beginPath();
      ctx.rect( 0.06 * width, -0.06 * height, 0.04 * width, 0.08 * width );
      ctx.fillStyle = '#448';
      ctx.fill();

      // Draw smile.
      ctx.beginPath();
      ctx.arc( 0, 0.02 * height, 0.1 * width, 0.25 * Math.PI, 0.75 * Math.PI );

      ctx.lineWidth = 0.03 * width;
      ctx.strokeStyle = '#448';
      ctx.stroke();
    } else if ( this.emotion === Emotion.HIT ) {
      // Draw X.
      ctx.beginPath();
      ctx.moveTo( -0.1 * width, -0.06 * height );
      ctx.lineTo( 0.1 * width, 0.02 * height );
      ctx.moveTo( -0.1 * width, 0.02 * height );
      ctx.lineTo( 0.1 * width, -0.06 * height );
      ctx.lineWidth = 0.03 * width;
      ctx.strokeStyle = '#448';
      ctx.stroke();

      // Draw square.
      ctx.beginPath();
      ctx.rect( -0.02 * width, 0.08 * height, 0.04 * width, 0.04 * width );
      ctx.fillStyle = '#448';
      ctx.fill();
    }
  };

  return Player;
});
