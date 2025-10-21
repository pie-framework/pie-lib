import React from 'react';
import PropTypes from 'prop-types';
import isUndefined from 'lodash/isUndefined';
import { DragSource, DropTarget } from '@pie-lib/drag';
import { color } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import { styled } from '@mui/material/styles';
import classnames from 'classnames';

import { GripIcon } from '../icons';

const StyledContent = styled('span')(({ theme }) => ({
  border: `solid 0px ${theme.palette.primary.main}`,
  '& mjx-frac': {
    fontSize: '120% !important',
  },
  '&.chip': {
    minWidth: '90px',
  },
  '&.correct': {
    border: `solid 1px ${color.correct()}`,
  },
  '&.incorrect': {
    border: `solid 1px ${theme.palette.error.main}`,
  },
  '&.selected': {
    border: `2px solid ${color.primaryDark()} !important`,
  },
}));

export class BlankContent extends React.Component {
  static propTypes = {
    n: PropTypes.object,
    children: PropTypes.func,
    isDragging: PropTypes.bool,
    isOver: PropTypes.bool,
    dragItem: PropTypes.object,
    value: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = { hoveredElementSize: null };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
  }

  handleClick(event) {
    if (this.elementRef) {
      this.elementRef.className = this.elementRef.contains(event.target) ? 'selected' : '';
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (!prevProps.isOver && this.props.isOver && this.elementRef) {
      const node = this.elementRef;
      return { width: node.offsetWidth, height: node.offsetHeight };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.elementRef && typeof renderMath === 'function') {
      renderMath(this.elementRef);
    }

    if (
      snapshot &&
      (!this.state.hoveredElementSize ||
        this.state.hoveredElementSize.width !== snapshot.width ||
        this.state.hoveredElementSize.height !== snapshot.height)
    ) {
      this.setState({ hoveredElementSize: snapshot });
      return;
    }

    if (prevProps.isOver && !this.props.isOver && this.state.hoveredElementSize) {
      this.setState({ hoveredElementSize: null });
    }
  }

  render() {
    const { n, children, isDragging, dragItem, isOver, value } = this.props;
    const { hoveredElementSize } = this.state;

    const label = dragItem && isOver ? dragItem.value.value : value.value || '\u00A0';
    const finalLabel = isDragging ? '\u00A0' : label;
    const hasGrip = finalLabel !== '\u00A0';
    const isPreview = dragItem && isOver;

    return (
      <div
        ref={(ref) => (this.elementRef = ref)}
        style={{
          display: 'inline-flex',
          minWidth: '178px',
          minHeight: '36px',
          background: isPreview ? `${color.defaults.BORDER_LIGHT}` : `${color.defaults.WHITE}`,
          border: isPreview ? `1px solid  ${color.defaults.BORDER_DARK}` : `1px solid  ${color.defaults.BORDER_LIGHT}`,
          boxSizing: 'border-box',
          borderRadius: '3px',
          overflow: 'hidden',
          position: 'relative',
          padding: '8px 8px 8px 35px',
          width: hoveredElementSize ? hoveredElementSize.width : undefined,
          height: hoveredElementSize ? hoveredElementSize.height : undefined,
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
              color: '#9B9B9B',
            }}
            contentEditable={false}
          />
        )}
        <span
          dangerouslySetInnerHTML={{
            __html: finalLabel,
          }}
        />
        {children}
      </div>
    );
  }
}

const connectedBlankContent = ({ connectDropTarget, connectDragSource, isOver, ...props }) => {
  const { value } = props;
  const dragContent = <BlankContent {...props} />;
  const dragEl = !value ? dragContent : connectDragSource(<span>{dragContent}</span>);
  const content = <StyledContent className={classnames(isOver && 'over')}>{dragEl}</StyledContent>;

  return connectDropTarget ? connectDropTarget(content) : content;
};

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
      dropped: shouldDrop,
    };
  },
  canDrop(props, monitor) {
    const draggedItem = monitor.getItem();

    return draggedItem.instanceId === props.instanceId;
  },
};

const DropTile = DropTarget('drag-in-the-blank-choice', tileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
  dragItem: monitor.getItem(),
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
      fromChoice: true,
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
  },
};

export default DragSource('drag-in-the-blank-choice', tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DropTile);
