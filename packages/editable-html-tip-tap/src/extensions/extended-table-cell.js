import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

/**
 * Default table cells use ProseMirror `createAndFill()`, which prefers the first
 * block type allowed by the content expression. Stock cells use `block+`, so
 * `paragraph` wins. Listing `div` first matches the editor default for plain text
 * (see DivNode) while still allowing other blocks (lists, headings, images, …).
 */
const TABLE_CELL_BLOCK_CONTENT =
  '(div | paragraph | heading | bulletList | orderedList | blockquote | codeBlock | horizontalRule | image | imageUploadNode)+';

export const ExtendedTableCell = TableCell.extend({
  content: TABLE_CELL_BLOCK_CONTENT,
});

export const ExtendedTableHeader = TableHeader.extend({
  content: TABLE_CELL_BLOCK_CONTENT,
});
