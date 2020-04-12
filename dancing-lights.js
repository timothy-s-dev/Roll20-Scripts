// DancingLights v0.1
// Licensed under GNU General Public License v3.0
// Available on GitHub: https://github.com/timothy-s-dev/Roll20-Scripts

var DancingLights = DancingLights || (function () {
  'use strict';

  var version = 0.1,

    handleInput = function (msg) {
      if (msg.type !== "api" || !playerIsGM(msg.playerid)) {
        return;
      }

      var args, range, bright_radius, low_radius;
      args = msg.content.split(" ");

      switch (args[0]) {
        case '!add-vision':
          _.each(msg.selected, function (o) {
            getObj(o._type, o._id).set({
              has_bright_light_vision: true
            });
          });
          break;
        case '!remove-vision':
          _.each(msg.selected, function (o) {
            getObj(o._type, o._id).set({
              has_bright_light_vision: false
            });
          });
          break;

        case '!add-darkvision':
          range = parseInt(args[1], 10) || 30;
          _.each(msg.selected, function (o) {
            getObj(o._type, o._id).set({
              has_night_vision: true,
              night_vision_distance: range
            });
          });
          break;
        case '!remove-darkvision':
          _.each(msg.selected, function (o) {
            getObj(o._type, o._id).set({
              has_night_vision: false
            });
          });
          break;

        case '!add-light':
          bright_radius = parseInt(args[1], 10) || 40;
          low_radius = parseInt(args[2], 10) || (radius / 2);
          _.each(msg.selected, function (o) {
            getObj(o._type, o._id).set({
              emits_bright_light: bright_radius > 0,
              bright_light_distance: bright_radius,
              emits_low_light: low_radius > 0,
              low_light_distance: low_radius + bright_radius
            });
          });
          break;
        case '!remove-light':
          _.each(msg.selected, function (o) {
            getObj(o._type, o._id).set({
              emits_bright_light: false,
              bright_light_distance: 0,
              emits_low_light: false,
              low_light_distance: 0
            });
          });
          break;
      }
    },

    checkInstall = function () {
      if (!_.has(state, 'DancingLights') || state.DancingLights.version !== version) {
        log('DancingLights: Resetting state');
        state.DancingLights = {
          version: version
        }
      }
    },

    registerEventHandlers = function () {
      on('chat:message', handleInput);
    };

  return {
    CheckInstall: checkInstall,
    RegisterEventHandlers: registerEventHandlers
  };
}());

on("ready", function () {
  'use strict';

  log('Starting DancingLights');
  DancingLights.CheckInstall();
  DancingLights.RegisterEventHandlers();
});