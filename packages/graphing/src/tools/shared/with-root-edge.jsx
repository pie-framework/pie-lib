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
      classes: PropTypes.object.isRequired,
      root: types.PointType.isRequired,
      edge: types.PointType,
      onChange: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      this.state = {};
    }

    startEdgeDrag = () => {};

    stopEdgeDrag = () => this.setState({ edge: undefined });

    dragEdge = edge => {
      log('[dragEdge] edge:', edge);
      this.setState({ edge });
    };

    startRootDrag = () => {};

    dragRoot = root => this.setState({ root });

    moveRoot = root => {
      const { edge, onChange } = this.props;
      const update = { root, edge };
      onChange(update);
    };

    moveEdge = edge => {
      const { root, onChange } = this.props;
      const update = { root, edge };
      onChange(update);
    };

    moveLine = ({ root, edge }) => {
      const { onChange } = this.props;
      onChange({ root, edge });
    };

    stopRootDrag = () => this.setState({ root: undefined });
    startLineDrag = () => {};
    stopLineDrag = () => this.setState({ line: undefined });
    dragLine = line => this.setState({ line });

    render() {
      const { classes, graphProps } = this.props;
      const { root, edge, dataPoints } = getPoints(this.props, this.state);

      const raw = dataPoints.map(d => [graphProps.scale.x(d.x), graphProps.scale.y(d.y)]);

      return (
        <g>
          {edge && (
            <LinePath
              xScale={d => graphProps.scale.x(d.x)}
              yScale={d => graphProps.scale.y(d.y)}
              data={raw}
              graphProps={graphProps}
              onDragStart={this.startLineDrag}
              onDragStop={this.stopLineDrag}
              onDrag={this.dragLine}
              root={this.props.root}
              edge={this.props.edge}
              onMove={this.moveLine}
              curve={curveMonotoneX}
            />
          )}

          <BasePoint
            graphProps={graphProps}
            x={root.x}
            y={root.y}
            onDragStart={this.startRootDrag}
            onDragStop={this.stopRootDrag}
            onDrag={this.dragRoot}
            onMove={this.moveRoot}
          />
          {edge && (
            <BasePoint
              graphProps={graphProps}
              x={edge.x}
              y={edge.y}
              onDragStart={this.startEdgeDrag}
              onDragStop={this.stopEdgeDrag}
              onDrag={this.dragEdge}
              onMove={this.moveEdge}
            />
          )}
        </g>
      );
    }
  }
  return RootEdge;
};
