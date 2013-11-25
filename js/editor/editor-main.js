/*globals requirejs, define*/
requirejs.config({
  baseUrl: '../js'
});

define(function( require ) {
  'use strict';

  var Editor = require( 'editor/editor' );

  var editor = new Editor({
    el: '#editor'
  });

  document.addEventListener( 'keydown', editor.onKeyDown.bind( editor ) );
  document.addEventListener( 'keyup', editor.onKeyUp.bind( editor ) );

  var Polygon = require( 'geometry/polygon' );

  var polygon = new Polygon();
  polygon.vertices = [ -100, 50, 100, 50, 0, -100 ];
  polygon.angle = 0.5 * Math.PI;
  editor.add( polygon );
  editor.draw();
});
