import _ from 'lodash';
export default SlicableService;

/** @ngInject */
function SlicableService(Slice) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _slice = Symbol('slice');
  const _slices = Symbol('slices');

  class Slicable {
    constructor(meta) {
      this[_meta] = angular.copy(meta);
      // Create slices
      this[_slices] = _.castArray(this[_meta]).map(slice => new Slice(slice, this));
      // Start before 0 (ie no slice)
      this[_slice] = -1;
      // Ensure those method arround bound to the current instance
      ['nextSlice', 'isLastSlice'].forEach(m => {
        this[m] = this[m].bind(this);
      });
    }
    isLastSlice() {
      return this.slice === this.slices.length - 1;
    }
    nextSlice() {
      this.slice = this.slice + 1;
    }
    finalSlice() {
      this.slice = this.slices.length - 1;
    }
    // Express reading time of the current slice in milliseconds
    get readingTime() {
      if (this.lastSlice !== null) {
        // We read approximativly 270 word per minute
        return this.lastSlice.text.split(' ').length * 60 / 270 * 1000;
      }
      // Default duration
      return 0;
    }
    set slice(val) {
      this[_slice] = Math.max(0, Math.min(this.slices.length - 1, val));
    }
    get slice() {
      return this[_slice];
    }
    get lastSlice() {
      return this.slices[this.slice] || null;
    }
    get slices() {
      return this[_slices];
    }
  }
  return Slicable;
}
