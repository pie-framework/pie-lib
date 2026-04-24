import { scaleBand, scaleLinear } from 'd3-scale';

export const scaleMock = () => {
  const fn = jest.fn((n) => n);
  fn.invert = jest.fn((n) => n);
  return fn;
};

export const createBandScale = (domain = [], range = [0, 400]) => {
  return scaleBand().domain(domain).range(range).padding(0.1);
};

export const graphProps = (dmin = 0, dmax = 1, rmin = 0, rmax = 1) => ({
  scale: {
    x: scaleLinear().domain([dmin, dmax]).range([0, 400]),
    y: scaleLinear().domain([rmin, rmax]).range([400, 0]),
  },
  snap: {
    x: jest.fn((n) => n),
    y: jest.fn((n) => n),
  },
  domain: {
    min: dmin,
    max: dmax,
    step: 1,
  },
  range: {
    min: rmin,
    max: rmax,
    step: 1,
  },
  size: {
    width: 400,
    height: 400,
  },
});
