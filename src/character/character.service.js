export default CharacterService;
import game from '../game/game.json';

/** @ngInject */
function CharacterService(I18n) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _key = Symbol('key');

  class Character extends I18n {
    constructor(key) {
      // Load meta data
      // Call the parent constructor with the right meta
      super(game.characters[key]);
      // Save the character key
      this[_key] = key;
      // Retreive meta within the game
      this[_meta] = game.characters[key];
    }
    toString() {
      return this.key;
    }
    get key() {
      return this[_key];
    }
    get avatar() {
      return this[_meta].avatar || `//api.adorable.io/avatars/18/${this.key}.png`;
    }
  }
  return Character;
}
