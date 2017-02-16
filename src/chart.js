export default chartConfig;

/** @ngInject */
function chartConfig($window) {
  // We need a few global variable
  $window.c3 = require('c3');
}
