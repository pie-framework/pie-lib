import { withStyles } from '@material-ui/core/styles/index';
import { gridDraggable } from '@pie-lib/plot';
import * as utils from '../../../utils';
import { disabled, correct, incorrect } from '../../styles';
import { RawSegment } from '../segment/segment';
import { RawVector } from '../vector/vector';
import { RawRay } from '../ray/ray';
import { RawLine } from '../line/line';

const applyStyle = fn => ({
  ...fn('stroke'),
  '&:hover': {
    strokeWidth: 3,
    ...fn('stroke')
  }
});

const styles = theme => ({
  bgSegment: {
    fill: 'transparent',
    stroke: theme.palette.primary.light,
    strokeWidth: 3,
    transition: 'stroke 200ms ease-in, stroke-width 200ms ease-in',
    '&:hover': {
      strokeWidth: 6,
      stroke: theme.palette.primary.dark
    }
  },
  arrow: {
    fill: `var(--point-bg, ${theme.palette.secondary.main})`
  },
  disabled: applyStyle(disabled),
  correct: applyStyle(correct),
  incorrect: applyStyle(incorrect)
});

export const BgSegment = withStyles(styles)(RawSegment);
export const BgVector = withStyles(styles)(RawVector);
export const BgRay = withStyles(styles)(RawRay);
export const BgLine = withStyles(styles)(RawLine);

const gridDraggableProperties = {
  bounds: (props, { domain, range }) => {
    const { from, to } = props;
    const area = utils.lineToArea(from, to);

    return utils.bounds(area, domain, range);
  },
  anchorPoint: props => {
    const { from } = props;

    return from;
  },
  fromDelta: (props, delta) => {
    return utils.point(props).add(utils.point(delta));
  }
};

export default {
  segment: gridDraggable(gridDraggableProperties)(BgSegment),
  vector: gridDraggable(gridDraggableProperties)(BgVector),
  ray: gridDraggable(gridDraggableProperties)(BgRay),
  line: gridDraggable(gridDraggableProperties)(BgLine)
};
