export default EndingService;

/** @ngInject */
function EndingService() {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _game = Symbol('game');

  class Ending {
    constructor(meta, game) {
      this[_game] = game;
      this[_meta] = angular.copy(meta);
    }
    hasCondition() {
      return this[_meta].hasOwnProperty('condition');
    }
    get assert() {
      // Minimum value condition
      if (this.condition.hasOwnProperty('min')) {
        return this.var.value >= this.condition.min;
      // Maximum value condition
      } else if (this.condition.hasOwnProperty('max')) {
        return this.var.value <= this.condition.max;
      }
      // No condition (or unkown)
      return true;
    }
    get var() {
      return this.game.var(this.condition.var);
    }
    get index() {
      return this.game.endings.indexOf(this);
    }
    get text() {
      return this[_meta]['text@en'] || null;
    }
    get game() {
      return this[_game];
    }
    get condition() {
      return this[_meta].condition || {};
    }
  }
  return Ending;
}
