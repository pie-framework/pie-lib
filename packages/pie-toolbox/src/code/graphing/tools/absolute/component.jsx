import debug from 'debug';
import { buildDataPoints, absoluteFromTwoPoints } from '../../../graphing-utils';
import { withRootEdge, rootEdgeComponent } from '../shared/line/with-root-edge';

const log = debug('pie-lib:graphing:absolute');

const Absolute = withRootEdge((props) => {
  const { root, edge, graphProps } = props;
  const { domain, range } = graphProps;

  const dataPoints =
    edge && edge.x === root.x
      ? []
      : buildDataPoints(domain, range, root, edge, absoluteFromTwoPoints(root, edge), true);

  log('dataPoints:', dataPoints);

  return { root: props.root, edge: props.edge, dataPoints, enableCurve: false };
});

const Component = rootEdgeComponent(Absolute);

export default Component;
