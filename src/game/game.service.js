export default gameService;
import _ from 'lodash';

/* ngInject */
function gameService($log, Step) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _vars = Symbol('vars');
  const _history = Symbol('history');

  class Game {
    constructor() {
      // Load meta data
      this[_meta] = angular.copy(require('./game.json'));
      // Build step using meta data
      this[_meta].steps = this[_meta].steps.map(meta => new Step(meta, this));
      // Prepare vars and party
      this.prepare();
      // Notice the user
      $log.info(`Starting game with ${this.steps.length} steps`);
    }
    prepare() {
      // Initialize vars
      this[_vars] = angular.copy(this[_meta].vars);
    }
    isCurrent(step) {
      return step.isCurrent();
    }
    get history() {
      // Instanciate history if needed
      this[_history] = this[_history] || [];
      // Return the array
      return this[_history];
    }
    get steps() {
      return this[_meta].steps;
    }
    get vars() {
      return this[_vars];
    }
    get stepIndex() {
      return this.history.length;
    }
    get step() {
      return this.steps[this.stepIndex];
    }
    get years() {
      return _(this.steps).map('year').compact().uniq().sort().value();
    }
  }
  return Game;
}
