import { shallow } from 'enzyme';
import React from 'react';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';
import { gridDraggable, utils } from '@pie-lib/plot';
const { xy } = utils;

import * as lineUtils from '../../../../utils';

const { bounds, pointsToArea } = lineUtils;
jest.mock('../../../../utils', () => {
  const a = jest.requireActual('../../../../utils');
  return {
    pointsToArea: jest.fn().mockReturnValue({}),
    bounds: jest.fn().mockReturnValue({}),
    point: a.point
  };
});

jest.mock('@pie-lib/plot', () => {
  const a = jest.requireActual('@pie-lib/plot');
  return {
    gridDraggable: jest.fn(opts => jest.fn()),
    types: a.types,
    utils: a.utils
  };
});

describe('LinePath', () => {
  let LinePath;
  let w;
  let onChange = jest.fn();
  beforeEach(() => {
    LinePath = require('../line-path').LinePath;
    // console.log('line path', LinePath);
  });
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: getGraphProps(),
      root: xy(0, 0, 0),
      edge: xy(1, 1, 0)
    };
    const props = { ...defaults, ...extras };
    return shallow(<LinePath {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});

describe('gridDraggable', () => {
  let opts;
  let graphProps;
  beforeEach(() => {
    require('../line-path');
    graphProps = getGraphProps();
    opts = gridDraggable.mock.calls[0][0];
  });

  describe('bounds', () => {
    beforeEach(() => {
      const root = xy(0, 0);
      const edge = xy(1, 1);
      const result = opts.bounds({ root: xy(0, 0), edge: xy(1, 1) }, graphProps);
    });

    it('calls bounds', () => {
      expect(bounds).toHaveBeenCalledWith(
        {},
        { max: 1, min: 0, step: 1 },
        { max: 1, min: 0, step: 1 }
      );
    });
    it('calls pointsToArea', () => {
      expect(pointsToArea).toHaveBeenCalledWith(xy(0, 0), xy(1, 1));
    });
  });

  describe('anchorPoint', () => {
    it('returns root', () => {
      const result = opts.anchorPoint({ root: xy(2, 2) });
      expect(result).toEqual(xy(2, 2));
    });
  });
  describe('fromDelta', () => {
    it('returns the delta', () => {
      const result = opts.fromDelta({ root: xy(0, 0), edge: xy(1, 1) }, xy(1, 1));
      expect(result).toEqual({ root: xy(1, 1), edge: xy(2, 2) });
    });
  });
});
