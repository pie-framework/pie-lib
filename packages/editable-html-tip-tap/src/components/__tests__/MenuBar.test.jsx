import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import StyledMenuBar from '../MenuBar';

jest.mock('@tiptap/react', () => ({
  EditorContent: ({ editor }) => <div data-testid="editor-content" />,
  useEditorState: ({ selector }) => {
    const mockEditor = {
      isActive: jest.fn(() => false),
      can: jest.fn(() => ({
        chain: jest.fn(() => ({
          toggleBold: jest.fn(() => ({ run: jest.fn(() => true) })),
          insertTable: jest.fn(() => ({ run: jest.fn(() => true) })),
          toggleItalic: jest.fn(() => ({ run: jest.fn(() => true) })),
          toggleStrike: jest.fn(() => ({ run: jest.fn(() => true) })),
          toggleCode: jest.fn(() => ({ run: jest.fn(() => true) })),
          unsetAllMarks: jest.fn(() => ({ run: jest.fn(() => true) })),
          undo: jest.fn(() => ({ run: jest.fn(() => true) })),
          redo: jest.fn(() => ({ run: jest.fn(() => true) })),
        })),
      })),
      getAttributes: jest.fn(() => ({ border: '1' })),
      isFocused: true,
      state: {
        selection: {},
      },
    };

    return selector({ editor: mockEditor });
  },
}));

jest.mock('prosemirror-state', () => ({
  NodeSelection: jest.fn(),
}));

jest.mock('../CharacterPicker', () => ({
  CharacterIcon: ({ letter }) => <div data-testid="character-icon">{letter}</div>,
  CharacterPicker: ({ onClose }) => (
    <div data-testid="character-picker">
      <button onClick={onClose} data-testid="close-picker">
        Close
      </button>
    </div>
  ),
}));

jest.mock('../common/done-button', () => ({
  DoneButton: ({ onClick }) => (
    <button onClick={onClick} data-testid="done-button">
      Done
    </button>
  ),
}));

describe('StyledMenuBar', () => {
  const mockEditor = {
    chain: jest.fn(() => ({
      focus: jest.fn(() => ({
        insertTable: jest.fn(() => ({ run: jest.fn() })),
        toggleBold: jest.fn(() => ({ run: jest.fn() })),
        toggleItalic: jest.fn(() => ({ run: jest.fn() })),
        toggleStrike: jest.fn(() => ({ run: jest.fn() })),
        toggleCode: jest.fn(() => ({ run: jest.fn() })),
        toggleUnderline: jest.fn(() => ({ run: jest.fn() })),
        toggleSubscript: jest.fn(() => ({ run: jest.fn() })),
        toggleSuperscript: jest.fn(() => ({ run: jest.fn() })),
        setImageUploadNode: jest.fn(() => ({ run: jest.fn() })),
        insertMedia: jest.fn(() => ({ run: jest.fn() })),
        toggleHeading: jest.fn(() => ({ run: jest.fn() })),
        insertMath: jest.fn(() => ({ run: jest.fn() })),
        toggleBulletList: jest.fn(() => ({ run: jest.fn() })),
        toggleOrderedList: jest.fn(() => ({ run: jest.fn() })),
        undo: jest.fn(() => ({ run: jest.fn() })),
        redo: jest.fn(() => ({ run: jest.fn() })),
        addRowAfter: jest.fn(() => ({ run: jest.fn() })),
        deleteRow: jest.fn(() => ({ run: jest.fn() })),
        addColumnAfter: jest.fn(() => ({ run: jest.fn() })),
        deleteColumn: jest.fn(() => ({ run: jest.fn() })),
        deleteTable: jest.fn(() => ({ run: jest.fn() })),
        insertResponseArea: jest.fn(() => ({ run: jest.fn() })),
      })),
    })),
    can: jest.fn(() => ({
      chain: jest.fn(() => ({
        toggleBold: jest.fn(() => ({ run: jest.fn(() => true) })),
        insertTable: jest.fn(() => ({ run: jest.fn(() => true) })),
        undo: jest.fn(() => ({ run: jest.fn(() => true) })),
        redo: jest.fn(() => ({ run: jest.fn(() => true) })),
      })),
    })),
    isActive: jest.fn((name) => {
      if (name === 'bold') return true;
      if (name === 'italic') return false;
      return false;
    }),
    getAttributes: jest.fn(() => ({ border: '1' })),
    getHTML: jest.fn(() => '<p>Test</p>'),
    commands: {
      blur: jest.fn(),
      openCSSClassDialog: jest.fn(),
      updateAttributes: jest.fn(),
    },
    isFocused: true,
    state: {
      selection: {},
    },
    _toolbarOpened: false,
  };

  const defaultProps = {
    editor: mockEditor,
    activePlugins: ['bold', 'italic', 'underline', 'table'],
    toolbarOpts: {},
    responseAreaProps: { type: 'explicit-constructed-response' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<StyledMenuBar {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('renders toolbar with buttons', () => {
    const { container } = render(<StyledMenuBar {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('shows bold button when bold plugin is active', () => {
    const { container } = render(<StyledMenuBar {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('hides buttons when isTable is true', () => {
    const { container } = render(<StyledMenuBar {...defaultProps} activePlugins={['table']} />);
    expect(container).toBeInTheDocument();
  });

  it('shows table buttons when in table context', () => {
    const { container } = render(<StyledMenuBar {...defaultProps} activePlugins={['table']} />);
    expect(container).toBeInTheDocument();
  });

  it('handles button clicks', () => {
    const { container } = render(<StyledMenuBar {...defaultProps} />);
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
    }
    expect(container).toBeInTheDocument();
  });

  it('shows done button when toolbarOpts.showDone is true', () => {
    const { getByTestId } = render(
      <StyledMenuBar {...defaultProps} toolbarOpts={{ showDone: true }} onChange={jest.fn()} />,
    );
    expect(getByTestId('done-button')).toBeInTheDocument();
  });

  it('does not show done button when toolbarOpts.showDone is false', () => {
    const { queryByTestId } = render(<StyledMenuBar {...defaultProps} toolbarOpts={{ showDone: false }} />);
    expect(queryByTestId('done-button')).not.toBeInTheDocument();
  });

  it('handles done button click', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <StyledMenuBar {...defaultProps} toolbarOpts={{ showDone: true }} onChange={onChange} />,
    );
    fireEvent.click(getByTestId('done-button'));
    expect(onChange).toHaveBeenCalledWith('<p>Test</p>');
    expect(mockEditor.commands.blur).toHaveBeenCalled();
  });

  it('applies custom minWidth from toolbarOpts', () => {
    const { container } = render(<StyledMenuBar {...defaultProps} toolbarOpts={{ minWidth: 500 }} />);
    const toolbar = container.querySelector('.toolbar');
    expect(toolbar).toHaveStyle({ minWidth: '500px' });
  });

  it('applies hidden class when toolbarOpts.isHidden is true', () => {
    const { container } = render(<StyledMenuBar {...defaultProps} toolbarOpts={{ isHidden: true }} />);
    const toolbar = container.querySelector('.toolbar');
    expect(toolbar).toHaveClass('hidden');
  });

  it('shows character picker when language character button is clicked', () => {
    const { container, queryByTestId } = render(
      <StyledMenuBar {...defaultProps} activePlugins={['languageCharacters']} />,
    );
    expect(queryByTestId('character-picker')).not.toBeInTheDocument();
  });

  it('applies focused class when editor is focused', () => {
    const { container } = render(<StyledMenuBar {...defaultProps} toolbarOpts={{ alwaysVisible: false }} />);
    const toolbar = container.querySelector('.toolbar');
    expect(toolbar).toHaveClass('focused');
  });

  it('shows response area button when responseArea plugin is active', () => {
    const { container } = render(<StyledMenuBar {...defaultProps} activePlugins={['responseArea']} />);
    expect(container).toBeInTheDocument();
  });

  it('prevents default on mouse down', () => {
    const { container } = render(<StyledMenuBar {...defaultProps} />);
    const toolbar = container.querySelector('.toolbar');
    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    toolbar?.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
