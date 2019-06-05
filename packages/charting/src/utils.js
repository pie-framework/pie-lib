import { scaleBand } from '@vx/scale';
import isEqual from 'lodash/isEqual';

export const bandKey = (d, index) => `${index}-${d.label || '-'}`;

export const dataToXBand = (scaleX, data, width) => {
  return scaleBand({
    rangeRound: [0, width],
    domain: data.map(bandKey),
    padding: 0.2
  });
};

export const isDomainRangeEqual = (graphProps, nextGraphProps) => {
  return (
    isEqual(graphProps.domain, nextGraphProps.domain) &&
    isEqual(graphProps.range, nextGraphProps.range)
  );
};
