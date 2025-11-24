import { render, screen } from '@testing-library/react';
import React from 'react';
import { RawAuthoring } from '../authoring';
import _ from 'lodash';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock dependencies
jest.mock('@pie-lib/editable-html', () => {
  return function EditableHtml(props) {
    return <div data-testid="editable-html" data-markup={props.markup} />;
  };
});

jest.mock('@pie-lib/config-ui', () => ({
  FeedbackConfig: ({ feedback }) => <div data-testid="feedback-config">{JSON.stringify(feedback)}</div>,
}));

jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }) => <div data-testid="drag-drop-context">{children}</div>,
  Droppable: ({ children }) => children({ droppableProps: {}, innerRef: () => {} }, {}),
  Draggable: ({ children, index }) =>
    children(
      {
        innerRef: () => {},
        draggableProps: { 'data-draggable-index': index },
        dragHandleProps: {}
      },
      {}
    ),
}));

describe('Rubric', () => {
  const points = ['nothing right', 'a teeny bit right', 'mostly right', 'bingo'];
  const sampleAnswers = [null, 'just right', 'not left', null];
  const theme = createTheme();

  const renderComponent = (value = {}, props = {}) => {
    const defaultProps = {
      classes: {},
      onChange: jest.fn(),
      className: 'className',
      value: {
        excludeZero: false,
        points,
        sampleAnswers,
        ...value,
      },
      ...props,
    };

    return {
      ...render(
        <ThemeProvider theme={theme}>
          <RawAuthoring {...defaultProps} />
        </ThemeProvider>
      ),
      onChange: defaultProps.onChange,
      props: defaultProps,
    };
  };

  describe('render', () => {
    it('renders rubric title and main structure', () => {
      renderComponent();
      expect(screen.getByText('Rubric')).toBeInTheDocument();
      expect(screen.getByLabelText('Max Points')).toBeInTheDocument();
      expect(screen.getByLabelText('Exclude zeros')).toBeInTheDocument();
    });

    it('renders all point configurations', () => {
      const { container } = renderComponent();
      // Verify DragDropContext is rendered
      expect(container.querySelector('[data-testid="drag-drop-context"]')).toBeInTheDocument();

      // Check that point labels are rendered (4 points = "3 pts", "2 pts", "1 pt", "0 pt")
      // Note: The PointConfig component uses singular "pt" for 0 and 1, plural "pts" for 2+
      expect(screen.getByText('3 pts')).toBeInTheDocument();
      expect(screen.getByText('2 pts')).toBeInTheDocument();
      expect(screen.getByText('1 pt')).toBeInTheDocument();
      expect(screen.getByText('0 pt')).toBeInTheDocument();
    });

    describe('draggable', () => {
      it('renders 3 draggable items when excludeZero is true', () => {
        const { container } = renderComponent({ excludeZero: true });

        // When excludeZero is true, the last point (0 pts) should not be rendered
        // So we should have 3 draggable items
        const draggableItems = container.querySelectorAll('[data-draggable-index]');
        expect(draggableItems.length).toEqual(3);

        // Verify the 0 pt label is not rendered
        expect(screen.queryByText('0 pt')).not.toBeInTheDocument();
      });

      it('renders 4 draggable items when excludeZero is false', () => {
        const { container } = renderComponent({ excludeZero: false });

        // When excludeZero is false, all points including 0 should be rendered
        const draggableItems = container.querySelectorAll('[data-draggable-index]');
        expect(draggableItems.length).toEqual(4);

        // Verify all point labels are rendered
        expect(screen.getByText('3 pts')).toBeInTheDocument();
        expect(screen.getByText('2 pts')).toBeInTheDocument();
        expect(screen.getByText('1 pt')).toBeInTheDocument();
        expect(screen.getByText('0 pt')).toBeInTheDocument();
      });
    });
  });

  describe('logic', () => {
    describe('changeMaxPoints', () => {
      const testChangeMaxPoints = (maxPoints, excludeZero, expectedPoints, expectedSampleAnswers) => {
        it(`maxPoints=${maxPoints}, excludeZero=${excludeZero} calls onChange correctly`, () => {
          const { onChange, container } = renderComponent({ excludeZero });

          // Get the component instance through the container
          // We need to call the method directly since we're testing internal behavior
          const instance = container.querySelector('[class*="MuiBox-root"]')?._owner;

          // Since we can't easily access instance methods in RTL, we'll test the behavior
          // by verifying the onChange prop receives the correct values
          // For now, we'll directly test the logic
          const component = new RawAuthoring({
            value: { excludeZero, points, sampleAnswers },
            onChange,
            classes: {},
            className: 'className'
          });

          component.changeMaxPoints(maxPoints);

          expect(onChange).toHaveBeenCalledWith({
            excludeZero,
            points: expectedPoints,
            sampleAnswers: expectedSampleAnswers,
            maxPoints: expectedPoints.length - 1,
          });
        });
      };

      testChangeMaxPoints(1, false, _.takeRight(points, 2), _.takeRight(sampleAnswers, 2));
      testChangeMaxPoints(1, true, _.takeRight(points, 2), _.takeRight(sampleAnswers, 2));
      testChangeMaxPoints(2, true, _.takeRight(points, 3), _.takeRight(sampleAnswers, 3));
      testChangeMaxPoints(2, false, _.takeRight(points, 3), _.takeRight(sampleAnswers, 3));
      testChangeMaxPoints(5, false, ['', ''].concat(points), [null, null].concat(sampleAnswers));
    });

    describe('changeSampleResponse', () => {
      const testChangeSampleResponse = (index, clickedItem, excludeZero, expectedPoints, expectedSampleAnswers) => {
        it(`Point ${index} with clickedItem="${clickedItem}" calls onChange correctly`, () => {
          const { onChange } = renderComponent({ excludeZero });

          // Test the logic by creating a component instance and calling the method
          const component = new RawAuthoring({
            value: { excludeZero, points, sampleAnswers },
            onChange,
            classes: {},
            className: 'className'
          });

          component.onPointMenuChange(index, clickedItem);

          expect(onChange).toHaveBeenCalledWith({
            excludeZero,
            points: expectedPoints,
            sampleAnswers: expectedSampleAnswers,
          });
        });
      };

      testChangeSampleResponse(0, 'sample', false, points, ['', 'just right', 'not left', null]);
      testChangeSampleResponse(3, 'sample', false, points, [null, 'just right', 'not left', '']);
      testChangeSampleResponse(1, 'sample', true, points, [null, null, 'not left', null]);
      testChangeSampleResponse(3, 'sample', true, points, [null, 'just right', 'not left', '']);
    });
  });
});
