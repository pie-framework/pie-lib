import React from 'react';
import { ToolPropTypeFields } from '../types';
import debug from 'debug';
import { types } from '@pie-lib/plot';
import { buildDataPoints, parabolaFromTwoPoints } from '../utils';
import { withRootEdge } from '../shared/with-root-edge';

const log = debug('pie-lib:graphing:sine');

const Parabola = withRootEdge(props => {
  const { domain } = props.graphProps;

  const { root, edge } = props;
  const interval = 1;

  const dataPoints =
    edge && edge.x === root.x
      ? []
      : buildDataPoints(
          domain.min,
          domain.max,
          root,
          edge,
          interval,
          parabolaFromTwoPoints(root, edge)
        );
  log('dataPoints:', dataPoints);
  return { root: props.root, edge: props.edge, dataPoints };
});

export default class Component extends React.Component {
  static propTypes = {
    ...ToolPropTypeFields,
    graphProps: types.GraphPropsType.isRequired
  };

  static defaultProps = {};

  changeMark = ({ root, edge }) => {
    const { mark, onChange } = this.props;
    const update = { ...mark, root, edge };
    onChange(mark, update);
  };

  render() {
    const { mark, graphProps, onClick, onDragStart, onDragStop } = this.props;
    return (
      <Parabola
        root={mark.root}
        edge={mark.edge}
        graphProps={graphProps}
        onChange={this.changeMark}
        onClick={onClick}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
      />
    );
  }
}
