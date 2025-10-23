import { styled } from '@mui/material/styles';
import { gridDraggable } from '@pie-lib/plot';
import * as utils from '../../../utils';
import { disabled, correct, incorrect, missing } from '../styles';
import { RawBp } from './base-point';
import { RawArrow } from './arrow-point';
import { color } from '@pie-lib/render-ui';
import BaseArrow from './arrow';

const opts = {
  bounds: (props, { domain, range }) => {
    const { x, y } = props;
    const area = { left: x, top: y, bottom: y, right: x };

    return utils.bounds(area, domain, range);
  },
  anchorPoint: (props) => {
    const { x, y } = props;

    return { x, y };
  },
  fromDelta: (props, delta) => {
    return utils.point(props).add(utils.point(delta));
  },
};

const StyledPointWrapper = styled('g', {
  shouldForwardProp: (prop) => !['disabled', 'correctness'].includes(prop),
})(({ disabled: isDisabled, correctness }) => ({
  '& circle, & polygon': {
    cursor: 'pointer',
    fill: color.defaults.SECONDARY,
    ...(isDisabled && disabled()),
    ...(correctness === 'correct' && correct()),
    ...(correctness === 'incorrect' && incorrect()),
    ...(correctness === 'missing' && missing()),
  },
}));

const withStyledWrapper = (WrappedComponent) => (props) => (
  <StyledPointWrapper disabled={props.disabled} correctness={props.correctness}>
    <WrappedComponent {...props} />
  </StyledPointWrapper>
);

export const BasePoint = gridDraggable(opts)(withStyledWrapper(RawBp));
export const ArrowPoint = gridDraggable(opts)(withStyledWrapper(RawArrow));
export const Arrow = gridDraggable(opts)(withStyledWrapper(BaseArrow));
