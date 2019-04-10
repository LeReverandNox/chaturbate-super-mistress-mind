import SuperMisstressmind from './SuperMistressmind.js';

export default class Round {
  constructor(nbAvailablePegs, codeStr, goal) {
    this.nbAvailablePegs = nbAvailablePegs;
    this._availablePegs = this._initPegs();
    this.code = codeStr;
    this.goal = goal;
    this._history = [];
    this._tries = 0;
    this._winner = null;
    this._isOver = false;
  }

  get nbAvailablePegs() {
    return this._nbAvailablePegs;
  }
  set nbAvailablePegs(nb) {
    if (nb > SuperMisstressmind.NB_PEGS || nb < 1)
      throw `You can't play with ${nb} colors. Please choose a value between 1 and ${SuperMisstressmind.NB_PEGS}.`;

    this._nbAvailablePegs = nb;
    return this.nbAvailablePegs;
  }

  get availablePegs() {
    return this._availablePegs;
  }

  get goal() {
    return this._goal;
  }
  set goal(str) {
    str = str.trim();
    if (!str)
      throw `You can't have an empty goal for a round.`;

    this._goal = str;
    return this.goal;
  }

  get history() {
    return this._history;
  }
  appendToHistory(player, code, keys) {
    this._history.push({player, code, keys});
  }

  get tries() {
    return this._tries;
  }

  get lastTry() {
    return this.history[this.tries];
  }

  get winner() {
    return this._winner;
  }
  set winner(name) {
    this._winner = name;
    return this.winner;
  }

  get code() {
    return this._code;
  }
  set code(codeStr) {
    let codeLength = codeStr.length;
    codeStr = codeStr
      .toUpperCase()
      .trim();

    if (codeLength < 1)
      throw `Your code can't be less then one peg.`;

    let code = [];
    for (let c of codeStr) {
      if (!this._isPegAvailable(c))
        throw `"${c} is not a valid color for your code.`;
      code.push(this.availablePegs[c]);
    }

    this._code = code;
    return this.code;
  }

  get codeLength() {
    return this._code.length;
  }

  get isOver() {
    return this._isOver;
  }
  end() {
    this._isOver = true;
  }

  _initPegs() {
    let colors = {};
    for (let i = 0; i < this.nbAvailablePegs; i += 1) {
      let letter = SuperMisstressmind.PEG_LETTERS[i];
      colors[letter] = SuperMisstressmind.CODE_PEGS[letter];
    }

    return colors;
  }

  _isPegAvailable(c) {
    if (c in this.availablePegs)
      return true;
    return false;
  }

  _convertInputIntoCode(codeStr) {
    codeStr = codeStr
      .toUpperCase()
      .padEnd(this.codeLength, config.EMPTY_CHAR)
      .substring(0, this.codeLength);
    let codeArr = codeStr.split("");
    let code = [];

    for (let c of codeArr) {
      if (this._isPegAvailable(c))
        code.push(this.availablePegs[c]);
      else
        code.push(SuperMisstressmind.EMPTY_PEGS["code"]);
    }

    return code;
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

  _isGuessCorrect(keys) {
    for (let k of keys) {
      if (k.name != SuperMisstressmind.KEY_PEGS[1].name)
        return false;
    }
    return true;
  }

  play(player, codeStr) {
    this._tries += 1;
    let code = this._convertInputIntoCode(codeStr);
    let keys = this._computeKeys(code);
    this.appendToHistory(player, code, keys);

    if (this._isGuessCorrect(keys)) {
      this.winner = player;
      return true;
    }
    return false;
  }
}
