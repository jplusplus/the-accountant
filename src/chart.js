export default chartRun;

/** @ngInject */
function chartRun($window) {
  // We need a few global variable
  $window.c3 = require('c3');
}
