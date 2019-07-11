import React from 'react';

import EditorAndToolbar from './editor-and-toolbar';

/**
 * Adds a toolbar which is shown when the editor is focused.
 * @param {*} opts
 */
export default function ToolbarPlugin(opts) {
  return {
    /* eslint-disable-next-line */
    renderEditor: props => (
      <EditorAndToolbar
        {...props}
        mainEditorRef={opts.mainEditorRef}
        disableUnderline={opts.disableUnderline}
        onDone={opts.onDone}
      />
    )
  };
}
