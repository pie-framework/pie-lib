import React from 'react';
import ReactDOM from 'react-dom';
import { Inline } from 'slate';
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

export const defaultECR = index =>
  Inline.create({
    type: 'explicit_constructed_response',
    isVoid: true,
    data: {
      index
    }
  });

export const defaultDIB = (opts, index) =>
  Inline.create({
    type: 'drag_in_the_blank',
    isVoid: true,
    data: {
      index,
      duplicates: opts.options.duplicates,
      value: null
    }
  });

export const defaultIDD = index =>
  Inline.create({
    object: 'inline',
    type: 'inline_dropdown',
    isVoid: true,
    data: {
      index
    }
  });

export const getDefaultElement = (opts, index) => {
  switch (opts.type) {
    case 'explicit-constructed-response':
      return defaultECR(index);
    case 'drag-in-the-blank':
      return defaultDIB(opts, index);
    default:
      // inline-dropdown
      return defaultIDD(index);
  }
};
