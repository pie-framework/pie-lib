import { lineToolComponent, lineBase, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';
import { ArrowMarker, genUid } from '../shared/arrow-head';
import { trig, types } from '@pie-lib/plot';
import classNames from 'classnames';
import { thinnerShapesNeeded, getAdjustedGraphLimits } from '../../utils';
import { styled } from '@mui/material/styles';

const StyledRayRoot = styled('g')(({ theme }) => ({
  line: styles.line(theme),
  enabledArrow: styles.arrow(theme),
  disabledArrow: styles.disabledArrow(theme),
  disabled: styles.disabled(theme),
  disabledSecondary: styles.disabledSecondary(theme),
  correct: styles.correct(theme, 'stroke'),
  correctArrow: styles.correct(theme),
  incorrect: styles.incorrect(theme, 'stroke'),
  incorrectArrow: styles.incorrect(theme),
  missing: styles.missing(theme, 'stroke'),
  missingArrow: styles.missing(theme),
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
    <StyledRayRoot>
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
        className={classNames(
          'line',
          disabled && 'disabledSecondary',
          correctness,
          className
        )}
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
