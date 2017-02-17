export const chart = {
  template: require('./chart.html'),
  bindings: {
    game: '<',
    id: '<chartId'
  },
  /** @ngInject */
  controller(Chart) {
    this.$onInit = () => {
      // Create the chart
      this.chart = new Chart(this.id, this.game);
    };
  }
};
