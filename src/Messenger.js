import Config from './Config';
import EventBus from './EventBus';

export default class Messenger {
  constructor(cb) {
    this._cb = cb;
    this._initEvents();
  }

  _initEvents() {
    EventBus.on('sendErrorTo', this.sendErrorTo.bind(this));
    EventBus.on('sendNoticeTo', this.sendNoticeTo.bind(this));
    EventBus.on('broadcastNotice', this.broadcastNotice.bind(this));
    EventBus.on('broadcastError', this.broadcastError.bind(this));
  }

  _sendNotice({
    txt = '',
    user = '',
    group = '',
    fg = '',
    bg = '',
    weight = '',
  }) {
    this._cb.sendNotice(
      `${Config.NOTICE_PREFIX} - ${txt}`,
      user,
      bg,
      fg,
      weight,
      group,
    );
  }

  sendNoticeTo({ user = '', group = '', txt = '' }) {
    const { bg, fg, weight } = Config.Messenger.Notice;
    const lines = txt.split('\n');

    lines.forEach(l => {
      const response = { txt: l, user, group, bg, fg, weight };
      this._sendNotice(response);
    });
  }

  sendErrorTo({ user = '', group = '', error }) {
    const { bg, fg, weight } = Config.Messenger.Error;
    const lines = error.message.split('\n');

    lines.forEach(l => {
      const response = { txt: l, user, group, bg, fg, weight };
      this._sendNotice(response);
    });
  }

  broadcastNotice(txt = '') {
    const { bg, fg, weight } = Config.Messenger.Notice;
    const lines = txt.split('\n');

    lines.forEach(l => {
      const response = { txt: l, bg, fg, weight };
      this._sendNotice(response);
    });
  }

  broadcastError(error) {
    const { bg, fg, weight } = Config.Messenger.Error;
    const lines = error.message.split('\n');

    lines.forEach(l => {
      const response = { txt: l, bg, fg, weight };
      this._sendNotice(response);
    });
  }
}
