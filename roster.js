// Roster v0.1
// Licensed under GNU General Public License v3.0
// Available on GitHub: https://github.com/timothy-s-dev/Roll20-Scripts

var Roster = Roster || (function () {
  'use strict';

  const version = 0.1,

    getRosterCharacter = function () {
      const characterSheets = findObjs({ type: 'character', name: 'Roster' });
      if (characterSheets.length === 0) {
        sendChat('Roster', '/w gm ERROR: Could not find Roster character sheet.');
        return null;
      }
      return characterSheets[0];
    },

    getRoster = function (isGm, callback) {
      const sheet = getRosterCharacter();
      sheet.get('gmnotes', (rosterJson) => {
        const roster = JSON.parse(rosterJson.replace(/<[^>]*>/g, ''));
        callback(roster.filter((npc) => isGm || npc.flags.indexOf('H') < 0));
      });
    },

    handleInput = function (msg) {
      if (msg.type !== "api") {
        return;
      }

      var args = msg.content.split(" ");
      if (args[0].toLowerCase() !== '!roster') return;

      const playerName = getObj('player', msg.playerid).get('displayname');

      if (args.length === 1) {
        getRoster(playerIsGM(msg.playerid), (roster) => {
          var message = `/w ${playerName} &{template:default} {{name=Character Roster}} {{=`;
          var categories = [...new Set(roster.map(character => character.category))];
          categories.forEach((category) => {
            message += `\n[${category}](!roster category ${category})`
          });
          message += '\n}}';
          sendChat('Roster', message);
        });
        return;
      }

      if (args[1] === 'category') {
        const categoryName = msg.content.substring(17);
        getRoster(playerIsGM(msg.playerid), (roster) => {
          var message = `/w ${playerName} &{template:default} {{name=${categoryName}}} {{=`;
          roster.filter(character => character.category === categoryName).forEach((character) => {
            message += `\n[${character.name}](!roster character ${character.id})`
          });
          message += '\n}}';
          sendChat('Roster', message);
        });
        return;
      }

      if (args[1] === 'character') {
        const characterId = parseInt(msg.content.substring(18));
        getRoster(playerIsGM(msg.playerid), (roster) => {
          roster.filter(character => character.id === characterId).forEach((character) => {
            let imageUrl = character.img_url.replace(/=/g, '&#61;');
            if (!imageUrl.endsWith('.png') && !imageUrl.endsWith('.jpg')) {
              imageUrl += '#.png';
            }

            var message = `/w ${playerName} &{template:default} {{name=${character.name}}}`;
            message += ` {{[Image](${imageUrl}#.png)}}`;
            message += ` {{${character.description}}}`;
            sendChat('Roster', message);
            sendChat('Roster', `/w gm ${character.name} - ${character.gm_notes}`);
          });
        });
        return;
      }
    },

    checkInstall = function () {
      if (!_.has(state, 'Roster') || state.Roster.version !== version) {
        log('Roster: Resetting state');
        state.Roster = {
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

  log('Starting Roster');
  Roster.CheckInstall();
  Roster.RegisterEventHandlers();
});