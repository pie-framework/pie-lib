import React from 'react';
import { Data } from 'slate';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import EditList from 'slate-edit-list';
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

  core.renderNode.propTypes = {
    node: PropTypes.object,
    attributes: PropTypes.object,
    children: PropTypes.func,
  };

  return core;
};
