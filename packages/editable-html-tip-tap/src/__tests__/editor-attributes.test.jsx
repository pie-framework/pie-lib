import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { EditableHtml } from '../components/EditableHtml';

const renderEditor = (props) =>
  render(<EditableHtml markup="<p>hello</p>" onChange={() => {}} pluginProps={{}} {...props} />);

const prosemirror = (container) => container.querySelector('.ProseMirror');

const waitForEditor = async (container) => {
  await waitFor(() => {
    expect(prosemirror(container)).toBeInTheDocument();
  });
};

describe('contenteditable attributes', () => {
  // PIE-1015: 2.1.17 lost role="textbox" on a plain mount, because setEditable re-pushes
  // editorProps through setOptions and ProseMirror drops any attribute no longer listed.
  it('announces the editor as a textbox on a plain mount', async () => {
    const { container } = renderEditor();

    await waitForEditor(container);

    expect(prosemirror(container).getAttribute('role')).toBe('textbox');
  });

  // PIE-1016: a PIE-owned hook external consumers can target, unlike role or .tiptap.ProseMirror.
  it('exposes the PIE-owned editor hook on a plain mount', async () => {
    const { container } = renderEditor();

    await waitForEditor(container);

    expect(prosemirror(container).getAttribute('data-pie-editor')).toBe('true');
  });

  it('keeps both attributes when spellCheck changes on a mounted editor', async () => {
    const { container, rerender } = renderEditor({ spellCheck: true });

    await waitForEditor(container);

    rerender(<EditableHtml markup="<p>hello</p>" onChange={() => {}} pluginProps={{}} spellCheck={false} />);

    await waitFor(() => {
      expect(prosemirror(container).getAttribute('spellcheck')).toBe('false');
    });

    expect(prosemirror(container).getAttribute('role')).toBe('textbox');
    expect(prosemirror(container).getAttribute('data-pie-editor')).toBe('true');
  });

  it('keeps both attributes when the editor is disabled on a mounted editor', async () => {
    const { container, rerender } = renderEditor();

    await waitForEditor(container);

    rerender(<EditableHtml markup="<p>hello</p>" onChange={() => {}} pluginProps={{}} disabled />);

    await waitFor(() => {
      expect(prosemirror(container).getAttribute('contenteditable')).toBe('false');
    });

    expect(prosemirror(container).getAttribute('role')).toBe('textbox');
    expect(prosemirror(container).getAttribute('data-pie-editor')).toBe('true');
  });

  // Online Testing queries [data-pie-editor][contenteditable="true"] to attach its answer-save
  // listener, so a read-only render has to carry the hook but not match that selector.
  it('marks a read-only editor as not editable so the hook can be filtered on it', async () => {
    const { container } = renderEditor({ disabled: true });

    await waitForEditor(container);

    expect(prosemirror(container).getAttribute('data-pie-editor')).toBe('true');
    expect(prosemirror(container).getAttribute('contenteditable')).toBe('false');
    expect(container.querySelector('[data-pie-editor][contenteditable="true"]')).toBeNull();
  });
});
