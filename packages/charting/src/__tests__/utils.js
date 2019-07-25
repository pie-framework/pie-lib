export const scaleMock = () => {
  const fn = jest.fn(n => n);
  fn.invert = jest.fn(n => n);
  return fn;
};

export const graphProps = (dmin = 0, dmax = 1, rmin = 0, rmax = 1) => ({
  scale: {
    x: scaleMock(),
    y: scaleMock()
  },
  snap: {
    x: jest.fn(n => n),
    y: jest.fn(n => n)
  },
  domain: {
    min: dmin,
    max: dmax,
    step: 1
  },
  range: {
    min: rmin,
    max: rmax,
    step: 1
  },
  size: {
    width: 400,
    height: 400
  }
});

export const xy = (x, y, index) => {
  const out = { x, y, index };
  if (!Number.isFinite(index)) {
    delete out.index;
  }
  return out;
};
