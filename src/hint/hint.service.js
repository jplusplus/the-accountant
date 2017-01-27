export default HintService;

/** @ngInject */
function HintService(I18n) {
  // Symbols declarion for private attributes and methods
  const _open = Symbol('open');
  const _step = Symbol('step');

  class Hint extends I18n {
    constructor(meta, step) {
      super(meta);
      // Create private properties
      this[_step] = step;
      this[_open] = false;
    }
    isOpen() {
      return this[_open] && this.step.displayHint();
    }
    toggle() {
      this[_open] = !this[_open];
    }
    close() {
      this[_open] = false;
    }
    open() {
      this[_open] = true;
    }
    get step() {
      return this[_step];
    }
  }
  return Hint;
}
