import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { color } from '@pie-lib/render-ui';
import { allTools } from './tools';
import { withDragContext, DragSource, DropTarget } from '@pie-lib/drag';
import Translator from '@pie-lib/translator';

const { translator } = Translator;

const StyledMiniButton = styled(Button, {
  shouldForwardProp: (prop) => !['selected'].includes(prop),
})(({ selected, disabled }) => ({
  color: color.text(),
  backgroundColor: color.background(),
  ...(selected && {
    border: `1px solid ${color.secondary()}`,
  }),
  ...(!selected && {
    '& span': {
      color: color.primary(),
    },
  }),
  ...(disabled && {
    '& span': {
      color: color.primary(),
    },
    backgroundColor: color.disabled(),
  }),
}));

export const MiniButton = (props) => {
  const { disabled, className, selected, value, onClick, language } = props;
  const translatorKey = value.toLowerCase();

  return (
    <StyledMiniButton
      size="small"
      disabled={disabled}
      className={className}
      selected={selected}
      value={value}
      key={value}
      variant="outlined"
      onClick={(e) => onClick({ ...e, buttonValue: value })}
    >
      {translator.t(`graphing.${translatorKey}`, { lng: language })}
    </StyledMiniButton>
  );
};

MiniButton.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  disabledClassName: PropTypes.string,
  selected: PropTypes.bool,
  value: PropTypes.string,
  onClick: PropTypes.func,
};

const StyledToolsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
}));

const StyledButton = styled(MiniButton)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  color: color.text(),
}));

const StyledWrapper = styled('div')({
  position: 'relative',
});

const StyledUnder = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: -1,
  pointerEvents: 'none',
});

const StyledHidden = styled('div')({
  opacity: 0,
});

export class ToggleBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    selectedToolType: PropTypes.string,
    disabled: PropTypes.bool,
    draggableTools: PropTypes.bool,
    onChange: PropTypes.func,
    onChangeToolsOrder: PropTypes.func,
    language: PropTypes.string,
  };

  static defaultProps = {};

  select = (e) => this.props.onChange(e.buttonValue || e.target.textContent);

  moveTool = (dragIndex, hoverIndex) => {
    const { options, onChangeToolsOrder } = this.props;
    const dragged = options[dragIndex];

    options.splice(dragIndex, 1);
    options.splice(hoverIndex, 0, dragged);

    onChangeToolsOrder(options);
  };

  render() {
    const { className, disabled, options, selectedToolType, draggableTools, language } = this.props;

    return (
      <StyledToolsContainer className={className}>
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
                toolRef={toolRef}
              >
                <StyledButton
                  disabled={disabled}
                  disableRipple={true}
                  onClick={this.select}
                  value={option}
                  selected={isSelected}
                  language={language}
                />
              </DragTool>
            );
          }
        })}
      </StyledToolsContainer>
    );
  }
}

export default withDragContext(ToggleBar);

const DRAG_TYPE = 'tool';

export class Item extends React.Component {
  static propTypes = {
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
      children,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      isDragging,
      toolRef,
    } = this.props;

    return (
      <StyledWrapper ref={toolRef}>
        {connectDragSource(connectDropTarget(<div style={{ opacity: isDragging ? 0 : 1 }}>{children}</div>))}
        {connectDragPreview(<StyledUnder>{children}</StyledUnder>)}
      </StyledWrapper>
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
