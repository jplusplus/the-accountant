export default ExplainerService;

/** @ngInject */
function ExplainerService(I18n) {
  // Symbols declarion for private attributes and methods
  const _open = Symbol('open');
  const _step = Symbol('step');
  const _ref = Symbol('ref');
  const REGEX_ENTITIES = new RegExp(/\[((.*?)\|(\w*))\]/g);

  class Explainer extends I18n {
    constructor(meta, ref, step) {
      super(meta);
      // Create private properties
      this[_step] = step;
      this[_ref] = ref;
      this[_open] = false;
    }
    get step() {
      return this[_step];
    }
    get ref() {
      return this[_ref];
    }
    // Init regex to its initial state
    static asNew(regex) {
      regex.lastIndex = 0;
      return regex;
    }
    static parse(text) {
      // Find entities
      const entities = (text.match(Explainer.asNew(REGEX_ENTITIES)) || []);
      // Transform result
      return entities.map(entity => {
        // Collect groups for this specific entity
        const match = Explainer.asNew(REGEX_ENTITIES).exec(entity);
        // Transform entities to object
        return {
          needle: match[0],
          text: match[2],
          ref: match[3]
        };
      });
    }
  }
  return Explainer;
}
