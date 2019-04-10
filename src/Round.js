import SuperMisstressmind from './SuperMistressmind';

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
      throw new Error(
        `You can't play with ${nb} colors. Please choose a value between 1 and ${
          SuperMisstressmind.NB_PEGS
        }.`,
      );

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
    const trimmedStr = str.trim();
    if (!str) throw new Error(`You can't have an empty goal for a round.`);

    this._goal = trimmedStr;
    return this.goal;
  }

  get history() {
    return this._history;
  }

  appendToHistory(player, code, keys) {
    this._history.push({ player, code, keys });
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
    const codeLength = codeStr.length;
    const cleanCodeStr = codeStr.toUpperCase().trim();

    if (codeLength < 1)
      throw new Error(`Your code can't be less then one peg.`);

    const code = [];

    [...cleanCodeStr].forEach(c => {
      if (!this._isPegAvailable(c))
        throw new Error(`"${c} is not a valid color for your code.`);
      code.push(this.availablePegs[c]);
    });

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
    const colors = {};
    for (let i = 0; i < this.nbAvailablePegs; i += 1) {
      const letter = SuperMisstressmind.PEG_LETTERS[i];
      colors[letter] = SuperMisstressmind.CODE_PEGS[letter];
    }

    return colors;
  }

  _isPegAvailable(c) {
    return c in this.availablePegs;
  }

  _convertInputIntoCode(codeStr) {
    const cleanCodeStr = codeStr
      .toUpperCase()
      .padEnd(this.codeLength, config.EMPTY_CHAR)
      .substring(0, this.codeLength);
    const codeArr = cleanCodeStr.split('');
    const code = [];

    codeArr.forEach(c => {
      if (this._isPegAvailable(c)) code.push(this.availablePegs[c]);
      else code.push(SuperMisstressmind.EMPTY_PEGS.code);
    });

    return code;
  }

  _computeKeys(playerCode) {
    const tmpCode = [...this.code];
    const tmpPlayerCode = [...playerCode];
    const keys = [];

    playerCode.forEach((_, i) => {
      if (this._isPegAtRightPos(i, tmpCode, tmpPlayerCode))
        keys.push(SuperMisstressmind.KEY_PEGS[1]);
    });

    tmpPlayerCode.forEach((_, i) => {
      if (tmpPlayerCode[i] !== null) {
        if (this._isPegInCode(i, tmpCode, tmpPlayerCode))
          keys.push(SuperMisstressmind.KEY_PEGS[0]);
        else keys.push(SuperMisstressmind.EMPTY_PEGS.key);
      }
    });

    keys.sort((a, b) => a.priority > b.priority);

    return keys;
  }

  _isPegAtRightPos(i, code, playerCode) {
    if (playerCode[i] === this.code[i]) {
      playerCode[i] = null;
      code[i] = null;
      return true;
    }
    return false;
  }

  _isPegInCode(pos, code, playerCode) {
    return playerCode.some((_, i) => {
      if (playerCode[pos] === code[i]) {
        code[i] = null;
        playerCode[pos] = null;
        return true;
      }
      return false;
    });
  }

  _isGuessCorrect(keys) {
    return !keys.some(k => {
      return k.name !== SuperMisstressmind.KEY_PEGS[1].name;
    });
  }

  play(player, codeStr) {
    this._tries += 1;
    const code = this._convertInputIntoCode(codeStr);
    const keys = this._computeKeys(code);
    this.appendToHistory(player, code, keys);

    if (this._isGuessCorrect(keys)) {
      this.winner = player;
      return true;
    }
    return false;
  }
}
