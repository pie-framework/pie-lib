import React from 'react';
import PropTypes from 'prop-types';
import { 
  PlaceHolder, 
  DraggableChoice, 
  DragProvider, 
  DragDroppablePlaceholder,
  uid 
} from '@pie-lib/drag';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const { Provider: IdProvider } = uid;

// Simple styled drop area
const DropArea = styled('div')(({ theme }) => ({
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  marginTop: '20px',
  minHeight: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f9f9f9',
  fontSize: '16px',
  color: '#666',
}));

const StyledPlaceHolder = styled(PlaceHolder)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

// Functional component for draggable choices
const Choice = ({ children }) => {
  const choiceId = uid.generateId();
  return (
    <DraggableChoice 
      choice={{ 
        id: choiceId,
        value: children
      }}
    >
      {children}
    </DraggableChoice>
  );
};

Choice.propTypes = {
  children: PropTypes.node,
};

// Main content component that uses the drag components
export function DragDemoContent({ containerVal, onDropItem }) {
  return (
    <div>
      <Typography variant="h6">Drag</Typography>

      <Divider />

      <PlaceHolder grid={{ columns: 3 }}>
        <Choice>foo bar</Choice>
        <Choice>
          <h1>Some Text</h1>
          <p>foo</p>
        </Choice>
        <Choice>
          <img
            width="200"
            src="https://placedog.net/500/280?id=1"
            alt="dog 1"
          />
        </Choice>
      </PlaceHolder>

      <StyledPlaceHolder isOver={true} grid={{ columns: 3 }}>
        <Choice>foo bar</Choice>
        <Choice>
          <h1>Some Text</h1>
          <p>foo</p>
        </Choice>
        <Choice>
          <img
            width="200"
            src="https://placedog.net/500/280?id=2"
            alt="dog 2"
          />
        </Choice>
      </StyledPlaceHolder>

      <StyledPlaceHolder disabled={true} grid={{ columns: 3 }}>
        <Choice>foo bar</Choice>
        <Choice>
          <h1>Some Text</h1>
          <p>foo</p>
        </Choice>
        <Choice>
          <img
            width="200"
            src="https://placedog.net/500/280?id=3"
            alt="dog 3"
          />
        </Choice>
      </StyledPlaceHolder>

      <DropArea>
        <Typography>Drop Area Content: {containerVal || 'Drop items here'}</Typography>
      </DropArea>

      <DragDroppablePlaceholder
        id="drop-container"
        onDrop={onDropItem}
        style={{ marginTop: '20px', minHeight: '100px', border: '2px dashed #999' }}
      >
        <Typography>DragDroppablePlaceholder: {containerVal || 'Drop items here'}</Typography>
      </DragDroppablePlaceholder>
    </div>
  );
}

DragDemoContent.propTypes = {
  containerVal: PropTypes.any,
  onDropItem: PropTypes.func,
};

// Wrapper component that sets up DragProvider and context
export class DragDemo extends React.Component {
  constructor(props) {
    super(props);
    this.uid = uid.generateId();
    this.state = {
      containerVal: '',
    };
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDropItem = this.handleDropItem.bind(this);
  }

  handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && over.id === 'drop-container') {
      // Get the dragged content from the active item's data
      const draggedValue = active.data.current?.value;
      this.setState({
        containerVal: draggedValue || active.id,
      });
    }
  };

  handleDropItem = (item) => {
    // Handle drop from DragDroppablePlaceholder
    this.setState({
      containerVal: item.value || item,
    });
  };

  render() {
    const { containerVal } = this.state;

    return (
      <IdProvider value={this.uid}>
        <DragProvider onDragEnd={this.handleDragEnd}>
          <DragDemoContent 
            containerVal={containerVal} 
            onDropItem={this.handleDropItem}
          />
        </DragProvider>
      </IdProvider>
    );
  }
}

export default DragDemo;
