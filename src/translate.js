/** @ngInject */
module.exports.translateConfig = function translateConfig($translateProvider) {
  // Configure Angular Translate
  $translateProvider
    .useStaticFilesLoader({
      prefix: 'locales/',
      suffix: '.json'
    })
    .registerAvailableLanguageKeys(['en', 'fr'], {
      'en_US': 'en',
      'en_UK': 'en',
      'en-US': 'en',
      'en-UK': 'en',
      'fr_FR': 'fr',
      'fr_BE': 'fr'
    })
    .determinePreferredLanguage()
    .fallbackLanguage('en')
    .useLocalStorage()
    .useSanitizeValueStrategy(null);
};

/** @ngInject */
module.exports.translateRun = function translateRun($transitions, $location, $translate) {
  // Redirect to login if route requires auth and you're not logged in
  $transitions.onSuccess({}, () => {
    // Get lang from location search
    const lang = $location.search().lang;
    // Does the search param exists?
    if ($translate.getAvailableLanguageKeys().indexOf(lang) > -1) {
      // Update current language
      $translate.use(lang);
    }
  });
};
