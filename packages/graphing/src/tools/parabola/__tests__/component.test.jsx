import { shallow } from 'enzyme';
import React from 'react';
import { withRootEdge } from '../../shared/line/with-root-edge';
import { buildDataPoints, parabolaFromTwoPoints } from '../../utils';
import { utils } from '@pie-lib/plot';

import { graphProps as getGraphProps } from '../../../__tests__/utils';

const { xy } = utils;
jest.mock('../../utils', () => ({
  buildDataPoints: jest.fn().mockReturnValue([]),
  parabolaFromTwoPoints: jest.fn(() => jest.fn())
}));

jest.mock('../../shared/line/with-root-edge', () => ({
  withRootEdge: jest.fn(),
  rootEdgeComponent: jest.fn()
}));
describe('Parabola', () => {
  let fnBody;
  let graphProps;
  let root;
  let edge;
  let result;
  beforeEach(() => {
    require('../component');
    fnBody = withRootEdge.mock.calls[0][0];
    graphProps = getGraphProps();
    root = xy(0, 0);
    edge = xy(1, 1);

    result = fnBody({ graphProps, root, edge });
  });
  it('fnBody is not null', () => {
    expect(fnBody).toBeDefined();
  });

  it('calls buildDataPoints', () => {
    const { domain } = graphProps;
    expect(buildDataPoints).toHaveBeenCalledWith(
      domain.min,
      domain.max,
      root,
      edge,
      1,
      expect.anything()
    );
  });
  it('calls parabolaFromTwoPoints', () => {
    expect(parabolaFromTwoPoints).toHaveBeenCalledWith(root, edge);
  });

  it('returns dataPoints', () => {
    expect(result).toEqual({ root, edge, dataPoints: [] });
  });
});
