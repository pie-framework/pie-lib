export const TOOLBAR_OPENED_META_KEY = 'toolbarOpenedChanged';

export const setToolbarOpened = (editor, opened) => {
  const next = !!opened;

  if (editor._toolbarOpened === next) {
    return;
  }

  editor._toolbarOpened = next;

  if (editor?.view && editor?.state?.tr) {
    editor.view.dispatch(editor.state.tr.setMeta(TOOLBAR_OPENED_META_KEY, true));
  }
};
