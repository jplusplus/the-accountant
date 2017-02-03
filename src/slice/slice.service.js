import _ from 'lodash';
export default SliceService;

/** @ngInject */
function SliceService(I18n) {
  // Symbols declarion for private attributes and methods
  const _stack = Symbol('stack');

  class Slice extends I18n {
    constructor(meta, stack) {
      super(meta);
      // Create private properties
      this[_stack] = stack;
    }
    isYou() {
      return this.character && this.character.key === 'you';
    }
    canClusterizeWith(other) {
      return this.type === other.type && this.character === other.character;
    }
    get readingTime() {
      // We start a new stack
      if (this.type === 'event' || this.isYou()) {
        // No reading time for the user's slices
        return 0;
      }
      // We read approximativly 270 word per minute
      const duration = this.text.split(' ').length * 60 / 270 * 1000;
      // Reading time can't be under 700 milliseconds
      return Math.max(duration, 700);
    }
    get type() {
      if (!this.character) {
        return 'event';
      }
      return 'chat';
    }
    get character() {
      return this.memoize('character', () => {
        // The slice may not have any character
        return _.find(this.game.characters, {key: this.meta.character});
      });
    }
    get stack() {
      return this[_stack];
    }
    get game() {
      return this.stack.game;
    }
    get index() {
      return this.stack.slices.indexOf(this);
    }
  }
  return Slice;
}
