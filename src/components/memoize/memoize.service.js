export default memoizeMixinService;
import _ from 'lodash';

/** @ngInject */
function memoizeMixinService() {
  const _memo = Symbol('memo');
  const memoizeMixin = Base => class extends Base {
    memoize(name, fn, ...args) {
      // Create memo attribute
      this[_memo] = this[_memo] || {};
      // A memoize function already has been created
      if (this[_memo].hasOwnProperty(name)) {
        return this[_memo][name](...args);
      }
      this[_memo][name] = _.memoize(fn);
      // Recurcive call
      return this.memoize(name, fn, ...args);
    }
  };

  return memoizeMixin;
}
