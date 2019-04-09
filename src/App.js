class App {
  constructor(cb, cbjs, commandParser) {
    this.cb = cb;
    this.cbjs = cbjs;
    this.commandParser = commandParser;
    this.modelName = cb.room_slug;
    this.game = null;

    this._initListeners();
  }
  _initListeners() {
    this.cb.onMessage((msg) => {
      return this.onMessage(msg);
    });

    this.cb.onTip((tip) => {
      return this.onTip(tip);
    });
  }

  _isModel(name) {
    return name === this.modelName;
  }

  onMessage(msgObj) {
    let msg = msgObj["m"];

    if (this._isCommand(msg)) {
      msgObj["X-Spam"] = true;
      this._handleCommand(msgObj);
    }

    return msgObj;
  }
  _isCommand(str) {
    return str.startsWith(CMD_PREFIX);
  }
  _handleCommand(msgObj) {
    let user = msgObj["user"];
    let msg = msgObj["m"];
    let args = this.commandParser.parse(msg);
    let cmd = args[0] || "";
    let responseText;

    if (this._isValidCommand(cmd)) {
      let response = this.commands[cmd].handler(user, args);
      this._sendResponse(response);
    } else {
      this._sendResponse({user, msg: "Invalid command."});
    }
  }

  onTip(tip){
    this.cb.log("Un tip");
  }

  _isValidCommand(name) {
    return name in this.commands;
  }

  _sendResponse(response) {
    let user = response.user || "";
    let bg = response.bg || "";
    let fg = response.bg || "";
    let weight = response.weight || "";
    let group = response.group || "";

    for (let line of response.text) {
      this.cb.sendNotice(line, user, bg, fg, weight, group);
    }
  }

  get commands() {
    return {
      "help": {
        modelOnly: true,
        desc: {
          short: {
            fr: ["Affiche l'aide"],
            en: ["Show the help"]
          },
          long: {
            fr: ["La commande d'aide permet..."],
            en: ["The help command blablabla"]
          }
        },
        handler: (user, args) => {
          let text = [];
          let cmd = args[1] || "";
          if (this._isValidCommand(cmd)) {
            if (this._isModel(user) || !this.commands[cmd].modelOnly)
              text = text.concat(this.commands[cmd].desc.long.fr);
            else
              text.push("Acces interdit");
          } else {
            text.push("Bienvenue dans l'aide !");
          }

          return {user, text};
        }
      }
    };
  }
}
