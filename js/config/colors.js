/*globals define*/
define(function() {
  'use strict';

  return {
    Glow: {
      MATTER: '#33f',
      ANTIMATTER: '#f33'
    },
    Solid: {
      MATTER: '#66c',
      ANTIMATTER: '#c66'
    },
    Explosion: {
      MATTER: {
        red: 32,
        green: 32,
        blue: 64,
        alpha: 1
      },
      ANTIMATTER: {
        red: 64,
        green: 32,
        blue: 32,
        alpha: 1
      }
    }
  };
});
