import React from 'react';
import PropTypes from 'prop-types';
import { PlaceHolder, DropTarget, withDragContext } from '@pie-lib/drag';
//import { withDragContext } from '@pie-lib/drag';
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
    const { children, connectDropTarget, onDropChoice, disabled } = this.props;

    return connectDropTarget(
      <div style={{ flex: 1 }}>
        <PlaceHolder choiceBoard={true} onDropChoice={onDropChoice}>
          {children}
        </PlaceHolder>
      </div>,
    );
  }
}

export const spec = {
  drop(monitor) {
    const draggedItem = monitor.getItem();
    console.log('I drag', draggedItem);

    return {
      dropped: true,
    };
  },
  canDrop(monitor) {
    const draggedItem = monitor.getItem();

    return true;
  },
};

export const DRAG_TYPE = 'CHOICE';

const WithTarget = withDragContext(
  DropTarget(DRAG_TYPE, spec, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }))(DroppablePlaceholder),
);

export default WithTarget;
