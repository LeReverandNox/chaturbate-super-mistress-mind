import SuperMisstressmind from './SuperMistressmind';

export default class App {
  constructor(cb, cbjs, commandParser) {
    this._cb = cb;
    this._cbjs = cbjs;

    this.authors = ['LeReverandNox'];
    this.version = '0.1';

    this._createSettingForm();

    this.commandParser = commandParser;
    this._modelName = cb.room_slug;
    this._settings = this._parseSettings();

    this._initListeners();
    this._run();
  }

  _run() {
    try {
      this._game = new SuperMisstressmind(this._settings.nbRounds);
    } catch (error) {
      this._sendError(this._modelName, error);
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

  _initListeners() {
    this._cb.onMessage(msg => {
      return this.onMessage(msg);
    });

    this._cb.onTip(tip => {
      return this.onTip(tip);
    });
  }

  _isModel(name) {
    return name === this._modelName;
  }

  onMessage(msgObj) {
    const msg = msgObj.m;

    if (this._isCommand(msg)) {
      msgObj['X-Spam'] = true;
      this._handleCommand(msgObj);
    }

    return msgObj;
  }

  _isCommand(str) {
    return str.startsWith(config.CMD_PREFIX);
  }

  _handleCommand(msgObj) {
    const { user } = msgObj;
    const msg = msgObj.m;
    const args = this.commandParser.parse(msg);
    const cmd = args[0] || '';

    if (this._isValidCommand(cmd)) {
      if (this._commandAuthorized(user, cmd)) {
        const response = this.commands[cmd].handler(user, args);
        this._sendResponse(response);
      } else this._sendError(user, new Error(`Access denied.`));
    } else this._sendError(user, new Error(`Invalid command..`));
  }

  onTip(tip) {
    this._cb.log('Un tip');
    this._cb.log(tip);
  }

  _isValidCommand(name) {
    return name in this.commands;
  }

  _sendResponse(response) {
    const user = response.user || '';
    const group = response.group || '';

    response.content.forEach(line => {
      const bg = line.bg || '';
      const fg = line.fg || '';
      const weight = line.weight || '';
      const txt = line.txt || '';
      this._cb.sendNotice(txt, user, bg, fg, weight, group);
    });
  }

  _sendError(to, err) {
    const response = {
      user: to,
      content: [
        {
          txt: err.message,
          fg: config.ERROR_COLOR,
        },
      ],
    };
    this._sendResponse(response);
  }

  _commandAuthorized(user, cmd) {
    return this._isModel(user) ? true : !this.commands[cmd].modelOnly;
  }

  get commands() {
    return {
      helpFr: {
        modelOnly: false,
        desc: {
          short: {
            fr: [
              `${
                config.CMD_PREFIX
              }helpFr [command] - Affiche l'aide du jeu (Fr)`,
            ],
            en: [`Show the help (En)`],
          },
          long: {
            fr: [
              `${
                config.CMD_PREFIX
              }helpFr [command] - Affiche des informations utiles sur le jeu (Fr).`,
              `Si [command] est specifie, affiche l'aide de la commande.`,
            ],
            en: [`The help command blablabla`],
          },
        },
        handler: (user, args) => {
          const content = [];
          const cmd = args[1] || '';
          if (this._isValidCommand(cmd)) {
            if (this._isModel(user) || !this.commands[cmd].modelOnly) {
              this.commands[cmd].desc.long.fr.forEach(helpLine => {
                content.push({ txt: helpLine });
              });
            } else {
              content.push({ txt: 'Acces interdit' });
            }
          } else {
            content.push({ txt: "Bienvenue dans l'aide !" });
          }

          return { user, content };
        },
      },
    };
  }
}
