import { scaleBand, scalePoint } from '@vx/scale';
export const bandKey = (d, index) => `${index}-${d.label || '-'}`;

export const dataToXBand = (scaleX, data, width, type) => {
  switch (type) {
    case 'bar':
      return scaleBand({
        rangeRound: [0, width],
        domain: data.map(bandKey),
        padding: 0.2
      });
    case 'histogram':
      return scaleBand({
        rangeRound: [0, width],
        domain: data.map(bandKey),
        padding: 0
      });
    case 'line':
      return scalePoint({
        domain: data.map(bandKey),
        rangeRound: [0, width]
      });
    default:
      return scaleBand({
        range: [0, width],
        domain: data.map(bandKey),
        padding: 0
      });
  }
};

export const getTickValues = prop => {
  const tickValues = [];
  let tickVal = 0;

  while (tickVal >= prop.min && tickValues.indexOf(tickVal) < 0) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal - prop.step) * 100) / 100;
  }

  tickVal = Math.round(prop.step * 100) / 100;

  while (tickVal <= prop.max && tickValues.indexOf(tickVal) < 0) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal + prop.step) * 100) / 100;
  }

  return tickValues;
};
