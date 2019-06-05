import React from 'react';
import debug from 'debug';
import { Inline, Text, Node, Document } from 'slate';
import { cloneFragment, findDOMNode, getEventTransfer } from 'slate-react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import capitalize from 'lodash/capitalize';

import InlineDropdown, { ItemBuilder, MenuItem } from './inline-dropdown';
import DragInTheBlank from './drag-in-the-blank';
import ExplicitConstructedResponse from './explicit-constructed-response';
import { getDefaultElement, isNumber } from './utils';
import { ToolbarIcon } from './icons';

const log = debug('@pie-lib:editable-html:plugins:response-area');

export default function ResponseAreaPlugin(opts) {
  const toolbar = {
    icon: <ToolbarIcon />,
    onClick: (value, onChange) => {
      log('[toolbar] onClick');
      const change = value.change();
      const newInline = getDefaultElement(opts);

      if (newInline) {
        change.insertInline(newInline);

        onChange(change);
      }
    },
    supports: node =>
      node.object === 'inline' &&
      (node.type === 'inline_dropdown' ||
        node.type === 'item_builder' ||
        node.type === 'explicit_constructed_response'),
    showDone: true
  };

  return {
    name: 'response_area',
    toolbar,
    filterPlugins: (node, plugins) => {
      if (node.type === 'explicit_constructed_response') {
        return [];
      }

      return plugins.filter(p => p.name !== 'response_area');
    },
    pluginStyles: (parentNode, p) => {
      if (p && p.name === 'math') {
        //eslint-disable-next-line
        const domNode = findDOMNode(parentNode.key);
        const domNodeRect = domNode.getBoundingClientRect();
        const editor = domNode.closest('[data-slate-editor]');
        const editorRect = editor.getBoundingClientRect();
        const top = domNodeRect.top - editorRect.top;

        return {
          position: 'absolute',
          top: `${top + domNodeRect.height}px`,
          width: getComputedStyle(editor).width
        };
      }
    },

    // Doesn't need reset
    stopReset: () => {
      return true;
    },

    renderNode(props) {
      const { attributes, node: n } = props;

      if (n.type === 'item_builder') {
        return <ItemBuilder attributes={attributes} n={n} nodeProps={props} />;
      }

      if (n.type === 'response_menu_item') {
        return props.children;
      }

      if (n.type === 'menu_item') {
        const data = n.data.toJSON();

        console.log('Index', n.key, data.id);

        return <MenuItem n={n} data={data} nodeProps={props} />;
      }

      if (n.type === 'explicit_constructed_response') {
        const data = n.data.toJSON();

        return (
          <ExplicitConstructedResponse
            attributes={attributes}
            data={data}
            n={n}
            nodeProps={props}
          />
        );
      }

      if (n.type === 'drag_in_the_blank') {
        const data = n.data.toJSON();

        return (
          <DragInTheBlank attributes={attributes} data={data} n={n} nodeProps={props} opts={opts} />
        );
      }

      if (n.type === 'inline_dropdown') {
        const data = n.data.toJSON();

        return (
          <InlineDropdown attributes={attributes} data={data} n={n} nodeProps={props} opts={opts} />
        );
      }
    },
    normalizeNode: node => {
      if (
        node.object !== 'document' &&
        node.type !== 'inline_dropdown' &&
        node.type !== 'explicit_constructed_response' &&
        node.type !== 'drag_in_the_blank'
      ) {
        return;
      }

      const removeSelectionArray = [];
      const altChangesMap = {};
      const changeSelectionArray = [];
      const removeValueOnCloseArray = [];
      const addItemBuilder = [];
      const addSpacesArray = [];
      const addMarginArray = [];

      const shouldRemoveSelection = node => {
        const selected = node.data.get('selected');

        if (!isNumber(selected)) {
          return false;
        }

        const selectedMenuItem = node.findDescendant(d => {
          if (d.type === 'menu_item') {
            const id = d.data.get('id');

            return `${id}` === `${selected}`;
          }
        });

        return !selectedMenuItem;
      };

      const shouldChangeSelection = node => {
        const selected = node.data.get('selected');
        const selectedMenuItem = node.findDescendant(d => {
          if (d.type === 'menu_item') {
            const id = d.data.get('id');

            return `${id}` === `${selected}`;
          }
        });

        if (!isNumber(selected)) {
          return false;
        }

        const hasResponse = node.findDescendant(d => d.type === 'response_menu_item');

        if (hasResponse) {
          const jsResponse = hasResponse.toJSON();
          const jsItem = selectedMenuItem && selectedMenuItem.toJSON();
          const respId = jsResponse.data.id;

          return !(
            `${respId}` === `${selected}` &&
            (!jsItem || isEqual(jsResponse.nodes, jsItem.nodes))
          );
        }

        return true;
      };

      const shouldRemoveValueOnClose = node => {
        if (node.data.get('open')) {
          return false;
        }

        const itemBuilder = node.findDescendant(d => d.type === 'item_builder');
        const text = itemBuilder && itemBuilder.getText();

        return !(text === '\u00A0' || isEmpty(text));
      };

      const shouldAddItemBuilder = node => {
        const itemBuilder = node.findDescendant(d => d.type === 'item_builder');

        return !itemBuilder;
      };

      const shouldAddSpace = node => {
        const lastText = node.getLastText();

        if (lastText) {
          const t = lastText.text[lastText.text.length - 1];

          return t !== '\u00A0' && t !== '\u200B' && t !== ' ';
        }
      };

      const shouldAddMargin = respArea => {
        const table = node.getClosest(respArea.key, n => n.type === 'table');

        return table && !respArea.data.get('inTable');
      };

      if (node.object === 'document') {
        const allElements = node.filterDescendants(
          d =>
            d.type === 'inline_dropdown' ||
            d.type === 'explicit_constructed_response' ||
            d.type === 'drag_in_the_blank'
        );
        const inlineDropdowns = node.filterDescendants(d => d.type === 'inline_dropdown');
        const ecrs = node.filterDescendants(d => d.type === 'explicit_constructed_response');

        if (inlineDropdowns.size) {
          inlineDropdowns.forEach(respArea => {
            if (shouldRemoveSelection(respArea)) {
              removeSelectionArray.push(respArea);
            } else {
              if (shouldChangeSelection(respArea)) {
                changeSelectionArray.push(respArea);
              }

              if (shouldRemoveValueOnClose(respArea)) {
                removeValueOnCloseArray.push(respArea);
              }

              if (shouldAddItemBuilder(respArea)) {
                addItemBuilder.push(respArea);
              }
            }
          });

          const mathNode = node.findDescendant(d => d.type === 'math');

          if (removeSelectionArray.length === 0 && mathNode) {
            const prevText = node.getPreviousText(mathNode.key);
            const nextText = node.getNextText(mathNode.key);
            const fn = (text, pos) => {
              const index = pos === 'l' ? (text.length || 1) - 1 : 0;
              const t = text[index];

              return t !== ' ';
            };

            if (fn(prevText.text, 'l')) {
              altChangesMap['prev'] = prevText;
            }

            if (fn(nextText.text, 'f')) {
              altChangesMap['next'] = nextText;
            }
          }
        }

        if (ecrs.size) {
          ecrs.forEach(ecr => {
            if (shouldAddSpace(ecr)) {
              addSpacesArray.push(ecr);
            }
          });
        }

        if (allElements.size) {
          allElements.forEach(el => {
            if (shouldAddMargin(el)) {
              addMarginArray.push(el);
            }
          });
        }
      }

      if (node.type === 'inline_dropdown') {
        if (shouldRemoveSelection(node)) {
          removeSelectionArray.push(node);
        } else {
          if (shouldChangeSelection(node)) {
            changeSelectionArray.push(node);
          }

          if (shouldRemoveValueOnClose(node)) {
            removeValueOnCloseArray.push(node);
          }

          if (shouldAddItemBuilder(node)) {
            addItemBuilder.push(node);
          }
        }
      }

      if (node.type === 'explicit_constructed_response') {
        if (shouldAddSpace(node)) {
          addSpacesArray.push(node);
        }
      }

      if (node.type === 'drag_in_the_blank') {
        if (shouldAddSpace(node)) {
          addSpacesArray.push(node);
        }
      }

      console.log(
        !addMarginArray.length,
        !addSpacesArray.length,
        !changeSelectionArray.length,
        !removeValueOnCloseArray.length,
        !addItemBuilder.length,
        isEmpty(altChangesMap)
      );

      if (
        /*!removeSelectionArray.length &&*/
        !addMarginArray.length &&
        !addSpacesArray.length &&
        !changeSelectionArray.length &&
        !removeValueOnCloseArray.length &&
        !addItemBuilder.length &&
        isEmpty(altChangesMap)
      ) {
        return;
      }

      const getInsertInfo = node => {
        // current selected id
        const selected = node.data.get('selected');
        // searching for previous selected, to delete
        const prevSelected = node.findDescendant(d => d.type === 'response_menu_item');
        const selectedItem = node.findDescendant(
          d => d.type === 'menu_item' && `${d.data.get('id')}` === `${selected}`
        );
        const jsonItem = selectedItem.toJSON();
        const newNode = Node.create({
          ...jsonItem,
          type: 'response_menu_item',
          data: {
            ...jsonItem.data,
            response: true
          }
        });

        return {
          key: node.key,
          offset: node.nodes.size,
          newNode,
          prevSelected
        };
      };

      return change => {
        change.withoutNormalization(() => {
          addMarginArray.forEach(n => {
            change.setNodeByKey(n.key, {
              data: {
                ...n.data.toJSON(),
                inTable: true
              }
            });
          });

          addSpacesArray.forEach(n => {
            const lastText = n.getLastText();

            change.insertTextByKey(lastText.key, lastText.text.length, ' ');
          });

          removeSelectionArray.forEach(n => {
            change.setNodeByKey(n.key, {
              data: {
                open: n.data.get('open')
              }
            });
          });

          changeSelectionArray.forEach(n => {
            const { key, offset, newNode, prevSelected } = getInsertInfo(n);

            if (prevSelected) {
              change.removeNodeByKey(prevSelected.key);
            }

            change.insertNodeByKey(key, offset, newNode);
          });

          removeValueOnCloseArray.forEach(n => {
            const itemBuilder = n.findDescendant(d => d.type === 'item_builder');
            const jsonNode = itemBuilder.toJSON();

            change.replaceNodeByKey(
              itemBuilder.key,
              Node.create({
                ...jsonNode,
                nodes: [Text.create('\u00A0')]
              })
            );
          });

          addItemBuilder.forEach(n => {
            const node = Inline.create({
              type: 'item_builder',
              nodes: [Text.create('\u00A0')]
            });

            change.insertNodeByKey(n.key, 0, node);
          });

          if (altChangesMap.prev) {
            change.insertTextByKey(altChangesMap.prev.key, altChangesMap.prev.text.length, ' ');
          }

          if (altChangesMap.next) {
            change.insertTextByKey(altChangesMap.next.key, 0, ' ');
          }
        });
      };
    },
    onKeyDown(event, change, editor) {
      /*
       * This function handles the actions that are happening inside the 3 items
       * when an user presses a key
       * */
      const { startKey, startOffset, startText, endOffset, document } = editor.value;
      const closesInline = document.getClosestInline(startKey);
      const prevNode = document.getPreviousNode(startKey);

      const key = event.keyCode || event.which;
      const ARROW_LEFT = 37;
      const ARROW_RIGHT = 39;
      const ARROW_UP = 38;
      const ARROW_DOWN = 40;
      const A_KEY = 65;
      const C_KEY = 67;
      const V_KEY = 86;
      const BACKSPACE_KEY = 8;
      const DELETE_KEY = 46;
      const HOME_KEY = 36;
      const END_KEY = 35;
      let shouldCancel = null;

      // This function is handling the input inside these 2 elements
      if (
        closesInline &&
        (closesInline.type === 'item_builder' ||
          closesInline.type === 'explicit_constructed_response')
      ) {
        if (
          key === A_KEY ||
          key === C_KEY ||
          key === V_KEY ||
          (key >= 35 && key <= 40) ||
          key === BACKSPACE_KEY ||
          key === DELETE_KEY
        ) {
          let allText = '';
          let length = 0;

          closesInline.forEachDescendant(d => {
            length += d.text.length;
            allText = `${allText}${d.text}`;
          });

          const preventEvent = () => {
            event.preventDefault();
            event.nativeEvent.stopImmediatePropagation();
            shouldCancel = true;
          };

          // If we are at the beginning of the input
          if (startOffset === 0) {
            // if the user presses the left or up arrow
            if (key === ARROW_LEFT || key === ARROW_UP) {
              // we don't let the cursor go outside of the input
              preventEvent();

              console.log('Moved Left');

              // if the buttons are pressed when the content is selected
              if (startOffset !== endOffset) {
                // we remove the selection and go to the beginning of the input
                change.moveOffsetsTo(0);
              }
            }

            // if the user presses the backspace key
            if (key === BACKSPACE_KEY && startOffset === endOffset) {
              // We prevent the event in order to not delete the inline
              preventEvent();
            }
          }

          // If we are at the end of the input
          if (length - startOffset <= 1) {
            // if the user presses the right or down arrow
            if (key === ARROW_RIGHT || key === ARROW_DOWN) {
              // we don't let the cursor go outside of the input
              preventEvent();
              console.log('Moved Right');
            }

            // if the user presses the delete key
            if (key === DELETE_KEY && startOffset === endOffset) {
              // We prevent the event in order to not delete the inline
              preventEvent();
            }
          }

          const shouldGoToBeginning = () => {
            // if the user presses the home key
            if (key === HOME_KEY) {
              return true;
            }

            const altKey = event.metaKey;

            // or the cmd + left or up arrow
            return altKey && (key === ARROW_LEFT || key === ARROW_UP);
          };

          const shouldGoToEnd = () => {
            // if the user presses the end key
            if (key === END_KEY) {
              return true;
            }

            const altKey = event.metaKey;

            // or the cmd + right or down arrow
            return altKey && (key === ARROW_RIGHT || key === ARROW_DOWN);
          };

          if (shouldGoToEnd()) {
            preventEvent();

            // move the anchor to the end of the input
            change.moveAnchorOffsetTo(length - 1);

            // if the shift key is not pressed we move the focus to the end of the input as well
            if (!event.shiftKey) {
              change.moveFocusOffsetTo(length - 1);
            }

            // if the shift key is pressed some text is going to be selected
            editor.onChange(change);
            console.log('Moved To End');
          }

          if (shouldGoToBeginning()) {
            preventEvent();

            // move the anchor to the beginning of the input
            change.moveAnchorOffsetTo(0);

            // if the shift key is not pressed we move the focus to the beginning of the input as well
            if (!event.shiftKey) {
              change.moveFocusOffsetTo(0);
            }

            // if the shift key is pressed some text is going to be selected
            editor.onChange(change);
            console.log('Moved To Start');
          }

          // if the control or metaKey is pressed
          if (event.cmdKey || event.metaKey) {
            // if the A key is pressed as well
            if (key === A_KEY) {
              const firstText = closesInline.getFirstText();
              const lastText = closesInline.getLastText();

              // we prevent the event
              preventEvent();

              // we move the focus to the first text and anchor to the last, to select all text
              change
                .moveFocusTo(firstText.key, 0)
                .moveAnchorTo(lastText.key, lastText.text.length - 1);
              console.log('Select All');
            }
          }

          // this is needed in order to check if the focus moved outside of the editors
          setTimeout(() => {
            const { startKey, document } = editor.value;
            const closestEditableElement = document.getClosest(
              startKey,
              a => a.type === 'item_builder' || a.type === 'explicit_constructed_response'
            );

            // if the focus is outside of the editors
            if (!closestEditableElement) {
              // we move it inside the editor, at the end of the input
              change
                .moveFocusTo(startText.key, startText.text.length - 1)
                .moveAnchorTo(startText.key, startText.text.length - 1);

              editor.onChange(change);
              console.log('A iesit');
            }
          }, 0);
        }
      }

      // if the backspace key is pressed and the previous node is of ecr type
      if (key === BACKSPACE_KEY && prevNode && prevNode.type === 'explicit_constructed_response') {
        // we remove the node
        change.removeNodeByKey(prevNode.key);
        editor.onChange(change);

        return true;
      }

      const native = window.getSelection();

      /*
       * If after pressing a key when the focus is not inside an ecr input
       * and the focus moves inside the ecr input, then we expand the item
       * */
      if (!closesInline || closesInline.type !== 'explicit_constructed_response') {
        setTimeout(() => {
          const { document, startOffset } = editor.value;
          const closestEl =
            native.anchorNode && native.anchorNode.parentElement.closest('[data-key]');
          const closestKey = closestEl && closestEl.dataset.key;
          const closestEcr =
            closestKey &&
            document.getClosest(closestKey, a => a.type === 'explicit_constructed_response');

          if (closestEcr) {
            change.moveFocusTo(closestKey, startOffset).moveAnchorTo(closestKey, startOffset);
            change.setNodeByKey(closestEcr.key, {
              data: { focused: true }
            });

            editor.onChange(change);
          }
        }, 0);
      }

      const closestEl = native.anchorNode && native.anchorNode.parentElement.closest('[data-key]');
      const closestKey = closestEl && closestEl.dataset.key;
      const closestEcr = closestKey && document.getClosestInline(closestKey);

      // if the input is inside the ecr input
      if (closestEcr && closestEcr.type === 'explicit_constructed_response') {
        /*
         * this is needed in order to change the width of the ecr element
         * to be the same as the one for the editable content
         * */
        //eslint-disable-next-line
        const inlineDOMNode = findDOMNode(closestEcr);
        const absoluteChild = inlineDOMNode.childNodes[1];
        const childStyle = getComputedStyle(absoluteChild);

        inlineDOMNode.style.width = childStyle.width;

        /*
         * this is needed in order to handle the case when the focus moves outside of the input
         * when it was inside before
         * */
        setTimeout(() => {
          const closestEl =
            native.anchorNode && native.anchorNode.parentElement.closest('[data-key]');
          const closestKey = closestEl && closestEl.dataset.key;
          const closestEcr = closestKey && document.getClosestInline(closestKey);
          const lastText = closestEcr.getLastText();

          if (
            lastText.text === native.anchorNode.textContent &&
            native.anchorOffset === lastText.text.length
          ) {
            change
              .moveFocusTo(lastText.key, lastText.text.length - 1)
              .moveAnchorTo(lastText.key, lastText.text.length - 1);

            editor.onChange(change);
            console.log('A iesit');
          }
        }, 0);
      }

      return shouldCancel;
    },
    onDrop(event, change, editor) {
      const closestEl = event.target.closest('[data-key]');
      const inline = editor.value.document.findDescendant(d => d.key === closestEl.dataset.key);

      if (inline.type === 'drag_in_the_blank') {
        return false;
      }
    },
    onCopy(event, change, editor) {
      const closestEl = event.target.closest('[data-key]');
      const inline = editor.value.document.getClosestInline(closestEl.dataset.key);

      if (inline) {
        if (inline.type === 'explicit_constructed_response' || inline.type === 'item_builder') {
          const ecrInlineWithContent = editor.value.fragment.findDescendant(
            d => d.type === 'explicit_constructed_response'
          );
          const fragment = Document.fromJSON({
            object: 'document',
            nodes: [
              {
                data: {},
                isVoid: false,
                nodes: ecrInlineWithContent.toJSON().nodes,
                object: 'block',
                type: 'paragraph'
              }
            ],
            data: {}
          });

          cloneFragment(event, change.value, fragment);
          return true;
        }
      }
    },
    onPaste(event, change, editor) {
      const closestEl = event.target.closest('[data-key]');
      const inline = editor.value.document.getClosestInline(closestEl.dataset.key);

      if (
        inline &&
        (inline.type === 'explicit_constructed_response' || inline.type === 'item_builder')
      ) {
        const transfer = getEventTransfer(event);
        let fragment = transfer.fragment;

        let range = change.value.selection;

        if (range.isExpanded) {
          change.deleteAtRange(range, { normalize: false });

          if (change.value.document.getDescendant(range.startKey)) {
            range = range.collapseToStart();
          } else {
            range = range.collapseTo(range.endKey, 0);
          }
        }

        if (!fragment || inline.type === 'explicit_constructed_response') {
          const copied = event.clipboardData.getData('text');

          change.insertText(copied);
          editor.onChange(change);

          return false;
        }

        if (!fragment.nodes.size) return;

        fragment = fragment.mapDescendants(child => child.regenerateKey());

        const blocks = fragment.getBlocks();
        const firstBlock = blocks.first();

        firstBlock.nodes.forEach(n => {
          if (n.object === 'text') {
            change.insertText(n.text);
          } else {
            change[`insert${capitalize(n.object)}`](n);
            change.collapseToStartOfNextText(n);
          }
        });

        editor.onChange(change);

        return false;
      }
    }
  };
}

export const serialization = {
  deserialize(el, next) {
    const type = el.dataset && el.dataset.type;

    const createDefaultMenuItem = (id, label) => ({
      object: 'inline',
      type: 'menu_item',
      data: {
        id,
        value: label,
        isDefault: true
      },
      nodes: [Text.create(label)]
    });
    const createDefaultMenuItems = nodes => {
      const newMenuItems = nodes.map(n => {
        if (n.data.isDefault) {
          return createDefaultMenuItem(1, 'Default Option 1');
        }

        return n;
      });

      if (newMenuItems.length === 0) {
        newMenuItems.push(createDefaultMenuItem(1, 'Default Option 1'));
      }

      if (newMenuItems.length === 1) {
        newMenuItems.push(createDefaultMenuItem(2, 'Default Option 2'));
      }

      return newMenuItems;
    };
    const getChildNodes = nodes => {
      const nextNodes = next(nodes);

      return nextNodes.length >= 2 ? nextNodes : createDefaultMenuItems(nextNodes);
    };

    switch (type) {
      case 'inline_dropdown':
        return {
          object: 'inline',
          type: 'inline_dropdown',
          data: {
            selected: isNumber(el.dataset.correctId) ? parseInt(el.dataset.correctId) : undefined,
            inTable: el.dataset.inTable
          },
          nodes: getChildNodes(el.childNodes)
        };
      case 'menu_item':
        return {
          object: 'inline',
          type: 'menu_item',
          data: {
            value: el.textContent,
            id: el.dataset.id,
            isDefault: el.dataset.isDefault
          },
          nodes: next(el.childNodes)
        };
      case 'explicit_constructed_response':
        return {
          object: 'inline',
          type: 'explicit_constructed_response',
          data: {
            inTable: el.dataset.inTable
          },
          nodes: next(el.childNodes)
        };
      case 'drag_in_the_blank':
        return {
          object: 'inline',
          type: 'drag_in_the_blank',
          isVoid: true,
          data: {
            index: el.dataset.index,
            id: el.dataset.id,
            value: el.dataset.value,
            inTable: el.dataset.inTable
          }
        };
    }
  },
  serialize(object, children) {
    if (object.object !== 'inline') {
      return;
    }

    switch (object.type) {
      case 'inline_dropdown': {
        const data = object.data.toJSON();

        return (
          <span
            data-type="inline_dropdown"
            data-correct-id={data.selected}
            data-in-table={data.inTable}
          >
            {children}
          </span>
        );
      }
      case 'explicit_constructed_response': {
        const data = object.data.toJSON();

        return (
          <span data-type="explicit_constructed_response" data-in-table={data.inTable}>
            {children}
          </span>
        );
      }
      case 'drag_in_the_blank': {
        const data = object.data.toJSON();

        return (
          <span
            data-type="drag_in_the_blank"
            data-index={data.index}
            data-id={data.id}
            data-value={data.value}
            data-in-table={data.inTable}
          />
        );
      }
      case 'item_builder':
      case 'response_menu_item':
        return null;
      case 'menu_item': {
        const jsonData = object.data.toJSON();

        return (
          <span data-type="menu_item" data-id={jsonData.id} data-is-default={jsonData.isDefault}>
            {children}
          </span>
        );
      }
    }
  }
};
