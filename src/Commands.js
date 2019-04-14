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
      const [cmd = ''] = args;
      if (this._isValidCommand(cmd)) {
        if (this._isModel(user) || !this._commands[cmd].modelOnly) {
          content.push(this._commands[cmd].desc.long.fr);
        } else {
          content.push(
            "You don't have the permission to see the help for this command.",
          );
        }
      } else {
        content.push("Bienvenue dans l'aide !");
      }
      EventBus.emit('sendNoticeTo', { user, txt: content.join('\n') });
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
        nbAvailablePegs = this._settings.nbAvailablePegs,
        codeStr = '',
        goal = '',
      ] = args;
      const txt = this._game.newRound(nbAvailablePegs, codeStr, goal);
      // TODO: Notify the chat about the new round, the goal, the code length and the available colors
      EventBus.emit('sendNoticeTo', { user, txt });
    },
  },
  pause: {
    modelOnly: true,
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
      EventBus.emit('sendNoticeTo', { user, txt });
    },
  },
  play: {
    modelOnly: true,
    desc: {
      short: {
        fr: ``,
        en: `${Config.CMD_PREFIX}play <code> - Play for free !`,
      },
      long: {
        fr: `${Config.CMD_PREFIX}play <code> - Jouer gratuitement !`,
        en: `${Config.CMD_PREFIX}play <code> - Play for free !`,
      },
    },
    handler: function playHandler(user, args) {
      const [code = ''] = args;
      this._handlePlayTip({ from_user: user, message: code });
    },
  },
  board: {
    modelOnly: false,
    desc: {
      short: {
        fr: `${Config.CMD_PREFIX}board <code> - Affiche la table de jeu.`,
        en: `${Config.CMD_PREFIX}board - Show the board game.`,
      },
      long: {
        fr: `${Config.CMD_PREFIX}board <code> - Affiche la table de jeu.`,
        en: `${Config.CMD_PREFIX}board <code> - Show the board game.`,
      },
    },
    handler: function boardHandler(user, args) {
      const { board } = this._game;
      if (!board.length)
        return EventBus.emit('sendNoticeTo', {
          user,
          txt: 'The board game is empty.',
        });

      const tries = board.map(t => this._formatTry(t));
      return EventBus.emit('sendNoticeTo', {
        user,
        txt: tries.join('\n'),
      });
    },
  },
};
