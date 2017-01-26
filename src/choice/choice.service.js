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
      this[_meta] = angular.copy(meta);
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
      return this[_meta].hasOwnProperty('feedback');
    }
    undo() {
      this.slice = -1;
      // Undo the parent step
      _.without(this.step.game.stepsAhead, this.step).forEach(_.method('undo'));
    }
    nextSlice() {
      return super.nextSlice();
    }
    // Risks related to that choices
    get risks() {
      // Variables changed by this choice (the risk must be included)
      const changes = _.keys(this.changes);
      // Filter risks list to the one included in the changes
      return _.filter(this.step.game.risks, risk => {
        // Some risk may not be worth it, yet
        return changes.indexOf(risk.name) && risk.isWorthIt();
      });
    }
    get consequences() {
      return this[_consequences] || [];
    }
    get changes() {
      return this[_meta].var_changes;
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
    get meta() {
      return this[_meta];
    }
  }
  return Choice;
}
