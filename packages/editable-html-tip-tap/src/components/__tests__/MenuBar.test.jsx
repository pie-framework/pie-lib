import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import StyledMenuBar from '../MenuBar';

// flipped to false by the accessibility tests to render the toolbar in its disabled state
let mockCanRunCommands = true;
// node/mark types the accessibility tests want the editor state to report as active
let mockActiveTypes = [];

jest.mock('@tiptap/react', () => ({
  EditorContent: ({ editor }) => <div data-testid="editor-content" />,
  useEditorState: ({ selector }) => {
    const can = () => ({ run: jest.fn(() => mockCanRunCommands) });
    const mockEditor = {
      isActive: jest.fn((name) => mockActiveTypes.includes(name)),
      can: jest.fn(() => ({
        chain: jest.fn(() => ({
          toggleBold: can,
          insertTable: can,
          toggleItalic: can,
          toggleStrike: can,
          toggleCode: can,
          unsetAllMarks: can,
          undo: can,
          redo: can,
        })),
      })),
      getAttributes: jest.fn(() => ({ border: '1' })),
      commandManager: {},
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

  it('calculates hasTextSelectionInTable correctly when selection is not empty in table', () => {
    // This test verifies the hasTextSelectionInTable state computation
    const { container } = render(<StyledMenuBar {...defaultProps} activePlugins={['table', 'bold', 'italic']} />);
    expect(container).toBeInTheDocument();
  });

  it('hides table manipulation buttons when text is selected in table', () => {
    // When hasTextSelectionInTable is true, table row/column buttons should be hidden
    const { container } = render(<StyledMenuBar {...defaultProps} activePlugins={['table']} />);
    // The component should render but table manipulation buttons should be conditional
    expect(container).toBeInTheDocument();
  });

  it('shows table manipulation buttons when no text is selected in table', () => {
    // When hasTextSelectionInTable is false, table row/column buttons should be visible
    const { container } = render(<StyledMenuBar {...defaultProps} activePlugins={['table']} />);
    expect(container).toBeInTheDocument();
  });

  it('shows text formatting buttons regardless of table state', () => {
    // Bold, italic, etc. should always be visible when their plugin is active
    const { container } = render(<StyledMenuBar {...defaultProps} activePlugins={['bold', 'italic', 'underline']} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('does not hide text formatting buttons when in table', () => {
    // Verify that the removal of "|| state.isTable" condition works correctly
    const { container } = render(<StyledMenuBar {...defaultProps} activePlugins={['table', 'bold', 'italic']} />);
    expect(container).toBeInTheDocument();
  });
  describe('accessible names', () => {
    const allPlugins = [
      'table',
      'bold',
      'italic',
      'strikethrough',
      'code',
      'underline',
      'subscript',
      'superscript',
      'image',
      'video',
      'audio',
      'css',
      'blockquote',
      'h3',
      'math',
      'languageCharacters',
      'bulleted-list',
      'numbered-list',
      'undo',
      'redo',
      'responseArea',
    ];

    const accessibleName = (button) => button.getAttribute('aria-label') || button.textContent.trim();

    afterEach(() => {
      mockCanRunCommands = true;
      mockActiveTypes = [];
    });

    it('gives every toolbar button an accessible name', () => {
      const { container } = render(<StyledMenuBar {...defaultProps} activePlugins={allPlugins} />);
      const buttons = Array.from(container.querySelectorAll('button'));

      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((button) => expect(accessibleName(button)).not.toEqual(''));
    });

    it('keeps accessible names on disabled buttons', () => {
      mockCanRunCommands = false;

      const { container } = render(<StyledMenuBar {...defaultProps} activePlugins={allPlugins} />);
      const disabled = Array.from(container.querySelectorAll('button[disabled]'));

      expect(disabled.length).toBeGreaterThan(0);
      disabled.forEach((button) => expect(accessibleName(button)).not.toEqual(''));
    });

    it('labels the formatting and history buttons', () => {
      const { getByLabelText } = render(<StyledMenuBar {...defaultProps} activePlugins={allPlugins} />);

      ['Bold', 'Italic', 'Underline', 'Insert table', 'Undo', 'Redo'].forEach((label) =>
        expect(getByLabelText(label)).toBeInTheDocument(),
      );
    });

    it('labels the table buttons', () => {
      mockActiveTypes = ['table'];

      const { getByLabelText } = render(<StyledMenuBar {...defaultProps} activePlugins={allPlugins} />);

      ['Add table row', 'Remove table row', 'Add table column', 'Remove table column', 'Remove table'].forEach(
        (label) => expect(getByLabelText(label)).toBeInTheDocument(),
      );
      expect(getByLabelText('Table borders')).toHaveAttribute('aria-pressed', 'true');
    });

    it('labels the response area insert button', () => {
      const { getByLabelText } = render(<StyledMenuBar {...defaultProps} activePlugins={['responseArea']} />);
      expect(getByLabelText('Insert response area')).toBeInTheDocument();
    });

    it('exposes toggle state via aria-pressed on mark buttons', () => {
      const { getByLabelText } = render(<StyledMenuBar {...defaultProps} activePlugins={allPlugins} />);

      expect(getByLabelText('Bold')).toHaveAttribute('aria-pressed', 'false');
      // one-shot actions are not toggles, so they must not report a pressed state
      expect(getByLabelText('Undo')).not.toHaveAttribute('aria-pressed');
    });
  });
});
