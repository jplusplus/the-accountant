export default CharacterService;

/** @ngInject */
function CharacterService() {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _game = Symbol('game');

  class Character {
    constructor(meta, game) {
      this[_game] = game;
      this[_meta] = angular.copy(meta);
    }
    get name() {
      return this[_meta]['name@en'] || null;
    }
    get game() {
      return this[_game];
    }
  }
  return Character;
}
