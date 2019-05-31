import { lineToolComponent, lineBase } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';

import { gridDraggable, utils } from '@pie-lib/plot';

const Line = gridDraggable({
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
});

Line.propTypes = {
  graphProps: PropTypes.any
};

const Segment = lineBase(Line);
const Component = lineToolComponent(Segment);

export default Component;
