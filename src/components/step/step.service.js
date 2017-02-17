export default StepService;
import _ from 'lodash';

/** @ngInject */
function StepService(Choice, Slice, Stack, I18n, Explainer, $rootScope, $log) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _game = Symbol('game');

  class Step extends Stack {
    constructor(meta, game) {
      // Create slices using the parent constructor
      super(meta.texts, game);
      // Set private properties
      this[_game] = game;
      this[_meta] = meta;
      // Ensure those method arround bound to the current instance
      ['select', 'isCurrent', 'hasCondition', 'undo', 'displayHelper', 'continue'].forEach(m => {
        this[m] = this[m].bind(this);
      });
    }
    hasCondition() {
      return this[_meta].hasOwnProperty('condition');
    }
    hasExplainer() {
      return this.hasHelper();
    }
    hasHelper() {
      return this[_meta].hasOwnProperty('helper');
    }
    displayHelper() {
      return this.isLastSlice() && this.hasHelper() && !this.selection;
    }
    isPrevious() {
      return this === this.game.journey.slice(-2)[0];
    }
    isCurrent() {
      return this.game.step === this;
    }
    isDone() {
      return (
        // Reach the last slice for this stack
        this.isLastSlice() &&
        // Has a selection (which is a stack)
        Boolean(this.selection) &&
        // Reach the last slice for the selection's feedback
        this.selection.isLastSlice()
      );
    }
    finalSlice() {
      super.finalSlice();
      this.game.invalidateJourney();
    }
    terminate() {
      this.selection.finalSlice();
      this.finalSlice();
    }
    select(choiceOrIndex = 0) {
      // Jump to the final slice of this stack
      this.finalSlice();
      // Get the choice with an index (if needed)
      const choice = isNaN(choiceOrIndex) ? choiceOrIndex : this.choices[choiceOrIndex];
      // Propagate the choice to the game
      this.game.select(choice);
      // Start from the begining of the choice slice
      choice.slice = -1;
      // Add info to the log
      $log.info('Step %s: choice %s', this.index, choice.index);
      // Return the choice for better chhain
      return this.selection;
    }
    continue() {
      super.continue();
      // Broadcast the event about this slice
      $rootScope.$broadcast('game:step:slice:next', this);
    }
    undo() {
      this.slice = -1;
    }
    isTyping() {
      return Boolean(!this.selection && super.isTyping());
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
      return this.memoize('choices', () => {
        // Create choices
        return _.chain(this[_meta].choices).castArray().compact().map(meta => {
          return new Choice(meta, this);
        }).value();
      });
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
    get explainer() {
      return this.memoize('explainer', () => {
        if (this.hasExplainer()) {
          // Iterate over helper's slices to find entity
          const entity = _.chain(this.helper.slices).map(slice => {
            return Explainer.parse(slice.text);
          // Get the first value (if any)
          }).flatten().first().value();
          // Has entity?
          if (entity) {
            // Create an explainer with this entity
            return new Explainer(this.game.meta.explainers[entity.ref], entity.ref, this);
          }
        }
        // There is none
        return null;
      });
    }
    get helper() {
      return this.memoize('helper', () => {
        return this.hasHelper() ? new Stack(this[_meta].helper, this) : null;
      });
    }
  }
  return Step;
}
