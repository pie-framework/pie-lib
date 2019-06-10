import React from 'react';
import { Inline, Text, Node } from 'slate';
import { insertSnackBar } from '../utils';

export const onItemBuilderMouseDown = (e, { nodeProps }) => {
  const value = nodeProps.editor.value;
  const change = value.change();
  const closestWithKey = e.target.closest('[data-key]');
  const key = closestWithKey.dataset.key;
  const currentNode = value.document.findDescendant(d => d.key === key);
  const lastText = currentNode.getLastText();

  setTimeout(() => {
    const native = window.getSelection();
    const p = native.anchorNode.parentElement.closest('[data-offset-key]');

    if (p) {
      const attr = p.getAttribute('data-offset-key');
      const focusKey = attr.split(':')[0];

      if (focusKey !== lastText.key) {
        change
          .moveFocusTo(lastText.key, lastText.text.length - 1)
          .moveAnchorTo(lastText.key, lastText.text.length - 1);

        nodeProps.editor.onChange(change);
      }
    }
  });
};

export const onAddMenuItemMouseDown = (e, { n, nodeProps }) => {
  const value = nodeProps.editor.value;
  const { document } = value;
  const change = value.change();
  const inlineDropdown = document.getClosest(n.key, a => a.type === 'inline_dropdown');
  const newVal = n.getText();

  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();

  if (n.nodes.size !== 1 || (newVal && newVal !== '\u00A0')) {
    const lastMenuItem = inlineDropdown.nodes.findLast(n => n.type === 'menu_item');
    const clonedNodes = n.nodes.map(n => Node.create(n.toJSON()));
    const node = Inline.create({
      type: 'menu_item',
      nodes: clonedNodes,
      data: {
        id: !lastMenuItem ? 0 : parseInt(lastMenuItem.data.get('id')) + 1
      }
    });

    const jsonNode = n.toJSON();

    change.insertNodeByKey(inlineDropdown.key, inlineDropdown.nodes.size, node);
    change.replaceNodeByKey(
      n.key,
      Node.create({
        ...jsonNode,
        nodes: [Text.create('\u00A0')]
      })
    );
  } else {
    insertSnackBar('Choice cannot be empty');
  }

  nodeProps.editor.onChange(change);
};

export default ({ attributes, n, nodeProps }) => {
  return (
    <span
      {...attributes}
      style={{
        alignItems: 'center',
        background: '#E0E1E6',
        boxSizing: 'border-box',
        borderRadius: '2px 2px 0px 0px',
        display: 'inline-flex',
        minHeight: '52px',
        justifyContent: 'center',
        minWidth: '178px',
        width: '100%',
        cursor: 'initial',
        padding: '10px'
      }}
      contentEditable
      suppressContentEditableWarning
    >
      <span
        style={{
          background: '#fff',
          border: '2px solid #89B7F4',
          borderRadius: '3px',
          boxSizing: 'border-box',
          display: 'inline-block',
          minWidth: '160px',
          width: '100%',
          minHeight: '36px',
          position: 'relative',
          padding: '10px 25px 10px 10px'
        }}
        data-key={n.key}
        onMouseDown={e => onItemBuilderMouseDown(e, { nodeProps })}
      >
        {nodeProps.children}
        <i
          style={{
            cursor: 'pointer',
            fontSize: '20px',
            fontStyle: 'normal',
            position: 'absolute',
            top: '8px',
            right: '8px'
          }}
          contentEditable={false}
          onMouseDown={e => onAddMenuItemMouseDown(e, { n, nodeProps })}
        >
          +
        </i>
      </span>
    </span>
  );
};
