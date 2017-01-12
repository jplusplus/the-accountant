export default gameService;
import _ from 'lodash';

/* ngInject */
function gameService($log, Step, Var) {
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
      // Prepare vars according to choice's history
      this.apply();
      // Notice the user
      $log.info(`Starting game with ${this.steps.length} steps`);
    }
    isCurrent(step) {
      return step.isCurrent();
    }
    update(changes) {
      _.forEach(changes, (value, key) => {
        // Set the value accordingly
        this.var(key).update(value);
      });
    }
    var(name) {
      return _.find(this.vars, {name});
    }
    select(choice) {
      this.history.push(choice);
      // Apply changes
      this.update(choice.changes);
    }
    apply() {
      // Create new vars
      this[_vars] = _.map(this[_meta].vars, (value, name) => {
        return new Var(angular.extend({name}, value), this);
      });
      // Apply existing choices
      this.history.forEach(choice => this.update(choice.changes));
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
    get risks() {
      return _.filter(this.vars, {category: 'risk'});
    }
  }
  return Game;
}
