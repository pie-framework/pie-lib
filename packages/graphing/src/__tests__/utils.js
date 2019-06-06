export const scaleMock = () => {
  const fn = jest.fn(n => n);
  fn.invert = jest.fn(n => n);
  return fn;
};

export const graphProps = () => ({
  scale: {
    x: scaleMock(),
    y: scaleMock()
  },
  snap: {
    x: jest.fn(n => n),
    y: jest.fn(n => n)
  },
  domain: {
    min: 0,
    max: 1,
    step: 1
  },
  range: {
    min: 0,
    max: 1,
    step: 1
  },
  size: {
    width: 400,
    height: 400
  }
});

export const xy = (x, y, index) => ({ x, y, index });
