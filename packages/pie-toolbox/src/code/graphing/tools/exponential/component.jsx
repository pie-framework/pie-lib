import debug from 'debug';
import { buildDataPoints, exponentialFromTwoPoints } from '../../../graphing-utils';
import { withRootEdge, rootEdgeComponent } from '../shared/line/with-root-edge';

const log = debug('pie-lib:graphing:exponential');

const Exponential = withRootEdge((props) => {
  const { domain } = props.graphProps;

  const { root, edge } = props;
  const interval = 1;

  const dataPoints =
    edge && edge.x === root.x
      ? []
      : buildDataPoints(
          domain.min,
          domain.max,
          root,
          edge,
          domain.step || interval,
          exponentialFromTwoPoints(root, edge),
        );
  log('dataPoints:', dataPoints);
  return { root: props.root, edge: props.edge, dataPoints };
});

const Component = rootEdgeComponent(Exponential);
export default Component;
