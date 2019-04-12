import Config from './Config';
import SuperMisstressmind from './SuperMistressmind';
import EventBus from './EventBus';

export default class App {
  constructor(cb, cbjs, commandParser) {
    this._cb = cb;
    this._cbjs = cbjs;
    this.commandParser = commandParser;

    this.authors = ['LeReverandNox'];
    this.version = '0.1';

    this._createSettingForm();

    this._modelName = cb.room_slug;
    this._settings = this._parseSettings();

    this._run();
  }

  _run() {
    try {
      this._game = new SuperMisstressmind(this._settings.nbRounds);
    } catch (error) {
      EventBus.emit('sendError', { to: this._modelName, error });
    }
  }

  _parseSettings() {
    return this._cb.settings;
  }

  _createSettingForm() {
    this._cb.settings_choices = [
      {
        name: 'nbRounds',
        type: 'int',
        minValue: 1,
        defaultValue: 3,
        label: 'Number of rounds to play',
      },
      {
        name: 'tokensToPlay',
        type: 'int',
        minValue: 1,
        defaultValue: 10,
        label: 'Amount of tokens required to play',
      },
    ];
  }

  _isModel(name) {
    return name === this._modelName;
  }

  _isCommand(str) {
    return str.startsWith(Config.CMD_PREFIX);
  }

  _handleCommand(msgObj) {
    const { user, m: msg } = msgObj;
    const args = this.commandParser.parse(msg);
    const [cmd = ''] = args;

    if (this._isValidCommand(cmd)) {
      if (this._commandAuthorized(user, cmd)) {
        try {
          this._commands[cmd].handler(user, args);
        } catch (error) {
          EventBus.emit('sendError', {
            to: user,
            error: new Error(
              `${error.message}
              ${this._commands[cmd].desc.short.en}`,
            ),
          });
        }
      } else
        EventBus.emit('sendError', {
          to: user,
          error: new Error(`Access denied.`),
        });
    } else
      EventBus.emit('sendError', {
        to: user,
        error: new Error(`Invalid command.`),
      });
  }

  _isValidCommand(name) {
    return name in this._commands;
  }

  _commandAuthorized(user, cmd) {
    return this._isModel(user) ? true : !this._commands[cmd].modelOnly;
  }

  onMessage(msgObj) {
    const msg = msgObj.m;

    if (this._isCommand(msg)) {
      msgObj['X-Spam'] = true;
      this._handleCommand(msgObj);
    }

    return msgObj;
  }

  onTip(tip) {
    this._cb.log('Un tip');
    this._cb.log(tip);
  }

  get _commands() {
    return {
      helpFr: {
        modelOnly: false,
        desc: {
          short: {
            fr: `${
              Config.CMD_PREFIX
            }helpFr [command] - Affiche l'aide du jeu (Fr)`,

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
        handler: (user, args) => {
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
        handler: (user, args) => {
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
        handler: (user, args) => {
          const txt = this._game.pause();
          EventBus.emit('sendResponse', { user, content: [{ txt }] });
        },
      },
    };
  }
}
