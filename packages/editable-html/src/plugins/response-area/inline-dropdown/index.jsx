import React from 'react';
import { Chevron } from '../icons';

export ItemBuilder from './item-builder';
export MenuItem from './menu-item';

export const openOrClose = (nodeProps, n, open) => {
  const key = n.key;
  const data = { open: open };
  const val = nodeProps.editor.value;
  const node = val.document.findDescendant(d => d.key === key);
  const itemBuilder = node.findDescendant(d => d.type === 'item_builder');
  const newChange = val.change();

  newChange.setNodeByKey(key, {
    data: {
      ...node.data.toJSON(),
      ...data
    }
  });

  if (open) {
    const firstText = itemBuilder.getFirstText();

    newChange.moveFocusTo(firstText.key, 0).moveAnchorTo(firstText.key, 0);
  } else {
    const inlineDropdown = val.document.getClosest(
      itemBuilder.key,
      a => a.type === 'inline_dropdown'
    );
    const nextText = val.document.getNextText(inlineDropdown.key);

    newChange.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);
  }

  nodeProps.editor.onChange(newChange);
};

export const getSelectedItem = nodeProps => {
  const selectedChildren = nodeProps.children.find(c => c.props.node.type === 'response_menu_item');

  return selectedChildren ? React.cloneElement(selectedChildren) : null;
};

export default ({ attributes, data, n, nodeProps }) => {
  const { open, inTable } = data;
  const selectedItem = getSelectedItem(nodeProps);
  const filteredItems = nodeProps.children.filter(c => c.props.node.type !== 'response_menu_item');
  const toggleOpen = val => openOrClose(nodeProps, n, val);

  console.log('Open', open);

  return (
    <span
      {...attributes}
      style={{
        display: 'inline-flex',
        height: '50px',
        position: 'relative',
        top: '10px',
        margin: inTable ? '10px' : '0 10px',
        cursor: 'pointer'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          minWidth: '178px',
          height: '36px',
          background: '#FFF',
          border: '1px solid #C0C3CF',
          boxSizing: 'border-box',
          borderRadius: '3px',
          position: 'relative',
          bottom: '10px'
        }}
        contentEditable={false}
        onClick={() => toggleOpen(true)}
      >
        <div
          style={{
            background: 'transparent',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            padding: '8px 25px 8px 8px'
          }}
        >
          {selectedItem || '\u00A0'}
        </div>
        <Chevron
          direction="down"
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px'
          }}
        />
      </div>
      <div
        style={{
          cursor: 'default',
          display: open ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        onClick={() => toggleOpen(false)}
      />
      <div
        style={{
          background: '#fff',
          position: 'absolute',
          top: '30px',
          display: 'block',
          minWidth: '178px',
          border: '1px solid #E0E1E6',
          boxSizing: 'border-box',
          boxShadow: '0px 0px 5px rgba(126, 132, 148, 0.3)',
          borderRadius: '3px',
          maxHeight: '400px',
          overflow: 'scroll',
          zIndex: open ? 2 : -1,
          visibility: open ? 'visible' : 'hidden'
        }}
      >
        {filteredItems}
      </div>
    </span>
  );
};
