import _ from 'lodash';
export default SlicableService;

/** @ngInject */
function SlicableService(Slice) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _slice = Symbol('slice');
  const _slices = Symbol('slices');
  const _clusters = Symbol('clusters');

  class Slicable {
    constructor(meta) {
      this[_meta] = angular.copy(meta);
      // Create slices
      this[_slices] = _.castArray(this[_meta]).map(slice => new Slice(slice, this));
      // Start before 0 (ie no slice)
      this[_slice] = -1;
      // Ensure those method arround bound to the current instance
      ['nextSlice', 'isLastSlice', 'clusterFilter', 'sliceFilter'].forEach(m => {
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
    clusterFilter(cluster, index) {
      return cluster.slices.length * index <= this.slice;
    }
    sliceFilter(slice) {
      return slice.index <= this.slice;
    }
    // Express reading time of the current slice in milliseconds
    get readingTime() {
      if (this.lastSlice !== null) {
        // We read approximativly 270 word per minute
        return this.lastSlice.text.split(' ').length * 60 / 270 * 1000;
      }
      // Default duration
      return 1200;
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
    // We regroup slices by "cluster" meaning they are regroupped by
    // successive slices of the same character.
    get clusters() {
      if (this[_clusters]) {
        return this[_clusters];
      }
      // Initialize clusters list
      this[_clusters] = [];
      // Iterates over ever slices
      this.slices.forEach(slice => {
        // Get last cluster
        const last = _.last(this[_clusters]);
        // Is there any cluster and is it the same character?
        if (last && last.character.key === slice.character.key) {
          // Add this slice
          last.slices.push(slice);
        // No cluster or a different character
        } else {
          // Create a cluster using the current slice
          this[_clusters].push({
            character: slice.character,
            slices: [slice]
          });
        }
      });
      return this[_clusters];
    }
  }
  return Slicable;
}
