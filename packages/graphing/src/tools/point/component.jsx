import React from 'react';
import { BasePoint } from '../common/point';
import debug from 'debug';
import { ToolPropTypeFields } from '../types';
import { types } from '@pie-lib/plot';
import { Label } from '../common/label';

const log = debug('pie-lib:graphing:point');

export class Point extends React.Component {
  static propTypes = {
    graphProps: types.GraphPropsType.isRequired,
    ...ToolPropTypeFields
  };

  static defaultProps = {};

  state = {};

  move = p => {
    const { mark, onChange } = this.props;
    const m = { ...mark, ...p };
    onChange(mark, m);
  };

  changeLabel = label => {
    const { mark, onChange } = this.props;

    const m = { ...mark, label, showLabel: !(label === undefined) };
    onChange(mark, m);
  };

  drag = draggedTo => {
    this.setState({ draggedTo });
  };

  render() {
    const { mark, graphProps, onComponentClick } = this.props;
    const { draggedTo } = this.state;

    return (
      <g onClick={onComponentClick}>
        <BasePoint {...mark} onMove={this.move} onDrag={this.drag} graphProps={graphProps} />
        <Label onChange={this.changeLabel} {...mark} {...draggedTo} graphProps={graphProps} />
      </g>
    );
  }
}

export default Point;
