import { lineToolComponent, lineBase } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';

import { types } from '@pie-lib/plot';

const Line = props => {
  const { graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
  // const [eFrom, eTo] = trig.edges(graphProps.domain, graphProps.range)(from, to);

  return (
    <line
      stroke="green"
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
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType
};

const Segment = lineBase(Line);
const Component = lineToolComponent(Segment);

export default Component;
