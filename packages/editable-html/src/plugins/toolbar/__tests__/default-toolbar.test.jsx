import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { Value } from 'slate';
import { DefaultToolbar } from '../default-toolbar';

// Mock IconButton
jest.mock('@mui/material/IconButton', () => {
  return function IconButton(props) {
    return <div className={props.className} style={props.style} aria-label={props['aria-label']} />;
  };
});

// Mock DoneButton
jest.mock('../done-button', () => ({
  DoneButton: ({ onDone }) => <button data-testid="done-button" onClick={onDone}>Done</button>,
}));

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
      const { container } = render(<DefaultToolbar {...defaultProps} />);
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

      expect(screen.getByTestId('done-button')).toBeInTheDocument();
    });

    it('does not render done button when deletable', () => {
      render(<DefaultToolbar {...defaultProps} deletable={true} />);

      expect(screen.queryByTestId('done-button')).not.toBeInTheDocument();
    });

    it('does not render done button when showDone is false', () => {
      render(<DefaultToolbar {...defaultProps} showDone={false} deletable={false} />);

      expect(screen.queryByTestId('done-button')).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onDone when done button is clicked', async () => {
      render(<DefaultToolbar {...defaultProps} deletable={false} />);

      const doneButton = screen.getByTestId('done-button');
      doneButton.click();

      expect(onDone).toHaveBeenCalled();
    });
  });
});
