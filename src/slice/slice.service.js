export default SliceService;

/** @ngInject */
function SliceService(Character) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _parent = Symbol('parent');
  const _character = Symbol('character');

  class Slice {
    constructor(meta, parent) {
      this[_parent] = parent;
      this[_meta] = angular.copy(meta);
      this[_character] = new Character(this.meta.character);
    }
    get text() {
      return this[_meta]['text@en'] || null;
    }
    get character() {
      return this[_character];
    }
    get parent() {
      return this[_parent];
    }
    get index() {
      return this.parent.slices.indexOf(this);
    }
    get meta() {
      return this[_meta];
    }
  }
  return Slice;
}
