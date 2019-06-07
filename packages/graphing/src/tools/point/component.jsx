import React from 'react';
import { BasePoint } from '../shared/point';
import debug from 'debug';
import { ToolPropTypeFields } from '../shared/types';
import { types } from '@pie-lib/plot';
import ReactDOM from 'react-dom';
import { MarkLabel } from '../../mark-label';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
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

  startDrag = () => {
    const update = { ...this.props.mark };

    if (update.label === '') {
      delete update.label;
    }
    this.setState({ mark: update });
  };

  stopDrag = () => {
    const { onChange } = this.props;
    const mark = { ...this.state.mark };
    this.setState({ mark: undefined }, () => {
      if (!isEqual(this.props.mark, mark)) {
        onChange(this.props.mark, mark);
      }
    });
  };

  labelChange = label => {
    const { onChange } = this.props;
    const update = { ...this.props.mark, label };

    if (!label || isEmpty(label)) {
      delete update.label;
    }

    this.setState({ mark: update }, () => {
      onChange(this.props.mark, update);
    });
  };

  clickPoint = () => {
    const { labelModeEnabled, onChange } = this.props;

    if (labelModeEnabled) {
      onChange(this.props.mark, { ...this.props.mark, label: '' });
      if (this.input) {
        this.input.focus();
      }
    }
  };

  render() {
    const { graphProps, labelNode, labelModeEnabled } = this.props;
    const mark = this.state.mark ? this.state.mark : this.props.mark;
    return (
      <React.Fragment>
        <BasePoint
          {...mark}
          onDrag={this.move}
          onDragStart={this.startDrag}
          onDragStop={this.stopDrag}
          graphProps={graphProps}
          onClick={this.clickPoint}
        />
        {labelNode &&
          mark.hasOwnProperty('label') &&
          ReactDOM.createPortal(
            <MarkLabel
              inputRef={r => (this.input = r)}
              disabled={!labelModeEnabled}
              mark={mark}
              graphProps={graphProps}
              onChange={this.labelChange}
            />,
            labelNode
          )}
      </React.Fragment>
    );
  }
}

export default Point;
