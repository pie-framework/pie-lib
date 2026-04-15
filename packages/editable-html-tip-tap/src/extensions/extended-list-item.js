import { ListItem } from '@tiptap/extension-list-item';

/**
 * Default list items use `paragraph block*`, so empty/new items become `<p>`.
 * Prefer `div` first to keep consistency with DivNode at root and table cells.
 */
export const ExtendedListItem = ListItem.extend({
  content:
    '(div | paragraph | heading | bulletList | orderedList | blockquote | codeBlock | horizontalRule | image | imageUploadNode)+',
});
