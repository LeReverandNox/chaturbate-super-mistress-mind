const IMAGE_PREFIX = "61cf4b2dc8";
const EMPTY_CHAR = '.';
const CMD_PREFIX = "/sm";

class SuperMisstressmind {
  static get EMPTY_PEGS() {
    return {
      code: {
        name: "code-empty",
        image: `:${IMAGE_PREFIX}-code-empty`,
        color: "#000000"
      },
      key: {
        name: "key-empty",
        image: `:${IMAGE_PREFIX}-key-empty`,
        color: "#000000"
      },
    };
  }

  static get CODE_PEGS() {
    return {
      'W': {
        name: "white",
        image: `:${IMAGE_PREFIX}-white`,
        color: "#FFFFFF"
      },
      'R': {
        name: "red",
        image: `:${IMAGE_PREFIX}-red`,
        color: "#FF0000"
      },
      'B': {
        name: "blue",
        image: `:${IMAGE_PREFIX}-blue`,
        color: "#0000FF"
      },
      'G': {
        name: "green",
        image: `:${IMAGE_PREFIX}-green`,
        color: "#008000"
      },
      'V': {
        name: "violet",
        image: `:${IMAGE_PREFIX}-violet`,
        color: "#8000FF"
      },
      'O': {
        name: "orange",
        image: `:${IMAGE_PREFIX}-orange`,
        color: "#FFA500"
      },
      'Y': {
        name: "yellow",
        image: `:${IMAGE_PREFIX}-yellow`,
        color: "##fFFF00"
      },
      'M': {
        name: "maroon",
        image: `:${IMAGE_PREFIX}-maroon`,
        color: "#8b4513"
      },
      'P': {
        name: "pink",
        image: `:${IMAGE_PREFIX}-pink`,
        color: "##FF69B4"
      },
      'C': {
        name: "cyan",
        image: `:${IMAGE_PREFIX}-cyan`,
        color: "##00ffff"
      },
      'L': {
        name: "lime",
        image: `:${IMAGE_PREFIX}-lime`,
        color: "##00ff00"
      }
    };
  }

  static get KEY_PEGS() {
    return [
      {
        name: "white",
        image: `:${IMAGE_PREFIX}-key-white`,
        color: "#FFFFFF"
      },
      {
        name: "red",
        image: `:${IMAGE_PREFIX}-key-red`,
        color: "#FF0000"
      }
    ];
  }

  constructor(nbRounds) {
    this.nbRounds = nbRounds;
    this.currRound = 0;
    this.isPaused = false;
    this.isRoundStarted = false;
    this.isGameOver = false;
  }

  newRound(nbColors, codeLength, codeStr, goal) {
    // TODO: Make a Round object instead...
    if (this.isRoundStarted)
      throw `The current round (${this.currRound} / ${this.nbRounds} is not over.`;
    if (this.isGameOver)
      throw `The game is over. Please start a new one if you want to play some more.`;

    this.nbColors = nbColors;
    this.availablePegs = this._initPegs();
    this.codeLength = codeLength;
    this.code = this._initCode(codeStr);
    this.roundGoal = goal;
    this.roundHistory = [];
    this.currRound += 1;
    this.roundTries = 0;
    this.roundWinner = null;
    this.isRoundStarted = true;
    this.isGameOver = false;
  }

  endRound() {
    if (!this.isRoundStarted)
      throw `There is currently no round playing.`;
    this.isRoundStarted = false;
    if (this.currRound == this.nbRounds)
      this.isGameOver = true;
  }

  takeAGuess(player, codeStr = "") {
    if (this.isPaused)
      throw `The game is paused.`;
    if(!this.isRoundStarted)
      throw `The round is not started yet. Please be patient`;
    if (this.isGameOver)
      throw `The game is over.`;

    this.roundTries += 1;

    let code = this._convertInputIntoCode(codeStr);
    let keys = this._computeKeys(code);
    this.roundHistory.push({player, code, keys});

    if (this._isGuessCorrect(keys)) {
      this.roundWinner = player;
      this.endRound();
    }
    return true;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  _initPegs() {
    let letters = Object.keys(SuperMisstressmind.CODE_PEGS);
    let nbColors = letters.length;
    if (this.nbColors > nbColors || this.nbColors < 1)
      throw `You can't play with ${this.nbColors} colors. Please choose a value between 1 and ${nbColors}.`;

    let colors = {};
    for (let i = 0; i < this.nbColors; i += 1) {
      colors[letters[i]] = SuperMisstressmind.CODE_PEGS[letters[i]];
    }

    return colors;
  }

  _initCode(codeStr) {
    let codeLength = codeStr.length;
    codeStr = codeStr.toUpperCase();

    if (codeLength != this.codeLength)
      throw `Your code must be exactly ${this.codeLength} colors long.`;

    let code = [];
    for (let c of codeStr) {
      if (!this._isPegAvailable(c))
        throw `"${c} is not a valid color for your code.`;
      code.push(this.availablePegs[c]);
    }

    return code;
  }

  _isPegAvailable(c) {
    if (c in this.availablePegs)
      return true;
    return false;
  }

  _computeKeys(playerCode) {
    let tmpCode = [...this.code];
    let tmpPlayerCode = [...playerCode];
    let keys = [];

    for (let i in playerCode) {
      if (this._isPegAtRightPos(i, tmpCode, tmpPlayerCode))
        keys.push(SuperMisstressmind.KEY_PEGS[1]);
    }
    for (let i in tmpPlayerCode) {
      if (tmpPlayerCode[i] !== null) {
        if (this._isPegInCode(i, tmpCode, tmpPlayerCode))
          keys.push(SuperMisstressmind.KEY_PEGS[0]);
        else
          keys.push(SuperMisstressmind.EMPTY_PEGS["key"]);
      }
    }

    return keys;
  }

  _isPegAtRightPos(i, code, playerCode) {
    if (playerCode[i] == this.code[i]) {
      playerCode[i] = null;
      code[i] = null;
      return true;
    }
    return false;
  }
  _isPegInCode(pos, code, playerCode) {
    for (let i in code) {
      if (playerCode[pos] == code[i]) {
        code[i] = null;
        playerCode[pos] = null;
        return true;
      }
    }
    return false;
  }
  _convertInputIntoCode(codeStr) {
    let code = [];

    codeStr = codeStr.toUpperCase();
    codeStr = codeStr.padEnd(this.codeLength, EMPTY_CHAR);
    codeStr = codeStr.substring(0, this.codeLength);
    let codeArr = codeStr.split("");

    for (let c of codeArr) {
      if (this._isPegAvailable(c))
        code.push(this.availablePegs[c]);
      else
        code.push(SuperMisstressmind.EMPTY_PEGS["code"]);
    }

    return code;
  }

  _isGuessCorrect(keys) {
    for (let k of keys) {
      if (k.name != SuperMisstressmind.KEY_PEGS[1].name)
        return false;
    }
    return true;
  }

  get lastGuess() {
    if (this.roundTries > 0)
      return this.roundHistory[this.roundTries - 1];
    return null;
  }
}

class CommandParser {
  _sanitize(str) {
    return str.trim()
      .replace(/\s+/g, ' ')
      .replace(/\t+/g, ' ');
  }

  parse(str, looksForQuotes = true) {
    str = this._sanitize(str);
    let args = [];
    let readingPart = false;
    let part = '';
    for(let i = CMD_PREFIX.length; i < str.length; i += 1) {
      if (str.charAt(i) === ' ' && !readingPart) {
        if (part !== '')
          args.push(part);
        part = '';
      } else {
        if (str.charAt(i) === '\"' && looksForQuotes) {
          readingPart = !readingPart;
        } else {
          part += str.charAt(i);
        }
      }
    }
    args.push(part);

    return args;
  }
}

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
      this.cb.log("Wrong command =/");
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

let commandParser = new CommandParser();
let app = new App(cb, cbjs, commandParser);
