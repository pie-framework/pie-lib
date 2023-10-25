import { shallow } from 'enzyme';
import React from 'react';
import { Chart } from '../chart';
import { graphProps } from './utils';

describe('ChartAxes', () => {
  let onDataChange = jest.fn();
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      onDataChange,
      className: 'className',
      graphProps: graphProps(),
      xBand: () => {
        return {
          bandwidth: () => {},
        };
      },
      charts: [
        {
          type: 'bar',
          Component: () => <div />,
        },
      ],
      chartType: 'bar',
      domain: {},
      range: {
        min: 0,
        max: 10,
      },
      size: {
        width: 100,
        height: 100,
      },
      data: [],
    };
    const props = { ...defaults, ...extras };
    return shallow(<Chart {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      jest.spyOn(Chart.prototype, 'generateMaskId').mockReturnValue('chart-2645');
      let w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('renders if size is not defined', () => {
      jest.spyOn(Chart.prototype, 'generateMaskId').mockReturnValue('chart-1553');
      let w = wrapper({ size: undefined });
      expect(w).toMatchSnapshot();
    });

    it('renders without chartType property', () => {
      jest.spyOn(Chart.prototype, 'generateMaskId').mockReturnValue('chart-4286');
      let w = wrapper({ chartType: null });
      expect(w).toMatchSnapshot();
    });

    it('renders without chartType and charts properties', () =>
      expect(wrapper({ chartType: null, charts: null })).toMatchSnapshot());

    it('renders without chartType property and empty charts property', () =>
      expect(wrapper({ chartType: null, charts: [] })).toMatchSnapshot());

    it('renders with chartType property and empty charts property', () =>
      expect(wrapper({ charts: [] })).toMatchSnapshot());
  });

  describe('logic', () => {
    it('changeData', () => {
      let w = wrapper();

      w.instance().changeData();

      expect(onDataChange).toHaveBeenCalled();
    });

    it('getChart', () => {
      const w = wrapper();

      const chart = w.instance().getChart();

      expect(chart.type).toEqual('bar');
    });
  });
});
