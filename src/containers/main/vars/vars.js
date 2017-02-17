import _ from 'lodash';

export const mainVars = {
  template: require('./vars.html'),
  bindings: {
    game: '<'
  },
  /** @ngInject */
  controller() {
    // List of chart to render
    this.charts = {};
    // List of charted var
    this.chartedVars = () => {
      return _.filter(this.game.vars, _.method('isCharted'));
    };
    // List of chart ids
    this.chartsIds = () => {
      return _.chain(this.chartedVars()).map('chartId').uniq().value();
    };
  }
};
