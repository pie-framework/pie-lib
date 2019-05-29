import React from 'react';
import { ToolPropTypeFields } from '../types';
import debug from 'debug';
import { types } from '@pie-lib/plot';
import { buildDataPoints, parabolaFromTwoPoints } from '../utils';
import { withRootEdge } from '../shared/with-root-edge';

const log = debug('pie-lib:graphing:sine');

const Parabola = withRootEdge((props, state) => {
  const { domain } = props.graphProps;

  if (state.line) {
    const dataPoints = buildDataPoints(
      domain.min,
      domain.max,
      props.root,
      props.edge,
      1,
      parabolaFromTwoPoints(props.root, props.edge)
    );

    log('dataPoints:', dataPoints);
    return {
      root: state.line.root,
      edge: state.line.edge,
      dataPoints
    };
  }

  const root = state.root ? state.root : props.root;
  const edge = state.edge ? state.edge : props.edge;
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
    const { mark, graphProps, onClick } = this.props;
    return (
      <Parabola
        root={mark.root}
        edge={mark.edge}
        graphProps={graphProps}
        onChange={this.changeMark}
        onClick={onClick}
      />
    );
  }
}
