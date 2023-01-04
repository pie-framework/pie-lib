import React from 'react';
import PlaceHolder from './placeholder';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { DroppablePlaceholder } from './droppable-placeholder';

const DRAG_TYPE = 'Answer';

export const spec = {
  canDrop: (props) => {
    return !props.disabled;
  },
  drop: (props, monitor) => {
    const item = monitor.getItem();

    if (props.onRemoveAnswer) {
      props.onRemoveAnswer(item.promptId);
    }
  },
};

const WithTarget = DropTarget(DRAG_TYPE, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(DroppablePlaceholder);

export default WithTarget;
