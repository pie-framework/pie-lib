let MQ;
export const load = () => {
  if (MQ) {
    return MQ;
  }

  if (typeof window !== 'undefined') {
    const MathQuill = require('@pie-framework/mathquill/build/index-dev');
    MQ = MathQuill.getInterface(2);
  }

  return MQ;
};
