export default translateConfig;

/** @ngInject */
function translateConfig($translateProvider) {
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
}
