export default SliceService;

/** @ngInject */
function SliceService(Character, I18n) {
  // Symbols declarion for private attributes and methods
  const _parent = Symbol('parent');
  const _character = Symbol('character');

  class Slice extends I18n {
    constructor(meta, parent) {
      super(meta);
      // Create private properties
      this[_parent] = parent;
      // The slice may not have any character
      if (this.meta.hasOwnProperty('character') && this.meta.character !== null) {
        this[_character] = new Character(this.meta.character);
      }
    }
    isYou() {
      return this.character.key === 'you';
    }
    canClusterizeWith(other) {
      return this.type === other.type && this.character.key === other.character.key;
    }
    get type() {
      if (!this.character) {
        return 'event';
      }
      return 'chat';
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
  }
  return Slice;
}
