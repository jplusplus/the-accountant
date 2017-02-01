export default I18nService;
import _ from 'lodash';

/** @ngInject */
function I18nService($translate) {
  const _memo = Symbol('memo');
  const _meta = Symbol('meta');
  const _fields = Symbol('fields');

  class I18n {
    constructor(meta) {
      // Hash to hold memoized results
      this[_memo] = {};
      // Metadata of this instance
      this[_meta] = meta;
      // Build field list
      this[_fields] = _.chain(this.meta)
        .keys()
        .filter(k => k.indexOf('@') > -1)
        .map(k => k.split('@')[0])
        .value();
    }
    translate(field) {
      // Return a specific field translated
      if (field) {
        return this.meta[`${field}@${this.use}`] || null;
      }
      // Return all fields translated
      return this.t;
    }
    memoize(name, fn, ...args) {
      if (this[_memo].hasOwnProperty(name)) {
        return this[_memo][name](...args);
      }
      this[_memo][name] = _.memoize(fn);
      // Recurcive call
      return this.memoize(name, fn, ...args);
    }
    // Translate all fields
    get t() {
      return this.memoize('t', () => {
        return _.reduce(this.fields, (res, field) => {
          res[field] = this.translate(field);
          return res;
        }, {});
      });
    }
    get fields() {
      return this[_fields];
    }
    get meta() {
      return this[_meta];
    }
    get use() {
      return $translate.use() || 'en';
    }
    // Some shortcut for common field names
    get title() {
      return this.translate('title');
    }
    get name() {
      return this.translate('name');
    }
    get content() {
      return this.translate('content');
    }
    get body() {
      return this.translate('body');
    }
    get text() {
      return this.translate('text');
    }
    get label() {
      return this.translate('label');
    }
  }

  return I18n;
}
