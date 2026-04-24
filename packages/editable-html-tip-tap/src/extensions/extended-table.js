import { Table, TableView } from '@tiptap/extension-table';

const applyPresentationToTableElement = (table, attrs) => {
  const border = attrs?.border != null && attrs.border !== '' ? attrs.border : '1';

  table.setAttribute('border', border);
  table.style.setProperty('color', 'var(--pie-text, black)');
  table.style.setProperty('background-color', 'var(--pie-background, rgba(255, 255, 255))');
};

class ExtendedTableView extends TableView {
  constructor(node, cellMinWidth, view) {
    super(node, cellMinWidth, view);
    applyPresentationToTableElement(this.table, node.attrs);
  }

  update(node) {
    const ok = super.update(node);

    if (ok) {
      applyPresentationToTableElement(this.table, node.attrs);
    }

    return ok;
  }
}

const ExtendedTable = Table.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      // ProseMirror's default table DOM does not prune extra <col> nodes when a column
      // is removed; TableView (via column resizing) does.
      resizable: true,
      handleWidth: 0,
      View: ExtendedTableView,
    };
  },
  addAttributes() {
    return {
      border: { default: '1' },
    };
  },
  renderHTML(props) {
    const originalTable = this.parent(props);
    const { border } = props.HTMLAttributes;

    const previousStyle = `${originalTable[1].style}${originalTable[1].style.match(/.*; */) ? '' : ';'}`;

    originalTable[1].style = `${previousStyle}
    color: var(--pie-text, black);
    background-color: var(--pie-background, rgba(255, 255, 255))`;
    originalTable[1].border = border ? border : '1';

    return originalTable;
  },
});

export { applyPresentationToTableElement, ExtendedTableView };
export default ExtendedTable;
