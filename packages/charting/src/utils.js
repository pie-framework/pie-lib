import { scaleBand } from '@vx/scale';
export const bandKey = (d, index) => `${index}-${d.label || '-'}`;

export const dataToXBand = (scaleX, data, width) => {
  return scaleBand({
    rangeRound: [0, width],
    domain: data.map(bandKey),
    padding: 0.2
  });
};
