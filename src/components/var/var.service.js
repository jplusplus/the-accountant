export default VarService;
import _ from 'lodash';

/** @ngInject */
function VarService(I18n) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _game = Symbol('game');

  class Var extends I18n {
    constructor(meta, game) {
      super(meta);
      this[_meta] = meta;
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
    isWorthIt() {
      return _.some(this.game.endingsFor(this.name), _.property('assert'));
    }
    isCharted() {
      return Boolean(this[_meta].chart);
    }
    get value() {
      return this[_meta].value;
    }
    get name() {
      return this[_meta].name;
    }
    get game() {
      return this[_game];
    }
    get category() {
      return this[_meta].category;
    }
    get private() {
      return this[_meta].private;
    }
    get icon() {
      return this[_meta].icon;
    }
    get public() {
      return !this.private;
    }
    get chartId() {
      return this[_meta].chart === true ? this.name : this[_meta].chart;
    }
    get cases() {
      return _.range(1, 11);
    }
  }
  return Var;
}
