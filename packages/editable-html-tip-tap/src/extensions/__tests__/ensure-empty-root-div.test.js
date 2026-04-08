import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { DivNode } from '../div-node';
import { EnsureEmptyRootIsDiv } from '../ensure-empty-root-div';

/** Match EditableHtml so TrailingNode does not add a second empty block next to an empty paragraph. */
const starterKitConfigured = StarterKit.configure({
  trailingNode: {
    node: 'paragraph',
    notAfter: ['paragraph', 'div'],
  },
});

describe('EnsureEmptyRootIsDiv', () => {
  const extensions = [starterKitConfigured, DivNode, EnsureEmptyRootIsDiv];

  let editor;

  afterEach(() => {
    if (editor) {
      editor.destroy();
      editor = null;
    }
  });

  it('replaces a lone root paragraph with an empty div after select-all and delete (full delete flow)', () => {
    editor = new Editor({
      extensions,
      content: '<p>hello</p>',
    });

    editor.chain().focus().selectAll().deleteSelection().run();

    expect(editor.state.doc.childCount).toBe(1);
    expect(editor.state.doc.firstChild.type.name).toBe('div');
    expect(editor.state.doc.firstChild.textContent).toBe('');
  });

  it('does not replace a root paragraph that still has text', () => {
    editor = new Editor({
      extensions,
      content: '<p>x</p>',
    });

    expect(editor.state.doc.firstChild.type.name).toBe('paragraph');
  });

  it('does not run when there is more than one top-level block', () => {
    editor = new Editor({
      extensions,
      content: '<p>a</p><p>b</p>',
    });

    expect(editor.state.doc.childCount).toBe(2);
    expect(editor.state.doc.firstChild.type.name).toBe('paragraph');
  });
});
