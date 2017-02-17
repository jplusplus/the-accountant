export default ChartService;
import _ from 'lodash';

/** @ngInject */
function ChartService($filter) {
  // Symbols declarion for private attributes and methods
  const _game = Symbol('game');
  const _memo = Symbol('memo');
  const _id = Symbol('id');

  class Chart {
    constructor(id, game) {
      this[_id] = id;
      this[_game] = game;
    }
    // Format tooltips name
    nameFormatFn(name) {
      return this.game.var(name).label;
    }
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
    // Format the value on x
    yFormatFn(value) {
      return `€${$filter('number')(value)}`;
    }
    get id() {
      return this[_id];
    }
    get vars() {
      // Get id for this var
      return _.filter(this.game.vars, {chartId: this.id});
    }
    get game() {
      return this[_game];
    }
    // From the first year seen the by the user to the last one
    get labels() {
      return _.range(_.first(this.game.years), this.game.year + 1);
    }
    // Collect value by year for the given var
    get valueByYear() {
      // Transform the array of var to an object of values
      return _.reduce(this.vars, (hash, desc) => {
        hash[desc.name] = _.reduce(this.game.history, (years, choice) => {
          const y = choice.step.year;
          // initialize value for this var using the previous year (if possible)
          years[y] = years[y] || years[y - 1] || this.game.meta.vars[desc.name].value;
          // Add the value of a given year
          years[y] += choice.changeFor(desc.name);
          // Return the value by year within a years
          return years;
        }, {});
        // Add a value for the current year
        hash[desc.name][this.game.year] = desc.value;
        // Return the hash
        return hash;
      }, {});
    }
    // An array of data for this var
    get data() {
      return this.memoize('data', () => {
        return _.reduce(this.valueByYear, (res, valueByYear, name) => {
          res[name] = _.values(valueByYear);
          return res;
        }, {});
      });
    }
  }
  return Chart;
}
