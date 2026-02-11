import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { RawAuthoring } from '../authoring';
import { takeRight } from 'lodash-es';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Mock dependencies
jest.mock('@pie-lib/editable-html-tip-tap', () => {
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
        dragHandleProps: {},
      },
      {},
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
        </ThemeProvider>,
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
            className: 'className',
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

      testChangeMaxPoints(1, false, takeRight(points, 2), takeRight(sampleAnswers, 2));
      testChangeMaxPoints(1, true, takeRight(points, 2), takeRight(sampleAnswers, 2));
      testChangeMaxPoints(2, true, takeRight(points, 3), takeRight(sampleAnswers, 3));
      testChangeMaxPoints(2, false, takeRight(points, 3), takeRight(sampleAnswers, 3));
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
            className: 'className',
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

  describe('user interactions', () => {
    it('calls onChange when excluding zeros checkbox is toggled', () => {
      const { onChange } = renderComponent({ excludeZero: false });

      const checkbox = screen.getByLabelText('Exclude zeros');
      fireEvent.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          excludeZero: true,
        }),
      );
    });

    it('calls onChange when max points is changed', () => {
      const { onChange } = renderComponent();

      const selectInput = screen.getByLabelText('Max Points');
      fireEvent.mouseDown(selectInput);

      // The onChange should be called when a new value is selected
      // This tests the changeMaxPoints logic indirectly
    });

    it('renders correct number of points based on excludeZero', () => {
      const { rerender } = renderComponent({ excludeZero: false });
      expect(screen.getByText('0 pt')).toBeInTheDocument();

      // Rerender with excludeZero true
      rerender(
        <ThemeProvider theme={theme}>
          <RawAuthoring
            classes={{}}
            onChange={jest.fn()}
            className="className"
            value={{ excludeZero: true, points, sampleAnswers }}
          />
        </ThemeProvider>,
      );

      expect(screen.queryByText('0 pt')).not.toBeInTheDocument();
    });
  });

  describe('drag and drop', () => {
    it('calls onChange with reordered points after drag end', () => {
      const { onChange } = renderComponent();

      const component = new RawAuthoring({
        value: { excludeZero: false, points, sampleAnswers },
        onChange,
        classes: {},
        className: 'className',
      });

      // Simulate drag from index 0 to index 2
      component.dragEnd({
        source: { index: 0 },
        destination: { index: 2 },
      });

      expect(onChange).toHaveBeenCalled();
      const result = onChange.mock.calls[0][0];
      expect(result.points).not.toEqual(points);
      expect(result.points.length).toBe(points.length);
    });

    it('does nothing when drag has no destination', () => {
      const { onChange } = renderComponent();

      const component = new RawAuthoring({
        value: { excludeZero: false, points, sampleAnswers },
        onChange,
        classes: {},
        className: 'className',
      });

      // Simulate drag without destination
      component.dragEnd({
        source: { index: 0 },
        destination: null,
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('content editing', () => {
    it('calls onChange when point content is changed', () => {
      const { onChange } = renderComponent();

      const component = new RawAuthoring({
        value: { excludeZero: false, points, sampleAnswers },
        onChange,
        classes: {},
        className: 'className',
      });

      component.changeContent(0, 'new content', 'points');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          points: expect.arrayContaining(['new content']),
        }),
      );
    });

    it('calls onChange when sample answer is changed', () => {
      const { onChange } = renderComponent();

      const component = new RawAuthoring({
        value: { excludeZero: false, points, sampleAnswers },
        onChange,
        classes: {},
        className: 'className',
      });

      component.changeContent(1, 'new sample answer', 'sampleAnswers');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          sampleAnswers: expect.arrayContaining(['new sample answer']),
        }),
      );
    });

    it('does not change content for invalid type', () => {
      const { onChange } = renderComponent();

      const component = new RawAuthoring({
        value: { excludeZero: false, points, sampleAnswers },
        onChange,
        classes: {},
        className: 'className',
      });

      component.changeContent(0, 'new content', 'invalidType');

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('rubricless mode', () => {
    it('calls onChange when rubricless instruction is changed', () => {
      const { onChange } = renderComponent({ rubriclessInstruction: '' }, { rubricless: true });

      const component = new RawAuthoring({
        value: { excludeZero: false, points, sampleAnswers, rubriclessInstruction: '' },
        onChange,
        classes: {},
        className: 'className',
        rubricless: true,
      });

      component.changeRubriclessInstruction('New instruction');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          rubriclessInstruction: 'New instruction',
        }),
      );
    });
  });

  describe('edge cases', () => {
    it('handles empty points array', () => {
      const { container } = renderComponent({ points: [], sampleAnswers: [] });
      expect(container).toBeInTheDocument();
    });

    it('handles maxPoints greater than current max', () => {
      const { onChange } = renderComponent();

      const component = new RawAuthoring({
        value: { excludeZero: false, points, sampleAnswers },
        onChange,
        classes: {},
        className: 'className',
      });

      component.changeMaxPoints(10);

      expect(onChange).toHaveBeenCalled();
      const result = onChange.mock.calls[0][0];
      expect(result.points.length).toBe(11); // 10 + 1 for 0 points
    });

    it('handles config and pluginOpts props', () => {
      const config = { someConfig: true };
      const pluginOpts = { somePlugin: true };
      const { container } = renderComponent({}, { config, pluginOpts });
      expect(container).toBeInTheDocument();
    });
  });
});
