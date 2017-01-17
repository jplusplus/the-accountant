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
      return this[_meta].hasOwnProperty('feedback@en');
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
    get text() {
      return this[_meta]['text@en'] || null;
    }
    get feedback() {
      return this[_meta]['feedback@en'] || null;
    }
    get step() {
      return this[_step];
    }
  }
  return Choice;
}
