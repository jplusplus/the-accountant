import _ from 'lodash';

export const mainVars = {
  template: require('./vars.html'),
  bindings: {
    game: '<'
  },
  /** @ngInject */
  controller($filter) {
    // List of chart to render
    this.charts = {};
    // After the components have been initialized
    this.$onInit = () => {
      // Iterate over var's names
      ['personal_account'].forEach(name => {
        // Create a chart conf for this var
        this.charts[name] = {
          // From the first year seen the by the user to the last one
          labels: _.range(_.first(this.game.years), this.game.year),
          // Format tooltips name
          nameFormatFn: name => {
            return this.game.var(name).label;
          },
          // Format the value on x
          yFormatFn: value => {
            return String.concat('€', $filter("number")(value));
          },
          // An array of data for this var
          data: _.chain(this.game.history).reduce((hash, choice) => {
            const y = choice.step.year;
            // initialize value for this var
            hash[y] = hash[y] || this.game.var(name).value;
            // Add the value of a given year
            hash[y] += choice.changeFor(name);
            // Return the value by year within a hash
            return hash;
          }, {}).values().value()
        };
      });
    };
  }
};
