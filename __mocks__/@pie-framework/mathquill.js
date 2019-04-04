class MockMathquill {
  MathField() {
    return this;
  }

  StaticMath() {
    return this;
  }

  constructor() {
    this.blur = jest.fn();
    this.focus = jest.fn();
    this.latex = jest.fn();
    this.cmd = jest.fn();
    this.write = jest.fn();
    this.keystroke = jest.fn();
  }
}

module.exports = {
  getInterface: jest.fn().mockReturnValue(new MockMathquill())
};
