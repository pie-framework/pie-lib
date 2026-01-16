import { lineTool, lineToolComponent, lineBase } from '../index';
import { utils } from '@pie-lib/plot';
import { render } from '@pie-lib/test-utils';
import React from 'react';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';

const { xy } = utils;
const xyLabel = (x, y, label) => ({ x, y, label });

describe('lineTool', () => {
  describe('addPoint', () => {
    let toolbar;
    beforeEach(() => {
      toolbar = lineTool('lineType', () => <div />)();
    });
    it('returns a building mark', () => {
      const result = toolbar.addPoint(xy(1, 1));
      expect(result).toEqual({
        type: 'lineType',
        building: true,
        from: xy(1, 1),
      });
    });

    it('returns a complete mark', () => {
      const result = toolbar.addPoint(xy(1, 1), { from: xy(0, 0) });
      expect(result).toEqual({
        building: false,
        from: xy(0, 0),
        to: xy(1, 1),
      });
    });
  });
});

describe('lineToolComponent', () => {
  let Comp;
  let mark;
  let onChange;
  const renderComponent = (extras) => {
    const defaults = {
      mark,
      onChange: jest.fn(),
      graphProps: getGraphProps(),
    };
    const props = { ...defaults, ...extras };

    return render(<Comp {...props} />);
  };

  beforeEach(() => {
    Comp = lineToolComponent(() => <text />);
    mark = { from: xy(0, 0), to: xy(1, 1) };
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('lineBase', () => {
  let Comp;
  let onChange = jest.fn();
  let changeMarkProps = jest.fn();

  beforeEach(() => {
    Comp = lineBase(() => <text />);
    onChange.mockClear();
    changeMarkProps.mockClear();
  });

  const renderComponent = (extras) => {
    const defaults = {
      onChange,
      changeMarkProps,
      graphProps: getGraphProps(),
      from: xy(0, 0),
      to: xy(1, 1),
    };
    const props = { ...defaults, ...extras };

    return render(<Comp {...props} />);
  };

  // used to test items that have labels attached to points
  const labelNode = document.createElement('foreignObject');
  const renderWithLabels = (extras = {}) =>
    renderComponent({
      ...extras,
      labelNode: labelNode,
      from: xyLabel(0, 0, 'A'),
      to: xyLabel(1, 1, 'B'),
    });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labels', () => {
      const { container } = renderWithLabels();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
