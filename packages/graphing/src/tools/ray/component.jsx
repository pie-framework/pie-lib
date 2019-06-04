import { lineToolComponent, lineBase } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';

import { trig, types } from '@pie-lib/plot';
import debug from 'debug';

const log = debug('pie-lib:graphing:ray-two');

const RayLine = props => {
  const { graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
  const [aToB, bToA] = trig.edges(graphProps.domain, graphProps.range)(from, to);

  log('from:', from, 'to: ', to);
  return (
    <line
      stroke="darkorange"
      strokeWidth="6"
      x1={scale.x(from.x)}
      y1={scale.y(from.y)}
      x2={scale.x(aToB.x)}
      y2={scale.y(aToB.y)}
      {...rest}
    />
  );
};

RayLine.propTypes = {
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType
};

const Ray = lineBase(RayLine);
const Component = lineToolComponent(Ray);

export default Component;
