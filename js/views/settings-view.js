/*globals define*/
define([
  'config/settings',
  'text!./../../templates/settings-view.html'
], function( Settings, settingsTemplate ) {
  'use strict';

  function checkboxListener( event ) {
    var id = event.target.id;
    Settings[ id ] = event.target.checked;
  }

  function SettingsView( el ) {
    this.el = document.querySelector( el );
    if ( !this.el ) {
      this.el = document.createElement( 'div' );
      this.el.id = 'settings-view';
    }

    this.template = settingsTemplate;
    this.initialize();
  }

  SettingsView.prototype.initialize = function() {
    this.el.innerHTML = this.template;

    Settings.keys.map(function( key ) {
      var element = this.el.querySelector( '#' + key );
      element.addEventListener( 'click', checkboxListener );
      element.checked = Settings[ key ];
    }.bind( this ));
  };

  SettingsView.prototype.remove = function() {
    Settings.keys.map(function( key ) {
      var element = this.el.querySelector( '#' + key );
      element.removeEventListener( 'click', checkboxListener );
    }.bind( this ));

    this.el.innerHTML = '';

    if ( this.el.parentElement ) {
      this.el.parentElement.removeChild( this.el );
    }
  };

  return SettingsView;
});
