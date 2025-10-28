import { lineToolComponent, lineBase, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';
import { ArrowMarker, genUid } from '../shared/arrow-head';
import { trig, types } from '@pie-lib/plot';
import classNames from 'classnames';
import { thinnerShapesNeeded, getAdjustedGraphLimits } from '../../utils';
import { styled } from '@mui/material/styles';

const StyledRayRoot = styled('g')(({ theme, disabled, correctness }) => ({
  '& line': {
    ...styles.line(theme),
    ...(disabled && styles.disabledSecondary(theme)),
    ...(correctness === 'correct' && styles.correct(theme, 'stroke')),
    ...(correctness === 'incorrect' && styles.incorrect(theme, 'stroke')),
    ...(correctness === 'missing' && styles.missing(theme, 'stroke')),
  },
  '& .enabledArrow': {
    ...styles.arrow(theme),
  },
  '& .disabledArrow': {
    ...styles.disabledArrow(theme),
  },
  '& .correctArrow': {
    ...styles.correct(theme),
  },
  '& .incorrectArrow': {
    ...styles.incorrect(theme),
  },
  '& .missingArrow': {
    ...styles.missing(theme),
  },
}));

export const RayLine = (props) => {
  const markerId = genUid();
  const { graphProps, from, to, disabled, correctness, className, markerId: propMarkerId, ...rest } = props;
  const { scale } = graphProps;
  const { domain, range } = getAdjustedGraphLimits(graphProps);
  const [aToB] = trig.edges(domain, range)(from, to);
  const suffix = correctness || (disabled && 'disabled') || 'enabled';
  const finalMarkerId = propMarkerId || markerId;

  return (
    <StyledRayRoot disabled={disabled} correctness={correctness}>
      <defs>
        <ArrowMarker
          size={thinnerShapesNeeded(graphProps) ? 4 : 5}
          id={`${finalMarkerId}-${suffix}`}
          className={classNames(
            suffix === 'enabled' ? 'enabledArrow' :
            suffix === 'disabled' ? 'disabledArrow' :
            `${suffix}Arrow`
          )}
        />
      </defs>
      <line
        x1={scale.x(from.x)}
        y1={scale.y(from.y)}
        x2={scale.x(aToB.x)}
        y2={scale.y(aToB.y)}
        className={className}
        markerEnd={`url(#${finalMarkerId}-${suffix})`}
        {...rest}
      />
    </StyledRayRoot>
  );
};

RayLine.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  correctness: PropTypes.string,
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType,
  markerId: PropTypes.string,
};

const Ray = lineBase(RayLine);
const Component = lineToolComponent(Ray);

export default Component;
