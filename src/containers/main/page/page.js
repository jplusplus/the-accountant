export const mainPage = {
  template: require('./page.html'),
  bindings: {
    markdown: '<'
  },
  /** @ngInject */
  controller($state, $scope) {
    const refresh = (ev, use) => {
      // Reload the state to update content
      $state.go('main.page', use, {reload: true});
    };
    this.$onInit = () => {
      // Language change
      $scope.$on('$translateChangeSuccess', refresh);
    };
  }
};
