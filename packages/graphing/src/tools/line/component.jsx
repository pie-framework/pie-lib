import { lineToolComponent, lineBase } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';

const buildExtendedLine = domain => (from, to) => {
  // const { scale } = this.context;
  // const { domain } = this.props;
  const expression = utils.expression(from, to);

  const fromX = expression.isVerticalLine ? from.x : domain.min;
  const toX = expression.isVerticalLine ? to.x : domain.max;

  const fromY = expression.getY(domain.min);
  const toY = expression.getY(domain.max);

  return {
    from: {
      x: fromX,
      y: fromY
    },
    to: {
      x: toX,
      y: toY
    }
  };
};

const slope = (from, to) => (from.y - to.y) / (from.x - to.x);

// const getEdges = (from, to, gp) => {
//   const s = slope(from, to);

//   const f = {
//     x: gp.domain.min,
//     y: s * gp.domain.min
//   };
//   const t = {
//     x: gp.domain.max,
//     y: s * gp.domain.max
//   };
//   return { from: f, to: t };
// };

const ArrowedLine = props => {
  const { graphProps, from, to } = props;
  const { scale } = graphProps;
  const el = buildExtendedLine(graphProps.domain, graphProps.scale)(from, to);

  return (
    <line
      stroke="red"
      x1={scale.x(el.from.x)}
      y1={scale.y(el.from.y)}
      x2={scale.x(el.to.x)}
      y2={scale.y(el.to.y)}
    />
  );
};
ArrowedLine.propTypes = {
  graphProps: PropTypes.any
};
const Line = lineBase(ArrowedLine);
const Component = lineToolComponent(Line);

export default Component;
