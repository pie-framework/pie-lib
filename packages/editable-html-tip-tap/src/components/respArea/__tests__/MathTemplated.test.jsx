import React from 'react';
import { render } from '@testing-library/react';
import MathTemplated from '../MathTemplated';

// Mock the dependencies
jest.mock('@tiptap/react', () => ({
  NodeViewWrapper: ({ children, ...props }) => (
    <div data-testid="node-view-wrapper" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('@pie-lib/math-input', () => ({
  mq: {
    Static: ({ latex }) => (
      <div data-testid="mq-static" data-latex={latex}>
        {latex}
      </div>
    ),
  },
}));

describe('MathTemplated', () => {
  const defaultProps = {
    node: {
      attrs: {
        value: 'x^2 + y^2 = r^2',
        index: 0,
      },
    },
    options: {},
    selected: false,
  };

  it('renders without crashing', () => {
    const { container } = render(<MathTemplated {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('renders NodeViewWrapper with correct className', () => {
    const { getByTestId } = render(<MathTemplated {...defaultProps} />);
    const wrapper = getByTestId('node-view-wrapper');
    expect(wrapper).toHaveClass('math-templated');
  });

  it('displays correct response key for index 0', () => {
    const { getByText } = render(<MathTemplated {...defaultProps} />);
    expect(getByText('R 1')).toBeInTheDocument();
  });

  it('displays correct response key for index 1', () => {
    const props = {
      ...defaultProps,
      node: {
        attrs: {
          value: 'a + b',
          index: 1,
        },
      },
    };
    const { getByText } = render(<MathTemplated {...props} />);
    expect(getByText('R 2')).toBeInTheDocument();
  });

  it('displays correct response key for index 5', () => {
    const props = {
      ...defaultProps,
      node: {
        attrs: {
          value: 'c = d',
          index: 5,
        },
      },
    };
    const { getByText } = render(<MathTemplated {...props} />);
    expect(getByText('R 6')).toBeInTheDocument();
  });

  it('renders LaTeX value correctly', () => {
    const { getByTestId } = render(<MathTemplated {...defaultProps} />);
    const mqStatic = getByTestId('mq-static');
    expect(mqStatic).toHaveAttribute('data-latex', 'x^2 + y^2 = r^2');
  });

  it('renders different LaTeX value', () => {
    const props = {
      ...defaultProps,
      node: {
        attrs: {
          value: '\\frac{a}{b}',
          index: 2,
        },
      },
    };
    const { getByTestId } = render(<MathTemplated {...props} />);
    const mqStatic = getByTestId('mq-static');
    expect(mqStatic).toHaveAttribute('data-latex', '\\frac{a}{b}');
  });

  it('passes selected prop to NodeViewWrapper', () => {
    const props = {
      ...defaultProps,
      selected: true,
    };
    const { getByTestId } = render(<MathTemplated {...props} />);
    const wrapper = getByTestId('node-view-wrapper');
    expect(wrapper).toHaveAttribute('data-selected', 'true');
  });

  it('passes false selected prop to NodeViewWrapper', () => {
    const { getByTestId } = render(<MathTemplated {...defaultProps} />);
    const wrapper = getByTestId('node-view-wrapper');
    expect(wrapper).toHaveAttribute('data-selected', 'false');
  });

  it('applies correct inline styles to NodeViewWrapper', () => {
    const { getByTestId } = render(<MathTemplated {...defaultProps} />);
    const wrapper = getByTestId('node-view-wrapper');
    expect(wrapper).toHaveStyle({
      display: 'inline-flex',
      minHeight: '36px',
      minWidth: '50px',
      cursor: 'pointer',
    });
  });

  it('handles string index correctly', () => {
    const props = {
      ...defaultProps,
      node: {
        attrs: {
          value: 'test',
          index: '3',
        },
      },
    };
    const { getByText } = render(<MathTemplated {...props} />);
    expect(getByText('R 4')).toBeInTheDocument();
  });

  it('handles empty value', () => {
    const props = {
      ...defaultProps,
      node: {
        attrs: {
          value: '',
          index: 0,
        },
      },
    };
    const { getByTestId } = render(<MathTemplated {...props} />);
    const mqStatic = getByTestId('mq-static');
    expect(mqStatic).toHaveAttribute('data-latex', '');
  });

  it('renders all styled components', () => {
    const { container, getByText } = render(<MathTemplated {...defaultProps} />);

    // Check for response box
    expect(getByText('R 1')).toBeInTheDocument();

    // Check for math block with LaTeX
    const mqStatic = container.querySelector('[data-testid="mq-static"]');
    expect(mqStatic).toBeInTheDocument();
  });

  it('handles zero index', () => {
    const props = {
      ...defaultProps,
      node: {
        attrs: {
          value: 'x = 0',
          index: 0,
        },
      },
    };
    const { getByText } = render(<MathTemplated {...props} />);
    expect(getByText('R 1')).toBeInTheDocument();
  });

  it('handles large index values', () => {
    const props = {
      ...defaultProps,
      node: {
        attrs: {
          value: 'x = 100',
          index: 99,
        },
      },
    };
    const { getByText } = render(<MathTemplated {...props} />);
    expect(getByText('R 100')).toBeInTheDocument();
  });

  it('renders with complex LaTeX expression', () => {
    const props = {
      ...defaultProps,
      node: {
        attrs: {
          value: '\\sqrt{x^2 + y^2}',
          index: 0,
        },
      },
    };
    const { getByTestId } = render(<MathTemplated {...props} />);
    const mqStatic = getByTestId('mq-static');
    expect(mqStatic).toHaveAttribute('data-latex', '\\sqrt{x^2 + y^2}');
  });
});
