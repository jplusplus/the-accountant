export default ExplainerService;

/** @ngInject */
function ExplainerService(I18n) {
  // Symbols declarion for private attributes and methods
  const _open = Symbol('open');
  const _step = Symbol('step');
  const REGEX_ENTITIES = new RegExp(/\[((.*?)\|(\w+))\]/);

  class Explainer extends I18n {
    constructor(meta, step) {
      super(meta);
      // Create private properties
      this[_step] = step;
      this[_open] = false;
    }
    get step() {
      return this[_step];
    }
    static parse(text) {
      // Find entities
      const entities = (text.match(REGEX_ENTITIES) || []).slice(0, 1);
      // Transform result
      return entities.map(entity => {
        // Collect groups for this specific entity
        const match = REGEX_ENTITIES.exec(entity);
        // Transform entities to object
        return {
          text: match[2],
          ref: match[3]
        };
      });
    }
  }
  return Explainer;
}
