import { setToolbarOpened, TOOLBAR_OPENED_META_KEY } from '../toolbar';

describe('setToolbarOpened', () => {
  const createEditor = (toolbarOpened = false) => {
    const tr = {
      setMeta: jest.fn().mockReturnThis(),
    };

    return {
      _toolbarOpened: toolbarOpened,
      state: { tr },
      view: {
        dispatch: jest.fn(),
      },
    };
  };

  it('sets editor._toolbarOpened and dispatches a meta transaction', () => {
    const editor = createEditor(false);

    setToolbarOpened(editor, true);

    expect(editor._toolbarOpened).toBe(true);
    expect(editor.state.tr.setMeta).toHaveBeenCalledWith(TOOLBAR_OPENED_META_KEY, true);
    expect(editor.view.dispatch).toHaveBeenCalledWith(editor.state.tr);
  });

  it('does nothing when the value is unchanged', () => {
    const editor = createEditor(true);

    setToolbarOpened(editor, true);

    expect(editor.view.dispatch).not.toHaveBeenCalled();
  });

  it('coerces the opened value to a boolean', () => {
    const editor = createEditor(false);

    setToolbarOpened(editor, 1);

    expect(editor._toolbarOpened).toBe(true);
  });
});
