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

  constructor(props) {
    super(props);
    this.state = {};
  }

  move = p => {
    const mark = { ...this.state.mark, ...p };
    this.setState({ mark });
  };
  startDrag = () => this.setState({ mark: { ...this.props.mark } });

  stopDrag = () => {
    const { onChange } = this.props;
    const mark = { ...this.state.mark };
    this.setState({ mark: undefined }, () => {
      onChange(this.props.mark, mark);
    });
  };

  render() {
    const { graphProps } = this.props;
    const mark = this.state.mark ? this.state.mark : this.props.mark;
    return (
      <BasePoint
        {...mark}
        onDrag={this.move}
        onDragStart={this.startDrag}
        onDragStop={this.stopDrag}
        graphProps={graphProps}
      />
    );
  }
}

export default Point;
