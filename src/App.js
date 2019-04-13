import Config from './Config';
import Commands from './Commands';
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
    this._commands = Commands;
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
    args.shift();

    if (!this._isValidCommand(cmd)) {
      return EventBus.emit('sendError', {
        to: user,
        error: new Error(`Invalid command.`),
      });
    }
    if (!this._commandAuthorized(user, cmd)) {
      return EventBus.emit('sendError', {
        to: user,
        error: new Error(`Access denied.`),
      });
    }

        try {
          this._commands[cmd].handler.call(this, user, args);
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
}
