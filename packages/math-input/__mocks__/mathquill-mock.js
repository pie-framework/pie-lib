import { stub } from 'sinon';

const stubField = () => {
  const out = {}

  out.reset = () => {
    out.latex = stub().returns('latex');
    out.focus = stub();
    out.cmd = stub();
    out.keystroke = stub();
    out.write = stub();
  }

  out.reset();
  return out;
};

export const staticField = stubField();
export const mathField = stubField();

export const MQ = {
  StaticMath: stub().returns(staticField),
  MathField: stub().returns(mathField)
}

export default {
  getInterface: () => MQ
};

export const resetMocks = () => {
  staticField.reset();
  mathField.reset();
}