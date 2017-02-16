export const mainHints = {
  template: require('./hints.html'),
  bindings: {
    game: '<'
  },
  /** @ngInject */
  controller($stateParams) {
    this.isActive = explainer => {
      return $stateParams.ref === explainer.ref;
    };
  }
};
