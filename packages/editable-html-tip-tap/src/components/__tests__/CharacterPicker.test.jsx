import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { CharacterIcon, CharacterPicker } from '../CharacterPicker';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

jest.mock('@pie-lib/math-toolbar', () => ({
  PureToolbar: ({ onChange, onDone, additionalKeys }) => (
    <div data-testid="pure-toolbar">
      <button onClick={() => onChange('á')} data-testid="char-button">
        á
      </button>
      <button onClick={onDone} data-testid="done-button">
        Done
      </button>
    </div>
  ),
}));

jest.mock('../characters/custom-popper', () => ({
  __esModule: true,
  default: ({ children, onClose }) => (
    <div data-testid="custom-popper">
      {children}
      <button onClick={onClose} data-testid="close-popper">
        Close
      </button>
    </div>
  ),
}));

describe('CharacterIcon', () => {
  it('renders with letter', () => {
    const { getByText } = render(<CharacterIcon letter="ñ" />);
    expect(getByText('ñ')).toBeInTheDocument();
  });

  it('renders with correct styling', () => {
    const { container } = render(<CharacterIcon letter="€" />);
    const div = container.firstChild;
    expect(div).toHaveStyle({ fontSize: '24px', lineHeight: '24px' });
  });
});

describe('CharacterPicker', () => {
  const mockEditor = {
    chain: jest.fn(() => ({
      focus: jest.fn(() => ({
        insertContent: jest.fn(() => ({ run: jest.fn() })),
      })),
    })),
    options: {
      element: document.createElement('div'),
    },
    view: {
      coordsAtPos: jest.fn(() => ({ top: 100, left: 50 })),
      dom: document.createElement('div'),
    },
    state: {
      selection: { from: 0 },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the element to avoid "Cannot redefine property" error
    mockEditor.options.element = document.createElement('div');
    Object.defineProperty(mockEditor.options.element, 'getBoundingClientRect', {
      value: jest.fn(() => ({ top: 0, left: 0, height: 100 })),
      configurable: true,
    });
  });

  it('returns null when opts has no characters', () => {
    const { container } = render(<CharacterPicker editor={mockEditor} opts={{}} onClose={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when opts is not provided', () => {
    const { container } = render(<CharacterPicker editor={mockEditor} opts={null} onClose={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders character picker with spanish config', () => {
    const opts = {
      language: 'spanish',
      characters: [['á', 'é', 'í']],
    };
    const { getByTestId } = render(<CharacterPicker editor={mockEditor} opts={opts} onClose={jest.fn()} />);
    expect(getByTestId('pure-toolbar')).toBeInTheDocument();
  });

  it('renders character picker with special config', () => {
    const opts = {
      language: 'special',
      characters: [['€', '£']],
    };
    const { getByTestId } = render(<CharacterPicker editor={mockEditor} opts={opts} onClose={jest.fn()} />);
    expect(getByTestId('pure-toolbar')).toBeInTheDocument();
  });

  it('handles character insertion', () => {
    const opts = {
      characters: [['á', 'é']],
    };
    const { getByTestId } = render(<CharacterPicker editor={mockEditor} opts={opts} onClose={jest.fn()} />);
    fireEvent.click(getByTestId('char-button'));
    expect(mockEditor.chain).toHaveBeenCalled();
  });

  it('calls onClose when done button is clicked', () => {
    const onClose = jest.fn();
    const opts = {
      characters: [['á', 'é']],
    };
    const { getByTestId } = render(<CharacterPicker editor={mockEditor} opts={opts} onClose={onClose} />);
    fireEvent.click(getByTestId('done-button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on outside click', async () => {
    const onClose = jest.fn();
    const opts = {
      characters: [['á', 'é']],
    };
    render(<CharacterPicker editor={mockEditor} opts={opts} onClose={onClose} />);

    await waitFor(() => {
      setTimeout(() => {
        fireEvent.click(document.body);
      }, 0);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('does not close when clicking inside picker', async () => {
    const onClose = jest.fn();
    const opts = {
      characters: [['á', 'é']],
    };
    const { container } = render(<CharacterPicker editor={mockEditor} opts={opts} onClose={onClose} />);

    await waitFor(() => {
      const picker = container.querySelector('.insert-character-dialog');
      if (picker) {
        fireEvent.mouseDown(picker);
      }
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders with custom opts structure', () => {
    const opts = {
      characters: [
        [
          { name: 'a', write: 'á', label: 'á' },
          { name: 'e', write: 'é', label: 'é' },
        ],
      ],
    };
    const { getByTestId } = render(<CharacterPicker editor={mockEditor} opts={opts} onClose={jest.fn()} />);
    expect(getByTestId('pure-toolbar')).toBeInTheDocument();
  });

  it('renders with hasPreview option', () => {
    const opts = {
      hasPreview: true,
      characters: [
        [
          {
            name: 'euro',
            write: '€',
            label: '€',
            description: 'Euro sign',
            unicode: 'U+20AC',
          },
        ],
      ],
    };
    const { getByTestId } = render(<CharacterPicker editor={mockEditor} opts={opts} onClose={jest.fn()} />);
    expect(getByTestId('pure-toolbar')).toBeInTheDocument();
  });

  it('calculates position correctly', () => {
    const opts = {
      characters: [['á']],
    };
    const { container } = render(<CharacterPicker editor={mockEditor} opts={opts} onClose={jest.fn()} />);
    const dialog = container.querySelector('.insert-character-dialog');
    expect(dialog).toHaveStyle({ position: 'absolute' });
  });
});
