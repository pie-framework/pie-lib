import React from 'react';
import ReactDOM from 'react-dom';
import { Mark, mergeAttributes } from '@tiptap/core';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export const removeDialogs = () => {
  const prevDialogs = document.querySelectorAll('.insert-css-dialog');

  prevDialogs.forEach((s) => s.remove());
};

const insertDialog = ({ editor, callback, opts, selectedText, parentNode }) => {
  const editorDOM = editor.options.element;
  const newEl = document.createElement('div');
  const { selection } = editor.state;

  removeDialogs();

  newEl.className = 'insert-css-dialog';

  let popoverEl;

  const closePopOver = () => {
    if (popoverEl) {
      popoverEl.remove();
    }
  };

  let firstCallMade = false;

  const listener = (e) => {
    // this will be triggered right after setting it because
    // this toolbar is added on the mousedown event
    // so right after mouseup, the click will be triggered
    if (firstCallMade) {
      const focusIsInModals = newEl.contains(e.target) || (popoverEl && popoverEl.contains(e.target));
      const focusIsInEditor = editorDOM.contains(e.target);

      if (!(focusIsInModals || focusIsInEditor)) {
        handleClose();
      }
    } else {
      firstCallMade = true;
    }
  };

  const handleClose = () => {
    callback(undefined, true);
    newEl.remove();
    closePopOver();
    document.body.removeEventListener('click', listener);
  };

  const handleChange = (name) => {
    callback(name, true);
    newEl.remove();
    closePopOver();
    document.body.removeEventListener('click', listener);
  };

  const parentNodeClass = parentNode?.attrs.class;
  const createHTML = (name) => {
    let html = `<span class="${name}">${selectedText}</span>`;

    if (parentNode) {
      let tag = 'span';

      if (parentNode?.object === 'inline') {
        tag = 'span';
      }

      if (parentNode?.object === 'block') {
        tag = 'div';
      }

      html = `<${tag} class="${parentNodeClass}">${parentNode.text.slice(
        0,
        selection.$anchor.textOffset,
      )}${html}${parentNode.text.slice(selection.$head.textOffset)}</${tag}>`;
    }

    return html;
  };

  const el = (
    <div
      style={{ background: 'white', height: 500, padding: 20, overflow: 'hidden', display: 'flex', flexFlow: 'column' }}
    >
      <h2>Please choose a css class</h2>
      {parentNodeClass && <div>The current parent has this class {parentNodeClass}</div>}
      <List component="nav" style={{ overflow: 'scroll' }}>
        {opts.names.map((name, i) => (
          <ListItem key={`rule-${i}`} button onClick={() => handleChange(name)}>
            <div style={{ marginRight: 20 }}>{name}</div>
            <div
              dangerouslySetInnerHTML={{
                __html: createHTML(name),
              }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );

  ReactDOM.render(el, newEl, () => {
    const cursorItem = editor.view.nodeDOM(editor.state.selection.from);
    const cursorNode = cursorItem?.parentNode;

    if (cursorNode) {
      const bodyRect = editorDOM.parentElement.parentElement.parentElement.getBoundingClientRect();
      const boundRect = cursorNode.getBoundingClientRect();

      editorDOM.parentElement.parentElement.parentElement.appendChild(newEl);

      newEl.style.maxWidth = '500px';
      newEl.style.position = 'absolute';
      newEl.style.top = 0;
      newEl.style.zIndex = 99999;

      const leftValue = `${boundRect.left + Math.abs(bodyRect.left) + cursorNode.offsetWidth + 10}px`;

      const rightValue = `${boundRect.x}px`;

      newEl.style.left = leftValue;

      const leftAlignedWidth = newEl.offsetWidth;

      newEl.style.left = 'unset';
      newEl.style.right = rightValue;

      const rightAlignedWidth = newEl.offsetWidth;

      newEl.style.left = 'unset';
      newEl.style.right = 'unset';

      if (leftAlignedWidth >= rightAlignedWidth) {
        newEl.style.left = leftValue;
      } else {
        newEl.style.right = rightValue;
      }

      document.body.addEventListener('click', listener);
    }
  });
};

export const CSSMark = Mark.create({
  name: 'cssmark',

  addOptions() {
    return {
      classes: [],
    };
  },

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (el) => el.getAttribute('class'),
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
    };
  },

  parseHTML() {
    // Any span with a class that matches one of allowed classes
    return [
      {
        tag: 'span[class]',
        getAttrs: (el) => {
          const cls = el.getAttribute('class') || '';
          const match = this.options.classes.find((name) => cls.includes(name));
          return match ? { class: match } : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setCSSClass:
        (className) =>
        ({ commands }) => {
          return commands.setMark(this.name, { class: className });
        },

      unsetCSSClass:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },

      openCSSClassDialog:
        () =>
        ({ editor }) => {
          insertDialog({
            editor,
            selectedText: editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to),
            parentNode: editor.state.selection.$from.nodeAfter,
            opts: this.options.extraCSSRules,
            callback: (className) => {
              if (className) {
                editor.chain().focus().setCSSClass(className).run();
              }
            },
          });
        },
    };
  },
});
