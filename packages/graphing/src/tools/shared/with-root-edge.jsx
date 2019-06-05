import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import LinePath from '../shared/line-path';
import { curveMonotoneX } from '@vx/curve';
import { BasePoint } from '../common/point';
import { ToolPropTypeFields } from '../types';

import debug from 'debug';
import isEqual from 'lodash/isEqual';
import { isDomainRangeEqual } from '../../../../charting/src/utils';

const log = debug('pie-lib:graphing:with-root-edge');

export const rootEdgeComponent = RootEdgeComp => {
  return class Component extends React.Component {
    static propTypes = {
      ...ToolPropTypeFields,
      graphProps: types.GraphPropsType.isRequired
    };

    constructor(props) {
      super(props);
      this.state = {};
    }

    changeMark = ({ root, edge }) => {
      const mark = { ...this.state.mark, root, edge };
      this.setState({ mark });
    };

    startDrag = () => this.setState({ mark: { ...this.props.mark } });

    stopDrag = () => {
      const { onChange } = this.props;
      const mark = { ...this.state.mark };
      this.setState({ mark: undefined }, () => {
        if (!isEqual(mark, this.props.mark)) {
          onChange(this.props.mark, mark);
        }
      });
    };

    shouldComponentUpdate(nextProps, nextState) {
      return (
        !isEqual(this.props.mark, nextProps.mark) ||
        !isEqual(this.state.mark, nextState.mark) ||
        !isDomainRangeEqual(this.props.graphProps, nextProps.graphProps)
      );
    }

    render() {
      const { graphProps, onClick } = this.props;

      const mark = this.state.mark ? this.state.mark : this.props.mark;

      return (
        <RootEdgeComp
          root={mark.root}
          edge={mark.edge}
          graphProps={graphProps}
          onChange={this.changeMark}
          onClick={onClick}
          onDragStart={this.startDrag}
          onDragStop={this.stopDrag}
        />
      );
    }
  };
};
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
