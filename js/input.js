/*globals define*/
define(function() {
  'use strict';

  function Input() {
    this.mouse = {
      x: 0,
      y: 0,

      down: false
    };

    this.keys = [];
    this.game = null;
  }

  Input.prototype = {
    start: function() {
      if ( this.game ) {
        this.game.running = true;
        this.game.tick();
      }
    },

    stop: function() {
      if ( this.game ) {
        this.game.running = false;
      }
    },

    onKeyDown: function( event ) {
      this.keys[ event.which ] = true;

      // ESC.
      if ( event.which === 27 ) {
        event.preventDefault();
        this.stop();
      }

      // Z.
      if ( event.which === 90 ) {
        event.preventDefault();
        this.start();

        setTimeout(function() {
          this.stop();
        }.bind( this ), 1000 );
      }

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
    }
  };

  return Input;
});
