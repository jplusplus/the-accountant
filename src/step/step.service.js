export default StepService;
import _ from 'lodash';

/** @ngInject */
function StepService(Choice, $log) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _game = Symbol('game');
  const _choices = Symbol('choices');

  class Step {
    constructor(meta, game) {
      this[_game] = game;
      this[_meta] = angular.copy(meta);
      // Create choices
      this[_choices] = this[_meta].choices.map(meta => new Choice(meta, this));
    }
    hasCondition() {
      return this[_meta].hasOwnProperty('condition');
    }
    isCurrent() {
      return this.game.step === this;
    }
    select(choice) {
      this.game.select(choice);
      // Add info to the log
      $log.info('Step %s: choice %s', this.index, choice.index);
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
    get text() {
      return this[_meta]['text@en'];
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
