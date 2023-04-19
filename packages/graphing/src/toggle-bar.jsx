import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import Button from '@material-ui/core/Button';
import { color } from '@pie-lib/render-ui';
import { allTools } from './tools/index';
import { withDragContext, DragSource, DropTarget } from '@pie-lib/drag';

const buttonStyles = () => ({
  root: {
    color: color.text(),
    '&:hover': {
      backgroundColor: color.primary(),
    },
  },
  selected: {
    backgroundColor: color.background(),
    border: `1px solid ${color.secondary()}`,
  },
  notSelected: {
    '& span': {
      color: color.primary(),
    },
    backgroundColor: color.background(),
  },
  disabled: {
    '& span': {
      color: color.primary(),
    },
    backgroundColor: color.disabled(),
  },
});

export const MiniButton = withStyles(buttonStyles)((props) => {
  const { disabled, classes, className, selected, value, onClick } = props;

  return (
    <Button
      size="small"
      disabled={disabled}
      className={cn(classes.root, selected && classes.selected, className)}
      classes={{ disabled: cn(disabled && classes.disabled) }}
      value={value}
      key={value}
      variant="outlined"
      onClick={onClick}
    >
      {value}
    </Button>
  );
});

MiniButton.propTypes = {
  disabled: PropTypes.bool,
  classes: PropTypes.object,
  className: PropTypes.string,
  disabledClassName: PropTypes.string,
  selected: PropTypes.bool,
  value: PropTypes.string,
  onClick: PropTypes.func,
};

export class ToggleBar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    selectedToolType: PropTypes.string,
    disabled: PropTypes.bool,
    draggableTools: PropTypes.bool,
    onChange: PropTypes.func,
    onChangeToolsOrder: PropTypes.func,
  };

  static defaultProps = {};

  select = (e) => this.props.onChange(e.target.textContent);

  moveTool = (dragIndex, hoverIndex) => {
    const { options, onChangeToolsOrder } = this.props;
    const dragged = options[dragIndex];

    options.splice(dragIndex, 1);
    options.splice(hoverIndex, 0, dragged);

    onChangeToolsOrder(options);
  };

  render() {
    const { classes, className, disabled, options, selectedToolType, draggableTools } = this.props;

    return (
      <div className={cn(className, classes.toolsContainer)}>
        {(options || []).map((option, index) => {
          if ((allTools || []).includes(option)) {
            const isSelected = option === selectedToolType;
            const toolRef = React.createRef();

            return (
              <DragTool
                key={option}
                index={index}
                draggable={draggableTools}
                moveTool={this.moveTool}
                classes={classes}
                toolRef={toolRef}
              >
                <MiniButton
                  className={cn(classes.button, isSelected && classes.selected)}
                  disabled={disabled}
                  disableRipple={true}
                  onClick={this.select}
                  value={option}
                  selected={isSelected}
                />
              </DragTool>
            );
          }
        })}
      </div>
    );
  }
}

const styles = (theme) => ({
  toolsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    marginRight: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
    color: color.text(),
    backgroundColor: color.background(),
  },
  under: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
    pointerEvents: 'none',
  },
  wrapper: {
    position: 'relative',
  },
  hidden: {
    opacity: 0,
  },
});

export default withDragContext(withStyles(styles)(ToggleBar));

const DRAG_TYPE = 'tool';

export class Item extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
    toolRef: PropTypes.any,
  };

  static defaultProps = {};

  render() {
    const {
      classes,
      children,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      isDragging,
      toolRef,
    } = this.props;

    return (
      <div className={classes.wrapper} ref={toolRef}>
        {connectDragSource(connectDropTarget(<div className={isDragging && classes.hidden}>{children}</div>))}
        {connectDragPreview(<div className={classes.under}>{children}</div>)}
      </div>
    );
  }
}

const itemSource = {
  canDrag(props) {
    return props.draggable;
  },
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const itemTarget = {
  hover(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const { toolRef, index: hoverIndex } = props;

    if (dragIndex === hoverIndex || !toolRef.current) {
      return;
    }

    const hoverBoundingRect = toolRef.current?.getBoundingClientRect();
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return;
    }

    props.moveTool(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

const collectTarget = (connect) => ({ connectDropTarget: connect.dropTarget() });

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
});

const DragTool = DropTarget(
  DRAG_TYPE,
  itemTarget,
  collectTarget,
)(DragSource(DRAG_TYPE, itemSource, collectSource)(Item));
