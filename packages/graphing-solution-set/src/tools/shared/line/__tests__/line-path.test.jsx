import { render } from '@pie-lib/test-utils';
import React from 'react';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';
import { utils } from '@pie-lib/plot';
import * as lineUtils from '../../../../utils';

const { xy } = utils;

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
    gridDraggable: jest.fn((opts) => (Comp) => Comp),
    types: a.types,
    utils: a.utils,
  };
});

describe('LinePath', () => {
  let LinePath;
  let onChange = jest.fn();
  beforeEach(() => {
    LinePath = require('../line-path').LinePath;
  });
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: getGraphProps(),
      from: xy(0, 0, 0),
      to: xy(1, 1, 0),
      data: [
        [0, 0],
        [1, 1],
      ],
    };
    const props = { ...defaults, ...extras };
    return render(<LinePath {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
