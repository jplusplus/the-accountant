import _ from 'lodash';

export const mainVars = {
  template: require('./vars.html'),
  bindings: {
    game: '<'
  },
  controller() {
    this.$onInit = () => {
      this.chart = {
        labels: _.range(_.first(this.game.years), this.game.year),
        series: ['personal_account'],
        data: [
          _.chain(this.game.history).reduce((hash, choice) => {
            const y = choice.step.year;
            hash[y] = hash[y] || this.game.var('personal_account').value;
            hash[y] += choice.changeFor('personal_account');
            return hash;
          }, {}).values().value()
        ]
      };
    };
  }
};
