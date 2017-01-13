export default gameService;
import _ from 'lodash';

/** @ngInject */
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
    isOver() {
      return _.some(this.history, _.method('hasConsequences'));
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
      // Take risk according to the current variables
      if (choice.takeRisks()) {
        // We loose!
        $log.info('Losing causes: %s', choice.consequences.join(', '));
      }
    }
    apply() {
      // Create new vars
      this[_vars] = _.map(this[_meta].vars, (value, name) => {
        return new Var(angular.extend({name}, value), this);
      });
      // Apply existing choices
      this.history.forEach(choice => this.update(choice.changes));
    }
    // LList of choices made by the player
    get history() {
      // Instanciate history if needed
      this[_history] = this[_history] || [];
      // Return the array
      return this[_history];
    }
    // List of step seen or currently seen by the player
    get journey() {
      // Collect step from history step
      const steps = _.map(this.history, _.property('step'));
      // Start index
      const from = steps.length ? _.last(steps).index + 1 : 0;
      // Find the next step
      steps.push(_.find(this.steps.slice(from), {assert: true}));
      // Return the steps
      return steps;
    }
    get vars() {
      return this[_vars];
    }
    get stepIndex() {
      return this.step.index;
    }
    get steps() {
      return _.filter(this[_meta].steps);
    }
    get step() {
      return this.isOver() ? null : _.last(this.journey);
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
