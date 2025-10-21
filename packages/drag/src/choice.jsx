import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { DragSource } from 'react-dnd';

import { withUid } from './uid-context';
import { grey } from '@mui/material/colors';

export const DRAG_TYPE = 'CHOICE';

const StyledChoice = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `solid 1px ${grey[400]}`,
  padding: theme.spacing(1),
  minHeight: '30px',
  minWidth: theme.spacing(20),
  maxWidth: theme.spacing(75),
}));

export class Choice extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    connectDragSource: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  render() {
    const { className, children, connectDragSource } = this.props;

    return connectDragSource(<StyledChoice className={className}>{children}</StyledChoice>);
  }
}

const choiceSource = {
  canDrag(props) {
    return !props.disabled;
  },
  beginDrag(props) {
    const out = {
      choiceId: props.choice.id,
      from: props.category.id,
      alternateResponseIndex: props.alternateResponseIndex,
      choiceIndex: props.choiceIndex,
    };
    return out;
  },

  endDrag: (props, monitor) => {
    if (!monitor.didDrop()) {
      const item = monitor.getItem();
      if (item.from) {
        props.onRemoveChoice(item);
      }
    }
  },
};

const styledChoice = Choice;

const DraggableChoice = DragSource(
  ({ uid }) => uid,
  choiceSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(styledChoice);

export default withUid(DraggableChoice);
