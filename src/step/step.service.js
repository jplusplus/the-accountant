export default StepService;
import _ from 'lodash';

/** @ngInject */
function StepService(Choice, Slice, Slicable, $rootScope, $log) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _game = Symbol('game');
  const _choices = Symbol('choices');

  class Step extends Slicable {
    constructor(meta, game) {
      // Create slices using the parent constructor
      super(meta.texts);
      // Set private properties
      this[_game] = game;
      this[_meta] = angular.copy(meta);
      // Create choices
      this[_choices] = this[_meta].choices.map(meta => new Choice(meta, this));
      // Ensure those method arround bound to the current instance
      ['select', 'isCurrent', 'hasCondition', 'undo'].forEach(m => {
        this[m] = this[m].bind(this);
      });
    }
    hasCondition() {
      return this[_meta].hasOwnProperty('condition');
    }
    isPrevious() {
      return this === this.game.journey.slice(-2)[0];
    }
    isCurrent() {
      return this.game.step === this;
    }
    isDone() {
      return this.isLastSlice() && this.selection && this.selection.isLastSlice();
    }
    select(choice = _.last(this.choices)) {
      this.game.select(choice);
      // Add info to the log
      $log.info('Step %s: choice %s', this.index, choice.index);
    }
    nextSlice() {
      super.nextSlice();
      // Broadcast the event about this slice
      $rootScope.$broadcast('game:step:slice:next', this);
    }
    undo() {
      this.slice = -1;
    }
    get assert() {
      // Minimum value condition
      if (this.condition.hasOwnProperty('min')) {
        return this.game.var(this.condition.var).value >= this.condition.min;
      // Maximum value condition
      } else if (this.condition.hasOwnProperty('max')) {
        return this.game.var(this.condition.var).value <= this.condition.max;
      }
      // No condition (or unkown)
      return true;
    }
    get choices() {
      return this[_choices];
    }
    get selection() {
      return _.find(this.game.history, {step: this});
    }
    get index() {
      return this.game.steps.indexOf(this);
    }
    get year() {
      return Number(this[_meta].year);
    }
    get game() {
      return this[_game];
    }
    get condition() {
      return this[_meta].condition || {};
    }
  }
  return Step;
}
