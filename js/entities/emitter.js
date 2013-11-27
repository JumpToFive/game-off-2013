/*jshint bitwise: false*/
/*globals define*/
define([
  'entities/physics-entity',
  'geometry/geometry-factory',
  'config/colors',
  'config/material',
  'config/settings'
], function( PhysicsEntity, GeometryFactory, Colors, Material, Settings ) {
  'use strict';

  function Emitter( x, y ) {
    PhysicsEntity.call( this, {
      fixture: {
        isSensor: true
      },
      body: {
        position: {
          x: x,
          y: y
        }
      }
    });

    this.spawnArea = null;

    this.rate = 0;
    this.speed = 0;
    this.particle = null;
    this.lifeTime = 0;

    // Any custom particle physics properties go here.
    this.properties = {};

    this.time = 0;
    this.firing = false;
  }

  Emitter.prototype = new PhysicsEntity();
  Emitter.prototype.constructor = Emitter;

  Emitter.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    if ( !this.firing ) {
      return;
    }

    this.time += dt;
    if ( this.time > this.rate ) {
      this.time = 0;
      this.fire();
    }
  };

  Emitter.prototype.fire = function() {
    if ( !this.particle || !this.game ) {
      return;
    }

    var x = this.x,
        y = this.y;

    var cos = 1,
        sin = 0;
    if ( this.angle ) {
      cos = Math.cos( -this.angle );
      sin = Math.sin( -this.angle );
    }

    // Spawn inside an area (rect, circle, segment).
    var point;
    var rx, ry;
    if ( this.spawnArea ) {
      point = this.spawnArea.random();
      if ( this.angle ) {
        rx = cos * point.x - sin * point.y;
        ry = sin * point.x + cos * point.y;

        point.x = rx;
        point.y = ry;
      }

      x += point.x;
      y += point.y;
    }

    var particleJSON = JSON.stringify( this.particle );

    // Create entities with the prototypical properties.
    var entity = new PhysicsEntity( this.properties );
    entity.x = x;
    entity.y = y;

    // Add any specified shapes.
    entity.add( GeometryFactory.create( particleJSON ) );

    entity.accelerate( cos * this.speed, sin * this.speed );

    this.game.add( entity );

    setTimeout(function() {
      this.game.remove( entity );
      this.game.world.DestroyBody( entity.body );
    }.bind( this ), this.lifeTime );
  };

  Emitter.prototype.start = function( when ) {
    when = when || 0;

    setTimeout(function() {
      this.firing = true;
      this.time = 0;
    }.bind( this ), when );
  };

  Emitter.prototype.stop = function( when ) {
    when = when || 0;

    setTimeout(function() {
      this.firing = false;
    }.bind( this ), when );
  };

  Emitter.prototype.drawPath = function( ctx ) {
    var material = this.properties.fixture.filter.categoryBits;

    var glowColor;
    if ( material & Material.MATTER ) {
      glowColor = Colors.Glow.MATTER;
    } else if ( material & Material.ANTIMATTER ) {
      glowColor = Colors.Glow.ANTIMATTER;
    }

    ctx.save();
    ctx.scale( 0.1, 1 );
    ctx.beginPath();

    // Draw warp hole.
    ctx.arc( 0, 0, 4, 0, 2 * Math.PI );
    ctx.restore();

    ctx.fillStyle = '#000';
    ctx.fill();

    // Draw ring.
    ctx.globalCompositeOperation = 'lighter';

    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 0.3 + Math.random() * 0.2;
    ctx.stroke();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.1 + Math.random() * 0.1;
    ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';

    PhysicsEntity.prototype.drawPath.call( this, ctx );
  };

  return Emitter;
});
