import _ from 'lodash';

export const mainVars = {
  template: require('./vars.html'),
  bindings: {
    game: '<'
  },
  /** @ngInject */
  controller(Chart) {
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
    // After the components have been initialized
    this.$onInit = () => {
      // For reference inside the charts
      const game = this.game;
      // Iterate over var's names
      this.chartsIds().forEach(id => {
        // Create a chart conf for this var
        this.charts[id] = new Chart(id, game);
      });
    };
  }
};
