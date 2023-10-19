import { scaleBand, scalePoint } from '@vx/scale';
import { utils } from '../plot';

export const tickCount = utils.tickCount;
export const bounds = utils.bounds;
export const point = utils.point;

export const bandKey = (d, index) => `${index}-${d.label || '-'}`;

export const dataToXBand = (scaleX, data, width, type) => {
  switch (type) {
    case 'bar':
    case 'dotPlot':
    case 'linePlot':
      return scaleBand({
        rangeRound: [0, width],
        domain: data && data.map(bandKey),
        padding: 0.2,
      });

    case 'histogram':
      return scaleBand({
        rangeRound: [0, width],
        domain: data && data.map(bandKey),
        padding: 0,
      });

    case 'lineCross':
    case 'lineDot':
      return scalePoint({
        domain: data && data.map(bandKey),
        rangeRound: [0, width],
      });

    default:
      return scaleBand({
        range: [0, width],
        domain: data && data.map(bandKey),
        padding: 0,
      });
  }
};

export const getTickValues = (prop = {}) => {
  const tickValues = [];
  let tickVal = prop.min;

  while (tickVal <= prop.max) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal + prop.step) * 10000) / 10000;
  }

  return tickValues;
};

export const getDomainAndRangeByChartType = (domain, range, chartType) => {
  let { step, labelStep, min, max } = range || {};

  if (!min) {
    min = 0;
  }

  if (!max || max < 0) {
    max = range.min + 1;
  }

  if (!step) {
    step = labelStep || 1;
  }
  if (!labelStep || (isNaN(labelStep) && step)) {
    labelStep = step || 1;
  }

  range.max = max;

  switch (chartType) {
    // if chart is dot plot or line plot, we should ignore step and make sure that min & max are integer values
    case 'dotPlot':
    case 'linePlot': {
      const intMin = Math.round(min);
      const intMax = Math.round(max);

      return {
        domain: {
          ...domain,
          step: 1,
          labelStep: 1,
          min: 0,
          max: 1,
        },
        range: {
          ...range,
          min: intMin,
          max: intMin === intMax ? intMin + 1 : intMax,
          labelStep,
          step: 1,
        },
      };
    }

    default:
      return {
        domain: {
          ...domain,
          step: 1,
          labelStep: 1,
          min: 0,
          max: 1,
        },
        range: {
          ...range,
          labelStep,
          step,
        },
      };
  }
};

export const getGridLinesAndAxisByChartType = (range, chartType) => {
  switch (chartType) {
    case 'lineDot':
    case 'lineCross':
      return {
        verticalLines: undefined,
        horizontalLines: getTickValues(range),
        leftAxis: true,
      };

    case 'dotPlot':
    case 'linePlot':
      return {
        verticalLines: [],
        horizontalLines: [],
        leftAxis: false,
      };

    default:
      return {
        verticalLines: [],
        horizontalLines: getTickValues(range),
        leftAxis: true,
      };
  }
};

export const getRotateAngle = (fontSize, height) => {
  if (height >= fontSize * 2) {
    return 25;
  }

  return 0;
};

export const getTopPadding = (barWidth) => {
  if (barWidth < 30) {
    return 50;
  }

  if (barWidth < 40) {
    return 30;
  }

  if (barWidth < 60) {
    return 15;
  }

  return 0;
};

// This function calculates the transformation scale for SVG and the icon's vertical distance from its category
export const getScale = (width) => {
  let scale, deltay;

  if (width > 91) {
    scale = 1.3;
    deltay = -55;
  } else if (width > 45) {
    scale = 1.1;
    deltay = -45;
  } else if (width > 40) {
    scale = 0.5 + (width - 34) * 0.02;
    deltay = -25;
  } else if (width > 30) {
    scale = 0.5 + (width - 34) * 0.02;
    deltay = -20;
  } else {
    scale = 0.5 * Math.pow(0.98, 34 - width); // 0.98 is the reduction factor. Adjust to control scaling.
    deltay = -15;
  }

  return { scale, deltay };
};

export const getAdjustedX = (width, scaleValue) => {
  const innerWidthOriginal = 57;
  const effectiveInnerWidth = innerWidthOriginal * scaleValue;
  return (width - effectiveInnerWidth) / 2;
};
