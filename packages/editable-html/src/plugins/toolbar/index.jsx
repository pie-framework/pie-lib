import EditorAndToolbar from './editor-and-toolbar';
import React from 'react';

/**
 * Adds a toolbar which is shown when the editor is focused.
 * @param {*} opts
 */
export default function ToolbarPlugin(opts) {
  return {
    // eslint-disable-next-line react/display-name
    renderEditor: props => (
      <EditorAndToolbar
        {...props}
        mainEditorRef={opts.mainEditorRef}
        disableUnderline={opts.disableUnderline}
        //onDone={opts.onDone}
        onDone={undefined}
      />
    )
  };
}
