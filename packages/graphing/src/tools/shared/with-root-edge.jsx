import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import LinePath from '../shared/line-path';
import { curveMonotoneX } from '@vx/curve';
import { BasePoint } from '../common/point/index';

import debug from 'debug';

const log = debug('pie-lib:graphing:with-root-edge');

export const withRootEdge = getPoints => {
  class RootEdge extends React.Component {
    static propTypes = {
      graphProps: types.GraphPropsType.isRequired,
      root: types.PointType.isRequired,
      edge: types.PointType,
      onChange: PropTypes.func.isRequired,
      onClick: PropTypes.func,
      onDragStart: PropTypes.func,
      onDragStop: PropTypes.func
    };

    static defaultProps = {
      onClick: () => ({})
    };

    dragRoot = root => {
      const { edge, onChange } = this.props;
      const update = { root, edge };
      onChange(update);
    };

    dragEdge = edge => {
      const { root, onChange } = this.props;
      const update = { root, edge };
      onChange(update);
    };

    dragLine = ({ root, edge }) => {
      const { onChange } = this.props;
      onChange({ root, edge });
    };

    render() {
      const { graphProps, onDragStart, onDragStop, onClick } = this.props;
      const { root, edge, dataPoints } = getPoints(this.props, this.state);

      const raw = dataPoints.map(d => [graphProps.scale.x(d.x), graphProps.scale.y(d.y)]);

      const common = { onClick, graphProps, onDragStart, onDragStop };
      return (
        <g>
          {edge && (
            <LinePath
              xScale={d => graphProps.scale.x(d.x)}
              yScale={d => graphProps.scale.y(d.y)}
              data={raw}
              onDrag={this.dragLine}
              root={this.props.root}
              edge={this.props.edge}
              curve={curveMonotoneX}
              {...common}
            />
          )}
          <BasePoint x={root.x} y={root.y} onDrag={this.dragRoot} {...common} />
          {edge && <BasePoint x={edge.x} y={edge.y} onDrag={this.dragEdge} {...common} />}
        </g>
      );
    }
  }
  return RootEdge;
};
