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
    point: a.point,
  };
});

jest.mock('@pie-lib/plot', () => {
  const a = jest.requireActual('@pie-lib/plot');
  return {
    gridDraggable: jest.fn((opts) => jest.fn()),
    types: a.types,
    utils: a.utils,
  };
});

describe('LinePath', () => {
  let LinePath;
  let w;
  let onChange = jest.fn();
  beforeEach(() => {
    LinePath = require('../line-path').LinePath;
  });
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: getGraphProps(),
      from: xy(0, 0, 0),
      to: xy(1, 1, 0),
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
