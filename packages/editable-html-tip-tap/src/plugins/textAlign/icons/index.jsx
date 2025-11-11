import React, { useState } from 'react';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

export const AlignLeft = () => (
  <svg width="20" height="20" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M42.1875 4.75C42.1875 7.38672 39.9902 9.4375 37.5 9.4375H4.6875C2.05078 9.4375 0 7.38672 0 4.75C0 2.25977 2.05078 0.0625 4.6875 0.0625H37.5C39.9902 0.0625 42.1875 2.25977 42.1875 4.75ZM42.1875 42.25C42.1875 44.8867 39.9902 46.9375 37.5 46.9375H4.6875C2.05078 46.9375 0 44.8867 0 42.25C0 39.7598 2.05078 37.5625 4.6875 37.5625H37.5C39.9902 37.5625 42.1875 39.7598 42.1875 42.25ZM0 23.5C0 21.0098 2.05078 18.8125 4.6875 18.8125H60.9375C63.4277 18.8125 65.625 21.0098 65.625 23.5C65.625 26.1367 63.4277 28.1875 60.9375 28.1875H4.6875C2.05078 28.1875 0 26.1367 0 23.5ZM65.625 61C65.625 63.6367 63.4277 65.6875 60.9375 65.6875H4.6875C2.05078 65.6875 0 63.6367 0 61C0 58.5098 2.05078 56.3125 4.6875 56.3125H60.9375C63.4277 56.3125 65.625 58.5098 65.625 61Z"
      fill="currentColor"
    />
  </svg>
);

export const AlignRight = () => (
  <svg width="20" height="20" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M65.625 4.75C65.625 7.38672 63.4277 9.4375 60.9375 9.4375H28.125C25.4883 9.4375 23.4375 7.38672 23.4375 4.75C23.4375 2.25977 25.4883 0.0625 28.125 0.0625H60.9375C63.4277 0.0625 65.625 2.25977 65.625 4.75ZM65.625 42.25C65.625 44.8867 63.4277 46.9375 60.9375 46.9375H28.125C25.4883 46.9375 23.4375 44.8867 23.4375 42.25C23.4375 39.7598 25.4883 37.5625 28.125 37.5625H60.9375C63.4277 37.5625 65.625 39.7598 65.625 42.25ZM0 23.5C0 21.0098 2.05078 18.8125 4.6875 18.8125H60.9375C63.4277 18.8125 65.625 21.0098 65.625 23.5C65.625 26.1367 63.4277 28.1875 60.9375 28.1875H4.6875C2.05078 28.1875 0 26.1367 0 23.5ZM65.625 61C65.625 63.6367 63.4277 65.6875 60.9375 65.6875H4.6875C2.05078 65.6875 0 63.6367 0 61C0 58.5098 2.05078 56.3125 4.6875 56.3125H60.9375C63.4277 56.3125 65.625 58.5098 65.625 61Z"
      fill="currentColor"
    />
  </svg>
);

export const AlignCenter = () => (
  <svg width="20" height="20" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M51.5625 4.75C51.5625 7.38672 49.3652 9.4375 46.875 9.4375H18.75C16.1133 9.4375 14.0625 7.38672 14.0625 4.75C14.0625 2.25977 16.1133 0.0625 18.75 0.0625H46.875C49.3652 0.0625 51.5625 2.25977 51.5625 4.75ZM65.625 23.5C65.625 26.1367 63.4277 28.1875 60.9375 28.1875H4.6875C2.05078 28.1875 0 26.1367 0 23.5C0 21.0098 2.05078 18.8125 4.6875 18.8125H60.9375C63.4277 18.8125 65.625 21.0098 65.625 23.5ZM0 61C0 58.5098 2.05078 56.3125 4.6875 56.3125H60.9375C63.4277 56.3125 65.625 58.5098 65.625 61C65.625 63.6367 63.4277 65.6875 60.9375 65.6875H4.6875C2.05078 65.6875 0 63.6367 0 61ZM51.5625 42.25C51.5625 44.8867 49.3652 46.9375 46.875 46.9375H18.75C16.1133 46.9375 14.0625 44.8867 14.0625 42.25C14.0625 39.7598 16.1133 37.5625 18.75 37.5625H46.875C49.3652 37.5625 51.5625 39.7598 51.5625 42.25Z"
      fill="currentColor"
    />
  </svg>
);

export const AlignJustify = () => (
  <svg width="20" height="20" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M65.625 4.75C65.625 7.38672 63.4277 9.4375 60.9375 9.4375H4.6875C2.05078 9.4375 0 7.38672 0 4.75C0 2.25977 2.05078 0.0625 4.6875 0.0625H60.9375C63.4277 0.0625 65.625 2.25977 65.625 4.75ZM65.625 42.25C65.625 44.8867 63.4277 46.9375 60.9375 46.9375H4.6875C2.05078 46.9375 0 44.8867 0 42.25C0 39.7598 2.05078 37.5625 4.6875 37.5625H60.9375C63.4277 37.5625 65.625 39.7598 65.625 42.25ZM0 23.5C0 21.0098 2.05078 18.8125 4.6875 18.8125H60.9375C63.4277 18.8125 65.625 21.0098 65.625 23.5C65.625 26.1367 63.4277 28.1875 60.9375 28.1875H4.6875C2.05078 28.1875 0 26.1367 0 23.5ZM65.625 61C65.625 63.6367 63.4277 65.6875 60.9375 65.6875H4.6875C2.05078 65.6875 0 63.6367 0 61C0 58.5098 2.05078 56.3125 4.6875 56.3125H60.9375C63.4277 56.3125 65.625 58.5098 65.625 61Z"
      fill="currentColor"
    />
  </svg>
);

export default ({ editor, onChange }) => {
  const [open, setOpen] = useState(false);

  let icon;

  switch (true) {
    case editor.isActive({ textAlign: 'right' }):
      icon = <AlignRight />;
      break;
    case editor.isActive({ textAlign: 'center' }):
      icon = <AlignCenter />;
      break;
    case editor.isActive({ textAlign: 'justify' }):
      icon = <AlignJustify />;
      break;
    default:
      icon = <AlignLeft />;
      break;
  }

  const applyAlignment = (event) => {
    const alignType = event.target?.closest('div')?.getAttribute('value');

    if (alignType) {
      editor.commands.setTextAlign(alignType);
    }

    setOpen(false);
  };

  const onMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!open);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }} onClick={onMouseDown}>
        {icon}
        <span style={{ marginLeft: '5px', fontSize: '8px' }}>&#9660;</span>
      </div>
      <Collapse in={open} timeout="auto" unmountOnExit style={{ position: 'absolute' }}>
        <List
          component="div"
          disablePadding
          style={{
            background: '#fff',
            display: 'flex',
            flexDirection: 'row',
            padding: 0,
          }}
        >
          <ListItem button type="submit" value="left" aria-label="Align text left" onClick={applyAlignment}>
            <AlignLeft />
          </ListItem>

          <ListItem button type="submit" value="center" aria-label="Align text center" onClick={applyAlignment}>
            <AlignCenter />
          </ListItem>

          <ListItem button type="submit" value="right" aria-label="Align text right" onClick={applyAlignment}>
            <AlignRight />
          </ListItem>

          <ListItem button type="submit" value="justify" aria-label="Justify text" onClick={applyAlignment}>
            <AlignJustify />
          </ListItem>
        </List>
      </Collapse>
    </div>
  );
};
