export default ChoiceService;
import _ from 'lodash';

/** @ngInject */
function ChoiceService(Slice, Stack) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _step = Symbol('step');
  const _consequences = Symbol('consequences');

  class Choice extends Stack {
    constructor(meta, step) {
      // Create slices using the parent constructor
      super(meta.feedback || []);
      // Set private properties
      this[_step] = step;
      this[_meta] = meta;
    }
    takeRisks() {
      // Create a list of risk vars that make the player loose
      this[_consequences] = _.filter(this.risks, risk => {
        return Math.random() * 20 <= risk.value;
      });
      // Return true if that choice has consequences
      return this.hasConsequences();
    }
    hasConsequences() {
      return this.consequences.length;
    }
    hasFeedback() {
      return this[_meta].hasOwnProperty('feedback') && Boolean(_.castArray(this.feedback).length);
    }
    undo() {
      this.slice = -1;
      // Undo the parent step
      _.without(this.step.game.stepsAhead, this.step).forEach(_.method('undo'));
    }
    continue() {
      return super.continue();
    }
    terminate() {
      this.finalSlice();
      this.step.terminate();
    }
    changeFor(name) {
      return this.changes[name] || 0;
    }
    // Risks related to that choices
    get risks() {
      return this.memoize('risk', () => {
        // Variables changed by this choice (the risk must be included)
        const changes = _.keys(this.changes);
        // Filter risks list to the one included in the changes
        return _.filter(this.step.game.risks, risk => {
          // Some risk may not be worth it, yet
          return changes.indexOf(risk.name) > -1 && risk.isWorthIt();
        });
      // Refresh after each journey invalidation
      }, this.step.game.journeyCacheKey);
    }
    get consequences() {
      return this[_consequences] || [];
    }
    get changes() {
      return this[_meta].var_changes || {};
    }
    get index() {
      return this.step.choices.indexOf(this);
    }
    get feedback() {
      return this.slices;
    }
    get step() {
      return this[_step];
    }
    get game() {
      return this.step.game;
    }
    get meta() {
      return this[_meta];
    }
  }
  return Choice;
}
