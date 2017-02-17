export const mainHints = {
  template: require('./hints.html'),
  bindings: {
    game: '<'
  },
  /** @ngInject */
  controller($stateParams, $document, $timeout) {
    this.isActive = explainer => {
      return $stateParams.ref === explainer.ref;
    };
    // After data have been bound
    this.$onInit = () => {
      // Is there any active element?
      if ($stateParams.ref) {
        // Wait for the dom to be rendered
        $timeout(this.scrollToRef);
      }
    };
    // Function to scroll to the active element
    this.scrollToRef = () => {
      // Container element
      const mainEl = angular.element($document[0].getElementById('main-panel'));
      // Id of the target element
      const targetId = `hint-${$stateParams.ref}`;
      // Target element
      const targetEl = angular.element($document[0].getElementById(targetId));
      // Does the target element exist?
      if (targetEl.length) {
        // Scroll from the container
        mainEl.scrollToElement(targetEl);
      }
    };
  }
};
