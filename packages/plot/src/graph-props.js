import invariant from 'invariant';
import { buildSizeArray, snapTo } from './utils';
import { scaleLinear } from 'd3-scale';

const createSnapMinAndMax = ({ importantMin, min, max, step }) => {
  // for charting range, if step is a value with decimals, we have to calculate the min & max for the grid taking in consideration
  // that min will determine the base line (grid's first line has to have min value)
  // for example, if min: -5 & max: 5 & step: 0.75, to display correctly the chart, we have to set min: -5 & max: 4.75
  if (importantMin) {
    return {
      step,
      min: importantMin,
      max: parseInt((Math.abs(importantMin) + max) / step) * step + importantMin
    };
  }

  // for graphing, if step is a value with decimals, we have to calculate the min & max for the grid taking in consideration that 0 has to be exactly in the middle
  // for example, if min: -5 & max: 5 & step: 0.75, in order to keep 0 in the middle we have to set min: -4.5 & max: 4.5
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
