import React from 'react';
import { BasePoint } from '../shared/point';
import { ToolPropTypeFields } from '../shared/types';
import { types } from '@pie-lib/plot';
import ReactDOM from 'react-dom';
import MarkLabel from '../../mark-label';
import { isEmpty, isEqual } from 'lodash-es';

export class Point extends React.Component {
  static propTypes = {
    graphProps: types.GraphPropsType.isRequired,
    ...ToolPropTypeFields,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    // which label is being edited, null if none - a point only has the one
    this.state = { editingLabel: null };
  }

  componentDidUpdate(prevProps) {
    // leaving label mode closes any label that is still being edited
    if (prevProps.labelModeEnabled && !this.props.labelModeEnabled && this.state.editingLabel !== null) {
      this.setState({ editingLabel: null });
    }
  }

  move = (p) => {
    const mark = { ...this.state.mark, ...p };
    this.setState({ mark });
  };

  startDrag = () => {
    const { onDragStart } = this.props;
    const update = { ...this.props.mark };

    if (update.label === '') {
      delete update.label;
    }
    this.setState({ mark: update });
    if (onDragStart) onDragStart();
  };

  stopDrag = () => {
    const { onChange, onDragStop } = this.props;
    const mark = { ...this.state.mark };
    this.setState({ mark: undefined }, () => {
      if (!isEqual(this.props.mark, mark)) {
        onChange(this.props.mark, mark);
      }
      if (onDragStop) onDragStop();
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

  stopEditingLabel = () => {
    if (this.state.editingLabel !== null) {
      this.setState({ editingLabel: null });
    }
  };

  clickPoint = () => {
    const { labelModeEnabled, onChange, onClick, mark } = this.props;

    if (!labelModeEnabled) {
      onClick(mark);
      return;
    }

    if (mark.disabled) {
      return;
    }

    onChange(mark, { label: '', ...mark });

    // MarkLabel focuses itself once it is rendered - it also holds on to the focus if the model
    // that comes back from the host (api save) remounts the input.
    this.setState({ editingLabel: 'label' });
  };

  render() {
    const { coordinatesOnHover, graphProps, labelNode, labelModeEnabled } = this.props;
    const { editingLabel } = this.state;
    const mark = this.state.mark ? this.state.mark : this.props.mark;

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
          onTouchStart={(e) => {
            e.stopPropagation();
            this.clickPoint();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            this.clickPoint();
          }}
        />
        {labelNode &&
          Object.prototype.hasOwnProperty.call(mark, 'label') &&
          ReactDOM.createPortal(
            <MarkLabel
              inputRef={(r) => (this.input = r)}
              autoFocus={editingLabel === 'label'}
              disabled={!labelModeEnabled}
              mark={mark}
              graphProps={graphProps}
              onBlur={this.stopEditingLabel}
              onChange={this.labelChange}
            />,
            labelNode,
          )}
      </React.Fragment>
    );
  }
}

export default Point;
