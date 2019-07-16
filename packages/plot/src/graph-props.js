import invariant from 'invariant';
import { buildSizeArray, snapTo } from './utils';
import { scaleLinear } from 'd3-scale';

const createSnapMinAndMax = ({ min, max, step }) => {
  return {
    step,
    min: parseInt(min / step) * step,
    max: parseInt(max / step) * step
  };
};

export const create = (domain, range, size, getRootNode) => {
  invariant(domain.min < domain.max, 'domain: min must be less than max');
  invariant(range.min < range.max, 'range: min must be less than max');

  const widthArray = buildSizeArray(size.width, domain.padding);
  const heightArray = buildSizeArray(size.height, range.padding);

  const domainMinMax = createSnapMinAndMax(domain);
  const rangeMinMax = createSnapMinAndMax(range);

  const scale = {
    x: scaleLinear()
      .domain([domain.min, domain.max])
      .range(widthArray),
    y: scaleLinear()
      .domain([range.max, range.min])
      .range(heightArray)
  };

  const snap = {
    x: snapTo.bind(null, domainMinMax.min, domainMinMax.max, domainMinMax.step),
    y: snapTo.bind(null, rangeMinMax.min, rangeMinMax.max, rangeMinMax.step)
  };

  return { scale, snap, domain, range, size, getRootNode };
};
