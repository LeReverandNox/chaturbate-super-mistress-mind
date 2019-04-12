import Config from './Config';
import Round from './Round';

export default class SuperMisstressmind {
  static get EMPTY_PEGS() {
    return {
      code: {
        name: 'code-empty',
        image: `:${Config.IMAGE_PREFIX}-code-empty`,
        color: '#000000',
      },
      key: {
        name: 'key-empty',
        image: `:${Config.IMAGE_PREFIX}-key-empty`,
        color: '#000000',
        priority: 2,
      },
    };
  }

  static get CODE_PEGS() {
    return {
      W: {
        name: 'white',
        image: `:${Config.IMAGE_PREFIX}-white`,
        color: '#FFFFFF',
      },
      R: {
        name: 'red',
        image: `:${Config.IMAGE_PREFIX}-red`,
        color: '#FF0000',
      },
      B: {
        name: 'blue',
        image: `:${Config.IMAGE_PREFIX}-blue`,
        color: '#0000FF',
      },
      G: {
        name: 'green',
        image: `:${Config.IMAGE_PREFIX}-green`,
        color: '#008000',
      },
      V: {
        name: 'violet',
        image: `:${Config.IMAGE_PREFIX}-violet`,
        color: '#8000FF',
      },
      O: {
        name: 'orange',
        image: `:${Config.IMAGE_PREFIX}-orange`,
        color: '#FFA500',
      },
      Y: {
        name: 'yellow',
        image: `:${Config.IMAGE_PREFIX}-yellow`,
        color: '##fFFF00',
      },
      M: {
        name: 'maroon',
        image: `:${Config.IMAGE_PREFIX}-maroon`,
        color: '#8b4513',
      },
      P: {
        name: 'pink',
        image: `:${Config.IMAGE_PREFIX}-pink`,
        color: '##FF69B4',
      },
      C: {
        name: 'cyan',
        image: `:${Config.IMAGE_PREFIX}-cyan`,
        color: '##00ffff',
      },
      L: {
        name: 'lime',
        image: `:${Config.IMAGE_PREFIX}-lime`,
        color: '##00ff00',
      },
    };
  }

  static get KEY_PEGS() {
    return [
      {
        name: 'white',
        image: `:${Config.IMAGE_PREFIX}-key-white`,
        color: '#FFFFFF',
        priority: 1,
      },
      {
        name: 'red',
        image: `:${Config.IMAGE_PREFIX}-key-red`,
        color: '#FF0000',
        priority: 0,
      },
    ];
  }

  static get PEG_LETTERS() {
    return Object.keys(SuperMisstressmind.CODE_PEGS);
  }

  static get NB_PEGS() {
    return SuperMisstressmind.PEG_LETTERS.length;
  }

  constructor(nbRounds) {
    this.nbRounds = nbRounds;
    this._currRound = 0;
    this.round = null;
    this.previousRounds = [];

    this.isPaused = false;
    this.isGameOver = false;
  }

  get nbRounds() {
    return this._nbRounds;
  }

  set nbRounds(n) {
    if (n < 1)
      throw new Error(
        `A game can't have less than one round. Please start over the game with a correct value`,
      );
    this._nbRounds = n;
    return this.nbRounds;
  }

  get currRound() {
    return this._currRound;
  }

  newRound(nbAvailablePegs, codeStr, goal) {
    if (this.round && !this.round.isOver)
      throw new Error(
        `The current round (${this.currRound} / ${this.nbRounds} is not over.`,
      );
    if (this.isGameOver)
      throw new Error(
        `The game is over. Please start a new one if you want to play some more.`,
      );

    this.round = new Round(nbAvailablePegs, codeStr, goal);
    this._currRound += 1;

    return `Round #${this.currRound} of ${this.nbRounds} has started.`;
  }

  endRound() {
    if (!this.round) throw new Error(`There is currently no round playing.`);
    this.previousRounds.push(this.round);
    this.round.end();
    if (this.currRound === this.nbRounds) this.isGameOver = true;
  }

  play(player, codeStr = '') {
    if (this.isPaused) throw new Error(`The game is paused.`);
    if (this.isGameOver) throw new Error(`The game is over.`);
    if (!this.round)
      throw new Error(`The round is not started yet. Please be patient`);
    if (this.round && this.round.isOver) throw new Error(`The round is over.`);

    const win = this.round.play(player, codeStr);
    if (win) this.endRound();
    return win;
  }

  pause() {
    if (this.isGameOver) throw new Error(`The game is over.`);
    this.isPaused = !this.isPaused;

    return `The game is now ${this.isPaused ? '' : 'un-'}paused`;
  }
}
