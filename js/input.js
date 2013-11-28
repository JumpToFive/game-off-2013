/*globals define*/
define(function() {
  'use strict';

  function Input() {
    this.mouse = {
      x: 0,
      y: 0,

      down: false
    };

    this.controls = {
      TOP:    false,
      RIGHT:  false,
      BOTTOM: false,
      LEFT:   false
    };

    this.keys = [];
    this.game = null;

    this.touches = [];
  }

  Input.prototype = {
    onKeyDown: function( event ) {
      this.keys[ event.which ] = true;

      // Arrow keys.
      if ( event.which === 37 ||
           event.which === 38 ||
           event.which === 39 ||
           event.which === 40 ) {
        event.preventDefault();
      }
    },

    onKeyUp: function( event ) {
      this.keys[ event.which ] = false;
    },

    onTouchStart: function( event ) {
      this.touches = [].slice.call( event.touches );
    },

    onTouchMove: function( event ) {
      event.preventDefault();
      this.touches = [].slice.call( event.touches );
    },

    onTouchEnd: function( event ) {
      this.touches = [].slice.call( event.touches );
    },

    update: function() {
      var controls = this.controls;

      Object.keys( controls ).forEach(function( control ) {
        controls[ control ] = false;
      });

      // Keyboard update.
      if ( this.keys[ 37 ] ) { controls.LEFT   = true; }
      if ( this.keys[ 38 ] ) { controls.TOP    = true; }
      if ( this.keys[ 39 ] ) { controls.RIGHT  = true; }
      if ( this.keys[ 40 ] ) { controls.BOTTOM = true; }

      // Touch update.
      var width  = this.game.canvas.width,
          height = this.game.canvas.height;

      var halfWidth =  0.5 * width,
          halfHeight = 0.5 * height;

      var offsetLeft = this.game.canvas.offsetLeft,
          offsetTop  = this.game.canvas.offsetTop;

      this.touches.forEach(function( touch ) {
        var x = touch.pageX - offsetLeft,
            y = touch.pageY - offsetTop;

        if ( 0 > x || x > width ||
             0 > y || y > height ) {
          return;
        }

        var angle = Math.atan2( y - halfHeight, x - halfWidth );
        // From [ -PI, PI ) to [ 0, 2PI ).
        angle += Math.PI;
        // Rotate CCW 45 degrees.
        angle -= 0.25 * Math.PI;

        if ( angle < 0 ) {
          angle += 2 * Math.PI;
        }

        // 90 degrees.
        if ( angle < 0.5 * Math.PI ) {
          controls.TOP = true;
        } else if ( angle < Math.PI ) {
          controls.RIGHT = true;
        } else if ( angle < 1.5 * Math.PI ) {
          controls.BOTTOM = true;
        } else {
          controls.LEFT = true;
        }
      }.bind( this ));
    }
  };

  return Input;
});
