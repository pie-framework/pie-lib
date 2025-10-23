import { lineToolComponent, lineBase, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';
import { trig, types } from '@pie-lib/plot';
import classNames from 'classnames';
import { ArrowMarker, genUid } from '../shared/arrow-head';
import { thinnerShapesNeeded, getAdjustedGraphLimits } from '../../utils';
import { styled } from '@mui/material/styles';

const StyledArrowedLineRoot = styled('g')(({ theme }) => ({
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

export const ArrowedLine = (props) => {
  const markerId = genUid();
  const { className, correctness, disabled, graphProps, from, to, markerId: propMarkerId, ...rest } = props;
  const { scale } = graphProps;
  const { domain, range } = getAdjustedGraphLimits(graphProps);
  const [eFrom, eTo] = trig.edges(domain, range)(from, to);
  const suffix = correctness || (disabled && 'disabled') || 'enabled';
  const finalMarkerId = propMarkerId || markerId;

  return (
    <StyledArrowedLineRoot>
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
        x1={scale.x(eFrom.x)}
        y1={scale.y(eFrom.y)}
        x2={scale.x(eTo.x)}
        y2={scale.y(eTo.y)}
        className={classNames(
          'line',
          disabled && 'disabledSecondary',
          correctness,
          className
        )}
        markerEnd={`url(#${finalMarkerId}-${suffix})`}
        markerStart={`url(#${finalMarkerId}-${suffix})`}
        {...rest}
      />
    </StyledArrowedLineRoot>
  );
};

ArrowedLine.propTypes = {
  className: PropTypes.string,
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
