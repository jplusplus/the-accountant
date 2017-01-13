export default unsafeFilter;

/** @ngInject */
function unsafeFilter($sce) {
  return $sce.trustAsHtml;
}
