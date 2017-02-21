export default modernizrRun;
import Modernizr from 'modernizr';

/** @ngInject */
function modernizrRun($window) {
  // Here are all the values we will test. If you want to use just one or two, comment out the lines of test you don't need.
  const tests = [
    // False positive in IE, supports SVG clip-path, but not on HTML element
    {name: 'svg', value: 'url(#test)'},
    {name: 'inset', value: 'inset(10px 20px 30px 40px)'},
    {name: 'circle', value: 'circle(60px at center)'},
    {name: 'ellipse', value: 'ellipse(50% 50% at 50% 50%)'},
    {name: 'polygon', value: 'polygon(50% 0%, 0% 100%, 100% 100%)'}
  ];

  let t = 0;
  let name;
  let value;
  let prop;

  function addTest() {
    // Try using window.CSS.supports
    if ('CSS' in $window && 'supports' in $window.CSS) {
      for (let i = 0; i < Modernizr._prefixes.length; i++) {
        prop = `${Modernizr._prefixes[i]}clip-path`;
        if ($window.CSS.supports(prop, value)) {
          return true;
        }
      }
      return false;
    }
    const properties = Modernizr._prefixes.join(`clip-path: ${value};`);
    // Otherwise, use Modernizr.testStyles and examine the property manually
    return Modernizr.testStyles(`#modernizr { ${properties} }`, elem => {
      const style = getComputedStyle(elem);
      let clip = style.clipPath;

      if (!clip || clip === "none") {
        clip = false;

        for (let i = 0; i < Modernizr._domPrefixes.length; i++) {
          const test = `${Modernizr._domPrefixes[i]}ClipPath`;
          if (style[test] && style[test] !== "none") {
            clip = true;
            break;
          }
        }
      }

      return Modernizr.testProp('clipPath') && clip;
    });
  }

  for (; t < tests.length; t++) {
    name = tests[t].name;
    value = tests[t].value;
    Modernizr.addTest(`cssclippath${name}`, addTest);
  }
}
