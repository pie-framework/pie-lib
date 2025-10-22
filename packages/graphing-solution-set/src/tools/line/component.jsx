import { lineToolComponent, lineBase, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';
import { trig, types } from '@pie-lib/plot';
import { styled } from '@mui/material/styles';
import { ArrowMarker, genUid } from '../shared/arrow-head';
import { thinnerShapesNeeded, getAdjustedGraphLimits } from '../../utils';

const StyledLine = styled('line', {
  shouldForwardProp: (prop) => !['fill', 'disabled', 'correctness'].includes(prop),
})(({ theme, fill, disabled, correctness }) => ({
  ...(fill === 'Solid' ? styles.line(theme) : styles.dashedLine(theme)),
  ...(disabled && styles.disabled(theme)),
  ...(correctness === 'correct' && styles.correct(theme, 'stroke')),
  ...(correctness === 'incorrect' && styles.incorrect(theme, 'stroke')),
  ...(correctness === 'missing' && styles.missing(theme, 'stroke')),
}));

const StyledArrowMarker = styled(ArrowMarker, {
  shouldForwardProp: (prop) => !['suffix'].includes(prop),
})(({ theme, suffix }) => ({
  ...(suffix === 'enabled' && styles.arrow(theme)),
  ...(suffix === 'disabled' && styles.disabledArrow(theme)),
  ...(suffix === 'correct' && styles.correct(theme)),
  ...(suffix === 'incorrect' && styles.incorrect(theme)),
  ...(suffix === 'missing' && styles.missing(theme)),
}));

export const ArrowedLine = (props) => {
  const markerId = genUid();
  const { className, correctness, disabled, graphProps, fill = 'Solid', from, to, ...rest } = props;
  const { scale } = graphProps;
  const { domain, range } = getAdjustedGraphLimits(graphProps);
  const [eFrom, eTo] = trig.edges(domain, range)(from, to);
  const suffix = correctness || (disabled && 'disabled') || 'enabled';

  return (
    <g>
      <defs>
        <StyledArrowMarker
          size={thinnerShapesNeeded(graphProps) ? 4 : 5}
          id={`${props.markerId || markerId}-${suffix}`}
          suffix={suffix}
        />
      </defs>
      <StyledLine
        x1={scale.x(eFrom.x)}
        y1={scale.y(eFrom.y)}
        x2={scale.x(eTo.x)}
        y2={scale.y(eTo.y)}
        fill={fill}
        disabled={disabled}
        correctness={correctness}
        className={className}
        markerEnd={`url(#${props.markerId || markerId}-${suffix})`}
        markerStart={`url(#${props.markerId || markerId}-${suffix})`}
        {...rest}
      />
    </g>
  );
};

ArrowedLine.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  correctness: PropTypes.string,
  disabled: PropTypes.bool,
  graphProps: types.GraphPropsType,
  from: types.PointType,
  to: types.PointType,
  markerId: PropTypes.string,
};

const Line = lineBase(ArrowedLine);
const Component = lineToolComponent(Line);

export default Component;
