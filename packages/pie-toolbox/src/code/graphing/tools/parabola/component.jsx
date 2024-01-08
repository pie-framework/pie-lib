import debug from 'debug';
import { buildDataPoints, parabolaFromTwoPoints } from '../../../graphing-utils';
import { withRootEdge, rootEdgeComponent } from '../shared/line/with-root-edge';

const log = debug('pie-lib:graphing:parabola');

const Parabola = withRootEdge((props) => {
  const { root, edge, graphProps } = props;
  const { domain, range } = graphProps;

  const dataPoints =
    edge && edge.x === root.x
      ? []
      : buildDataPoints(domain, range, root, edge, parabolaFromTwoPoints(root, edge), true);

  log('dataPoints:', dataPoints);

  return { root: props.root, edge: props.edge, dataPoints };
});

const Component = rootEdgeComponent(Parabola);

export default Component;
