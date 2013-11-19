(function( window, document, undefined ) {
  'use strict';

  var el = document.querySelector( '.container' );

  (function() {
    var canvas = document.createElement( 'canvas' ),
        ctx    = canvas.getContext( '2d' );

    canvas.width = 64;
    canvas.height = 64;

    el.appendChild( canvas );

    ctx.fillStyle = 'black';
    ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
  }) ();
}) ( window, document );
