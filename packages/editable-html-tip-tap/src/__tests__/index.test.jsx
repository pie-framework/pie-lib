import StyledEditor, { ALL_PLUGINS, DEFAULT_PLUGINS, EditableHtml } from '../index';

// Mock TipTap and dependencies
jest.mock('@tiptap/react', () => ({
  EditorContent: () => <div data-testid="editor-content" />,
  useEditor: jest.fn(() => ({
    getHTML: jest.fn(() => '<p>test content</p>'),
    setEditable: jest.fn(),
    commands: { setContent: jest.fn() },
    isActive: jest.fn(() => false),
    isFocused: false,
  })),
  useEditorState: jest.fn(() => ({ isFocused: false })),
}));

jest.mock('@tiptap/starter-kit', () => ({
  __esModule: true,
  default: { configure: jest.fn(() => ({})) },
}));
jest.mock('@tiptap/extension-text-style', () => ({ TextStyleKit: {} }));
jest.mock('@tiptap/extension-character-count', () => ({
  CharacterCount: { configure: jest.fn(() => ({})) },
}));
jest.mock('@tiptap/extension-superscript', () => ({ __esModule: true, default: {} }));
jest.mock('@tiptap/extension-subscript', () => ({ __esModule: true, default: {} }));
jest.mock('@tiptap/extension-text-align', () => ({
  __esModule: true,
  default: { configure: jest.fn(() => ({})) },
}));
jest.mock('@tiptap/extension-image', () => ({ __esModule: true, default: {} }));
jest.mock('@tiptap/extension-table', () => ({ __esModule: true, default: {} }));
jest.mock('@tiptap/extension-table-row', () => ({ TableRow: {} }));
jest.mock('../extensions/extended-table-cell', () => ({
  ExtendedTableCell: {},
  ExtendedTableHeader: {},
}));
jest.mock('../extensions/extended-table', () => ({ __esModule: true, default: {} }));
jest.mock('../extensions/ensure-empty-root-div', () => ({ EnsureEmptyRootIsDiv: {} }));
jest.mock('../extensions/extended-list-item', () => ({ ExtendedListItem: {} }));
jest.mock('../extensions/ensure-list-item-content-is-div', () => ({ EnsureListItemContentIsDiv: {} }));
jest.mock('../extensions/responseArea', () => ({
  ExplicitConstructedResponseNode: { configure: jest.fn(() => ({})) },
  DragInTheBlankNode: { configure: jest.fn(() => ({})) },
  InlineDropdownNode: { configure: jest.fn(() => ({})) },
  ResponseAreaExtension: { configure: jest.fn(() => ({})) },
}));
jest.mock('../extensions/math', () => ({ MathNode: { configure: jest.fn(() => ({})) } }));
jest.mock('../extensions/image', () => ({ ImageUploadNode: { configure: jest.fn(() => ({})) } }));
jest.mock('../extensions/media', () => ({ Media: { configure: jest.fn(() => ({})) } }));
jest.mock('../extensions/css', () => ({ CSSMark: { configure: jest.fn(() => ({})) } }));
jest.mock('../components/TiptapContainer', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="editor-container">{children}</div>,
}));
jest.mock('../extensions', () => ({
  buildExtensions: jest.fn(() => []),
  ALL_PLUGINS: [
    'bold',
    'html',
    'extraCSSRules',
    'italic',
    'underline',
    'strikethrough',
    'bulleted-list',
    'numbered-list',
    'image',
    'math',
    'languageCharacters',
    'text-align',
    'blockquote',
    'h3',
    'table',
    'video',
    'audio',
    'responseArea',
    'redo',
    'undo',
    'superscript',
    'subscript',
  ],
  DEFAULT_PLUGINS: [
    'bold',
    'html',
    'extraCSSRules',
    'italic',
    'underline',
    'strikethrough',
    'bulleted-list',
    'numbered-list',
    'image',
    'math',
    'languageCharacters',
    'text-align',
    'table',
    'video',
    'audio',
    'redo',
    'undo',
    'superscript',
    'subscript',
  ],
}));

describe('editable-html-tip-tap module', () => {
  describe('exports', () => {
    it('exports StyledEditor as default', () => {
      expect(StyledEditor).toBeDefined();
    });

    it('exports EditableHtml as named export', () => {
      expect(EditableHtml).toBeDefined();
    });

    it('exports ALL_PLUGINS as named export', () => {
      expect(ALL_PLUGINS).toBeDefined();
      expect(Array.isArray(ALL_PLUGINS)).toBe(true);
    });

    it('exports DEFAULT_PLUGINS as named export', () => {
      expect(DEFAULT_PLUGINS).toBeDefined();
      expect(Array.isArray(DEFAULT_PLUGINS)).toBe(true);
    });

    it('StyledEditor and EditableHtml refer to the same component', () => {
      expect(StyledEditor).toBe(EditableHtml);
    });
  });

  describe('ALL_PLUGINS', () => {
    it('contains expected plugins', () => {
      expect(ALL_PLUGINS).toContain('bold');
      expect(ALL_PLUGINS).toContain('italic');
      expect(ALL_PLUGINS).toContain('underline');
      expect(ALL_PLUGINS).toContain('math');
      expect(ALL_PLUGINS).toContain('table');
      expect(ALL_PLUGINS).toContain('responseArea');
    });
  });

  describe('DEFAULT_PLUGINS', () => {
    it('is a subset of ALL_PLUGINS', () => {
      const allPluginsSet = new Set(ALL_PLUGINS);
      DEFAULT_PLUGINS.forEach((plugin) => {
        expect(allPluginsSet.has(plugin)).toBe(true);
      });
    });

    it('contains basic formatting plugins', () => {
      expect(DEFAULT_PLUGINS).toContain('bold');
      expect(DEFAULT_PLUGINS).toContain('italic');
      expect(DEFAULT_PLUGINS).toContain('underline');
    });
  });
});
