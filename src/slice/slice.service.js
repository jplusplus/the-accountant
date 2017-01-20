export default SliceService;

/** @ngInject */
function SliceService() {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _step = Symbol('step');

  class Choice {
    constructor(meta, step) {
      this[_step] = step;
      this[_meta] = angular.copy(meta);
    }
    get text() {
      return this[_meta]['text@en'] || null;
    }
    get character() {
      return this[_meta].character;
    }
    get step() {
      return this[_step];
    }
  }
  return Choice;
}
