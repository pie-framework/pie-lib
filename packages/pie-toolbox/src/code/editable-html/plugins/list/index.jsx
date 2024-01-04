import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { Editor, Element as SlateElement, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { jsx } from 'slate-hyperscript';

const log = debug('@pie-lib:editable-html:plugins:list');

const b = (type, next, childNodes) => ({
  object: 'block',
  type,
  nodes: next(childNodes),
});

export const serialization = {
  deserialize(el, next) {
    const name = el.tagName.toLowerCase();
    const children = el.children.length ? Array.from(el.children) : el.childNodes;

    if (name === 'li') {
      return jsx(
        'element',
        {
          type: 'li',
        },
        next(children),
      );
    }

    if (name === 'ul') {
      return jsx(
        'element',
        {
          type: 'ul',
        },
        next(children),
      );
    }

    if (name === 'ol') {
      return jsx(
        'element',
        {
          type: 'ol',
        },
        next(children),
      );
    }
  },
  serialize(object, children) {
    const key = ReactEditor.findKey(undefined, object);

    if (object.type === 'list_item') {
      return <li key={key}>{children}</li>;
    }

    if (object.type === 'ul_list') {
      return <ul key={key}>{children}</ul>;
    }

    if (object.type === 'ol_list') {
      return <ol key={key}>{children}</ol>;
    }
  },
};

const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node) => !Editor.isEditor(node) && SlateElement.isElement(node) && node.type === format,
    }),
  );

  return !!match;
};

const createEditList = () => {
  const core = {
    changes: {},
  };

  core.changes.wrapInList = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
      split: true,
    });

    const newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list_item' : format,
    };

    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  return core;
};

const LIST_TYPES = ['ol_list', 'ul_list', 'list_item'];

export default (options) => {
  const { type, icon } = options;

  const core = createEditList();

  core.supports = (node) => LIST_TYPES.includes(node.type);

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
    isActive: isBlockActive,
    onClick: (editor) => {
      core.changes.wrapInList(editor, type);
    },
  };

  core.renderNode.propTypes = {
    node: PropTypes.object,
    attributes: PropTypes.object,
    children: PropTypes.func,
  };

  return core;
};
