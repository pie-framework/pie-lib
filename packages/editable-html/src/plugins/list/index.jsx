import React from 'react';
import PropTypes from 'prop-types';
import EditList from 'slate-edit-list';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:plugins:list');

const b = (type, next, childNodes) => ({
  object: 'block',
  type,
  nodes: next(childNodes)
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
  }
};

export default options => {
  const { type, icon } = options;

  const core = EditList({
    typeDefault: 'span'
  });

  // fix outdated schema

  if (core.schema && core.schema.blocks) {
    Object.keys(core.schema.blocks).forEach(key => {
      const block = core.schema.blocks[key];

      if (block.parent) {
        return;
      }

      block.nodes[0] = { type: block.nodes[0].types[0] };
    });
  }

  // eslint-disable-next-line react/display-name
  core.renderNode = props => {
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
      return current.type === type;
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
    }
  };

  core.renderNode.propTypes = {
    node: PropTypes.object,
    attributes: PropTypes.object,
    children: PropTypes.func
  };

  return core;
};
