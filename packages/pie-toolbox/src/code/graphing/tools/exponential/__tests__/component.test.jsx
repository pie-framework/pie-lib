import React from 'react';
import { withRootEdge } from '../../shared/line/with-root-edge';
import { buildDataPoints, exponentialFromTwoPoints } from '../../../../graphing-utils';
import { utils } from '../../../../plot';

import { graphProps as getGraphProps } from '../../../__tests__/utils';

const { xy } = utils;

jest.mock('../../../../graphing-utils', () => ({
  buildDataPoints: jest.fn().mockReturnValue([]),
  exponentialFromTwoPoints: jest.fn(() => jest.fn()),
  getAmplitudeAndFreq: jest.fn().mockReturnValue({ freq: 4, amplitude: 1 }),
}));

jest.mock('../../shared/line/with-root-edge', () => ({
  withRootEdge: jest.fn(),
  rootEdgeComponent: jest.fn(),
}));

describe('Exponential', () => {
  let fnBody;
  let graphProps;
  let root;
  let edge;
  let result;

  beforeEach(() => {
    require('../component');
    fnBody = withRootEdge.mock.calls[0][0];
    graphProps = getGraphProps();
    root = xy(1, 1);
    edge = xy(2, 2);

    result = fnBody({ graphProps, root, edge });
  });

  it('fnBody is not null', () => {
    expect(fnBody).toBeDefined();
  });

  it('calls buildDataPoints', () => {
    const { domain } = graphProps;
    expect(buildDataPoints).toHaveBeenCalledWith(domain.min, domain.max, root, edge, 1, expect.anything());
  });

  it('calls exponentialFromTwoPoints', () => {
    expect(exponentialFromTwoPoints).toHaveBeenCalledWith(root, edge);
  });

  it('returns dataPoints', () => {
    expect(result).toEqual({ root, edge, dataPoints: [] });
  });
});
