export default slide;

import $ from 'jquery';

/** @ngInject */
function slide() {
  return {
    enter: (element, done) => {
      return $(element).hide().slideDown(400, done);
    },
    leave: (element, done) => {
      return $(element).show().slideUp(400, done);
    },
    beforeAddClass: (element, className, done) => {
      if (className === "ng-hide") {
        $(element).show().slideUp(400, done);
      }
      return null;
    },
    removeClass: (element, className, done) => {
      if (className === "ng-hide") {
        $(element).hide().slideDown(400, done);
      }
      return null;
    }
  };
}
