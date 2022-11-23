import * as utils from '../utils';

const xy = (x, y) => ({ x, y });

describe('utils', () => {
  describe('getTickValues', () => {
    const assertGetTickValues = (range, points) => {
      it(`converts ${range} -> ${points}`, () => {
        const result = utils.getTickValues(range);
        expect(result).toEqual(points);
      });
    };

    assertGetTickValues({ min: 0, max: 5, step: 1 }, [0, 1, 2, 3, 4, 5]);
    assertGetTickValues({ min: 0, max: 5, step: 0.5 }, [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]);
    assertGetTickValues({ min: 0.4, max: 2, step: 0.3 }, [0.4, 0.7, 1, 1.3, 1.6, 1.9]);
  });

  describe('getDomainAndRangeByChartType', () => {
    const assertGetDomainAndRangeByChartType = (domain, range, chartType, correctValues) => {
      it('returns correct values for domain and range', () => {
        const result = utils.getDomainAndRangeByChartType(domain, range, chartType);
        expect(result).toEqual(correctValues);
      });
    };

    assertGetDomainAndRangeByChartType({ min: -1, max: 4 }, { min: 1, max: 2, step: 1 }, 'line', {
      domain: { min: 0, max: 1, step: 1, labelStep: 1 },
      range: { min: 1, max: 2, step: 1, labelStep: 1 },
    });
    assertGetDomainAndRangeByChartType({ min: -1, max: 4 }, { min: 0.1, max: 2, labelStep: 0.1 }, 'line', {
      domain: { min: 0, max: 1, step: 1, labelStep: 1 },
      range: { min: 0.1, max: 2, step: 0.1, labelStep: 0.1 },
    });
    assertGetDomainAndRangeByChartType({ min: -1, max: 4 }, { min: 0.2, max: 2.4, step: 0.1 }, 'dotPlot', {
      domain: { min: 0, max: 1, step: 1, labelStep: 1 },
      range: { min: 0, max: 2, step: 1, labelStep: 0.1 },
    });
  });

  describe('getGridLinesAndAxisByChartType', () => {
    const assertGetGridLinesAndAxisByChartType = (range, chartType, gridLines) => {
      it('returns proper grid values', () => {
        const result = utils.getGridLinesAndAxisByChartType(range, chartType);
        expect(result).toEqual(gridLines);
      });
    };

    assertGetGridLinesAndAxisByChartType({ min: 0, max: 1, step: 1 }, 'lineDot', {
      verticalLines: undefined,
      horizontalLines: [0, 1],
      leftAxis: true,
    });

    assertGetGridLinesAndAxisByChartType({ min: 0, max: 1, step: 1 }, 'lineCross', {
      verticalLines: undefined,
      horizontalLines: [0, 1],
      leftAxis: true,
    });

    assertGetGridLinesAndAxisByChartType({ min: 0, max: 1, step: 1 }, 'bar', {
      verticalLines: [],
      horizontalLines: [0, 1],
      leftAxis: true,
    });

    assertGetGridLinesAndAxisByChartType({ min: 0, max: 1, step: 1 }, 'dotPlot', {
      verticalLines: [],
      horizontalLines: [],
      leftAxis: false,
    });
  });

  describe('getTopPadding', () => {
    const assertGetTopPadding = (barWidth, topPadding) => {
      it('returns proper top padding', () => {
        const result = utils.getTopPadding(barWidth);
        expect(result).toEqual(topPadding);
      });
    };

    assertGetTopPadding(20, 50);
    assertGetTopPadding(35, 30);
    assertGetTopPadding(55, 15);
    assertGetTopPadding(65, 0);
  });

  describe('getRotateAngle', () => {
    const assertGetRotateAngle = ({ fontSize, height }, rotateAngle) => {
      it('returns proper rotate angle', () => {
        const result = utils.getRotateAngle(fontSize, height);
        expect(result).toEqual(rotateAngle);
      });
    };

    assertGetRotateAngle({ fontSize: 14, height: 14 }, 0);
    assertGetRotateAngle({ fontSize: 14, height: 28 }, 25);
    assertGetRotateAngle({ fontSize: 14, height: 42 }, 25);
  });
});
