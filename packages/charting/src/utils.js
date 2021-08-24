import { scaleBand, scalePoint } from '@vx/scale';
import { utils } from '@pie-lib/plot';

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
        padding: 0.2
      });
    case 'histogram':
      return scaleBand({
        rangeRound: [0, width],
        domain: data && data.map(bandKey),
        padding: 0
      });
    case 'lineCross':
    case 'lineDot':
      return scalePoint({
        domain: data && data.map(bandKey),
        rangeRound: [0, width]
      });
    default:
      return scaleBand({
        range: [0, width],
        domain: data && data.map(bandKey),
        padding: 0
      });
  }
};

export const getTickValues = (prop = {}) => {
  const tickValues = [];
  let tickVal = prop.min;

  while (tickVal <= prop.max) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal + prop.step) * 100) / 100;
  }

  return tickValues;
};

export const customLabelStep = (rangeMax, size, labelFontSize) => {
  const ceilMax = Math.ceil(rangeMax);
  const segmentLength = size.height / ceilMax;

  // how many ticksWidth fit in a segment
  let tickWidthPerSegment = segmentLength / labelFontSize;

  const ticksToFitInOneSegment = 1;

  const labelStep = ticksToFitInOneSegment / tickWidthPerSegment;
  const roundedStep = Math.ceil((labelStep * 10) / 10);

  return labelStep > 0.15 ? roundedStep : labelStep || 1;
};

export const crowdedTicks = (rangeMax, customLabelStep, size, labelFontSize) => {
  const ceilMax = Math.ceil(rangeMax);

  const numberOfSegments = ceilMax * customLabelStep;

  return size.height / numberOfSegments < labelFontSize && size.height / numberOfSegments > 0.5;
};

export const getDomainAndRangeByChartType = (domain, range, size, chartType, labelFontSize) => {
  let { step, labelStep, min, max } = range || {};

  if (!min) {
    min = 0;
  }

  if (!max || max < 0) {
    max = range.min + 1;
  }

  if (labelStep && !step) {
    step = labelStep;
  }
  if (!labelStep || (isNaN(labelStep) && step)) {
    let customLabelStep = step;
    let crowded = crowdedTicks(max, customLabelStep, size, labelFontSize);

    while (crowded) {
      customLabelStep = customLabelStep + step;
      crowded = crowdedTicks(max, customLabelStep, size, labelFontSize);
    }

    labelStep = customLabelStep;
  }

  if (!step || (isNaN(step) && !labelStep) || isNaN(labelStep)) {
    labelStep = customLabelStep(max, size, labelFontSize);

    if (labelStep <= 1) {
      step = labelStep;
    } else if (labelStep <= 4) {
      step = 1;
    } else if (labelStep > 4 && labelStep < 10) {
      step = labelStep / 2;
    } else {
      step = labelStep / 3;
    }
  }

  if (max % step !== 0) {
    max = max + step;
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
          max: 1
        },
        range: {
          ...range,
          min: intMin,
          max: intMin === intMax ? intMin + 1 : intMax,
          labelStep,
          step: 1
        }
      };
    }
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
          labelStep,
          step
        }
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

export const getRotateAngle = (fontSize, height) => {
  if (height >= fontSize * 2) {
    return 25;
  }

  return 0;
};

export const getTopPadding = barWidth => {
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
