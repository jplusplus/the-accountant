export default EndingService;

/** @ngInject */
function EndingService(I18n) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _game = Symbol('game');

  class Ending extends I18n {
    constructor(meta, game) {
      super(meta);
      this[_game] = game;
      this[_meta] = meta;
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
    get game() {
      return this[_game];
    }
    get condition() {
      return this[_meta].condition || {};
    }
  }
  return Ending;
}
