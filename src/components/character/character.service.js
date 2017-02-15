export default CharacterService;

/** @ngInject */
function CharacterService(I18n) {
  // Symbols declarion for private attributes and methods
  const _key = Symbol('key');

  class Character extends I18n {
    constructor(meta, key) {
      // Call the parent constructor with the right meta
      super(meta);
      // Save the character key
      this[_key] = key;
    }
    toString() {
      return this.key;
    }
    get key() {
      return this[_key];
    }
    get avatar() {
      return this.meta.avatar || `//api.adorable.io/avatars/18/${this.key}.png`;
    }
  }
  return Character;
}
