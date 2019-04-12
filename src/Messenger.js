import Config from './Config';
import EventBus from './EventBus';

export default class Messenger {
  constructor(cb) {
    this._cb = cb;
    this._initEvents();
  }

  _initEvents() {
    EventBus.on('sendError', this._sendError.bind(this));
    EventBus.on('sendResponse', this._sendResponse.bind(this));
  }

  _sendResponse({ user = '', group = '', content = [] }) {
    content.forEach(line => {
      const { fg = '', bg = '', weight = '', txt = '' } = line;
      this._cb.sendNotice(
        `${Config.NOTICE_PREFIX} - ${txt}`,
        user,
        bg,
        fg,
        weight,
        group,
      );
    });
  }

  _sendError({ to, error }) {
    const response = {
      user: to,
      content: [
        {
          txt: error.message,
          fg: Config.ERROR_COLOR,
        },
      ],
    };
    this._sendResponse(response);
  }
}
