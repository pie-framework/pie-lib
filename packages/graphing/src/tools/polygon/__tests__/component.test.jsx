import { shallow } from 'enzyme';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import { RawBaseComponent, buildLines } from '../component';

describe('buildLines', () => {
  const defaultPoints = [xy(0, 0), xy(1, 1), xy(1, 0)];

  const assertBuildLines = (points, closed, expected) => {
    it(`builds points and lines for ${points} = ${expected}`, () => {
      const result = buildLines(points);
      expect(result).toMatchObject([
        { from: xy(0, 0, 0), to: xy(1, 1, 1) },
        { from: xy(1, 1, 1), to: xy(1, 0, 2) }
      ]);
    });
  };

  assertBuildLines(defaultPoints, true, []);
});

describe('swap', () => {
  it.todo('swaps pairs');
});

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
    describe('dragPoint', () => {
      it('calls onChange', () => {
        onChange = jest.fn();
        w = wrapper({ points: [xy(1, 1)], onChange });
        w.instance().dragPoint(0, xy(1, 1), xy(2, 2));
        expect(onChange).toHaveBeenCalledWith([xy(2, 2)]);
      });
    });
    describe('dragLine', () => {
      it('calls onChange', () => {
        w = wrapper({ points: [xy(1, 1, 0), xy(2, 2, 1)], onChange });
        w.instance().dragLine(
          { from: xy(1, 1, 0), to: xy(2, 2, 1) },
          { from: xy(2, 2, 0), to: xy(4, 4, 1) }
        );
        expect(onChange).toHaveBeenCalledWith([xy(2, 2, 0), xy(4, 4, 1)]);
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
        const w = wrapper({ onClosePolygon, onClick, isToolActive, closed });
        w.instance().clickPoint(xy(0, 0, 0), index, {});
        expect(mock).toHaveBeenCalled();
      });
    };

    assertCallback(true, false, 0, onClosePolygon);
    assertCallback(true, false, 1, onClick);
    assertCallback(false, false, 0, onClick);
    assertCallback(true, true, 0, onClick);
  });
});
