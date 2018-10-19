import EditorAndToolbar from './editor-and-toolbar';
import React from 'react';

/**
 * Adds a toolbar which is shown when the editor is focused.
 * @param {*} opts
 */
export default function ToolbarPlugin(opts) {
  return {
    /* eslint-disable-next-line */
    renderEditor: props => <EditorAndToolbar {...props} disableUnderline={opts.disableUnderline} onDone={opts.onDone} />
  };
}
