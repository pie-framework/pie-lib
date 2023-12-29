import debug from 'debug';
import { buildDataPoints, absoluteFromTwoPoints } from '../../../graphing-utils';
import { withRootEdge, rootEdgeComponent } from '../shared/line/with-root-edge';

const log = debug('pie-lib:graphing:absolute');

const Absolute = withRootEdge((props) => {
  const { domain } = props.graphProps;

  const { root, edge } = props;
  const interval = 1;

  const dataPoints =
    edge && edge.x === root.x
      ? []
      : buildDataPoints(domain.min, domain.max, root, edge, domain.step || interval, absoluteFromTwoPoints(root, edge));
  log('dataPoints:', dataPoints);
  return { root: props.root, edge: props.edge, dataPoints, enableCurve: false };
});

const Component = rootEdgeComponent(Absolute);
export default Component;
