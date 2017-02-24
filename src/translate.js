/** @ngInject */
module.exports.translateConfig = function translateConfig($translateProvider, tmhDynamicLocaleProvider) {
  // Load current locale
  tmhDynamicLocaleProvider.localeLocationPattern('//code.angularjs.org/1.2.20/i18n/angular-locale_{{locale}}.js');
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
module.exports.translateRun = function translateRun($transitions, $location, $translate, tmhDynamicLocale) {
  // Redirect to login if route requires auth and you're not logged in
  $transitions.onSuccess({}, () => {
    // Get lang from location search
    const lang = $location.search().lang;
    // Does the search param exists?
    if ($translate.getAvailableLanguageKeys().indexOf(lang) > -1) {
      // Update current language
      $translate.use(lang);
      tmhDynamicLocale.set(lang.slice(0, 2));
    } else {
      tmhDynamicLocale.set($translate.use().slice(0, 2));
    }
  });
};
