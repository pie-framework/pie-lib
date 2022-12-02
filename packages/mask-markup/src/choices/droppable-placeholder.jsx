import React from 'react';
import PropTypes from 'prop-types';
import { PlaceHolder, DropTarget } from '@pie-lib/drag';
import debug from 'debug';

const log = debug('@pie-ui:categorize:droppable-placeholder');

export class DroppablePlaceholder extends React.Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    className: PropTypes.string,
    grid: PropTypes.object,
    disabled: PropTypes.bool,
  };
  render() {
    const { children, connectDropTarget, isOver } = this.props;

    return connectDropTarget(
      <div style={{ flex: 1 }}>
        <PlaceHolder choiceBoard={true} isOver={isOver}>
          {children}
        </PlaceHolder>
      </div>,
    );
  }
}

export const spec = {
  drop() {
    return true;
  },
  canDrop() {
    return true;
  },
};

export const DRAG_TYPE = 'CHOICE';

const WithTarget = DropTarget(DRAG_TYPE, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  dragItem: monitor.getItem(),
}))(DroppablePlaceholder);

export default WithTarget;
