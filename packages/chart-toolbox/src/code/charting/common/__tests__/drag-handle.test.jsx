import { shallow } from 'enzyme/build';
import React from 'react';
import DragHandle from '../drag-handle';
import { gridDraggable } from '../../../plot';
import { graphProps } from './utils';
import { bounds } from '../../utils';

jest.mock('../../utils', () => {
  const { point } = jest.requireActual('../../utils');
  return {
    bounds: jest.fn(),
    point,
  };
});

jest.mock('../../../plot', () => {
  const { types, utils } = jest.requireActual('@pie-lib/plot');
  return {
    gridDraggable: jest.fn((opts) => (Comp) => Comp),
    types,
    utils,
  };
});

describe('BasePoint', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
      x: 0,
      y: 0,
      width: 100,
    };
    const props = { ...defaults, ...extras };
    return shallow(<DragHandle {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('gridDraggable options', () => {
    let opts;
    let domain;
    let range;
    beforeEach(() => {
      domain = {
        min: 0,
        max: 1,
        step: 1,
      };
      range = {
        min: 0,
        max: 1,
        step: 1,
      };
      const w = wrapper();
      opts = gridDraggable.mock.calls[0][0];
    });

    describe('bounds', () => {
      it('calls utils.bounds with area', () => {
        const result = opts.bounds({ x: 0, y: 0 }, { domain, range });

        expect(result).toEqual({ left: 0, top: 1, bottom: 0, right: 1 });
      });
    });
    describe('anchorPoint', () => {
      it('returns x/y', () => {
        const result = opts.anchorPoint({ x: 0, y: 0 });
        expect(result).toEqual({ x: 0, y: 0 });
      });
    });

    describe('fromDelta', () => {
      it('returns y coordinate of a new point from the x/y + delta', () => {
        const result = opts.fromDelta({ x: -1, y: 0 }, { x: 1, y: 3 });
        expect(result).toEqual(3);
      });
    });
  });
});
