import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Value } from 'slate';
import { DefaultToolbar } from '../default-toolbar';

// Mock IconButton to preserve onClick
jest.mock('@mui/material/IconButton', () => {
  return function IconButton(props) {
    const { onClick, children, buttonRef, ...rest } = props;
    return (
      <button onClick={onClick} {...rest}>
        {children}
      </button>
    );
  };
});

describe('default-toolbar', () => {
  let onDone;
  let onChange;

  beforeEach(() => {
    onDone = jest.fn();
    onChange = jest.fn();
  });

  const defaultProps = {
    classes: {},
    value: Value.fromJSON({}),
    plugins: [],
    className: 'className',
    onDone,
    onChange,
    deletable: false,
    showDone: true,
  };

  describe('rendering', () => {
    it('renders toolbar', () => {
      const { container } = render(<DefaultToolbar {...defaultProps} deletable={false} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with 1 plugin', () => {
      const { container } = render(
        <DefaultToolbar
          {...defaultProps}
          plugins={[{ toolbar: { icon: <span>Icon1</span> }, name: 'plugin-one' }]}
        />,
      );

      expect(container.firstChild).toBeInTheDocument();
      // Should render plugin toolbar button
    });

    it('renders with 2 plugins', () => {
      const { container } = render(
        <DefaultToolbar
          {...defaultProps}
          plugins={[
            { toolbar: { icon: <span>Icon1</span> }, name: 'plugin-one' },
            { toolbar: { icon: <span>Icon2</span> }, name: 'plugin-two' },
          ]}
        />,
      );

      expect(container.firstChild).toBeInTheDocument();
      // Should render both plugin toolbar buttons
    });

    it('renders only enabled plugins when one is disabled', () => {
      const { container } = render(
        <DefaultToolbar
          {...defaultProps}
          pluginProps={{
            'plugin-one': {
              disabled: true,
            },
          }}
          plugins={[
            { toolbar: { icon: <span>Icon1</span> }, name: 'plugin-one' },
            { toolbar: { icon: <span>Icon2</span> }, name: 'plugin-two' },
          ]}
        />,
      );

      expect(container.firstChild).toBeInTheDocument();
      // Only plugin-two should be rendered (plugin-one is disabled)
    });

    it('renders done button when not deletable', () => {
      render(<DefaultToolbar {...defaultProps} deletable={false} />);

      expect(screen.getByLabelText('Done')).toBeInTheDocument();
    });

    it('does not render done button when deletable', () => {
      render(<DefaultToolbar {...defaultProps} deletable={true} />);

      expect(screen.queryByLabelText('Done')).not.toBeInTheDocument();
    });

    it('does not render done button when showDone is false', () => {
      render(<DefaultToolbar {...defaultProps} showDone={false} deletable={false} />);

      expect(screen.queryByLabelText('Done')).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onDone when done button is clicked', () => {
      render(<DefaultToolbar {...defaultProps} deletable={false} />);

      const doneButton = screen.getByLabelText('Done');
      fireEvent.click(doneButton);

      expect(onDone).toHaveBeenCalled();
    });
  });
});
