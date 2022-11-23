import debug from 'debug';
import { sinY, buildDataPoints, getAmplitudeAndFreq, FREQ_DIVIDER } from '@pie-lib/graphing-utils';
import { withRootEdge, rootEdgeComponent } from '../shared/line/with-root-edge';

const log = debug('pie-lib:graphing:sine');

log('sine...');

const Sine = withRootEdge((props) => {
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
          sinY(amplitude, freq, { phase: root.x, vertical: root.y }),
        );
  return { root: props.root, edge: props.edge, dataPoints };
});

const Component = rootEdgeComponent(Sine);
export default Component;
