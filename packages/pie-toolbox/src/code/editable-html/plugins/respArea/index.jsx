import React from 'react';
import debug from 'debug';
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
    onClick: (value, onChange) => {
      log('[toolbar] onClick');
      const change = value.change();
      const currentRespAreaList = change.value.document.filterDescendants(isOfCurrentType);

      if (currentRespAreaList.size >= opts.maxResponseAreas) {
        return;
      }

      const type = opts.type.replace(/-/g, '_');
      const prevIndex = lastIndexMap[type];
      const newIndex = prevIndex === 0 ? prevIndex : prevIndex + 1;
      const newInline = getDefaultElement(opts, newIndex);

      lastIndexMap[type] += 1;

      if (newInline) {
        if (change.value.selection.startKey || change.value.selection.endKey) {
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
        }

        onChange(change);
      }
    },
    customToolbar: opts.respAreaToolbar,
    supports: (node) => node.object === 'inline' && elTypesArray.indexOf(node.type) >= 0,
    showDone: false,
  };

  return {
    name: 'response_area',
    toolbar,
    filterPlugins: (node, plugins) => {
      if (node.type === 'explicit_constructed_response' || node.type === 'drag_in_the_blank') {
        return [];
      }

      return plugins.filter((p) => p.name !== 'response_area');
    },
    deleteNode: (e, node, value, onChange) => {
      e.preventDefault();

      const change = value.change().removeNodeByKey(node.key);

      onChange(change);
    },
    renderNode(props) {
      const { attributes, node: n } = props;

      if (n.type === 'explicit_constructed_response') {
        const data = n.data.toJSON();
        let error;

        if (opts.error) {
          error = opts.error();
        }

        return (
          <ExplicitConstructedResponse
            attributes={attributes}
            value={data.value}
            error={error && error[data.index] && error[data.index][0]}
          />
        );
      }

      if (n.type === 'drag_in_the_blank') {
        const data = n.data.toJSON();

        return <DragInTheBlank attributes={attributes} data={data} n={n} nodeProps={props} opts={opts} />;
      }

      if (n.type === 'inline_dropdown') {
        const data = n.data.toJSON();

        return <InlineDropdown attributes={attributes} selectedItem={data.value} />;
      }
    },
    onChange(change, editor) {
      const type = opts.type.replace(/-/g, '_');

      if (isUndefined(lastIndexMap[type])) {
        lastIndexMap[type] = 0;

        change.value.document.forEachDescendant((d) => {
          if (d.type === type) {
            const newIndex = parseInt(d.data.get('index'), 10);

            if (newIndex > lastIndexMap[type]) {
              lastIndexMap[type] = newIndex;
            }
          }
        });
      }

      if (!editor.value) {
        return;
      }

      const currentRespAreaList = change.value.document.filterDescendants(isOfCurrentType);
      const oldRespAreaList = editor.value.document.filterDescendants(isOfCurrentType);

      if (currentRespAreaList.size >= opts.maxResponseAreas) {
        toolbar.disabled = true;
      } else {
        toolbar.disabled = false;
      }

      const arrayToFilter = oldRespAreaList.size > currentRespAreaList.size ? oldRespAreaList : currentRespAreaList;
      const arrayToUseForFilter = arrayToFilter === oldRespAreaList ? currentRespAreaList : oldRespAreaList;

      const elementsWithChangedStatus = arrayToFilter.filter(
        (d) => !arrayToUseForFilter.find((e) => e.data.get('index') === d.data.get('index')),
      );

      if (elementsWithChangedStatus.size && oldRespAreaList.size > currentRespAreaList.size) {
        opts.onHandleAreaChange(elementsWithChangedStatus);
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
        return {
          object: 'inline',
          type: 'inline_dropdown',
          isVoid: true,
          data: {
            index: el.dataset.index,
            value: el.dataset.value,
          },
        };
      case 'explicit_constructed_response':
        return {
          object: 'inline',
          type: 'explicit_constructed_response',
          isVoid: true,
          data: {
            index: el.dataset.index,
            value: el.dataset.value,
          },
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
            inTable: el.dataset.inTable,
          },
        };
    }
  },
  serialize(object) {
    if (object.object !== 'inline') {
      return;
    }

    switch (object.type) {
      case 'inline_dropdown': {
        const data = object.data.toJSON();

        return <span data-type="inline_dropdown" data-index={data.index} data-value={data.value} />;
      }
      case 'explicit_constructed_response': {
        const data = object.data.toJSON();

        return <span data-type="explicit_constructed_response" data-index={data.index} data-value={data.value} />;
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
    }
  },
};
