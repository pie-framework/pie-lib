import React from 'react';
import { BasePoint } from '../common/point';
import debug from 'debug';
import { ToolPropTypeFields } from '../types';
import { types } from '@pie-lib/plot';

const log = debug('pie-lib:graphing:point');

export class Point extends React.Component {
  static propTypes = {
    graphProps: types.GraphPropsType.isRequired,
    ...ToolPropTypeFields
  };

  static defaultProps = {};

  move = p => {
    const { mark, onChange } = this.props;
    const m = { ...mark, ...p };
    onChange(mark, m);
  };

  render() {
    const { mark, graphProps, onDragStart, onDragStop } = this.props;
    return (
      <BasePoint
        {...mark}
        onDrag={this.move}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        graphProps={graphProps}
      />
    );
  }
}

export default Point;
