import SuperMisstressmind from './SuperMistressmind.js';

export default class App {
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
    return str.startsWith(config.CMD_PREFIX);
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
      this._sendResponse({user, content: [{txt: "Invalid command."}]});
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
    let group = response.group || "";

    for (let line of response.content) {
      let bg = line.bg || "";
      let fg = line.fg || "";
      let weight = line.weight || "";
      let txt = line.txt || "";
      this.cb.sendNotice(txt, user, bg, fg, weight, group);
    }
  }

  get commands() {
    return {
      "helpFr": {
        modelOnly: false,
        desc: {
          short: {
            fr: [`${config.CMD_PREFIX}helpFr [command] - Affiche l'aide du jeu (Fr)`],
            en: [`Show the help (En)`]
          },
          long: {
            fr: [`${config.CMD_PREFIX}helpFr [command] - Affiche des informations utiles sur le jeu (Fr).`,
                 `Si [command] est specifie, affiche l'aide de la commande.`],
            en: [`The help command blablabla`]
          }
        },
        handler: (user, args) => {
          let content = [];
          let cmd = args[1] || "";
          if (this._isValidCommand(cmd)) {
            if (this._isModel(user) || !this.commands[cmd].modelOnly) {
              for (let  helpLine of this.commands[cmd].desc.long.fr) {
                content.push({txt: helpLine});
              }
            } else {
              content.push({txt: "Acces interdit"});
            }
          } else {
            content.push({txt: "Bienvenue dans l'aide !"});
          }

          return {user, content};
        }
      }
    };
  }
}
