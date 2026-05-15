/**
 * Minimal stub for `mathlive` used when the real package isn't installed.
 * Allows the Next.js dev server to start without mathlive in node_modules.
 * Once `yarn install` is run successfully, this stub is never loaded because
 * next.config.js only applies the alias when mathlive cannot be resolved.
 */

class MathfieldElement extends HTMLElement {
  constructor() {
    super();
    this._value = '';
    this.readOnly = false;
  }

  get value() {
    return this._value;
  }

  set value(v) {
    this._value = v;
  }

  insert(latex) {
    this._value += latex;
  }

  executeCommand() {}

  getPrompts() {
    return [];
  }

  getPromptValue() {
    return '';
  }

  setPromptValue() {}
}

if (typeof customElements !== 'undefined' && !customElements.get('math-field')) {
  customElements.define('math-field', MathfieldElement);
}

module.exports = {
  MathfieldElement,
  convertLatexToMarkup: (latex) => `<span class="ML__latex">${latex || ''}</span>`,
  renderMathInDocument: () => {},
  renderMathInElement: () => {},
};
