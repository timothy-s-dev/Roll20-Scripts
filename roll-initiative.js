// RollInitiative v0.1
// Licensed under GNU General Public License v3.0
// Available on GitHub: https://github.com/timothy-s-dev/Roll20-Scripts

var RollInitiative = RollInitiative || (function () {
  'use strict';

  var version = 0.1,

    addToTurnOrder = function (object, initMod) {
      var turnOrderJson = Campaign().get('turnorder');
      var turnOrder = turnOrderJson === '' ? [] : JSON.parse(turnOrderJson);
      turnOrder.push({
        id: object.id,
        pr: (randomInteger(20) + initMod).toFixed(2),
        custom: '',
        _pageid: Campaign().get('playerpageid')
      });
      Campaign().set('turnorder', JSON.stringify(turnOrder));
    },

    sortTurnOrder = function () {
      var turnOrderJson = Campaign().get('turnorder');
      var turnOrder = turnOrderJson === '' ? [] : JSON.parse(turnOrderJson);
      turnOrder.sort(function (a, b) { return b.pr - a.pr; });
      Campaign().set('turnorder', JSON.stringify(turnOrder));
    },

    getValidTokens = function (objects, group) {
      if (!Campaign().get('initiativepage')) {
        sendChat('RollInitiative', '/w gm ERROR: Initiative page must be open to roll initiative.');
        return [];
      }

      if (Campaign().get('playerspecificpages') !== false) {
        sendChat('RollInitiative', '/w gm WARNING: Rolling based on page with player ribbon, but some players are on other pages.');
      }

      var foundCharacters = [];
      return objects.filter(function (obj) {
        if (obj.get('type') !== 'graphic' || obj.get('subtype') !== 'token' || obj.get('_pageid') !== Campaign().get('playerpageid')) return false;

        var characterId = obj.get('represents');
        if (!characterId) return false;
        if (group && foundCharacters.includes(characterId)) return false;
        foundCharacters.push(characterId);

        var character = getObj('character', characterId);
        if (!character) return false;

        return getAttrByName(characterId, 'initiative_bonus') !== undefined;
      });
    },

    rollInitiative = function (who) {
      if (who.length > 50) {
        sendChat('RollInitiative', '/w gm ERROR: Too many tokens to roll for.');
        return;
      }
      _.each(who, function (o) {
        var characterId = o.get('represents');
        var modifier = getAttrByName(characterId, 'initiative_bonus')
        addToTurnOrder(o, modifier);
      });
      sortTurnOrder();
    },

    handleInput = function (msg) {
      if (msg.type !== "api" || !playerIsGM(msg.playerid)) {
        return;
      }

      var args = msg.content.split(" ");
      var shouldGroup = args.length > 1 && args[1].toLowerCase() === 'group';
      var selected = !msg.selected ? [] : msg.selected.map(s => getObj(s._type, s._id));

      switch (args[0]) {
        case '!roll-initiative':
          var who = selected.length > 0 ? getValidTokens(selected, shouldGroup) : getValidTokens(getAllObjs(), shouldGroup);
          rollInitiative(who);
          break;
        case '!roll-initiative-all':
          rollInitiative(getValidTokens(getAllObjs(), shouldGroup));
          break;
      }
    },

    checkInstall = function () {
      if (!_.has(state, 'RollInitiative') || state.RollInitiative.version !== version) {
        log('RollInitiative: Resetting state');
        state.RollInitiative = {
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

  log('Starting RollInitiative');
  RollInitiative.CheckInstall();
  RollInitiative.RegisterEventHandlers();
});