import React from 'react';
import { Data } from 'slate';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import EditList from 'slate-edit-list';
import ListOptions from 'slate-edit-list/dist/options';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:plugins:list');

const b = (type, next, childNodes) => ({
  object: 'block',
  type,
  nodes: next(childNodes),
});

export const serialization = {
  deserialize(el, next) {
    const name = el.tagName.toLowerCase();

    if (name === 'li') {
      return b('list_item', next, el.childNodes);
    }

    if (name === 'ul') {
      return b('ul_list', next, el.children.length ? Array.from(el.children) : el.childNodes);
    }

    if (name === 'ol') {
      return b('ol_list', next, el.children.length ? Array.from(el.children) : el.childNodes);
    }
  },
  serialize(object, children) {
    if (object.object !== 'block') return;

    if (object.type === 'list_item') {
      return <li>{children}</li>;
    }

    if (object.type === 'ul_list') {
      return <ul>{children}</ul>;
    }

    if (object.type === 'ol_list') {
      return <ol>{children}</ol>;
    }
  },
};

const createEditList = () => {
  const core = EditList({
    typeDefault: 'span',
  });

  const listOptions = new ListOptions({
    typeDefault: 'span',
  });

  // fix outdated schema
  if (core.schema && core.schema.blocks) {
    Object.keys(core.schema.blocks).forEach((key) => {
      const block = core.schema.blocks[key];

      if (block.parent) {
        return;
      }

      block.nodes[0] = { type: block.nodes[0].types[0] };
    });
  }

  /**
   * This override of the core.changes.wrapInList is needed because the version
   * of immutable that we have does not support getting the element at a specific
   * index with a square bracket (list[0]). We have to use the list.get function instead
   */

  /**
   * Returns the highest list of blocks that cover the current selection
   */
  const getHighestSelectedBlocks = (value) => {
    const range = value.selection;
    const document = value.document;

    const startBlock = document.getClosestBlock(range.startKey);
    const endBlock = document.getClosestBlock(range.endKey);

    if (startBlock === endBlock) {
      return Immutable.List([startBlock]);
    }

    const ancestor = document.getCommonAncestor(startBlock.key, endBlock.key);
    const startPath = ancestor.getPath(startBlock.key);
    const endPath = ancestor.getPath(endBlock.key);

    return ancestor.nodes.slice(startPath.get(0), endPath.get(0) + 1);
  };

  /**
   * Wrap the blocks in the current selection in a new list. Selected
   * lists are merged together.
   */
  core.changes.wrapInList = function(change, type, data) {
    const selectedBlocks = getHighestSelectedBlocks(change.value);

    // Wrap in container
    change.wrapBlock({ type: type, data: Data.create(data) }, { normalize: false });

    // Wrap in list items
    selectedBlocks.forEach(function(node) {
      if (core.utils.isList(node)) {
        // Merge its items with the created list
        node.nodes.forEach(function(_ref) {
          const key = _ref.key;
          return change.unwrapNodeByKey(key, { normalize: false });
        });
      } else if (node.type !== 'list_item') {
        change.wrapBlockByKey(node.key, 'list_item', {
          normalize: false,
        });
      }
    });

    return change.normalize();
  };

  core.changes.unwrapList = function unwrapList(opts, change) {
    const items = core.utils.getItemsAtRange(change.value);

    if (items.isEmpty()) {
      return change;
    }

    // Unwrap the items from their list
    items.forEach((item) => change.unwrapNodeByKey(item.key, { normalize: false }));

    // Parent of the list of the items
    const firstItem = items.first();
    const parent = change.value.document.getParent(firstItem.key);

    let index = parent.nodes.findIndex((node) => node.key === firstItem.key);

    // Unwrap the items' children
    items.forEach((item) => {
      item.nodes.forEach((node) => {
        change.moveNodeByKey(node.key, parent.key, index, {
          normalize: false,
        });
        index += 1;
      });
    });

    // Finally, remove the now empty items
    items.forEach((item) => change.removeNodeByKey(item.key, { normalize: false }));

    return change;
  }.bind(this, listOptions);

  core.utils.getItemsAtRange = function(opts, value, range) {
    range = range || value.selection;

    if (!range.startKey) {
      return Immutable.List();
    }

    const { document } = value;

    const startBlock = document.getClosestBlock(range.startKey);
    const endBlock = document.getClosestBlock(range.endKey);

    if (startBlock === endBlock) {
      const item = core.utils.getCurrentItem(value, startBlock);
      return item ? Immutable.List([item]) : Immutable.List();
    }

    const ancestor = document.getCommonAncestor(startBlock.key, endBlock.key);

    if (core.utils.isList(ancestor)) {
      const startPath = ancestor.getPath(startBlock.key);
      const endPath = ancestor.getPath(endBlock.key);

      return ancestor.nodes.slice(startPath.get(0), endPath.get(0) + 1);
    } else if (ancestor.type === opts.typeItem) {
      // The ancestor is the highest list item that covers the range
      return Immutable.List([ancestor]);
    }
    // No list of items can cover the range
    return Immutable.List();
  }.bind(this, listOptions);

  core.utils.getListForItem = function(opts, value, item) {
    const { document } = value;
    const parent = document.getParent(item.key);
    return parent && core.utils.isList(parent) ? parent : null;
  }.bind(this, listOptions);

  core.utils.isSelectionInList = function(opts, value, type) {
    const items = core.utils.getItemsAtRange(value);
    return (
      !items.isEmpty() &&
      // Check the type of the list if needed
      (!type || core.utils.getListForItem(value, items.first()).get('type') === type)
    );
  }.bind(this, listOptions);

  return core;
};

export default (options) => {
  const { type, icon } = options;

  const core = createEditList();

  // eslint-disable-next-line react/display-name
  core.renderNode = (props) => {
    const { node, attributes, children } = props;

    switch (node.type) {
      case 'ul_list':
        return <ul {...attributes}>{children}</ul>;
      case 'ol_list':
        return <ol {...attributes}>{children}</ol>;
      case 'list_item':
        return <li {...attributes}>{children}</li>;
    }
  };

  core.toolbar = {
    isMark: false,
    ariaLabel: type == 'ul_list' ? 'bulleted list' : 'numbered-list',
    type,
    icon,
    isActive: (value, type) => {
      if (!core.utils.isSelectionInList(value)) {
        return false;
      }
      const current = core.utils.getCurrentList(value);
      return current ? current.type === type : false;
    },
    onClick: (value, onChange) => {
      log('[onClick]', value);
      const inList = core.utils.isSelectionInList(value);
      if (inList) {
        const change = value.change().call(core.changes.unwrapList);
        onChange(change);
      } else {
        const change = value.change().call(core.changes.wrapInList, type);
        onChange(change);
      }
    },
  };

  core.normalizeNode = (node) => {
    if (node.object !== 'document' && node.object !== 'block') {
      return undefined;
    }

    const response = core.validateNode(node);

    const invalidListItems = [];

    node.forEachDescendant((d) => {
      if (d.type === 'list_item' && d.nodes.size === 1 && d.nodes.first().object === 'text') {
        // if we have a list_item that has only a text inside, we need to add a block in it
        invalidListItems.push(d);
      }
    });

    if (!invalidListItems.length && !response) {
      return undefined;
    }

    return (change) => {
      if (response) {
        response(change);
      }

      if (invalidListItems.length) {
        change.withoutNormalization(() => {
          invalidListItems.forEach((node) => {
            const textNode = node.nodes.first();
            const wrappedBlock = {
              object: 'block',
              type: 'div',
              nodes: [textNode.toJSON()],
            };

            change.removeNodeByKey(textNode.key);

            change.insertNodeByKey(node.key, 0, wrappedBlock);
          });
        });
      }
    };
  };

  core.renderNode.propTypes = {
    node: PropTypes.object,
    attributes: PropTypes.object,
    children: PropTypes.func,
  };
  core.name = type;

  return core;
};
