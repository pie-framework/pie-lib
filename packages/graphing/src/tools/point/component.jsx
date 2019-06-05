import React from 'react';
import { BasePoint } from '../common/point';
import debug from 'debug';
import { ToolPropTypeFields } from '../types';
import { types } from '@pie-lib/plot';
import ReactDOM from 'react-dom';
import { MarkLabel } from '../../mark-label';

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

  labelChange = label => {
    const { onChange } = this.props;
    this.setState({ mark: undefined }, () => {
      onChange(this.props.mark, { ...this.props.mark, label });
    });
  };

  render() {
    const { graphProps, labelNode } = this.props;
    console.log('labelNode: ', labelNode);
    const mark = this.state.mark ? this.state.mark : this.props.mark;
    return (
      <React.Fragment>
        <BasePoint
          {...mark}
          onDrag={this.move}
          onDragStart={this.startDrag}
          onDragStop={this.stopDrag}
          graphProps={graphProps}
        />
        {labelNode &&
          mark.label &&
          ReactDOM.createPortal(
            <MarkLabel mark={mark} graphProps={graphProps} onChange={this.labelChange} />,
            labelNode
          )}
      </React.Fragment>
    );
  }
}

export default Point;
