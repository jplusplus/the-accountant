import _ from 'lodash';
export default StackService;

/** @ngInject */
function StackService(Slice, I18n) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _slice = Symbol('slice');
  const _slices = Symbol('slices');
  const _clusters = Symbol('clusters');

  class Stack extends I18n {
    constructor(meta) {
      super(meta);
      this[_meta] = angular.copy(meta);
      // Create slices
      this[_slices] = _.castArray(this[_meta]).map(slice => new Slice(slice, this));
      // Start before 0 (ie no slice)
      this[_slice] = -1;
      // Ensure those method arround bound to the current instance
      ['continue', 'isLastSlice', 'clusterFilter', 'sliceFilter'].forEach(m => {
        this[m] = this[m].bind(this);
      });
    }
    isStartingSlice() {
      return this.slice === -1;
    }
    isFirstSlice() {
      return this.slice === 0;
    }
    isLastSlice() {
      return this.slice === this.slices.length - 1;
    }
    continue() {
      this.slice++;
    }
    finalSlice() {
      this.slice = this.slices.length - 1;
    }
    clusterFilter(cluster, index) {
      // Clusters before this one
      const previous = this.clusters.slice(0, index);
      // Count seen slices within those clusters
      const seen = _.chain(previous).map('slices.length').sum().value();
      // Display this cluster
      return seen <= this.slice;
    }
    sliceFilter(slice) {
      return slice.index <= this.slice;
    }
    isTyping() {
      return this.next && !this.next.isYou();
    }
    // Express reading time of the current slice in milliseconds
    get readingTime() {
      return this.current ? this.current.readingTime : 0;
    }
    set slice(val) {
      this[_slice] = Math.max(-1, Math.min(this.slices.length - 1, val));
    }
    get slice() {
      return this[_slice];
    }
    get next() {
      return this.slices[this.slice + 1] || null;
    }
    get previous() {
      return this.slices[this.slice - 1] || null;
    }
    get current() {
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
        if (last && slice.canClusterizeWith(last)) {
          // Add this slice
          last.slices.push(slice);
        // No cluster or a different character
        } else {
          // Create a cluster using the current slice
          this[_clusters].push({
            character: slice.character,
            type: slice.type,
            slices: [slice]
          });
        }
      });
      return this[_clusters];
    }
  }
  return Stack;
}