import { lineToolComponent, lineBase } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';

import { trig, types } from '@pie-lib/plot';
import debug from 'debug';

const log = debug('pie-lib:graphing:ray-two');

const RayLine = props => {
  const { graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
  const [eFrom, eTo] = trig.edges(graphProps.domain, graphProps.range)(from, to);

  log('from:', from, 'to: ', to);
  log('eFrom:', eFrom, 'to: ', eTo);
  return (
    <line
      stroke="darkorange"
      strokeWidth="6"
      x1={scale.x(eFrom.x)}
      y1={scale.y(eFrom.y)}
      x2={scale.x(eTo.x)}
      y2={scale.y(eTo.y)}
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
