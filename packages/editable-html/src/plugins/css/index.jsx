import React from 'react';
import ReactDOM from 'react-dom';
import List from '@material-ui/core/List';
import { Leaf, Mark } from 'slate';
import Immutable from 'immutable';
import ListItem from '@material-ui/core/ListItem';
import isEmpty from 'lodash/isEmpty';
import debug from 'debug';
import CssIcon from './icons';

const log = debug('@pie-lib:editable-html:plugins:characters');

export const removeDialogs = () => {
  const prevDialogs = document.querySelectorAll('.insert-css-dialog');

  log('[characters:removeDialogs]');
  prevDialogs.forEach((s) => s.remove());
};

const insertDialog = ({ editorDOM, value, callback, opts, textNode, parentNode }) => {
  const newEl = document.createElement('div');

  log('[characters:insertDialog]');

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

  const selectedText = textNode.text.slice(value.selection.anchorOffset, value.selection.focusOffset);
  const parentNodeClass = parentNode?.data?.get('attributes')?.class;
  const createHTML = (name) => {
    let html = `<span class="${name}">${selectedText}</span>`;

    if (parentNode) {
      let tag;

      if (parentNode?.object === 'inline') {
        tag = 'span';
      }

      if (parentNode?.object === 'block') {
        tag = 'div';
      }

      html = `<${tag} class="${parentNodeClass}">${parentNode.text.slice(
        0,
        value.selection.anchorOffset,
      )}${html}${parentNode.text.slice(value.selection.focusOffset)}</${tag}>`;
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
    const cursorItem = document.querySelector(`[data-key="${value.anchorKey}"]`);

    if (cursorItem) {
      const bodyRect = editorDOM.parentElement.parentElement.parentElement.getBoundingClientRect();
      const boundRect = cursorItem.getBoundingClientRect();

      editorDOM.parentElement.parentElement.parentElement.appendChild(newEl);

      // when height of toolbar exceeds screen - can happen in scrollable contexts
      let additionalTopOffset = 0;
      if (boundRect.y < newEl.offsetHeight) {
        additionalTopOffset = newEl.offsetHeight - boundRect.y + 10;
      }

      newEl.style.maxWidth = '500px';
      newEl.style.position = 'absolute';
      newEl.style.top = 0;
      newEl.style.zIndex = 99999;

      const leftValue = `${boundRect.left + Math.abs(bodyRect.left) + cursorItem.offsetWidth + 10}px`;

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

const findParentNodeInfo = (value, textNode) => {
  const closestInline = value.document.getClosestInline(value.selection.endKey);
  const closestBlock = value.document.getClosestBlock(value.selection.endKey);
  let nodeToUse = null;

  if (closestInline?.nodes?.find((n) => n.key === textNode.key)) {
    nodeToUse = closestInline;
  }

  if (closestBlock?.nodes?.find((n) => n.key === textNode.key)) {
    nodeToUse = closestBlock;
  }

  return nodeToUse;
};

/**
 * Find the node that has a class attribute and return it.
 * Keeping this in case the implementation of classes needs to be changed
 * @param value
 * @param opts
 * @returns {*}
 */
const getNodeWithClass = (value, opts) => {
  const blocksAtRange = value.document.getBlocksAtRangeAsArray(value.selection);
  const inlinesAtRange = value.document.getInlinesAtRangeAsArray(value.selection);
  const blockData = blocksAtRange[0]?.data.toJSON() || {};
  const inlineData = inlinesAtRange[0]?.data.toJSON() || {};

  if (!blockData.attributes?.class && !inlineData.attributes?.class) {
    return null;
  }

  const { class: blockClass } = blockData.attributes || {};
  const { class: inlineClass } = inlineData.attributes || {};
  const inlineHasClass = opts.names.find((name) => inlineClass.includes(name));

  if (inlineHasClass) {
    return inlinesAtRange[0];
  }

  const blockHasClass = opts.names.find((name) => blockClass.includes(name));

  if (blockHasClass) {
    return blocksAtRange[0];
  }

  return null;
};

/**
 * Plugin in order to be able to add a css clas that is provided through the model
 * on a text element. Works like a mark (bold, italic etc.).
 * @param opts
 * @constructor
 */
export default function CSSPlugin(opts) {
  const plugin = {
    name: 'extraCSSRules',
    toolbar: {
      isMark: true,
      icon: <CssIcon />,
      ariaLabel: 'CSS editor',
      type: 'css',
      onToggle: (change) => {
        const type = 'css';
        const hasMark = change.value.activeMarks.find((entry) => {
          return entry.type === type;
        });

        if (hasMark) {
          change.removeMark(hasMark);
        } else {
          const newMark = Mark.create(type);

          change.addMark(newMark);
        }

        return change;
      },
      onClick: (value, onChange, getFocusedValue) => {
        const type = 'css';
        const hasMark = value.activeMarks.find((entry) => {
          return entry.type === type;
        });

        let change = value.change();

        if (hasMark) {
          change.removeMark(hasMark);
          onChange(change);
          return;
        }

        // keeping this if implementation needs to be changed to regular blocks instead of marks
        // let nodeWithClass = getNodeWithClass(value, opts);
        //
        // if (nodeWithClass) {
        //   const nodeAttributes = nodeWithClass.data.get('attributes');
        //
        //   opts.names.forEach((name) => {
        //     if (nodeAttributes.class.includes(name)) {
        //       nodeAttributes.class = nodeAttributes.class.replace(name, '');
        //     }
        //   });
        //
        //   // keeping only one space between classes
        //   nodeAttributes.class = nodeAttributes.class.replace(/ +/g, ' ');
        //
        //   nodeWithClass.data.set('attributes', nodeAttributes);
        //
        //   let change = value.change();
        //   change.replaceNodeByKey(nodeWithClass.key, nodeWithClass);
        //
        //   onChange(change);
        //   return;
        // }

        const editorDOM = document.querySelector(`[data-key="${value.document.key}"]`);
        let valueToUse = value;

        const callback = (className, focus) => {
          if (getFocusedValue) {
            valueToUse = getFocusedValue() || valueToUse;
          }

          if (className) {
            let change = valueToUse.change();

            const newMark = Mark.create({
              object: 'mark',
              type: 'css',
              data: {
                attributes: {
                  class: className,
                },
              },
            });

            change.addMark(newMark);
            // keeping this if implementation needs to be changed to regular blocks instead of marks
            // change = change.wrapInline({ type: 'span', data: { attributes: { class: className } } });
            //
            // // change = change.splitBlockAtRange(adaptedRange);
            // //
            // // const newBlock = change.value.document.getFurthestBlock(change.value.selection.endKey);
            // //
            // // change = change.setNodeByKey(newBlock.key, { data: { attributes: { class: className } } });
            //
            // valueToUse = change.value;
            // log('[characters:insert]: ', value);
            onChange(change);
          }

          log('[characters:click]');

          if (focus) {
            setTimeout(() => {
              if (editorDOM) {
                editorDOM.focus();
              }
            }, 0);
          }
        };
        const textNode = value.document.getTextsAtRangeAsArray(value.selection)[0];

        if (textNode) {
          const parentNode = findParentNodeInfo(value, textNode, opts);

          insertDialog({ editorDOM, value: valueToUse, callback, opts, textNode, parentNode });
        }
      },
    },
    renderMark(props) {
      if (props.mark.type === 'css') {
        const { data } = props.mark || {};
        const jsonData = data?.toJSON() || {};

        return <span {...jsonData.attributes}>{props.children}</span>;
      }
    },
  };

  return plugin;
}
