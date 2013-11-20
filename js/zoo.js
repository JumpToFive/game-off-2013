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

    var t = 0;

    function draw() {
      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      ctx.save();
      ctx.translate( 0.5 * width, 0.5 * height );

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

      // Draw mouth.
      if ( t % 240 < 80 ) {
        ctx.beginPath();
        ctx.arc( 0, 0.02 * height, 0.1 * width, 0.25 * Math.PI, 0.75 * Math.PI );

        ctx.lineWidth = 0.03 * width;
        ctx.strokeStyle = '#448';
        ctx.stroke();
      } else if ( t % 240 < 160 ) {
        ctx.beginPath();
        ctx.rect( -0.02 * width, 0.08 * height, 0.04 * width, 0.04 * width );
        ctx.fillStyle = '#448';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.rect( -0.06 * width, 0.08 * height, 0.12 * width, 0.02 * width );
        ctx.fillStyle = '#448';
        ctx.fill();
      }

      // Draw ring.
      ctx.beginPath();
      ctx.arc( 0, 0, 0.35 * width, 0, PI2 );

      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 0.05 * width + Math.random() * 0.05 * width;

      ctx.lineWidth = 0.07 * width;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      ctx.shadowBlur = 0;

      ctx.restore();
    }

    return function() {
      t++;
      draw();
    };
  }) ());

  tickFns.push((function() {
    var canvas = document.createElement( 'canvas' ),
        ctx    = canvas.getContext( '2d' );

    var size = 128;

    var width  = size,
        height = size;

    canvas.width  = width;
    canvas.height = height;
    canvas.style.backgroundColor = '#333';

    el.appendChild( canvas );

    function draw() {

    }

    return function() {};
  }) ());

  var prevTime = Date.now(),
      currTime;

  function tick() {
    currTime = Date.now();
    var dt = currTime - prevTime;
    prevTime = currTime;

    if ( dt > 1e2 ) {
      dt = 1e2;
    }

    dt *= 1e-3;

    tickFns.forEach(function( tickFn ) {
      tickFn( dt );
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
