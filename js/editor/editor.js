/*globals define*/
define(function() {
  'use strict';

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

    this.entities = [];
    this.physicsEntities = [];
  }

  return Editor;
});
