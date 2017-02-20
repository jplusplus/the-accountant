export default ChartService;
import _ from 'lodash';

/** @ngInject */
function ChartService($filter, I18n, memoizeMixin) {
  // Symbols declarion for private attributes and methods
  const _game = Symbol('game');
  const _id = Symbol('id');

  class Chart {
    constructor(id, game) {
      this[_id] = id;
      this[_game] = game;
    }
    // Format tooltips name
    nameFormatFn(name) {
      return this.memoize('nameFormatFn', name => {
        return (this.game.var(name) || {}).label || name;
      }, name);
    }
    hasLegend() {
      return this.vars.length > 1;
    }
    // Format the value on x
    yFormatFn(value) {
      return $filter('number')(value);
    }
    get paddingRight() {
      return this.hasLegend() ? null : 15;
    }
    get i18n() {
      return this.memoize('i18n', () => {
        if (this.game.meta.charts && this.game.meta.charts[this.id]) {
          return new I18n(this.game.meta.charts[this.id]);
        }
      });
    }
    get title() {
      return this.i18n ? this.i18n.title : _.map(this.vars, 'label').join(', ');
    }
    get description() {
      return this.i18n ? this.i18n.description : null;
    }
    get id() {
      return this[_id];
    }
    get vars() {
      return this.memoize('vars', () => {
      // Get id for this var
        return _.filter(this.game.vars, {chartId: this.id});
      });
    }
    get game() {
      return this[_game];
    }
    // From the first year seen the by the user to the last one
    get labels() {
      return this.memoize('labels', () => {
        return _.range(_.first(this.game.years), this.game.year + 1);
      });
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
  return memoizeMixin(Chart);
}
