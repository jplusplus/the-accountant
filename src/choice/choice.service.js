export default ChoiceService;
import _ from 'lodash';

/** @ngInject */
function ChoiceService() {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _step = Symbol('step');
  const _consequences = Symbol('consequences');

  class Choice {
    constructor(meta, step) {
      this[_step] = step;
      this[_meta] = angular.copy(meta);
    }
    takeRisks() {
      // Create a list of risk vars that make the player loose
      this[_consequences] = _.filter(this.step.game.risks, risk => {
        return Math.random() * 20 <= risk.value;
      });
      // Return true if that choice has consequences
      return this.hasConsequences();
    }
    hasConsequences() {
      return this.consequences.length;
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
    get text() {
      return this[_meta]['text@en'];
    }
    get step() {
      return this[_step];
    }
  }
  return Choice;
}
