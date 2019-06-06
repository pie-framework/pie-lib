import React from 'react';
import ReactDOM from 'react-dom';
import { Inline, Text } from 'slate';
import Snackbar from '@material-ui/core/Snackbar';

export const isNumber = val => !isNaN(parseFloat(val)) && isFinite(val);

export const insertSnackBar = message => {
  const prevSnacks = document.querySelectorAll('.response-area-alert');

  prevSnacks.forEach(s => s.remove());

  const newEl = document.createElement('div');

  newEl.className = 'response-area-alert';

  const el = (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={true}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      message={<span id="message-id">{message}</span>}
    />
  );

  ReactDOM.render(el, newEl);

  document.body.appendChild(newEl);

  setTimeout(() => {
    newEl.remove();
  }, 2000);
};

export const defaultECR = Inline.create({
  type: 'explicit_constructed_response',
  nodes: [Text.create('\u00A0')],
  data: {
    selected: null
  }
});

export const defaultDIB = opts =>
  Inline.create({
    type: 'drag_in_the_blank',
    isVoid: true,
    data: {
      duplicates: opts.options.duplicates,
      value: null
    }
  });

export const defaultIDD = Inline.create({
  type: 'inline_dropdown',
  nodes: [
    Inline.create({
      type: 'item_builder',
      nodes: [Text.create('\u00A0')]
    }),
    {
      object: 'inline',
      type: 'menu_item',
      data: {
        id: 0,
        value: 'Default Option 1',
        isDefault: true
      },
      nodes: [Text.create('Default Option 1')]
    },
    {
      object: 'inline',
      type: 'menu_item',
      data: {
        id: 1,
        value: 'Default Option 2',
        isDefault: true
      },
      nodes: [Text.create('Default Option 2')]
    }
  ],
  data: {
    open: false,
    selected: null
  }
});

export const getDefaultElement = opts => {
  switch (opts.type) {
    case 'explicit-constructed-response':
      return defaultECR;
    case 'drag-in-the-blank':
      return defaultDIB(opts);
    default:
      // inline-dropdown
      return defaultIDD;
  }
};
