export default gameService;
import _ from 'lodash';

/** @ngInject */
function gameService($log, $rootScope, Step, Var, Ending) {
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
      // Build step using meta data
      this[_meta].endings = this[_meta].endings.map(meta => new Ending(meta, this));
      // Prepare vars according to choice's history
      this.apply();
      // Ensure those method arround bound to the current instance
      ['nextSlice'].forEach(m => {
        this[m] = this[m].bind(this);
      });
      // Notice the user
      $log.info(`Starting game with ${this.steps.length} steps`);
      // And broadcast a starting event
      $rootScope.$broadcast('game:start', this);
    }
    isCurrent(step) {
      return step.isCurrent();
    }
    isOver() {
      return _.some(this.history, _.method('hasConsequences')) || !this.hasStepsAhead();
    }
    isFirstYear() {
      return this.year === _.first(this.years);
    }
    hasFeedback() {
      return this.history.length ? _.last(this.history).hasFeedback() : false;
    }
    hasStepsAhead() {
      return this.stepsAhead.length > 0;
    }
    hasStepsBehind() {
      return this.stepsBehind.length > 0;
    }
    allowsNextSlice() {
      return this.step !== null && !this.targetSlice.isLastSlice();
    }
    hasHints() {
      return this.hints.length > 0;
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
    endingsFor(name) {
      return _.filter(this.endingsWithVar, ending => ending.var.name === name);
    }
    select(choice) {
      // Avoid adding a choice twice
      if (this.history.indexOf(choice) > -1) {
        return;
      }
      this.history.push(choice);
      // Apply changes
      this.update(choice.changes);
      // Take risk according to the current variables
      if (choice.takeRisks()) {
        // We loose!
        $log.info('Losing causes: %s', choice.consequences.join(', '));
      }
      // Send event to the root scope
      $rootScope.$broadcast('game:selection', choice);
    }
    undo() {
      // Remove the last choice
      const choice = this.history.pop();
      // Reset the current step's slice
      choice.undo();
      // And apply the whole history
      this.apply();
      // Send event to the root scope
      $rootScope.$broadcast('game:undo', choice);
    }
    apply() {
      // Create new vars
      this[_vars] = _.map(this[_meta].vars, (value, name) => {
        return new Var(angular.extend({name}, value), this);
      });
      // Apply existing choices
      this.history.forEach(choice => this.update(choice.changes));
    }
    nextSlice() {
      this.targetSlice.nextSlice();
      // Emit an event
      $rootScope.$broadcast("game:slice:next", this.targetSlice);
    }
    finalSlice() {
      return this.targetSlice.finalSlice();
    }
    findPicture(lastYear = this.step.year) {
      // Find the closest years
      const year = _.chain(this.pictures).keys().sort().findLast(y => {
        return y <= lastYear;
      });
      // Return the picture for this year
      return this.pictures[year];
    }
    get readingTime() {
      return this.targetSlice.readingTime;
    }
    get targetSlice() {
      // Next slice within the step's selection
      if (this.step.selection && this.step.isLastSlice()) {
        return this.step.selection;
      }
      // Next slice within the step by default
      return this.step;
    }
    get slice() {
      if (this.step.selection) {
        return this.step.slice + this.step.selection.slice;
      }
      return this.step.slice;
    }
    get feedback() {
      return this.hasFeedback() ? _.last(this.history).feedback : null;
    }
    get consequences() {
      return _(this.history).map('consequences').flatten().uniq().value();
    }
    // List of choices made by the player
    get history() {
      // Instanciate history if needed
      this[_history] = this[_history] || [];
      // Return the array
      return this[_history];
    }
    // List of step seen or currently seen by the player
    get journey() {
      // Do not add any step if the party is over
      if (this.isOver()) {
        // Get only steps from the past
        return this.stepsBehind;
      }
      // Get steps from the past and the first ahead
      return this.stepsBehind.concat(this.stepsAhead.slice(0, 1));
    }
    get vars() {
      return this[_vars];
    }
    get stepIndex() {
      return this.step.index;
    }
    get steps() {
      return this[_meta].steps;
    }
    get end() {
      // Did we had consequences?
      if (this.consequences.length) {
        // Get the last ending for the last consequence
        return _.last(this.endingsFor(_.last(this.consequences).name));
      }
      // Last ending is the default
      return _.last(this.endings);
    }
    get endings() {
      return this[_meta].endings;
    }
    get endingsWithVar() {
      return _.filter(this.endings, _.method('hasCondition'));
    }
    get stepsBehind() {
      // Collect step from history step that are done
      return _.chain(this.history).map('step').filter(_.method('isDone')).value();
    }
    get stepsAhead() {
      const steps = this.stepsBehind;
      // Start index
      const from = steps.length ? _.last(steps).index + 1 : 0;
      // Step must be valid
      return _.filter(this.steps.slice(from), {assert: true});
    }
    get step() {
      return this.isOver() ? null : _.last(this.journey);
    }
    get year() {
      return this.step && this.step.year;
    }
    get years() {
      return _(this.steps).map('year').compact().uniq().sort().value();
    }
    get pictures() {
      return this[_meta].years;
    }
    get picture() {
      return this.findPicture();
    }
    get risks() {
      return _.filter(this.vars, {category: 'risk'});
    }
    get publicRisks() {
      return _.filter(this.vars, {category: 'risk', public: true});
    }
    get publicVars() {
      return _.filter(this.vars, {public: true});
    }
    get hints() {
      // Get all past steps that reach the last slice (before selection)
      const withSelection = _.chain(this.journey).filter(_.method('isLastSlice'));
      // Extract the hint
      return withSelection.map('hint').compact().uniqBy(h => h.title).value();
    }
    get lastHint() {
      if (this.step && this.step.hasHint()) {
        return this.step.hint;
      }
    }
  }
  return Game;
}
