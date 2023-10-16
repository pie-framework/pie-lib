import { withRootEdge } from '../../shared/line/with-root-edge';
import { buildDataPoints, sinY } from '../../../../graphing-utils/index';
import { utils } from '@pie-lib/plot';

import { graphProps as getGraphProps } from '../../../__tests__/utils';

const { xy } = utils;
jest.mock('../../../../graphing-utils/index', () => ({
  sinY: jest.fn().mockReturnValue(0),
  buildDataPoints: jest.fn().mockReturnValue([]),
  parabolaFromTwoPoints: jest.fn(() => jest.fn()),
  getAmplitudeAndFreq: jest.fn().mockReturnValue({ freq: 4, amplitude: 1 }),
  FREQ_DIVIDER: 16,
}));

jest.mock('../../shared/line/with-root-edge', () => ({
  withRootEdge: jest.fn(),
  rootEdgeComponent: jest.fn(),
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
    expect(buildDataPoints).toHaveBeenCalledWith(domain.min, domain.max, root, edge, 0.25, expect.anything());
  });

  it('calls sinY', () => {
    expect(sinY).toHaveBeenCalledWith(1, 4, expect.anything());
  });

  it('returns dataPoints', () => {
    expect(result).toEqual({ root, edge, dataPoints: [] });
  });
});
