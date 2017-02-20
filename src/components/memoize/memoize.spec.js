import angular from 'angular';
import 'angular-mocks';
import 'angular-translate';
import memoizeMixinService from './memoize.service';
import _ from 'lodash';

describe('service: memoize', () => {
  let memoizeMixin;

  beforeEach(() => {
    angular.module('memoize', [])
      .service('memoizeMixin', memoizeMixinService);
    angular.mock.module('memoize');
  });

  beforeEach(angular.mock.inject(_memoizeMixin_ => {
    memoizeMixin = _memoizeMixin_;
  }));

  it('should create a memoize method in the new class', () => {
    class Foo {}
    const FooWithMemo = memoizeMixin(Foo);
    // Check classes
    expect(Foo.prototype.memoize).toBeUndefined();
    expect(FooWithMemo.prototype.memoize).toBeDefined();
  });

  it('should create a memoize method in the instances', () => {
    class Foo {}
    const FooWithMemo = memoizeMixin(Foo);
    // Instanciate foo and fooWithMemo
    const [foo, fooWithMemo] = [new Foo(), new FooWithMemo()];
    // Check classes
    expect(foo.memoize).toBeUndefined();
    expect(fooWithMemo.memoize).toBeDefined();
  });

  it('should memoize the result of the method', () => {
    class Foo {
      uniqueId() {
        this._id = (this._id || 0) + 1;
        return this._id;
      }
      bar(obj) {
        return this.memoize('bar', () => {
          // Create a unique object for this value
          return this.uniqueId();
        }, obj);
      }
    }
    const FooWithMemo = memoizeMixin(Foo);
    // Create an instance
    const foo = new FooWithMemo();
    // Should always be the same result (iterations are arbitrary)
    _.range(0, 10).forEach(() => expect(foo.bar('a')).toEqual(1));
    // Should always be the same result, but not with the new value
    _.range(0, 20).forEach(() => expect(foo.bar('b')).toEqual(2));
    // Should give the previous result
    _.range(0, 30).forEach(() => expect(foo.bar('a')).toEqual(1));
    // Even if the new value is not the same type
    _.range(0, 20).forEach(() => expect(foo.bar(foo)).toEqual(3));
  });
});
