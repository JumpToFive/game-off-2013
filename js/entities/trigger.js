/*jshint camelcase: false*/
/*globals define*/
define([
  'entities/physics-entity',
  'config/colors',
  'config/material',
  'config/settings',
  'utils'
], function( PhysicsEntity, Colors, Material, Settings, Utils ) {
  'use strict';

  var PI2 = Utils.PI2;

  var defaults = {
    duration: 0.3
  };

  function Trigger( x, y, radius, material ) {
    this.radius = radius || 0;

    PhysicsEntity.call( this, {
      shape: 'circle',
      radius: this.radius,
      fixture: {
        isSensor: true,
        filter: {
          categoryBits: material
        }
      },
      body: {
        position: {
          x: x,
          y: y
        }
      }
    });

    Utils.defaults( this, defaults );

    this.object = null;
    // If there is an object AND the trigger has caught it.
    this.active = false;

    this.time = 0;
  }

  Trigger.prototype = new PhysicsEntity();
  Trigger.prototype.constructor = Trigger;

  Trigger.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    // When the correct trash object enters the trigger,
    // set its lifeTime to infinite.
    if ( this.object && !this.active ) {
      this.object.x = this.x;
      this.object.y = this.y;
      this.object.vx = 0;
      this.object.vy = 0;
      this.object.fixture.SetSensor( true );
      if ( typeof this.object.lifeTime !== 'undefined' ) {
        this.object.lifeTime = Number.POSITIVE_INFINITY;
      }

      this.active = true;
    }

    // Animation.
    if ( this.active && this.time < this.duration ) {
      this.time += dt;
    }
  };

  Trigger.prototype.drawPath = function( ctx ) {
    var radius = this.radius;


    // Draw sensor.

    // Draw frame/border.
    var size = 1.2 * ( 2 * radius ),
        halfSize = 0.5 * size;

    var glowColor = Colors.Solid[ Material.type( this.material ) ];

    if ( glowColor ) {
      ctx.beginPath();
      ctx.rect( -1.5 * halfSize, -1.5 * halfSize, halfSize, halfSize );
      ctx.rect( -1.5 * halfSize,  0.5 * halfSize, halfSize, halfSize );
      ctx.rect(  0.5 * halfSize,  0.5 * halfSize, halfSize, halfSize );
      ctx.rect(  0.5 * halfSize, -1.5 * halfSize, halfSize, halfSize );

      ctx.save();
      ctx.clip();

      ctx.beginPath();
      ctx.rect( -halfSize, -halfSize, size, size );

      ctx.lineWidth = 0.3 * radius;
      ctx.strokeStyle = glowColor;
      ctx.stroke();

      ctx.lineWidth = 0.1 * radius;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      ctx.restore();
    }


    ctx.beginPath();
    ctx.arc( 0, 0, radius, 0, PI2 );
    ctx.fillStyle = '#333';
    ctx.fill();

    ctx.lineWidth = 0.2 * radius;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    PhysicsEntity.prototype.drawPath.call( this, ctx );
  };

  return Trigger;
});
