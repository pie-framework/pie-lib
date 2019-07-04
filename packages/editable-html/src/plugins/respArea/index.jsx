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

export default function ResponseAreaPlugin(opts) {
  const toolbar = {
    icon: <ToolbarIcon />,
    onClick: (value, onChange) => {
      log('[toolbar] onClick');
      const change = value.change();
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
          const firstText = value.document.getFirstText();
          const parentNode = value.document.getParent(firstText.key);

          if (parentNode) {
            const index = parentNode.nodes.indexOf(firstText.key);

            if (parentNode.isVoid) return;

            change.insertNodeByKey(parentNode.key, index + 1, newInline);
          }
        }

        onChange(change);
      }
    },
    customToolbar: opts.respAreaToolbar,
    supports: node =>
      node.object === 'inline' &&
      (node.type === 'inline_dropdown' ||
        node.type === 'item_builder' ||
        node.type === 'explicit_constructed_response'),
    showDone: false
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
    renderNode(props) {
      const { attributes, node: n } = props;

      if (n.type === 'explicit_constructed_response') {
        const data = n.data.toJSON();

        return <ExplicitConstructedResponse attributes={attributes} value={data.value} />;
      }

      if (n.type === 'drag_in_the_blank') {
        const data = n.data.toJSON();

        return (
          <DragInTheBlank attributes={attributes} data={data} n={n} nodeProps={props} opts={opts} />
        );
      }

      if (n.type === 'inline_dropdown') {
        const data = n.data.toJSON();

        return <InlineDropdown attributes={attributes} selectedItem={data.value} />;
      }
    },
    onChange(change) {
      const type = opts.type.replace(/-/g, '_');

      if (isUndefined(lastIndexMap[type])) {
        lastIndexMap[type] = 0;

        change.value.document.forEachDescendant(d => {
          if (d.type === type) {
            const newIndex = parseInt(d.data.get('index'), 10);

            if (newIndex > lastIndexMap[type]) {
              lastIndexMap[type] = newIndex;
            }
          }
        });
      }
    },
    normalizeNode: node => {
      if (node.object !== 'document') {
        return;
      }

      const addSpacesArray = [];

      const allElements = node.filterDescendants(
        d =>
          d.type === 'inline_dropdown' ||
          d.type === 'explicit_constructed_response' ||
          d.type === 'drag_in_the_blank'
      );

      allElements.forEach(el => {
        const prevText = node.getPreviousText(el.key);
        const nextText = node.getNextText(el.key);

        if (prevText.text[prevText.text.length - 1] !== ' ') {
          addSpacesArray.push({
            key: prevText.key,
            pos: 'end'
          });
        }

        if (nextText.text[0] !== ' ') {
          addSpacesArray.push({
            key: nextText.key,
            pos: 'start'
          });
        }
      });

      if (!addSpacesArray.length) {
        return;
      }

      return change => {
        change.withoutNormalization(() => {
          addSpacesArray.forEach(({ key, pos }) => {
            const node = change.value.document.getNode(key);
            const offset = pos === 'start' ? 0 : node.text.length;

            change.insertTextByKey(key, offset, ' ');
          });
        });
      };
    },
    onDrop(event, change, editor) {
      const closestEl = event.target.closest('[data-key]');
      const inline = editor.value.document.findDescendant(d => d.key === closestEl.dataset.key);

      if (inline.type === 'drag_in_the_blank') {
        return false;
      }
    }
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
            value: el.dataset.value
          }
        };
      case 'explicit_constructed_response':
        return {
          object: 'inline',
          type: 'explicit_constructed_response',
          isVoid: true,
          data: {
            index: el.dataset.index,
            value: el.dataset.value
          }
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

        return (
          <span
            data-type="explicit_constructed_response"
            data-index={data.index}
            data-value={data.value}
          />
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
    }
  }
};
