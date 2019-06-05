import React from 'react';

export const onInputClick = (nodeProps, n) => {
  const { value: val, onChange } = nodeProps.editor;
  const change = val.change();
  const nextText = val.document.getNextText(n.key);

  change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);
  change.setNodeByKey(n.key, {
    data: { focused: false }
  });

  onChange(change);
};

export const onMouseDown = (e, nodeProps, n, data) => {
  const { focused } = data;
  const value = nodeProps.editor.value;
  const change = value.change();
  const closestWithKey = e.target.closest('[data-key]');
  const key = closestWithKey.dataset.key;
  const currentNode =
    key === n.key
      ? value.document.findDescendant(d => d.key === key)
      : value.document.getClosestInline(key);
  const lastText = currentNode.getLastText();

  if (value.isFocused) {
    setTimeout(() => {
      const native = window.getSelection();
      const p = native.anchorNode.parentElement.closest('[data-offset-key]');

      if (p) {
        const attr = p.getAttribute('data-offset-key');
        const focusKey = attr.split(':')[0];
        const parentNode = value.document.getParent(focusKey);

        if (!focused || parentNode.type !== 'explicit_constructed_response') {
          change
            .moveFocusTo(lastText.key, lastText.text.length - 1)
            .moveAnchorTo(lastText.key, lastText.text.length - 1);

          change.setNodeByKey(currentNode.key, {
            data: { focused: true }
          });

          nodeProps.editor.onChange(change);
        }
      }
    });
  }
};

export default ({ attributes, data, n, nodeProps }) => {
  const { focused, inTable } = data;

  return (
    <span
      {...attributes}
      style={{
        display: 'inline-flex',
        minHeight: '50px',
        minWidth: '178px',
        position: 'relative',
        margin: inTable ? '10px' : '0 10px',
        cursor: 'pointer'
      }}
    >
      <div
        style={{
          cursor: 'default',
          display: focused ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        onClick={() => onInputClick(nodeProps, n)}
      />
      <div
        style={{
          display: 'inline-flex',
          minWidth: '178px',
          minHeight: '36px',
          height: !data.focused && '36px',
          background: '#FFF',
          border: '1px solid #C0C3CF',
          boxSizing: 'border-box',
          borderRadius: '3px',
          overflow: 'hidden',
          position: data.focused ? 'absolute' : 'relative',
          padding: '8px'
        }}
        data-key={n.key}
        onMouseDown={e => onMouseDown(e, nodeProps, n, data)}
        contentEditable
        suppressContentEditableWarning
      >
        {nodeProps.children}
      </div>
    </span>
  );
};
