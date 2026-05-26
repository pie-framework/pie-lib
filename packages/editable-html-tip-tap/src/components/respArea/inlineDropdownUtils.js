import { NodeSelection } from 'prosemirror-state';

export const HOLD_INLINE_DROPDOWN_TOOLBAR_INDEX = '_holdInlineDropdownToolbarIndex';

export const findInlineDropdownPos = (editor, index) => {
    let foundPos = null;

    editor.state.doc.descendants((n, p) => {
        if (n.type?.name === 'inline_dropdown' && String(n.attrs?.index) === String(index)) {
            foundPos = p;
            return false;
        }

        return true;
    });

    return foundPos;
};

export const holdInlineDropdownToolbar = (editor, index) => {
    editor[HOLD_INLINE_DROPDOWN_TOOLBAR_INDEX] = index;
};

export const releaseInlineDropdownToolbarHold = (editor) => {
    delete editor[HOLD_INLINE_DROPDOWN_TOOLBAR_INDEX];
};

export const isInlineDropdownToolbarHeld = (editor, index) =>
    editor[HOLD_INLINE_DROPDOWN_TOOLBAR_INDEX] != null &&
    String(editor[HOLD_INLINE_DROPDOWN_TOOLBAR_INDEX]) === String(index);

export const selectInlineDropdownNode = (editor, index, fallbackPos) => {
    const pos = findInlineDropdownPos(editor, index) ?? fallbackPos;

    if (pos == null) {
        return null;
    }

    const { tr } = editor.state;
    const nodeAtPos = tr.doc.nodeAt(pos);

    if (!nodeAtPos) {
        return null;
    }

    const { selection } = tr;

    if (selection.from === pos && selection.to === pos + nodeAtPos.nodeSize) {
        return pos;
    }

    tr.setSelection(NodeSelection.create(tr.doc, pos));
    editor.view.dispatch(tr);

    return pos;
};

export const deleteInlineDropdownByIndex = (editor, index, fallbackPos) => {
    const pos = findInlineDropdownPos(editor, index) ?? fallbackPos;

    if (pos == null) {
        releaseInlineDropdownToolbarHold(editor);
        return false;
    }

    const { tr } = editor.state;
    const nodeAtPos = tr.doc.nodeAt(pos);

    if (!nodeAtPos) {
        releaseInlineDropdownToolbarHold(editor);
        return false;
    }

    tr.delete(pos, pos + nodeAtPos.nodeSize);
    editor.view.dispatch(tr);
    releaseInlineDropdownToolbarHold(editor);

    return true;
};