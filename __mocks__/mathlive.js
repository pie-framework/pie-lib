class MockMathfieldElement extends HTMLElement {
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

  executeCommand(cmd) {}

  getPrompts() {
    return [];
  }

  getPromptValue() {
    return '';
  }

  setPromptValue() {}
}

if (typeof customElements !== 'undefined' && !customElements.get('math-field')) {
  customElements.define('math-field', MockMathfieldElement);
}

module.exports = {
  convertLatexToMarkup: jest.fn((latex) => `<span class="ML__latex">${latex}</span>`),
  renderMathInDocument: jest.fn(),
  renderMathInElement: jest.fn(),
  MathfieldElement: MockMathfieldElement,
};
