import React from 'react';
import { Node as SlateNode } from 'slate';
import { jsx } from 'slate-hyperscript';
import debug from 'debug';

import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import InlineDropdown from './inline-dropdown';
import DragInTheBlank from './drag-in-the-blank';
import ExplicitConstructedResponse from './explicit-constructed-response';
import { getDefaultElement } from './utils';
import { ToolbarIcon } from './icons';

const log = debug('@pie-lib:editable-html:plugins:respArea');

const lastIndexMap = {};
const elTypesMap = {
  'inline-dropdown': 'inline_dropdown',
  'explicit-constructed-response': 'explicit_constructed_response',
  'drag-in-the-blank': 'drag_in_the_blank',
};
const elTypesArray = Object.values(elTypesMap);

export default function ResponseAreaPlugin(opts) {
  const isOfCurrentType = (d) => d.type === opts.type || d.type === elTypesMap[opts.type];

  const toolbar = {
    icon: <ToolbarIcon />,
    buttonStyles: {
      margin: '0 20px 0 auto',
    },
    onClick: (editor) => {
      log('[toolbar] onClick');
      const currentRespAreaList = [];
      const descendants = Array.from(SlateNode.descendants(editor, { reverse: true })).map(([d]) => d);

      descendants.forEach((d) => {
        if (isOfCurrentType(d)) {
          currentRespAreaList.push(d);
        }
      });

      if (currentRespAreaList.length >= opts.maxResponseAreas) {
        return;
      }

      const type = opts.type.replace(/-/g, '_');
      const prevIndex = lastIndexMap[type];
      const newIndex = !prevIndex ? 0 : prevIndex + 1;
      const newInline = getDefaultElement(opts, newIndex);

      lastIndexMap[type] += 1;

      if (newInline) {
        /*        if (change.value.selection.startKey || change.value.selection.endKey) {
          change.insertInline(newInline);
        } else {
          // If the markup is empty and there's no focus
          const lastText = value.document.getLastText();

          if (!lastText) {
            return;
          }
          const parentNode = value.document.getParent(lastText.key);

          if (parentNode) {
            const index = parentNode.nodes.indexOf(lastText.key);

            if (parentNode.isVoid) return;

            change.insertNodeByKey(parentNode.key, index + 1, newInline);
          }
        }

        if (newInline.type === 'drag_in_the_blank') {
          const nextText = change.value.document.getNextText(newInline.key);

          if (nextText) {
            change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);
          }
        }*/
        editor.insertNode(newInline);
      }
    },
    customToolbar: opts.respAreaToolbar,
    showDone: false,
  };

  return {
    name: 'response_area',
    toolbar,
    rules: (editor) => {
      const { isVoid, isInline, onChange } = editor;

      editor.isVoid = (element) => {
        return elTypesArray.includes(element.type) ? true : isVoid(element);
      };

      editor.isInline = (element) => {
        return elTypesArray.includes(element.type) ? true : isInline(element);
      };

      let oldEditor = cloneDeep(editor);

      editor.onChange = (options) => {
        const descendants = Array.from(SlateNode.descendants(editor, { reverse: true })).map(([d]) => d);
        const type = opts.type.replace(/-/g, '_');

        if (isUndefined(lastIndexMap[type])) {
          lastIndexMap[type] = 0;

          descendants.forEach((d) => {
            if (d.type === type) {
              const newIndex = parseInt(d.data.index, 10);

              if (newIndex > lastIndexMap[type]) {
                lastIndexMap[type] = newIndex;
              }
            }
          });
        }

        if (isEqual(editor, oldEditor)) {
          return;
        }

        const oldDescendants = Array.from(SlateNode.descendants(oldEditor, { reverse: true })).map(([d]) => d);
        const currentRespAreaList = descendants.filter(isOfCurrentType);
        const oldRespAreaList = oldDescendants.filter(isOfCurrentType);

        toolbar.disabled = currentRespAreaList.length >= opts.maxResponseAreas;

        const arrayToFilter =
          oldRespAreaList.length > currentRespAreaList.length ? oldRespAreaList : currentRespAreaList;
        const arrayToUseForFilter = arrayToFilter === oldRespAreaList ? currentRespAreaList : oldRespAreaList;

        const elementsWithChangedStatus = arrayToFilter.filter(
          (d) => !arrayToUseForFilter.find((e) => e.data.index === d.data.index),
        );

        if (elementsWithChangedStatus.length && oldRespAreaList.length > currentRespAreaList.length) {
          opts.onHandleAreaChange(elementsWithChangedStatus);
        }

        oldEditor = cloneDeep(editor);
        onChange(options);
      };

      return editor;
    },
    filterPlugins: (node, plugins) => {
      if (node.type === 'explicit_constructed_response' || node.type === 'drag_in_the_blank') {
        return [];
      }

      return plugins.filter((p) => p.name !== 'response_area');
    },
    deleteNode: (e, node, nodePath, editor, onChange) => {
      e.preventDefault();

      editor.apply({
        type: 'remove_node',
        path: nodePath,
      });

      onChange(editor);
    },
    supports: (node) => elTypesArray.indexOf(node.type) >= 0,
    renderNode(props) {
      const { attributes, node } = props;

      if (node.type === 'explicit_constructed_response') {
        const { data } = node;
        let error;

        if (opts.error) {
          error = opts.error();
        }

        return (
          <ExplicitConstructedResponse
            attributes={attributes}
            value={data.value}
            error={error && error[data.index] && error[data.index][0]}
          >
            {props.children}
          </ExplicitConstructedResponse>
        );
      }

      if (node.type === 'drag_in_the_blank') {
        const { data } = node;

        return (
          <DragInTheBlank attributes={attributes} data={data} n={node} nodeProps={props} opts={opts}>
            {props.children}
          </DragInTheBlank>
        );
      }

      if (node.type === 'inline_dropdown') {
        const { data } = node;

        return (
          <InlineDropdown attributes={attributes} selectedItem={data.value}>
            {props.children}
          </InlineDropdown>
        );
      }
    },
    onDrop(event, change, editor) {
      const closestEl = event.target.closest('[data-key]');
      const inline = editor.value.document.findDescendant((d) => d.key === closestEl.dataset.key);

      if (inline.type === 'drag_in_the_blank') {
        return false;
      }
    },
  };
}

export const serialization = {
  deserialize(el) {
    const type = el.dataset && el.dataset.type;

    switch (type) {
      case 'inline_dropdown':
        return jsx('element', {
          type: 'inline_dropdown',
          data: {
            index: el.dataset.index,
            value: el.dataset.value,
          },
        });
      case 'explicit_constructed_response':
        return jsx('element', {
          type: 'explicit_constructed_response',
          data: {
            index: el.dataset.index,
            value: el.dataset.value,
          },
        });
      case 'drag_in_the_blank':
        return jsx('element', {
          type: 'drag_in_the_blank',
          data: {
            index: el.dataset.index,
            id: el.dataset.id,
            value: el.dataset.value,
            inTable: el.dataset.inTable,
          },
        });
    }
  },
  serialize(object) {
    switch (object.type) {
      case 'inline_dropdown': {
        const data = object.data;

        return <span data-type="inline_dropdown" data-index={data.index} data-value={data.value} />;
      }
      case 'explicit_constructed_response': {
        const data = object.data;

        return <span data-type="explicit_constructed_response" data-index={data.index} data-value={data.value} />;
      }
      case 'drag_in_the_blank': {
        const data = object.data;

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
    }
  },
};
