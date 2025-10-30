import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { color } from '@pie-lib/render-ui';
import { allTools } from './tools';
import { DragProvider } from '@pie-lib/drag';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from '@dnd-kit/sortable';
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
    const newOptions = arrayMove(options, dragIndex, hoverIndex);
    console.log('New Options Order:', newOptions);
    onChangeToolsOrder(newOptions);
  };

  handleDragEnd = (event) => {
    const { active, over } = event;
    
    console.log('Drag End Event:', event);
    if (!over || !active) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === 'tool' && overData?.type === 'tool') {
      const dragIndex = activeData.index;
      const hoverIndex = overData.index;
      
      if (dragIndex !== hoverIndex) {
        this.moveTool(dragIndex, hoverIndex);
      }
    }
  };

  render() {
    const { className, disabled, options, selectedToolType, draggableTools, language } = this.props;

    return (
      <DragProvider onDragEnd={this.handleDragEnd}>
        <StyledToolsContainer className={className}>
          {(options || []).map((option, index) => {
            if ((allTools || []).includes(option)) {
              const isSelected = option === selectedToolType;
              const toolRef = React.createRef();

              return (
                <DragTool
                  key={option}
                  index={index}
                  value={option}
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
      </DragProvider>
    );
  }
}

// DragTool functional component using @dnd-kit hooks
function DragTool({ 
  children, 
  index, 
  draggable, 
  moveTool, 
  toolRef, 
  value 
}) {
  const {
    attributes,
    listeners,
    setNodeRef: setDragNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: `tool-${value}-${index}`,
    disabled: !draggable,
    data: {
      type: 'tool',
      index,
      value,
    },
  });

  const {
    setNodeRef: setDropNodeRef,
    isOver,
  } = useDroppable({
    id: `drop-tool-${value}-${index}`,
    data: {
      type: 'tool',
      index,
      accepts: ['tool'],
    },
  });

  // Combine refs
  const setNodeRef = (node) => {
    setDragNodeRef(node);
    setDropNodeRef(node);
    if (toolRef?.current) {
      toolRef.current = node;
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <StyledWrapper ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners}>
        {children}
      </div>
    </StyledWrapper>
  );
}

DragTool.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number,
  draggable: PropTypes.bool,
  moveTool: PropTypes.func,
  toolRef: PropTypes.object,
  value: PropTypes.string,
};

export default ToggleBar;
