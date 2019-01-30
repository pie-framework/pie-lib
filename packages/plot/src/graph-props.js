import invariant from 'invariant';
import { buildSizeArray, snapTo } from './utils';
import { scaleLinear } from 'd3-scale';

export const create = (domain, range, size) => {
  invariant(domain.min < domain.max, 'domain: min must be less than max');
  invariant(range.min < range.max, 'range: min must be less than max');

  const widthArray = buildSizeArray(size.width, domain.padding);
  const heightArray = buildSizeArray(size.height, range.padding);

  const scale = {
    x: scaleLinear()
      .domain([domain.min, domain.max])
      .range(widthArray),
    y: scaleLinear()
      .domain([range.max, range.min])
      .range(heightArray)
  };

  const snap = {
    x: snapTo.bind(null, domain.min, domain.max, 1),
    y: snapTo.bind(null, range.min, range.max, 1)
  };

  return { scale, snap, domain, range, size };
};
