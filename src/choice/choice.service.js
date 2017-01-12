export default ChoiceService;

/* ngInject */
function ChoiceService() {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _step = Symbol('step');

  class Choice {
    constructor(meta, step) {
      this[_step] = step;
      this[_meta] = angular.copy(meta);
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
