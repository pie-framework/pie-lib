import React from 'react';
import PropTypes from 'prop-types';
import isUndefined from 'lodash/isUndefined';
import { DragSource, DropTarget } from '@pie-lib/drag';
import { renderMath } from '@pie-lib/math-rendering';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import { GripIcon } from '../icons';

const useStyles = withStyles(theme => ({
  content: {
    border: `solid 0px ${theme.palette.primary.main}`
  },
  chip: {
    minWidth: '90px'
  },
  correct: {
    border: 'solid 1px green'
  },
  incorrect: {
    border: 'solid 1px red'
  }
}));

export class BlankContent extends React.Component {
  static propTypes = {
    n: PropTypes.object,
    children: PropTypes.func,
    isDragging: PropTypes.bool,
    isOver: PropTypes.bool,
    dragItem: PropTypes.object,
    value: PropTypes.object
  };

  componentDidUpdate() {
    if (this.elementRef) {
      renderMath(this.elementRef);
    }
  }

  render() {
    const { n, children, isDragging, dragItem, isOver, value } = this.props;

    const label = dragItem && isOver ? dragItem.value.value : value.value || '\u00A0';
    const finalLabel = isDragging ? '\u00A0' : label;
    const hasGrip = finalLabel !== '\u00A0';

    return (
      <div
        ref={ref => (this.elementRef = ref)}
        style={{
          display: 'inline-flex',
          minWidth: '178px',
          minHeight: '36px',
          background: '#FFF',
          border: '1px solid #C0C3CF',
          boxSizing: 'border-box',
          borderRadius: '3px',
          overflow: 'hidden',
          position: 'relative',
          padding: '8px 8px 8px 35px'
        }}
        data-key={n.key}
        contentEditable={false}
      >
        {hasGrip && (
          <GripIcon
            style={{
              position: 'absolute',
              top: '6px',
              left: '15px',
              color: '#9B9B9B'
            }}
            contentEditable={false}
          />
        )}
        <span
          dangerouslySetInnerHTML={{
            __html: finalLabel
          }}
        />
        {children}
      </div>
    );
  }
}

const StyledBlankContent = useStyles(BlankContent);

const connectedBlankContent = useStyles(({ connectDropTarget, connectDragSource, ...props }) => {
  const { classes, isOver, value } = props;
  const dragContent = <StyledBlankContent {...props} />;
  const dragEl = !value ? dragContent : connectDragSource(<span>{dragContent}</span>);
  const content = (
    <span className={classnames(classes.content, isOver && classes.over)}>{dragEl}</span>
  );

  return connectDropTarget ? connectDropTarget(content) : content;
});

export const tileTarget = {
  drop(props, monitor) {
    const draggedItem = monitor.getItem();
    const shouldDrop =
      isUndefined(draggedItem.value.index) ||
      isUndefined(props.value.index) ||
      draggedItem.value.index !== props.value.index;

    if (shouldDrop) {
      props.onChange(draggedItem.value);
    }

    return {
      dropped: shouldDrop
    };
  },
  canDrop(props, monitor) {
    const draggedItem = monitor.getItem();

    return draggedItem.instanceId === props.instanceId;
  }
};

const DropTile = DropTarget('drag-in-the-blank-choice', tileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  dragItem: monitor.getItem()
}))(connectedBlankContent);

export const tileSource = {
  canDrag(props) {
    return !props.disabled && !!props.value;
  },
  beginDrag(props) {
    return {
      id: props.targetId,
      value: props.value,
      instanceId: props.instanceId,
      fromChoice: true
    };
  },
  endDrag(props, monitor) {
    // this will be null if it did not drop
    const dropResult = monitor.getDropResult();

    if (!dropResult || (dropResult.dropped && !props.duplicates)) {
      const draggedItem = monitor.getItem();

      if (draggedItem.fromChoice) {
        props.removeResponse(draggedItem.value);
      }
    }
  }
};

export default DragSource('drag-in-the-blank-choice', tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(DropTile);
