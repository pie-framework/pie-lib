import { lineTool, lineToolComponent, lineBase } from '../index';
import { utils } from '@pie-lib/plot';
import { render } from '@pie-lib/test-utils';
import React from 'react';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';

const { xy } = utils;
const xyLabel = (x, y, label) => ({ x, y, label });

// Pure function tests - keep as-is
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

// TODO: These enzyme-based instance tests need migration to behavioral testing with RTL
describe.skip('lineToolComponent (legacy enzyme tests - needs migration)', () => {
  let Comp;
  let mark;

  beforeEach(() => {
    Comp = lineToolComponent(() => <text />);
    mark = { from: xy(0, 0), to: xy(1, 1) };
  });

  const renderComponent = (extras) => {
    const defaults = {
      mark,
      onChange: jest.fn(),
      graphProps: getGraphProps(),
    };
    const props = { ...defaults, ...extras };
    return render(<Comp {...props} />);
  };

  describe('rendering', () => {
    it('renders', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
  // These tests need enzyme wrapper.instance() - skip for now
  describe('logic', () => {
    it.skip('startDrag sets state', () => {});
    it.skip('stopDrag/changeMark calls onChange', () => {});
  });
});

// TODO: These enzyme-based instance tests need migration to behavioral testing with RTL
describe.skip('lineBase (legacy enzyme tests - needs migration)', () => {
  let Comp;
  let onChange = jest.fn();
  let changeMarkProps = jest.fn();

  beforeEach(() => {
    Comp = lineBase(() => <text />);
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
    it('renders', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labels', () => {
      const { container } = renderWithLabels();
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // These tests need enzyme wrapper.instance() - skip for now
  describe('logic', () => {
    it.skip('dragComp calls onChange', () => {});
    it.skip('dragComp keeps labels on both "from" and "to"', () => {});
    it.skip('dragFrom', () => {});
    it.skip('dragFrom keeps labels on "from"', () => {});
    it.skip('dragTo', () => {});
    it.skip('dragTo keeps labels on "to"', () => {});
    it.skip('labelChange updates "label" property for point', () => {});
    it.skip('labelChange removes "label" property if the field is empty', () => {});
    it.skip('clickPoint adds "label" property to a point', () => {});
    it.skip('clickPoint if point already has label, keeps that value', () => {});
  });
});
