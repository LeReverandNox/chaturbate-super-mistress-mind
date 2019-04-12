import Config from './Config';
import EventBus from './EventBus';

export default {
  helpFr: {
    modelOnly: false,
    desc: {
      short: {
        fr: `${Config.CMD_PREFIX}helpFr [command] - Affiche l'aide du jeu (Fr)`,

        en: `${Config.CMD_PREFIX}helpFr [command] - Show the help (Fn)`,
      },
      long: {
        fr: `${
          Config.CMD_PREFIX
        }helpFr [command] - Affiche des informations utiles sur le jeu (Fr).
        Si [command] est specifie, affiche l'aide de la commande.`,
        en: `The help command blablabla`,
      },
    },
    handler: function helpFrHandler(user, args) {
      const content = [];
      const [, cmd = ''] = args;
      if (this._isValidCommand(cmd)) {
        if (this._isModel(user) || !this._commands[cmd].modelOnly) {
          content.push({ txt: this._commands[cmd].desc.long.fr });
        } else {
          content.push({
            txt:
              "You don't have the permission to see the help for this command.",
          });
        }
      } else {
        content.push({ txt: "Bienvenue dans l'aide !" });
      }
      EventBus.emit('sendResponse', { user, content });
    },
  },
  newround: {
    modelOnly: true,
    desc: {
      short: {
        fr: ``,
        en: `${
          Config.CMD_PREFIX
        }newround <number of colors> <code> <goal> - Starts a new round.`,
      },
      long: {
        fr: ``,
        en: ``,
      },
    },
    handler: function newroundHandler(user, args) {
      const [
        ,
        nbAvailablePegs = this._settings.nbAvailablePegs,
        codeStr = '',
        goal = '',
      ] = args;
      const txt = this._game.newRound(nbAvailablePegs, codeStr, goal);
      EventBus.emit('sendResponse', { user, content: [{ txt }] });
    },
  },
  pause: {
    modelOnly: false,
    desc: {
      short: {
        fr: ``,
        en: `${Config.CMD_PREFIX}pause - Pause / Resume the game.`,
      },
      long: {
        fr: ``,
        en: ``,
      },
    },
    handler: function pauseHandler(user, args) {
      const txt = this._game.pause();
      EventBus.emit('sendResponse', { user, content: [{ txt }] });
    },
  },
};
