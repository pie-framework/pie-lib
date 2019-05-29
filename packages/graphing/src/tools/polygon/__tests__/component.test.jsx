import { shallow } from 'enzyme';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import { RawBaseComponent, buildLines } from '../component';

describe('RawBaseComponent', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      onClosePolygon: jest.fn(),
      graphProps: graphProps(),
      points: []
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawBaseComponent {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {
    describe('movePoint', () => {
      it('calls onChange', () => {
        onChange = jest.fn();
        w = wrapper({ points: [xy(1, 1)], onChange });
        w.instance().movePoint(xy(1, 1), xy(2, 2));
        expect(onChange).toHaveBeenCalledWith([xy(2, 2)]);
      });
    });
    describe('moveLine', () => {
      it('calls onChange', () => {
        w = wrapper({ points: [xy(1, 1), xy(2, 2)], onChange });
        w.instance().moveLine({ from: xy(1, 1), to: xy(2, 2) }, { from: xy(3, 3), to: xy(4, 4) });
        expect(onChange).toHaveBeenCalledWith([xy(3, 3), xy(4, 4)]);
      });
    });

    describe('dragPoint', () => {
      it('stores point', () => {
        w = wrapper();
        w.instance().dragPoint(xy(1, 1), undefined, xy(2, 2));
        expect(w.state().dragPoint).toEqual({ from: xy(1, 1), to: xy(2, 2), index: undefined });
      });
    });

    describe('dragLine', () => {
      it('stores dragLine', () => {
        w = wrapper();
        const existing = { from: xy(1, 1), to: xy(2, 2) };
        const next = { from: xy(2, 2), to: xy(3, 3) };
        w.instance().dragLine(existing, next);
        expect(w.state().dragLine).toEqual({ existing, next });
      });
    });
    describe('dragPoly', () => {
      it('stores dragPoly', () => {
        w = wrapper();
        const existing = [xy(1, 1)];
        const next = [xy(2, 2)];
        w.instance().dragPoly(existing, next);
        expect(w.state().dragPoly).toEqual({ existing, next });
      });
    });

    describe('clearDragState', () => {
      const assertClear = (key, value) => {
        it(`clears ${key}`, () => {
          w = wrapper();
          w.setState({ [key]: value });
          w.instance().clearDragState();
          expect(w.state()[key]).toBeUndefined();
        });
      };

      assertClear('dragPoint', { from: xy(1, 1), to: xy(2, 2) });

      assertClear('dragLine', {
        existing: { from: xy(1, 1), to: xy(2, 2) },
        next: { from: xy(2, 2), to: xy(3, 3) }
      });

      assertClear('dragPoly', {
        existing: [],
        next: []
      });
    });

    describe('getPointsAndLines', () => {
      const defaultPoints = [xy(0, 0), xy(1, 1), xy(1, 0)];

      const assertPointsAndLines = (isClosed, key, value, expected) => {
        it(`builds points and lines for ${key} = ${value}`, () => {
          w = wrapper({
            closed: isClosed,
            points: defaultPoints
          });
          w.setState({ [key]: value });
          const result = w.instance().getPointsAndLines();

          expect(result).toMatchObject(expected);
        });
      };

      assertPointsAndLines(
        true,
        'dragPoint',
        {
          from: xy(0, 0),
          to: xy(-1, 0)
        },
        {
          points: [xy(0, 0), xy(1, 1), xy(1, 0)],
          poly: [xy(-1, 0), xy(1, 1), xy(1, 0)],
          lines: buildLines([xy(-1, 0), xy(1, 1), xy(1, 0)], true)
        }
      );

      assertPointsAndLines(
        true,
        'dragLine',
        {
          existing: {
            from: xy(0, 0),
            to: xy(1, 1)
          },
          next: {
            from: xy(1, 0),
            to: xy(2, 1)
          }
        },
        {
          points: [xy(1, 0), xy(2, 1), xy(1, 0)],
          poly: [xy(1, 0), xy(2, 1), xy(1, 0)],
          lines: buildLines(defaultPoints, true)
        }
      );
      assertPointsAndLines(
        true,
        'dragPoly',
        { existing: [], next: [xy(2, 2), xy(3, 3)] },
        {
          points: [xy(2, 2), xy(3, 3)],
          poly: defaultPoints,
          lines: buildLines([xy(2, 2), xy(3, 3)], true)
        }
      );
    });

    describe('close', () => {
      it('calls onClosePolygon', () => {
        const onClosePolygon = jest.fn();
        w = wrapper({ onClosePolygon, points: [xy(1, 1), xy(2, 2), xy(3, 3)] });
        w.instance().close();
        expect(onClosePolygon).toHaveBeenCalled();
      });
    });
  });
});
