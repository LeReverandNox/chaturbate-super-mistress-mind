import Round from './Round';

export default class SuperMisstressmind {
  constructor(nbRounds) {
    this.nbRounds = nbRounds;
    this._currRound = 0;
    this.round = null;
    this._previousRounds = [];

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

  get lastTry() {
    return this.round.lastTry;
  }

  get currentWinner() {
    return this.round.winner;
  }

  get currentGoal() {
    return this.round.goal;
  }

  newRound(nbAvailablePegs, codeStr, goal) {
    if (this.round && !this.round.isOver)
      throw new Error(
        `The current round (${this.currRound} / ${this.nbRounds}) is not over.`,
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
    this._previousRounds.push(this.round);
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
