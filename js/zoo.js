(function( window, document, undefined ) {
  'use strict';

  var PI2 = 2 * Math.PI;

  var running = false;

  var el = document.querySelector( '.container' );

  var tickFns = [];

  tickFns.push((function() {
    var canvas = document.createElement( 'canvas' ),
        ctx    = canvas.getContext( '2d' );

    var size = 128;

    var width  = size,
        height = size;

    canvas.width  = width;
    canvas.height = height;
    canvas.style.backgroundColor = 'black';

    el.appendChild( canvas );

    function draw() {
      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      // Draw main body.
      ctx.beginPath();
      ctx.arc( 0.5 * width, 0.5 * height, 0.2 * width, 0, PI2 );
      ctx.fillStyle = '#ddf';
      ctx.fill();

      // Draw eye.
      ctx.beginPath();
      ctx.arc( 0.65 * width, 0.5 * height, 0.08 * width, 0, PI2 );
      ctx.fillStyle = '#f43';
      ctx.fill();

      // Draw eye gleam.
      ctx.beginPath();
      ctx.arc( 0.65 * width, 0.5 * height, 0.05 * width, -0.25 * Math.PI, 0.25 * Math.PI );
      ctx.lineWidth = 0.02 * width;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      // Draw ring.
      ctx.beginPath();
      ctx.arc( 0.5 * width, 0.5 * height, 0.35 * width, 0, PI2 );

      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 0.05 * width + Math.random() * 0.03 * width;

      ctx.lineWidth = 0.07 * width;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      ctx.shadowBlur = 0;
    }

    return function() {
      draw();
    };
  }) ());

  function tick() {
    tickFns.forEach(function( tickFn ) {
      tickFn();
    });

    if ( !running ) {
      return;
    }

    window.requestAnimationFrame( tick );
  }

  tick();

  document.addEventListener( 'keydown', function( event ) {
    // ESC.
    if ( event.which === 27 ) {
      running = false;
    }

    // Space.
    if ( event.which === 32 ) {
      if ( !running ) {
        running = true;
        tick();
      }
    }
  });

  window.addEventListener( 'blur', function() {
    running = false;
  });
}) ( window, document );
