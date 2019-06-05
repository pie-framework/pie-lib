import debug from 'debug';
import { buildDataPoints, parabolaFromTwoPoints } from '../utils';
import { withRootEdge, rootEdgeComponent } from '../shared/with-root-edge';

const log = debug('pie-lib:graphing:sine');

const Parabola = withRootEdge(props => {
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
          interval,
          parabolaFromTwoPoints(root, edge)
        );
  log('dataPoints:', dataPoints);
  return { root: props.root, edge: props.edge, dataPoints };
});

const Component = rootEdgeComponent(Parabola);
export default Component;
