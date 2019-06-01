import { lineToolComponent, lineBase } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';

const Line = props => {
  const { graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
  return (
    <line
      stroke="magenta"
      strokeWidth="6"
      x1={scale.x(from.x)}
      y1={scale.y(from.y)}
      x2={scale.x(to.x)}
      y2={scale.y(to.y)}
      {...rest}
    />
  );
};

Line.propTypes = {
  graphProps: PropTypes.any
};

const Vector = lineBase(Line);
const Component = lineToolComponent(Vector);

export default Component;
