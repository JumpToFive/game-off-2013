(function( window, document, undefined ) {
  'use strict';

  var PI2 = 2 * Math.PI;

  var running = false;

  var el = document.querySelector( '.container' );

  var tickFns = [];

  /**
   * TODO:
   * - Wires,
   * - Teleporter?
   * - Emitter.
   * - Trash?
   */

  tickFns.push((function drawHero() {
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


  tickFns.push((function drawEmitter() {
    var canvas = document.createElement( 'canvas' ),
        ctx    = canvas.getContext( '2d' );

    var size = 128;

    var width  = size,
        height = size;

    canvas.width  = width;
    canvas.height = height;
    canvas.style.backgroundColor = '#333';

    el.appendChild( canvas );

    var beamWidth  = 0.4 * width,
        beamHeight = 0.3 * height;

    var baseWidth  = 0.1 * beamWidth,
        baseHeight = beamHeight;

    function yRandom() {
      return Math.random() - 0.5;
    }

    var t = 0;

    var particles = [];
    var particleCount = 10;
    var radius;
    while ( particleCount-- ) {
      radius = ( 0.02 + Math.random() * 0.01 ) * width;
      particles.push({
        x: Math.random() * beamWidth,
        y: yRandom() * ( beamHeight - radius ),
        radius: radius,
        vx: 1.8 * beamHeight,
        vy: 0
      });
    }

    var redPrefix  = 'rgba(255, 128, 128, ',
        bluePrefix = 'rgba(128, 128, 255, ';

    var colorPrefix = redPrefix;

    function draw() {
      if ( t % 120 < 60 ) {
        colorPrefix = redPrefix;
      } else {
        colorPrefix = bluePrefix;
      }

      ctx.clearRect( 0, 0, width, height );

      ctx.save();
      ctx.translate( 0.5 * width, 0.5 * height );

      // Draw beam.
      ctx.beginPath();
      ctx.rect( 0, -0.5 * beamHeight, beamWidth, beamHeight );
      var grad = ctx.createLinearGradient( 0, 0, beamWidth, 0 );
      grad.addColorStop( 0, colorPrefix + '0.8)' );
      grad.addColorStop( 1, colorPrefix + '0.0)' );
      ctx.fillStyle = grad;
      ctx.fill();


      // Draw particles.
      particles.forEach(function( particle ) {
        var alpha = 1 - particle.x / beamWidth;

        ctx.beginPath();
        ctx.arc( particle.x, particle.y, particle.radius, 0, PI2 );
        ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
        ctx.fill();
      });

      // Draw base.
      ctx.shadowBlur = 0.02 * width;
      ctx.shadowColor = colorPrefix + '1.0)';

      ctx.beginPath();
      ctx.moveTo( 0, -0.5 * baseHeight );
      ctx.lineTo( 0, 0.5 * baseHeight );

      ctx.lineCap = 'round';
      ctx.lineWidth = baseWidth;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      ctx.lineCap = 'butt';
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    return function( dt ) {
      t++;

      particles.forEach(function( particle ) {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        if ( particle.x - particle.radius > beamWidth ) {
          particle.x = particle.radius;
          particle.y = yRandom() * ( beamHeight - radius );
        }
      });

      draw();
    };
  }) ());

  tickFns.push((function drawBackground() {
    var canvas = document.createElement( 'canvas' ),
        ctx    = canvas.getContext( '2d' );

    var size = 512;

    var width  = size,
        height = size;

    var hue = 240;

    canvas.width  = width;
    canvas.height = height;

    el.appendChild( canvas );

    var t = 0;

    var rects = [];

    function generateRects() {
      rects = [];

      var rectCount = 100;
      while ( rectCount-- ) {
        rects.push({
          x: Math.random() * width,
          y: Math.random() * height,
          width: Math.random() * 0.25 * width,
          height: Math.random() * 0.25 * height,
          saturation: Math.round( Math.random() * 30 + 25 ) + '%',
          lightness: Math.round( Math.random() * 50 + 25 ) + '%'
        });
      }
    }

    function draw() {
      var width  = ctx.canvas.width,
          height = ctx.canvas.height;

      if ( t % 240 < 120 ) {
        hue = 240;
      } else {
        hue = 0;
      }

      canvas.style.backgroundColor = 'hsla(' + hue + ', 30%, 50%, 1.0)';

      ctx.clearRect( 0, 0, width, height );

      generateRects();
      rects.forEach(function( rect ) {
        ctx.save();
        ctx.translate( rect.x, rect.y );

        ctx.beginPath();
        ctx.rect( -0.5 * rect.width, -0.5 * rect.height, rect.width, rect.height );
        ctx.fillStyle = 'hsla(' +
          hue + ', ' +
          rect.saturation + ', ' +
          rect.lightness + ', ' +
          Math.random() +
        ')';
        ctx.fill();

        ctx.restore();
      });
    }

    var isDrawn = false;

    return function() {
      t++;
      if ( t % 120 === 0 ) {
        isDrawn = false;
      }

      if ( !isDrawn ) {
        draw();
        isDrawn = true;
      }
    };
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
