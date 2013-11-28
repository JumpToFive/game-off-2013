/*globals define*/
define([
  'config/settings',
  'text!./../../templates/settings-view.html'
], function( Settings, settingsTemplate ) {
  'use strict';

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
    this.el.innerHTMML = this.template;

    console.log( this.template );
    console.log( Settings.keys );
  };

  return SettingsView;
});
