import { lineToolComponent, lineBase } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';

const slope = (from, to) => (from.y - to.y) / (from.x - to.x);

const getEdges = (from, to, gp) => {
  const s = slope(from, to);

  const f = {
    x: gp.domain.min,
    y: s * gp.domain.min
  };
  const t = {
    x: gp.domain.max,
    y: s * gp.domain.max
  };
  return { from: f, to: t };
};

const ArrowedLine = props => {
  const { graphProps, from, to } = props;
  const { scale } = graphProps;
  const edges = getEdges(from, to, graphProps);
  return (
    <line
      x1={scale.x(edges.from.x)}
      y1={scale.y(edges.from.y)}
      x2={scale.x(edges.to.x)}
      y2={scale.y(edges.to.y)}
    />
  );
};
ArrowedLine.propTypes = {
  graphProps: PropTypes.any
};
const Line = lineBase(ArrowedLine);
const Component = lineToolComponent(Line);

export default Component;
