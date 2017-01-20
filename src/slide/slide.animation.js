export default slide;

import $ from 'jquery';

/** @ngInject */
function slide($rootScope) {
  return {
    enter: (element, done) => {
      return $(element).hide().slideDown(400, () => $rootScope.$apply(done));
    },
    leave: (element, done) => {
      return $(element).show().slideUp(400, () => $rootScope.$apply(done));
    },
    beforeAddClass: (element, className, done) => {
      if (className === "ng-hide") {
        $(element).show().slideUp(400, () => $rootScope.$apply(done));
      }
      return null;
    },
    removeClass: (element, className, done) => {
      if (className === "ng-hide") {
        $(element).hide().slideDown(400, () => $rootScope.$apply(done));
      }
      return null;
    }
  };
}
