import debug from 'debug';
import Point from '@mapbox/point-geometry';
import { sinY, buildDataPoints } from '../utils';
import { withRootEdge, rootEdgeComponent } from '../shared/line/with-root-edge';

const FREQ_DIVIDER = 16;

const log = debug('pie-lib:graphing:sine');

log('sine...');
const getAmplitudeAndFreq = (root, edge) => {
  if (!edge) {
    return { freq: 0, amplitude: 0 };
  }

  if (root.x == edge.x) {
    return { freq: 0, amplitude: 0 };
  }

  const r = new Point(root.x, root.y);
  const e = new Point(edge.x, edge.y);
  const d = e.sub(r);
  // edge point describes 1/4 of the freq
  return { freq: d.x * 4, amplitude: d.y };
};

const Sine = withRootEdge(props => {
  const { domain } = props.graphProps;

  const { root, edge } = props;
  const { amplitude, freq } = getAmplitudeAndFreq(root, edge);
  const interval = freq / FREQ_DIVIDER;
  log('[getPoints] amplitude:', amplitude, 'freq:', freq);

  const dataPoints =
    edge && edge.x === root.x
      ? []
      : buildDataPoints(
          domain.min,
          domain.max,
          root,
          edge,
          interval,
          sinY(amplitude, freq, { phase: root.x, vertical: root.y })
        );
  return { root: props.root, edge: props.edge, dataPoints };
});

const Component = rootEdgeComponent(Sine);
export default Component;
