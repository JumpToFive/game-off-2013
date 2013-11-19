(function( window, document, undefined ) {
  'use strict';

  var running = false;

  var el = document.querySelector( '.container' );

  var tickFns = [];

  tickFns.push((function() {
    var canvas = document.createElement( 'canvas' ),
        ctx    = canvas.getContext( '2d' );

    canvas.width = 64;
    canvas.height = 64;
    canvas.style.backgroundColor = 'black';

    el.appendChild( canvas );

    function draw() {
      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      ctx.beginPath();
      ctx.arc( 32, 32, 20, 0, 2 * Math.PI );

      ctx.shadowColor = 'white';
      ctx.shadowBlur = 8 + Math.random() * 4;

      ctx.lineWidth = 8;
      ctx.strokeStyle = 'white';
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#89c';
      ctx.fill();
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
