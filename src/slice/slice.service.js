export default SliceService;

/** @ngInject */
function SliceService() {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _parent = Symbol('parent');

  class Choice {
    constructor(meta, parent) {
      this[_parent] = parent;
      this[_meta] = angular.copy(meta);
    }
    get text() {
      return this[_meta]['text@en'] || null;
    }
    get character() {
      return this[_meta].character;
    }
    get parent() {
      return this[_parent];
    }
  }
  return Choice;
}
