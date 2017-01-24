export default CharacterService;

/** @ngInject */
function CharacterService() {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _key = Symbol('key');

  class Character {
    constructor(key) {
      // Load meta data
      const game = require('../game/game.json');
      // Save the character key
      this[_key] = key;
      // Retreive meta within the game
      this[_meta] = angular.copy(game.characters[key]);
    }
    get key() {
      return this[_key];
    }
    get name() {
      return this[_meta]['name@en'] || null;
    }
    get title() {
      return this[_meta]['title@en'] || null;
    }
    get avatar() {
      return this[_meta].avatar || `//api.adorable.io/avatars/18/${this.key}.png`;
    }
  }
  return Character;
}
