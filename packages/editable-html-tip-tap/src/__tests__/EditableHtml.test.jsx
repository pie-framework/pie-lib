import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { EditableHtml } from '../components/EditableHtml';

// Mock TipTap dependencies
jest.mock('@tiptap/react', () => ({
  EditorContent: ({ editor, ...props }) => <div data-testid="editor-content" {...props} />,
  useEditor: jest.fn((config) => {
    const mockEditor = {
      getHTML: jest.fn(() => '<p>test content</p>'),
      setEditable: jest.fn(),
      commands: {
        setContent: jest.fn(),
      },
      isActive: jest.fn(() => false),
      isFocused: false,
    };
    return mockEditor;
  }),
  useEditorState: jest.fn(() => ({
    isFocused: false,
  })),
}));

jest.mock('@tiptap/starter-kit', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@tiptap/extension-text-style', () => ({
  TextStyleKit: {},
}));

jest.mock('@tiptap/extension-character-count', () => ({
  CharacterCount: {
    configure: jest.fn(() => ({})),
  },
}));

jest.mock('@tiptap/extension-superscript', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@tiptap/extension-subscript', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@tiptap/extension-text-align', () => ({
  __esModule: true,
  default: {
    configure: jest.fn(() => ({})),
  },
}));

jest.mock('@tiptap/extension-image', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@tiptap/extension-table', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@tiptap/extension-table-row', () => ({
  TableRow: {},
}));

jest.mock('@tiptap/extension-table-cell', () => ({
  TableCell: {},
}));

jest.mock('@tiptap/extension-table-header', () => ({
  TableHeader: {},
}));

jest.mock('../extensions/extended-table', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('../extensions/responseArea', () => ({
  ExplicitConstructedResponseNode: {
    configure: jest.fn(() => ({})),
  },
  DragInTheBlankNode: {
    configure: jest.fn(() => ({})),
  },
  InlineDropdownNode: {
    configure: jest.fn(() => ({})),
  },
  MathTemplatedNode: {
    configure: jest.fn(() => ({})),
  },
  ResponseAreaExtension: {
    configure: jest.fn(() => ({})),
  },
}));

jest.mock('../extensions/math', () => ({
  MathNode: {
    configure: jest.fn(() => ({})),
  },
}));

jest.mock('../extensions/image', () => ({
  ImageUploadNode: {
    configure: jest.fn(() => ({})),
  },
}));

jest.mock('../extensions/media', () => ({
  Media: {
    configure: jest.fn(() => ({})),
  },
}));

jest.mock('../extensions/css', () => ({
  CSSMark: {
    configure: jest.fn(() => ({})),
  },
}));

jest.mock('../components/TiptapContainer', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="editor-container">{children}</div>,
}));

jest.mock('../extensions', () => ({
  ...jest.requireActual('../extensions'),
  buildExtensions: jest.fn(() => []),
}));

describe('EditableHtml', () => {
  const defaultProps = {
    markup: '<p>Hello World</p>',
    onChange: jest.fn(),
    onDone: jest.fn(),
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<EditableHtml {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('renders editor container', () => {
    const { getByTestId } = render(<EditableHtml {...defaultProps} />);
    expect(getByTestId('editor-container')).toBeInTheDocument();
  });

  it('renders editor content when editor is initialized', async () => {
    const { getByTestId } = render(<EditableHtml {...defaultProps} />);
    await waitFor(() => {
      expect(getByTestId('editor-content')).toBeInTheDocument();
    });
  });

  it('accepts custom toolbar options', () => {
    const toolbarOpts = {
      position: 'top',
      alignment: 'center',
      alwaysVisible: true,
      showDone: false,
      doneOn: 'change',
    };
    const { container } = render(<EditableHtml {...defaultProps} toolbarOpts={toolbarOpts} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts custom active plugins', () => {
    const activePlugins = ['bold', 'italic', 'underline'];
    const { container } = render(<EditableHtml {...defaultProps} activePlugins={activePlugins} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts plugin props', () => {
    const pluginProps = {
      showParagraphs: { disabled: false },
      separateParagraphs: { disabled: false },
    };
    const { container } = render(<EditableHtml {...defaultProps} pluginProps={pluginProps} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts response area props', () => {
    const responseAreaProps = {
      type: 'explicit-constructed-response',
      options: {},
    };
    const { container } = render(<EditableHtml {...defaultProps} responseAreaProps={responseAreaProps} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts size props', () => {
    const sizeProps = {
      width: 500,
      height: 300,
      minHeight: 200,
      maxHeight: 400,
      minWidth: 300,
      maxWidth: 600,
    };
    const { container } = render(<EditableHtml {...defaultProps} {...sizeProps} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts character limit', () => {
    const { container } = render(<EditableHtml {...defaultProps} charactersLimit={500} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts image support props', () => {
    const imageSupport = {
      add: jest.fn(),
      delete: jest.fn(),
    };
    const { container } = render(<EditableHtml {...defaultProps} imageSupport={imageSupport} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts max image dimensions', () => {
    const { container } = render(<EditableHtml {...defaultProps} maxImageWidth={800} maxImageHeight={600} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts language characters props', () => {
    const languageCharactersProps = [
      { label: 'Greek', value: 'greek' },
      { label: 'Cyrillic', value: 'cyrillic' },
    ];
    const { container } = render(<EditableHtml {...defaultProps} languageCharactersProps={languageCharactersProps} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts extra CSS rules', () => {
    const extraCSSRules = {
      '.custom-class': { color: 'red' },
    };
    const { container } = render(<EditableHtml {...defaultProps} extraCSSRules={extraCSSRules} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts upload sound support', () => {
    const uploadSoundSupport = {
      add: jest.fn(),
      delete: jest.fn(),
    };
    const { container } = render(<EditableHtml {...defaultProps} uploadSoundSupport={uploadSoundSupport} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts onKeyDown handler', () => {
    const onKeyDown = jest.fn();
    const { container } = render(<EditableHtml {...defaultProps} onKeyDown={onKeyDown} />);
    expect(container).toBeInTheDocument();
  });

  it('accepts disableImageAlignmentButtons prop', () => {
    const { container } = render(<EditableHtml {...defaultProps} disableImageAlignmentButtons={true} />);
    expect(container).toBeInTheDocument();
  });
});
