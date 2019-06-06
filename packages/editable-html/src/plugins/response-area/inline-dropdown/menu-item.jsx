import React from 'react';
import { insertSnackBar } from '../utils';

export let clickInterval;

export const onMenuItemMouseDown = (e, { data, n, nodeProps }) => {
  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();

  const handleClick = (e, doubleClick) => {
    const val = nodeProps.editor.value;
    const change = val.change();
    const list = val.document.filterDescendants(d => d.type === 'menu_item');

    if (doubleClick) {
      const closestEl = e.target.closest('[data-node-key]');
      const key = closestEl.dataset.nodeKey;
      // response area
      const inlineDropdown = val.document.getClosest(key, a => a.type === 'inline_dropdown');
      const newData = {
        ...inlineDropdown.data.toJSON(),
        open: false,
        selected: null
      };

      const menuItem = inlineDropdown.findDescendant(d => d.type === 'menu_item' && d.key === key);

      newData.selected = menuItem && menuItem.data.get('id');

      console.log('Changing to', newData.selected);

      change.setNodeByKey(inlineDropdown.key, {
        data: newData
      });

      const nextText = val.document.getNextText(inlineDropdown.key);

      change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);
    } else {
      list.forEach(n =>
        change.setNodeByKey(n.key, {
          data: {
            ...n.data.toJSON(),
            clicked: false
          }
        })
      );

      change.setNodeByKey(n.key, {
        data: {
          ...data,
          clicked: true
        }
      });
    }

    nodeProps.editor.onChange(change);
    clickInterval = undefined;
  };

  console.log('click', clickInterval);

  if (clickInterval) {
    clearInterval(clickInterval);
    handleClick(e, true);
  } else {
    clickInterval = setTimeout(() => handleClick(e), 200);
  }
};

export const onRemoveItemMouseDown = (e, { nodeProps }) => {
  const elKey = e.target.dataset.key;
  const val = nodeProps.editor.value;
  const inlineDropdown = val.document.getClosest(elKey, a => a.type === 'inline_dropdown');
  const menuItems = inlineDropdown.filterDescendants(d => d.type === 'menu_item');
  const change = val.change();

  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();

  if (menuItems.size > 2) {
    const elKey = e.target.dataset.key;

    change.removeNodeByKey(elKey);

    nodeProps.editor.onChange(change);
  } else {
    insertSnackBar('You need to have at least 2 possible responses.');
  }
};

export default ({ data, n, nodeProps }) => {
  return (
    <span
      contentEditable={false}
      data-node-key={n.key}
      style={{
        background: data.clicked ? '#C4DCFA' : '#fff',
        boxSizing: 'border-box',
        display: 'block',
        minHeight: '45px',
        minWidth: '178px',
        cursor: 'pointer',
        lineHeight: '30px',
        padding: '10px 25px 10px 10px',
        margin: '0px 0px -20px 0px',
        position: 'relative'
      }}
      onMouseDown={e => onMenuItemMouseDown(e, { data, n, nodeProps })}
    >
      <i
        style={{
          cursor: 'pointer',
          fontSize: '20px',
          fontStyle: 'normal',
          position: 'absolute',
          top: '0',
          right: '0',
          zIndex: 3,
          width: '25px',
          height: '50px',
          lineHeight: '40px'
        }}
        data-key={n.key}
        onMouseDown={e => onRemoveItemMouseDown(e, { nodeProps })}
      >
        x
      </i>
      <div
        style={{
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2
        }}
      />
      {nodeProps.children}
    </span>
  );
};
