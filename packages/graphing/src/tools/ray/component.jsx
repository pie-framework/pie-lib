import { lineToolComponent, lineBase } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';

import { trig, gridDraggable, utils } from '@pie-lib/plot';
import debug from 'debug';

const log = debug('pie-lib:graphing:ray-two');

const RayLine = gridDraggable({
  bounds: (props, { domain, range }) => {
    const area = utils.lineToArea(props.from, props.to);
    return utils.bounds(area, domain, range);
  },
  anchorPoint: props => {
    const { from } = props;
    return from;
  },
  fromDelta: (props, delta) => {
    const { from, to } = props;
    return {
      from: utils.point(from).add(utils.point(delta)),
      to: utils.point(to).add(utils.point(delta))
    };
  }
})(props => {
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
});

RayLine.propTypes = {
  graphProps: PropTypes.any
};

const Ray = lineBase(RayLine);
const Component = lineToolComponent(Ray);

export default Component;
