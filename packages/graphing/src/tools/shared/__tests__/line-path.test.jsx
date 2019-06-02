import { shallow } from 'enzyme/build';
import React from 'react';
import { LinePath } from '../line-path';
import { gridDraggable } from '@pie-lib/plot';
import { graphProps, xy } from '../../../__tests__/utils';
import { bounds, pointsToArea } from '../../../utils';

jest.mock('../../../utils', () => {
  const { point, utils } = jest.requireActual('../../../utils');
  return {
    bounds: jest.fn(),
    pointsToArea: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    point,
    utils
  };
});

jest.mock('@pie-lib/plot', () => {
  const { types, utils } = jest.requireActual('@pie-lib/plot');
  return {
    gridDraggable: jest.fn(opts => Comp => Comp),
    types,
    utils
  };
});

describe('LinePath', () => {
  let w;
  let onChange = jest.fn();
  const root = { ...xy(0, 0) };
  const edge = { ...xy(1, 1) };
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      root,
      edge,
      graphProps: graphProps()
    };
    const props = { ...defaults, ...extras };
    return shallow(<LinePath {...props} />);
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
        step: 1
      };
      range = {
        min: 0,
        max: 1,
        step: 1
      };
      opts = gridDraggable.mock.calls[0][0];
    });

    describe('bounds', () => {
      it('calls utils.bounds with area', () => {
        const result = opts.bounds({ root, edge }, { domain, range });
        expect(bounds).toHaveBeenCalledWith(
          { left: 0, top: 0, bottom: 0, right: 0 },
          domain,
          range
        );
      });
    });
    describe('anchorPoint', () => {
      it('returns x/y', () => {
        const result = opts.anchorPoint({ root });
        expect(result).toEqual(root);
      });
    });

    describe('fromDelta', () => {
      it('returns a new point from the x/y + delta', () => {
        const result = opts.fromDelta({ root, edge }, { x: 1, y: 1 });
        expect(result).toEqual({
          root: { ...xy(1, 1) },
          edge: { ...xy(2, 2) }
        });
      });
    });
  });
});
