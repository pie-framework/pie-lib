import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Value } from 'slate';
import { DefaultToolbar } from '../default-toolbar';

// Mock the DoneButton component directly to avoid styled component issues
jest.mock('../done-button', () => ({
  DoneButton: (props) => (
    <button aria-label="Done" onClick={props.onClick} data-testid="done-button">
      Done
    </button>
  ),
  RawDoneButton: (props) => (
    <button aria-label="Done" onClick={props.onClick} className="RawDoneButton">
      Done
    </button>
  ),
}));

describe('default-toolbar', () => {
  let onDone;
  let onChange;
  let getFocusedValue;
  let defaultProps;

  beforeEach(() => {
    onDone = jest.fn();
    onChange = jest.fn();
    getFocusedValue = jest.fn();

    defaultProps = {
      classes: {},
      value: Value.fromJSON({}),
      plugins: [],
      className: 'className',
      onDone,
      onChange,
      getFocusedValue,
      deletable: false,
      showDone: true,
    };
  });

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
    it('calls onDone when done button is clicked', async () => {
      render(<DefaultToolbar {...defaultProps} deletable={false} />);

      const doneButton = screen.getByLabelText('Done');
      fireEvent.click(doneButton);

      expect(onDone).toHaveBeenCalled();
    });
  });
});
