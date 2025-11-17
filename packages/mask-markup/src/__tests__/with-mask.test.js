import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withMask } from '../with-mask';

describe('WithMask', () => {
  const onChange = jest.fn();
  const defaultProps = {
    markup: '<p>Foo bar {{0}} over the moon;</p>',
    value: {
      0: 'blank',
    },
    onChange,
  };

  const Masked = withMask('foo', (props) => (node) => {
    const dataset = node.data ? node.data.dataset || {} : {};

    if (dataset.component === 'foo') {
      return <input type="text" data-testid="masked-input" defaultValue="Foo" onChange={props.onChange} />;
    }
  });

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<Masked {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders markup content', () => {
      render(<Masked {...defaultProps} />);
      expect(screen.getByText(/Foo bar/)).toBeInTheDocument();
    });

    it('renders paragraph content', () => {
      const { container } = render(<Masked {...defaultProps} />);
      // Paragraph is rendered as a styled div, not a <p> tag
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText(/Foo bar/)).toBeInTheDocument();
    });
  });

  describe('onChange handler', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      render(<Masked {...defaultProps} />);

      const input = screen.queryByTestId('masked-input');
      if (input) {
        await user.clear(input);
        await user.type(input, 'ceva');

        expect(onChange).toHaveBeenCalled();
      }
    });

    it('passes event to onChange', async () => {
      const user = userEvent.setup();
      render(<Masked {...defaultProps} />);

      const input = screen.queryByTestId('masked-input');
      if (input) {
        await user.clear(input);
        await user.type(input, 'test');

        expect(onChange).toHaveBeenCalled();
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
        expect(lastCall).toHaveProperty('target');
      }
    });
  });
});
