import * as React from 'react';
import { render, screen } from '@testing-library/react';
import DragInTheBlank from '../drag-in-the-blank';
import { closestDroppableKeyboardCoordinates } from '../keyboard-coordinates';

const markup = `<div>
  <img src="https://image.shutterstock.com/image-vector/cow-jumped-over-moon-traditional-260nw-1152899330.jpg"></img>
   <h5>Hey Diddle Diddle <i>by ?</i></h5>
 <p>1: Hey, diddle, diddle,</p>
 <p>2: The cat and the fiddle,</p>
 <p>3: The cow {{0}} over the moon;</p>
 <p>4: The little dog {{1}},</p>
 <p>5: To see such sport,</p>
 <p>6: And the dish ran away with the {{2}}.</p>
</div>`;
const choice = (v, id) => ({ value: v, id });

let capturedDragProviderProps;

// Mock DragProvider and DragDroppablePlaceholder to avoid DndContext requirement
jest.mock('@pie-lib/drag', () => ({
  DragProvider: (props) => {
    capturedDragProviderProps = props;
    // Simple wrapper that doesn't require DndContext
    return <div data-testid="drag-provider">{props.children}</div>;
  },
  DragDroppablePlaceholder: ({ children, disabled, instanceId }) => {
    // Simple wrapper that doesn't require useDroppable
    return <div data-testid="drag-droppable-placeholder">{children}</div>;
  },
}));

// Mock @dnd-kit/core components and hooks used by DragInTheBlank and child components
jest.mock('@dnd-kit/core', () => ({
  DragOverlay: ({ children }) => <div data-testid="drag-overlay">{children}</div>,
  closestCenter: jest.fn(),
  useDraggable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    isDragging: false,
  })),
  useDroppable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    isOver: false,
    active: null,
  })),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Translate: {
      toString: jest.fn(() => 'translate3d(0, 0, 0)'),
    },
  },
}));

describe('DragInTheBlank', () => {
  const defaultProps = {
    disabled: false,
    feedback: {},
    markup,
    choices: [
      choice('Jumped', '0'),
      choice('Laughed', '1'),
      choice('Spoon', '2'),
      choice('Fork', '3'),
      choice('Bumped', '4'),
      choice('Smiled', '5'),
    ],

    value: {
      0: undefined,
    },
  };

  describe('render', () => {
    it('renders correctly with default props', () => {
      const { container } = render(<DragInTheBlank {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
      // Check that markup content is rendered
      expect(screen.getByText(/Hey Diddle Diddle/)).toBeInTheDocument();
      expect(screen.getByText(/Hey, diddle, diddle,/)).toBeInTheDocument();
    });

    it('renders correctly with disabled prop as true', () => {
      const { container } = render(<DragInTheBlank {...defaultProps} disabled={true} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders correctly with feedback', () => {
      const { container } = render(
        <DragInTheBlank
          {...defaultProps}
          feedback={{
            0: {
              value: 'Jumped',
              correct: 'Jumped',
            },
            1: {
              value: 'Laughed',
              correct: 'Laughed',
            },
            2: {
              value: 'Spoon',
              correct: 'Spoon',
            },
          }}
        />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('selection state', () => {
    const baseProps = {
      value: {},
      onChange: jest.fn(),
      choices: [{ id: '0', value: 'firstChoice' }, { id: '1', value: 'secondChoice' }],
      markup: 'text {{0}} more {{1}} end',
    };

    beforeEach(() => {
      baseProps.onChange.mockClear();
    });

    it('mirrors an active drag into selectedItem on drag start', () => {
      const instance = new DragInTheBlank(baseProps);
      instance.setState = (s) => Object.assign(instance.state, typeof s === 'function' ? s(instance.state) : s);
      const data = { id: '0', choice: { id: '0', value: 'X' }, fromChoice: false, type: 'MaskBlank' };

      instance.handleDragStart({ active: { data: { current: data } } });

      expect(instance.state.selectedItem).toEqual(data);
    });

    it('toggleItemSelection selects, then deselects the same item', () => {
      const instance = new DragInTheBlank(baseProps);
      instance.setState = (s) => Object.assign(instance.state, typeof s === 'function' ? s(instance.state) : s);
      const data = { choice: { id: '0' }, fromChoice: true, type: 'MaskBlank' };

      instance.toggleItemSelection(data);
      expect(instance.state.selectedItem).toEqual(data);

      instance.toggleItemSelection(data);
      expect(instance.state.selectedItem).toBeNull();
    });

    it('placeSelectedItem places a pool choice into a blank via commitPlacement/onChange', () => {
      const instance = new DragInTheBlank(baseProps);
      instance.setState = (s) => Object.assign(instance.state, typeof s === 'function' ? s(instance.state) : s);
      const poolChoice = { choice: { id: '0' }, instanceId: 'x', fromChoice: true, type: 'MaskBlank' };

      instance.toggleItemSelection(poolChoice);
      instance.placeSelectedItem('blank-1');

      expect(baseProps.onChange).toHaveBeenCalledWith({ 'blank-1': '0' });
      expect(instance.state.selectedItem).toBeNull();
    });

    it('placeSelectedItem with targetId undefined removes a placed item (returns it to the board)', () => {
      const props = { ...baseProps, value: { 'blank-1': '0' } };
      const instance = new DragInTheBlank(props);
      instance.setState = (s) => Object.assign(instance.state, typeof s === 'function' ? s(instance.state) : s);
      const placedItem = { id: 'blank-1', choice: { id: '0' }, instanceId: 'x', fromChoice: false, type: 'MaskBlank' };

      instance.toggleItemSelection(placedItem);
      instance.placeSelectedItem(undefined);

      expect(props.onChange).toHaveBeenCalledWith({});
    });

    it('placeSelectedItem does nothing when nothing is selected', () => {
      const instance = new DragInTheBlank(baseProps);
      instance.setState = (s) => Object.assign(instance.state, typeof s === 'function' ? s(instance.state) : s);

      instance.placeSelectedItem('blank-1');

      expect(baseProps.onChange).not.toHaveBeenCalled();
    });

    it('onItemClick and onPlacementClick are ignored for a short window right after a drag ends', () => {
      const instance = new DragInTheBlank(baseProps);
      instance.setState = (s) => Object.assign(instance.state, typeof s === 'function' ? s(instance.state) : s);
      const data = { choice: { id: '0' }, fromChoice: true, type: 'MaskBlank' };

      instance.handleDragEnd({ active: null, over: null });
      instance.onItemClick(data);

      expect(instance.state.selectedItem).toBeNull();
    });

    it('onPlacementClick is ignored for a short window right after a drag ends', () => {
      const instance = new DragInTheBlank(baseProps);
      instance.setState = (s) => Object.assign(instance.state, typeof s === 'function' ? s(instance.state) : s);
      const data = { choice: { id: '0' }, fromChoice: true, type: 'MaskBlank' };

      instance.handleDragEnd({ active: null, over: null });
      // Select an item after the drag-end guard is armed, so placeSelectedItem would
      // have something to place if the guard didn't short-circuit it first.
      instance.toggleItemSelection(data);
      instance.onPlacementClick('blank-1');

      expect(baseProps.onChange).not.toHaveBeenCalled();
      expect(instance.state.selectedItem).toEqual(data);
    });

    it("onDragEnd dropping a blank's own content back onto its own slot is a no-op", () => {
      const props = { ...baseProps, value: { 'blank-1': '0' } };
      const instance = new DragInTheBlank(props);
      instance.setState = (s) => Object.assign(instance.state, typeof s === 'function' ? s(instance.state) : s);
      const draggedItem = { id: 'blank-1', choice: { id: '0' }, fromChoice: false, type: 'MaskBlank' };

      instance.handleDragEnd({
        active: { data: { current: draggedItem } },
        over: { data: { current: { id: 'blank-1', accepts: ['MaskBlank'] } } },
      });

      expect(props.onChange).not.toHaveBeenCalled();
    });
  });

  describe('DragProvider wiring', () => {
    it('passes the Tab/Shift+Tab coordinate getter and keyboard codes to DragProvider', () => {
      render(
        <DragInTheBlank
          value={{}}
          onChange={jest.fn()}
          choices={[]}
          markup="text {{0}} end"
        />,
      );

      expect(capturedDragProviderProps.keyboardCoordinateGetter).toBe(closestDroppableKeyboardCoordinates);
      expect(capturedDragProviderProps.keyboardCodes).toEqual({
        start: ['Space', 'Enter'],
        cancel: ['Escape'],
        end: ['Space', 'Enter'],
      });
    });

    it('passes onDragCancel to DragProvider', () => {
      render(
        <DragInTheBlank
          value={{}}
          onChange={jest.fn()}
          choices={[]}
          markup="text {{0}} end"
        />,
      );

      expect(typeof capturedDragProviderProps.onDragCancel).toBe('function');
    });
  });
});
