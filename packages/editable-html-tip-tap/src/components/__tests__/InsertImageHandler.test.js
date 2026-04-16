import InsertImageHandler from '../image/InsertImageHandler';

describe('InsertImageHandler', () => {
  const mockNode = {
    attrs: {},
    nodeSize: 1,
  };

  const createMockEditor = () => ({
    _insertingImage: true,
    state: {
      doc: {
        descendants: jest.fn((callback) => {
          callback(mockNode, 5);
        }),
      },
      tr: {
        setNodeMarkup: jest.fn((pos, type, attrs) => ({ setNodeMarkup: jest.fn() })),
        delete: jest.fn((from, to) => ({ delete: jest.fn() })),
      },
    },
    view: {
      dispatch: jest.fn(),
    },
  });

  const mockOnFinish = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates handler instance', () => {
    const editor = createMockEditor();
    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    expect(handler).toBeDefined();
    expect(handler.editor).toBe(editor);
    expect(handler.node).toBe(mockNode);
    expect(handler.onFinish).toBe(mockOnFinish);
  });

  it('stores nodePos from descendants', () => {
    const editor = createMockEditor();
    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    expect(handler.nodePos).toBe(5);
  });

  it('stores isPasted parameter', () => {
    const editor = createMockEditor();
    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish, true);
    expect(handler.isPasted).toBe(true);
  });

  it('defaults isPasted to false', () => {
    const editor = createMockEditor();
    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    expect(handler.isPasted).toBe(false);
  });

  it('cancel deletes node and calls onFinish', () => {
    const editor = createMockEditor();
    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    handler.cancel();
    expect(mockOnFinish).toHaveBeenCalledWith(false);
    expect(editor._insertingImage).toBe(false);
  });

  it('updateNode dispatches transaction with new attributes', () => {
    const editor = createMockEditor();
    const mockNodeAt = jest.fn(() => ({ attrs: { existing: 'value' } }));
    editor.state.doc.nodeAt = mockNodeAt;

    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    handler.updateNode({ newAttr: 'newValue' });

    expect(mockNodeAt).toHaveBeenCalledWith(5);
    expect(editor.view.dispatch).toHaveBeenCalled();
  });

  it('done calls onFinish with false on error', () => {
    const editor = createMockEditor();
    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    handler.done('error', null);

    expect(consoleLogSpy).toHaveBeenCalledWith('error');
    expect(mockOnFinish).toHaveBeenCalledWith(false);
    expect(editor._insertingImage).toBe(false);
    consoleLogSpy.mockRestore();
  });

  it('done updates node and calls onFinish with true on success', () => {
    const editor = createMockEditor();
    const mockNodeAt = jest.fn(() => ({ attrs: {} }));
    editor.state.doc.nodeAt = mockNodeAt;

    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    handler.done(null, 'http://example.com/image.jpg');

    expect(editor.view.dispatch).toHaveBeenCalled();
    expect(mockOnFinish).toHaveBeenCalledWith(true);
    expect(editor._insertingImage).toBe(false);
  });

  it('fileChosen returns early when no file provided', () => {
    const editor = createMockEditor();
    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    handler.fileChosen(null);
    expect(editor.view.dispatch).not.toHaveBeenCalled();
  });

  it('fileChosen saves file and reads it as data URL', () => {
    const editor = createMockEditor();
    const mockNodeAt = jest.fn(() => ({ attrs: {} }));
    editor.state.doc.nodeAt = mockNodeAt;

    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    global.FileReader = jest.fn(function () {
      this.readAsDataURL = jest.fn(function () {
        this.result = 'data:image/jpeg;base64,abc123';
        this.onload();
      });
    });

    handler.fileChosen(mockFile);

    expect(handler.chosenFile).toBe(mockFile);
    expect(editor._insertingImage).toBe(false);
  });

  it('progress updates node with percent', () => {
    const editor = createMockEditor();
    const mockNodeAt = jest.fn(() => ({ attrs: {} }));
    editor.state.doc.nodeAt = mockNodeAt;

    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    handler.progress(50, 500, 1000);

    expect(editor.view.dispatch).toHaveBeenCalled();
  });

  it('getChosenFile returns the chosen file', () => {
    const editor = createMockEditor();
    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    handler.chosenFile = mockFile;

    expect(handler.getChosenFile()).toBe(mockFile);
  });

  it('getChosenFile returns null initially', () => {
    const editor = createMockEditor();
    const handler = new InsertImageHandler(editor, mockNode, mockOnFinish);
    expect(handler.getChosenFile()).toBeNull();
  });
});
