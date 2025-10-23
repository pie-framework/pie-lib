import { lineToolComponent, lineBase, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import classNames from 'classnames';
import { styled } from '@mui/material/styles';

const StyledLineRoot = styled('line')(({ theme }) => ({
  line: styles.line(theme),
  disabled: styles.disabled(theme),
  disabledSecondary: styles.disabledSecondary(theme),
  correct: styles.correct(theme, 'stroke'),
  incorrect: styles.incorrect(theme, 'stroke'),
  missing: styles.missing(theme, 'stroke'),
}));

export const Line = (props) => {
  const { className, correctness, disabled, graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;

  return (
    <StyledLineRoot
      stroke="green"
      strokeWidth={6}
      x1={scale.x(from.x)}
      y1={scale.y(from.y)}
      x2={scale.x(to.x)}
      y2={scale.y(to.y)}
      className={classNames(
        'line',
        disabled && 'disabledSecondary',
        correctness,
        className
      )}
      {...rest}
    />
  );
};

Line.propTypes = {
  className: PropTypes.string,
  correctness: PropTypes.string,
  disabled: PropTypes.bool,
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType,
};

const Segment = lineBase(Line);
const Component = lineToolComponent(Segment);

export default Component;
