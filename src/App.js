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
      EventBus.emit('sendErrorTo', { user: this._modelName, error });
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
      return EventBus.emit('sendErrorTo', {
        user,
        error: new Error(`Invalid command.`),
      });
    }
    if (!this._commandAuthorized(user, cmd)) {
      return EventBus.emit('sendErrorTo', {
        user,
        error: new Error(`Access denied.`),
      });
    }

    try {
      this._commands[cmd].handler.call(this, user, args);
      return true;
    } catch (error) {
      return EventBus.emit('sendErrorTo', {
        to: user,
        error: new Error(
          `${error.message}
          ${this._commands[cmd].desc.short.en}`,
        ),
      });
    }
  }

  _handlePlayTip(tipObj) {
    const { from_user: user, message = '' } = tipObj;

    try {
      const hasWin = this._game.play(user, message);
      this._displayLastTry();
      if (hasWin) {
        EventBus.emit(
          'broadcastNotice',
          `${this._game.currentWinner} cracked the code ! Well played :)
          The goal "${this._game.currentGoal}" is achieved !`,
        );
      }
    } catch (error) {
      EventBus.emit('sendErrorTo', { user, error });
    }
  }

  _displayLastTry() {
    const t = this._game.lastTry;
    const txt = this._formatTry(t);
    EventBus.emit('broadcastNotice', txt);
  }

  _formatTry(t) {
    const elements = [];
    t.code.forEach(c => elements.push(c.image));
    elements.push(' - ');
    t.keys.forEach(k => elements.push(k.image));
    return elements.join(' ');
  }

  _isValidCommand(name) {
    return name in this._commands;
  }

  _isCorrectAmountToPlay(amount) {
    return amount === this._settings.tokensToPlay;
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

  onTip(tipObj) {
    const { amount } = tipObj;

    if (this._isCorrectAmountToPlay(amount)) {
      this._handlePlayTip(tipObj);
    }
  }
}
