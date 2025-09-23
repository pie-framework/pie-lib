import EditTable from 'slate-edit-table';
import { isSelectionInTable } from 'slate-edit-table/dist/utils';
import { onEnter, onModEnter, onTab, onUpDown } from 'slate-edit-table/dist/handlers';
import TableOptions from 'slate-edit-table/dist/options';
import { clearCell } from 'slate-edit-table/dist/changes';

function onBackspace(event, change, editor, opts) {
  const { value } = change;
  const { startBlock, endBlock, selection, document } = value;

  const startCell = document.getClosest(startBlock.key, opts.isCell);
  const endCell = document.getClosest(endBlock.key, opts.isCell);

  const startBlockIndex = startCell?.nodes?.findIndex((block) => block.key == startBlock.key);

  // If a cursor is collapsed at the start of the first block, do nothing
  if (startBlockIndex === 0 && selection.isAtStartOf(startBlock)) {
    if (startBlock.isVoid) {
      // Delete the block normally if it is a void block
      return undefined;
    }

    event.preventDefault();
    return change;
  }

  // If "normal" deletion, we continue
  if (startCell === endCell) {
    return undefined;
  }

  // If cursor is between multiple blocks,
  // we clear the content of the cells.
  event.preventDefault();

  const { blocks } = value;

  // Get all cells that contains the selection
  const cells = blocks
    .map((node) =>
      node.type === opts.typeCell ? node : document.getClosest(node.key, (a) => a.type === opts.typeCell),
    )
    .toSet();

  // If the cursor is at the very end of the first cell, ignore it.
  // If the cursor is at the very start of the last cell, ignore it.
  // This behavior is to compensate hanging selection behaviors:
  // https://github.com/ianstormtaylor/slate/pull/1605
  const ignoreFirstCell = value.selection.collapseToStart().isAtEndOf(cells.first());
  const ignoreLastCell = value.selection.collapseToEnd().isAtStartOf(cells.last());

  let cellsToClear = cells;
  if (ignoreFirstCell) {
    cellsToClear = cellsToClear.rest();
  }
  if (ignoreLastCell) {
    cellsToClear = cellsToClear.butLast();
  }

  // Clear all the selection
  cellsToClear.forEach((cell) => clearCell(opts, change, cell));

  // Update the selection properly, and avoid reset of selection
  const updatedStartCell = change.value.document.getDescendant(cellsToClear.first().key);
  return change.collapseToStartOf(updatedStartCell);
}

const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';
const KEY_BACKSPACE = 'Backspace';
const KEY_DOWN = 'ArrowDown';
const KEY_UP = 'ArrowUp';

/**
 * User is pressing a key in the editor
 */
function onKeyDown(opts, event, change, editor) {
  // Only handle events in cells
  if (!isSelectionInTable(opts, change.value)) {
    return undefined;
  }

  // Build arguments list
  const args = [event, change, editor, opts];

  switch (event.key) {
    case KEY_ENTER:
      if (event.metaKey && opts.exitBlockType) {
        return onModEnter(...args);
      }
      return onEnter(...args);

    case KEY_TAB:
      return onTab(...args);
    case KEY_BACKSPACE:
      return onBackspace(...args);
    case KEY_DOWN:
    case KEY_UP:
      return onUpDown(...args);
    default:
      return undefined;
  }
}

export default (opts) => {
  const core = EditTable(opts);

  const tableOpts = new TableOptions(opts);

  core.onKeyDown = onKeyDown.bind(null, tableOpts);

  return core;
};
