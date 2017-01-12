export default gameService;
import _ from 'lodash';

/* ngInject */
function gameService($log, Step) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _vars = Symbol('vars');
  const _stepIndex = Symbol('stepIndex');

  class Game {
    constructor() {
      // Load meta data
      this[_meta] = require('./game.json');
      // Build step using meta data
      this[_meta].steps.map(meta => new Step(meta, this));
      // Prepare vars and party
      this.prepare();
      // Notice the user
      $log.info(`Starting game with ${this.steps.length} steps`);
    }
    get steps() {
      return this[_meta].steps;
    }
    get vars() {
      return this[_vars];
    }
    set stepIndex(index) {
      this[_stepIndex] = index;
    }
    get stepIndex() {
      return this[_stepIndex];
    }
    get step() {
      return this.steps[this.stepIndex];
    }
    get years() {
      return _(this.steps).map('year').compact().uniq().sort().value();
    }
    prepare() {
      // Initialize vars
      this[_vars] = angular.copy(this[_meta].vars);
      // Set current step to 0
      this.stepIndex = 0;
    }
  }
  return Game;
}
