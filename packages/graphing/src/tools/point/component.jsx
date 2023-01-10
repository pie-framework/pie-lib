import React from 'react';
import { BasePoint } from '../shared/point';
import { ToolPropTypeFields } from '../shared/types';
import { types } from '@pie-lib/plot';
import ReactDOM from 'react-dom';
import MarkLabel from '../../mark-label';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

export class Point extends React.Component {
  static propTypes = {
    graphProps: types.GraphPropsType.isRequired,
    ...ToolPropTypeFields,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  move = (p) => {
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

  labelChange = (label) => {
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
    const { labelModeEnabled, onChange, onClick, mark } = this.props;

    if (labelModeEnabled) {
      onChange(mark, { label: '', ...mark });
      if (this.input) {
        this.input.focus();
      }
    } else {
      onClick(mark);
    }
  };

  render() {
    const { coordinatesOnHover, graphProps, labelNode, labelModeEnabled } = this.props;
    const mark = this.state.mark ? this.state.mark : this.props.mark;

    console.log(labelNode, "labelNode")
    return (
      <React.Fragment>
        <BasePoint
          {...mark}
          coordinatesOnHover={coordinatesOnHover}
          graphProps={graphProps}
          labelNode={labelNode}
          onDrag={this.move}
          onDragStart={this.startDrag}
          onDragStop={this.stopDrag}
          onClick={this.clickPoint}
          onTouchStart={(e) =>{ e.stopPropagation(); this.clickPoint();}} 
          onTouchEnd={this.clickPoint}
          onPointerDown={(e) =>{ e.stopPropagation(); this.clickPoint();}} 
          onPointerUp={(e) =>{ e.stopPropagation(); this.clickPoint();}} 
        />
        {labelNode &&
          mark.hasOwnProperty('label') &&
          ReactDOM.createPortal(
            <MarkLabel
              inputRef={(r) => (this.input = r)}
              disabled={!labelModeEnabled}
              mark={mark}
              graphProps={graphProps}
              onChange={this.labelChange}
            />,
            labelNode,
          )}
      </React.Fragment>
    );
  }
}

export default Point;
