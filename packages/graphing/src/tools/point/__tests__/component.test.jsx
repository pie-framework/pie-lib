import { fireEvent, render } from '@pie-lib/test-utils';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import Component from '../component';

describe('Component', () => {
  let onChange;
  let onClick;

  beforeEach(() => {
    onChange = jest.fn();
    onClick = jest.fn();
  });

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      onClick,
      graphProps: graphProps(),
      mark: xy(0, 0),
    };
    const props = { ...defaults, ...extras };
    return render(<Component {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with mark', () => {
      const { container } = renderComponent({ mark: { ...xy(0, 0) } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with label', () => {
      const { container } = renderComponent({ mark: { label: 'foo', ...xy(0, 0) } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with different coordinates', () => {
      const { container } = renderComponent({ mark: { ...xy(5, -3) } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with empty label', () => {
      const { container } = renderComponent({ mark: { label: '', ...xy(1, 1) } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with negative coordinates', () => {
      const { container } = renderComponent({ mark: { ...xy(-5, -5) } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with decimal coordinates', () => {
      const { container } = renderComponent({ mark: { ...xy(1.5, 2.5) } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with zero coordinates', () => {
      const { container } = renderComponent({ mark: { ...xy(0, 0) } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with large coordinate values', () => {
      const { container } = renderComponent({ mark: { ...xy(1000, 1000) } });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('state properties', () => {
    it('renders with disabled state', () => {
      const { container } = renderComponent({ mark: { ...xy(1, 1), disabled: true } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness state - correct', () => {
      const { container } = renderComponent({ mark: { ...xy(1, 1), correctness: 'correct' } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness state - incorrect', () => {
      const { container } = renderComponent({ mark: { ...xy(1, 1), correctness: 'incorrect' } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness state - missing', () => {
      const { container } = renderComponent({ mark: { ...xy(1, 1), correctness: 'missing' } });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with fill color', () => {
      const { container } = renderComponent({ mark: { ...xy(1, 1), fill: '#ff0000' } });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('label functionality', () => {
    it('renders label portal when labelNode is provided', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({
        mark: { ...xy(1, 1), label: 'Test' },
        labelNode,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without label portal when labelNode is not provided', () => {
      const { container } = renderComponent({
        mark: { ...xy(1, 1), label: 'Test' },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('does not render label portal when mark has no label property', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({
        mark: { ...xy(1, 1) },
        labelNode,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labelModeEnabled', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({
        mark: { ...xy(1, 1), label: 'Test' },
        labelNode,
        labelModeEnabled: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labelModeEnabled disabled', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({
        mark: { ...xy(1, 1), label: 'Test' },
        labelNode,
        labelModeEnabled: false,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles empty string label', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({
        mark: { ...xy(1, 1), label: '' },
        labelNode,
        labelModeEnabled: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles long label text', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({
        mark: { ...xy(1, 1), label: 'This is a very long label text for testing' },
        labelNode,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles label with special characters', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({
        mark: { ...xy(1, 1), label: 'Test@#$%' },
        labelNode,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('coordinates on hover', () => {
    it('renders with coordinatesOnHover enabled', () => {
      const { container } = renderComponent({
        mark: { ...xy(1, 1) },
        coordinatesOnHover: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with coordinatesOnHover disabled', () => {
      const { container } = renderComponent({
        mark: { ...xy(1, 1) },
        coordinatesOnHover: false,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('interaction modes', () => {
    it('renders in label mode', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({
        mark: { ...xy(1, 1), label: 'A' },
        labelModeEnabled: true,
        labelNode,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders in normal mode', () => {
      const { container } = renderComponent({
        mark: { ...xy(1, 1) },
        labelModeEnabled: false,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles disabled point in label mode', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({
        mark: { ...xy(1, 1), label: 'A', disabled: true },
        labelModeEnabled: true,
        labelNode,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles mark updates', () => {
      const { rerender, container } = renderComponent({ mark: xy(1, 1) });
      expect(container.firstChild).toBeInTheDocument();

      rerender(<Component mark={xy(2, 2)} onChange={onChange} onClick={onClick} graphProps={graphProps()} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles mark with all properties', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({
        mark: {
          ...xy(3, 4),
          label: 'Complete',
          disabled: false,
          correctness: 'correct',
          fill: '#00ff00',
        },
        labelNode,
        labelModeEnabled: true,
        coordinatesOnHover: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles mark without any optional properties', () => {
      const { container } = renderComponent({ mark: xy(1, 1) });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles rapid mark position changes', () => {
      const { rerender, container } = renderComponent({ mark: xy(0, 0) });

      for (let i = 1; i <= 5; i++) {
        rerender(<Component mark={xy(i, i)} onChange={onChange} onClick={onClick} graphProps={graphProps()} />);
      }

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('component lifecycle', () => {
    it('initializes with empty state', () => {
      const { container } = renderComponent({ mark: xy(1, 1) });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('updates when mark prop changes', () => {
      const { container, rerender } = renderComponent({ mark: xy(1, 1) });
      expect(container.firstChild).toBeInTheDocument();

      rerender(<Component mark={xy(5, 5)} onChange={onChange} onClick={onClick} graphProps={graphProps()} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles label addition', () => {
      const labelNode = document.createElement('foreignObject');
      const { container, rerender } = renderComponent({
        mark: xy(1, 1),
        labelNode,
      });

      rerender(
        <Component
          mark={{ ...xy(1, 1), label: 'New' }}
          onChange={onChange}
          onClick={onClick}
          graphProps={graphProps()}
          labelNode={labelNode}
        />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles label removal', () => {
      const labelNode = document.createElement('foreignObject');
      const { container, rerender } = renderComponent({
        mark: { ...xy(1, 1), label: 'Remove' },
        labelNode,
      });

      rerender(
        <Component
          mark={xy(1, 1)}
          onChange={onChange}
          onClick={onClick}
          graphProps={graphProps()}
          labelNode={labelNode}
        />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('graphProps variations', () => {
    it('handles different domain and range', () => {
      const customGraphProps = graphProps(0, 10, 0, 10);
      const { container } = renderComponent({
        mark: xy(5, 5),
        graphProps: customGraphProps,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles negative domain and range', () => {
      const customGraphProps = graphProps(-10, 0, -10, 0);
      const { container } = renderComponent({
        mark: xy(-5, -5),
        graphProps: customGraphProps,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles large domain and range', () => {
      const customGraphProps = graphProps(-100, 100, -100, 100);
      const { container } = renderComponent({
        mark: xy(50, 50),
        graphProps: customGraphProps,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('label focus', () => {
    let labelNode;

    // the label is rendered into a portal - it has to be in the document for it to take the focus
    beforeEach(() => {
      labelNode = document.createElement('div');
      document.body.appendChild(labelNode);
    });

    afterEach(() => {
      document.body.removeChild(labelNode);
    });

    // the mark is owned by the container, so the tool only sees a new label once it is handed back
    const Controlled = ({ initialMark, labelModeEnabled }) => {
      const [mark, setMark] = React.useState(initialMark);

      return (
        <Component
          mark={mark}
          onChange={(current, update) => setMark(update)}
          onClick={onClick}
          graphProps={graphProps()}
          labelNode={labelNode}
          labelModeEnabled={labelModeEnabled}
        />
      );
    };

    const clickPoint = (container) => fireEvent.click(container.querySelector('circle'));

    it('focuses the new label when a point is clicked in label mode', () => {
      const { container } = render(<Controlled initialMark={xy(1, 1)} labelModeEnabled={true} />);

      expect(labelNode.querySelector('input')).toBe(null);

      clickPoint(container);

      const input = labelNode.querySelector('input');
      expect(input).not.toBe(null);
      expect(document.activeElement).toBe(input);
    });

    it('does not focus the label when a point is clicked outside of label mode', () => {
      const { container } = render(<Controlled initialMark={{ ...xy(1, 1), label: 'A' }} labelModeEnabled={false} />);

      clickPoint(container);

      expect(onClick).toHaveBeenCalled();
      expect(document.activeElement).not.toBe(labelNode.querySelector('input'));
    });

    it('does not focus the label of a disabled mark', () => {
      const { container } = render(
        <Controlled initialMark={{ ...xy(1, 1), label: 'A', disabled: true }} labelModeEnabled={true} />,
      );

      clickPoint(container);

      expect(document.activeElement).not.toBe(labelNode.querySelector('input'));
    });

    it('stops auto focusing the label once it is blurred', () => {
      const { container } = render(<Controlled initialMark={xy(1, 1)} labelModeEnabled={true} />);

      clickPoint(container);
      const input = labelNode.querySelector('input');
      expect(document.activeElement).toBe(input);

      fireEvent.blur(input);

      // a re-render must not pull the focus back into the label the user just left
      fireEvent.change(input, { target: { value: 'A' } });
      expect(document.activeElement).not.toBe(input);
    });

    it('closes the label that is being edited when label mode is left', () => {
      const ref = React.createRef();
      const { container, rerender } = render(
        <Component
          ref={ref}
          mark={xy(1, 1)}
          onChange={onChange}
          onClick={onClick}
          graphProps={graphProps()}
          labelNode={labelNode}
          labelModeEnabled={true}
        />,
      );

      clickPoint(container);
      expect(ref.current.state.editingLabel).toBe('label');

      rerender(
        <Component
          ref={ref}
          mark={xy(1, 1)}
          onChange={onChange}
          onClick={onClick}
          graphProps={graphProps()}
          labelNode={labelNode}
          labelModeEnabled={false}
        />,
      );

      // there is no user visible path for this one: a real blur resets it through onBlur, this is
      // the safety net for a label that is still marked as edited when label mode goes away
      expect(ref.current.state.editingLabel).toBe(null);
    });
  });
});
