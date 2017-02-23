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
      this[_stack] = stack || {slices: [this]};
    }
    isYou() {
      return this.meta.character === 'you';
    }
    canClusterizeWith(other) {
      return this.type === other.type && this.character === other.character;
    }
    get readingTime() {
      // We start a new stack
      if (this.type === 'event') {
        // No reading time for the user's slices
        return 0;
      }
      // We read approximativly 200 words per minute
      const duration = (this.text || '').split(' ').length * 60 / 200 * 1000;
      // Reading time can't be under 700 milliseconds
      return Math.max(duration, 700);
    }
    get type() {
      if (!this.meta.character) {
        return 'event';
      }
      return 'chat';
    }
    get character() {
      return this.memoize('character', () => {
        // The slice may not have any character
        if (this.game && this.meta.character) {
          return _.find(this.game.characters, {key: this.meta.character});
        }
        return undefined;
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
