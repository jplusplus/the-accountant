module.exports = {
  "minify": true,
  "options": [
    "setClasses",
    "addTest",
    "domPrefixes",
    "prefixes",
    "testStyles",
    "testProp"
  ],
  "feature-detects": [
    "test/css/flexbox",
    "test/css/filters"
  ]
};
