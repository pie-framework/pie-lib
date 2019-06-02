import { lineToolComponent, lineBase } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';
import { trig, types } from '@pie-lib/plot';

const ArrowedLine = props => {
  const { graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
  const [eFrom, eTo] = trig.edges(graphProps.domain, graphProps.range)(from, to);

  return (
    <line
      stroke="red"
      strokeWidth="7"
      x1={scale.x(eFrom.x)}
      y1={scale.y(eFrom.y)}
      x2={scale.x(eTo.x)}
      y2={scale.y(eTo.y)}
      {...rest}
    />
  );
};

ArrowedLine.propTypes = {
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType
};

const Line = lineBase(ArrowedLine);
const Component = lineToolComponent(Line);

export default Component;
