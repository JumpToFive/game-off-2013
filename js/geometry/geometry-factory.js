/*globals define*/
define(function( require ) {
  'use strict';

  var Color = require( 'color' );

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

    // Handle color objects.
    var color;
    for ( var key in attrs ) {
      if ( attrs[ key ].type === 'Color' ) {
        color = new Color();
        color.set( attrs[ key ] );
        attrs[ key ] = color;
      }
    }

    var geometryObject = new classes[ type ]();
    geometryObject.set( attrs );

    return geometryObject;
  }

  return {
    create: create
  };
});
