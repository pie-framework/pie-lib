import { shallow } from 'enzyme';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import { RawBaseComponent, buildLines, swap } from '../component';

const xyLabel = (x, y, index, label) => ({
  ...xy(x, y, index),
  label,
});

describe('buildLines', () => {
  const defaultPoints = [xy(0, 0), xy(1, 1), xy(1, 0)];

  const assertBuildLines = (points, closed, expected) => {
    it(`builds points and lines for ${points} = ${expected}`, () => {
      const result = buildLines(points);
      expect(result).toMatchObject([
        { from: xy(0, 0, 0), to: xy(1, 1, 1) },
        { from: xy(1, 1, 1), to: xy(1, 0, 2) },
      ]);
    });
  };

  assertBuildLines(defaultPoints, true, []);
});

describe('swap', () => {
  it('swaps pairs', () => {
    const result = swap([xy(0, 0, 0), xy(1, 1, 1), xy(2, 2, 2)], xy(0, 0, 0), xy(3, 3, 0));
    expect(result).toEqual([xy(3, 3, 0), xy(1, 1, 1), xy(2, 2, 2)]);
  });
});

describe('RawBaseComponent', () => {
  let w;
  let onChange = jest.fn();
  let onChangeProps = jest.fn();
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      onChangeProps,
      onClosePolygon: jest.fn(),
      graphProps: graphProps(),
      points: [],
    };
    const props = { ...defaults, ...extras };

    return shallow(<RawBaseComponent {...props} />);
  };

  // used to test items that have labels attached to points
  const labelNode = document.createElement('foreignObject');
  const points = [xyLabel(0, 0, 0, 'A'), xyLabel(2, 2, 1, 'B'), xyLabel(0, 2, 2, 'C')];
  const wrapperWithLabels = (extras) =>
    wrapper({
      labelNode: labelNode,
      points: points,
      ...extras,
    });

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('renders with labels', () => {
      w = wrapperWithLabels();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('dragPoint', () => {
      it('calls onChange', () => {
        onChange = jest.fn();
        w = wrapper({ points: [xy(1, 1)], onChange });
        w.instance().dragPoint(0, xy(1, 1), xy(2, 2));
        expect(onChange).toHaveBeenCalledWith([xy(2, 2)]);
      });

      it('calls onChange keeping label property from point', () => {
        onChange = jest.fn();
        w = wrapperWithLabels(onChange);

        w.instance().dragPoint(0, xy(0, 0), xy(0, 1));
        expect(onChange).toHaveBeenCalledWith([{ x: 0, y: 1, label: 'A' }, points[1], points[2]]);
      });
    });

    describe('dragLine', () => {
      it('calls onChange', () => {
        w = wrapper({ points: [xy(1, 1, 0), xy(2, 2, 1)], onChange });
        w.instance().dragLine({ from: xy(1, 1, 0), to: xy(2, 2, 1) }, { from: xy(2, 2, 0), to: xy(4, 4, 1) });
        expect(onChange).toHaveBeenCalledWith([xy(2, 2, 0), xy(4, 4, 1)]);
      });

      it('calls onChange keeping label property from both points', () => {
        onChange = jest.fn();
        w = wrapperWithLabels(onChange);

        w.instance().dragLine(
          { from: points[0], to: points[1] },
          {
            from: xy(0, 1, 0),
            to: xy(2, 3, 1),
          },
        );
        expect(onChange).toHaveBeenCalledWith([xyLabel(0, 1, 0, 'A'), xyLabel(2, 3, 1, 'B'), points[2]]);
      });
    });

    describe('dragPoly', () => {
      it('calls onChange', () => {
        w = wrapper({ onChange });
        const existing = [xy(1, 1)];
        const next = [xy(2, 2)];
        w.instance().dragPoly(existing, next);
        expect(onChange).toHaveBeenCalledWith([xy(2, 2)]);
      });

      it('calls onChange keeping label property from all points', () => {
        onChange = jest.fn();
        w = wrapperWithLabels(onChange);

        w.instance().dragPoly(points, [xy(0, 1, 0), xy(2, 3, 1), xy(0, 3, 2)]);
        expect(onChange).toHaveBeenCalledWith([xyLabel(0, 1, 0, 'A'), xyLabel(2, 3, 1, 'B'), xyLabel(0, 3, 2, 'C')]);
      });
    });

    describe('labelChange', () => {
      it('updates "label" property for point', () => {
        w = wrapperWithLabels();

        w.instance().labelChange({ ...points[0], label: 'Label A' }, 0);
        expect(onChangeProps).toBeCalledWith([{ ...points[0], label: 'Label A' }, points[1], points[2]]);

        w.instance().labelChange({ ...points[1], label: 'Label B' }, 1);
        expect(onChangeProps).toBeCalledWith([points[0], { ...points[1], label: 'Label B' }, points[2]]);
      });

      it('removes "label" property if the field is empty', () => {
        w = wrapperWithLabels();

        w.instance().labelChange({ ...points[0], label: '' }, 0);
        expect(onChangeProps).toBeCalledWith([xy(0, 0, 0), points[1], points[2]]);

        w.instance().labelChange({ ...points[1], label: '' }, 1);
        expect(onChangeProps).toBeCalledWith([points[0], xy(2, 2, 1), points[2]]);
      });
    });
  });

  describe('close', () => {
    it('calls onClosePolygon', () => {
      const onClosePolygon = jest.fn();
      w = wrapper({ onClosePolygon, points: [xy(1, 1), xy(2, 2), xy(3, 3)] });
      w.instance().close();
      expect(onClosePolygon).toHaveBeenCalled();
    });
  });

  describe('clickPoint', () => {
    let onClick = jest.fn();
    let onClosePolygon = jest.fn();
    beforeEach(() => {
      onClosePolygon.mockClear();
      onClick.mockClear();
    });

    const assertCallback = (isToolActive, closed, index, mock) => {
      it('calls onClosePolygon', () => {
        const w = wrapper({
          points: [xy(1, 1), xy(2, 2), xy(3, 3)],
          onClosePolygon,
          onClick,
          isToolActive,
          closed,
        });

        w.instance().clickPoint(xy(1, 1, 0), index, {});
        expect(mock).toHaveBeenCalled();
      });
    };

    assertCallback(true, false, 0, onClosePolygon);
    assertCallback(true, false, 1, onClick);
    assertCallback(false, false, 0, onClick);
    assertCallback(true, true, 0, onClick);

    it('adds "label" property to a point', () => {
      const onChangeProps = jest.fn();
      const w = wrapperWithLabels({
        labelModeEnabled: true,
        onChangeProps,
        points: [xy(0, 0, 0), xy(2, 2, 1), xy(0, 2, 2)],
      });

      w.instance().clickPoint(xy(0, 0, 0), 0, {});
      expect(onChangeProps).toHaveBeenCalledWith([xyLabel(0, 0, 0, ''), xy(2, 2, 1), xy(0, 2, 2)]);
    });

    it('if point already has label, keeps that value', () => {
      const onChangeProps = jest.fn();
      const w = wrapperWithLabels({ labelModeEnabled: true, onChangeProps });

      w.instance().clickPoint(points[0], 0, {});
      expect(onChangeProps).toHaveBeenCalledWith(points);
    });
  });
});
