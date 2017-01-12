export default VarService;

/** @ngInject */
function VarService() {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _game = Symbol('game');

  class Var {
    constructor(meta, game) {
      this[_meta] = angular.copy(meta);
      this[_game] = game;
    }
    update(value) {
      switch (this.category) {
        case 'choice':
          this[_meta].value = value;
          break;
        default:
          this[_meta].value += value;
          break;
      }
    }
    toString() {
      return this.name;
    }
    get value() {
      return this[_meta].value;
    }
    get label() {
      return this[_meta]['label@en'] || this[_meta].name;
    }
    get name() {
      return this[_meta].name;
    }
    get category() {
      return this[_meta].category;
    }
  }
  return Var;
}
