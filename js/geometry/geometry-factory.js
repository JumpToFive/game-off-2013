/*globals define*/
define(function( require ) {
  'use strict';

  var classes = {};

  function create( json ) {
    var attrs = JSON.parse( json );

    var type = attrs.type;
    if ( !classes[ type ] ) {
      try {
        classes[ type ] = require( 'geometry/' + type.toLowerCase() );
      } catch( error ) {
        return;
      }
    }

    // Warning: This does not handle Color objects!
    var geometryObject = new classes[ type ]();
    geometryObject.set( attrs );

    return geometryObject;
  }

  return {
    create: create
  };
});
