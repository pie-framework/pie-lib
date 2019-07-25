import { scaleBand, scalePoint } from '@vx/scale';
export const bandKey = (d, index) => `${index}-${d.label || '-'}`;

export const dataToXBand = (scaleX, data, width, type) => {
  switch (type) {
    case 'bar':
    case 'dotPlot':
    case 'linePlot':
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
  let tickVal = prop.min;

  while (tickVal <= prop.max) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal + prop.step) * 100) / 100;
  }

  return tickValues;
};

export const getDomainAndRangeByChartType = (domain, range, chartType) => {
  const { min, max, step } = range;

  switch (chartType) {
    // if chart is dot plot or line plot, we should ignore step and make sure that min & max are integer values
    case 'dotPlot':
    case 'linePlot':
      return {
        domain: {
          ...domain,
          step: 1,
          labelStep: 1,
          min: 0,
          max: 1
        },
        range: {
          ...range,
          min: parseInt(min, 10),
          max: parseInt(max, 10),
          step: 1
        }
      };
    default:
      return {
        domain: {
          ...domain,
          step: 1,
          labelStep: 1,
          min: 0,
          max: 1
        },
        range: {
          ...range,
          step: !step ? 1 : step
        }
      };
  }
};

export const getGridLinesAndAxisByChartType = (range, chartType) => {
  switch (chartType) {
    case 'line':
      return {
        verticalLines: undefined,
        horizontalLines: getTickValues(range),
        leftAxis: true
      };
    case 'dotPlot':
    case 'linePlot':
      return {
        verticalLines: [],
        horizontalLines: [],
        leftAxis: false
      };
    default:
      return {
        verticalLines: [],
        horizontalLines: getTickValues(range),
        leftAxis: true
      };
  }
};
