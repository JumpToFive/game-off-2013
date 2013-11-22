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
});
