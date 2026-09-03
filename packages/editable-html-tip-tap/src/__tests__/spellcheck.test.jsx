import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { EditableHtml } from '../components/EditableHtml';

const renderEditor = (props) =>
  render(<EditableHtml markup="<p>teh</p>" onChange={() => {}} pluginProps={{}} {...props} />);

const prosemirror = (container) => container.querySelector('.ProseMirror');

const waitForEditor = async (container) => {
  await waitFor(() => {
    expect(prosemirror(container)).toBeInTheDocument();
  });
};

describe('spellCheck', () => {
  it('turns off browser spellcheck on the contenteditable when spellCheck is false', async () => {
    const { container } = renderEditor({ spellCheck: false });

    await waitForEditor(container);

    expect(prosemirror(container).getAttribute('spellcheck')).toBe('false');
    expect(prosemirror(container).getAttribute('autocorrect')).toBe('off');
    expect(prosemirror(container).getAttribute('autocapitalize')).toBe('off');
  });

  it('leaves browser spellcheck on when spellCheck is true', async () => {
    const { container } = renderEditor({ spellCheck: true });

    await waitForEditor(container);

    expect(prosemirror(container).getAttribute('spellcheck')).toBe('true');
  });

  it('keeps the browser default when spellCheck is not provided', async () => {
    const { container } = renderEditor();

    await waitForEditor(container);

    expect(prosemirror(container).getAttribute('spellcheck')).toBe('true');
  });

  it('updates the contenteditable when spellCheck changes on an existing editor', async () => {
    const { container, rerender } = renderEditor({ spellCheck: true });

    await waitForEditor(container);
    expect(prosemirror(container).getAttribute('spellcheck')).toBe('true');

    rerender(<EditableHtml markup="<p>teh</p>" onChange={() => {}} pluginProps={{}} spellCheck={false} />);

    await waitFor(() => {
      expect(prosemirror(container).getAttribute('spellcheck')).toBe('false');
    });
  });

  it('keeps spellcheck off for a disabled (read-only) editor', async () => {
    const { container } = renderEditor({ spellCheck: false, disabled: true });

    await waitForEditor(container);

    expect(prosemirror(container).getAttribute('spellcheck')).toBe('false');
  });
});
