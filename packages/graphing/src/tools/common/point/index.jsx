import { withStyles } from '@material-ui/core/styles/index';
import { gridDraggable } from '@pie-lib/plot';
import * as utils from '../../../utils';
import { disabled, correct, incorrect } from '../../styles';
import { RawBp } from './base-point';
import { RawArrow } from './arrow-point';

const gridDraggableProperties = {
  bounds: (props, { domain, range }) => {
    const { x, y } = props;
    const area = { left: x, top: y, bottom: y, right: x };

    return utils.bounds(area, domain, range);
  },
  anchorPoint: props => {
    const { x, y } = props;

    return { x, y };
  },
  fromDelta: (props, delta) => {
    return utils.point(props).add(utils.point(delta));
  }
};

const styles = theme => {
  return {
    point: {
      '& circle, & polygon': {
        cursor: 'pointer',
        fill: `var(--point-bg, ${theme.palette.secondary.main})`
      }
    },
    disabled: {
      '& circle, & polygon': {
        ...disabled()
      }
    },
    correct: {
      '& circle, & polygon': {
        ...correct()
      }
    },
    incorrect: {
      '& circle, & polygon': {
        ...incorrect()
      }
    }
  };
};

export const BP = gridDraggable(gridDraggableProperties)(RawBp);
export const AP = gridDraggable(gridDraggableProperties)(RawArrow);

export const BasePoint = withStyles(styles)(BP);
export const ArrowPoint = withStyles(styles)(AP);
