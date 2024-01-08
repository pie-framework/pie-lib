import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { Node as SlateNode, Editor, Element as SlateElement, Transforms, Text } from 'slate';
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

    if (object.type === 'li') {
      return <li key={key}>{children}</li>;
    }

    if (object.type === 'ul') {
      return <ul key={key}>{children}</ul>;
    }

    if (object.type === 'ol') {
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
      type: isActive ? 'paragraph' : isList ? 'li' : format,
    };

    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  return core;
};

const LIST_TYPES = ['ul', 'ol', 'li'];

const KEY_TAB = 'Tab';

export default (options) => {
  const { type, icon } = options;

  const core = createEditList();

  core.supports = (node) => LIST_TYPES.includes(node.type);

  core.renderNode = (props) => {
    const { node, attributes, children } = props;

    switch (node.type) {
      case 'ul':
        return <ul {...attributes}>{children}</ul>;
      case 'ol':
        return <ol {...attributes}>{children}</ol>;
      case 'li':
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

  const getAncestorByType = (editor, type) => {
    if (!editor || !type) {
      return null;
    }

    const ancestors = SlateNode.ancestors(editor, Editor.path(editor, editor.selection), {
      reverse: true,
    });

    for (const [ancestor, ancestorPath] of ancestors) {
      if (ancestor.type === type) {
        return [ancestor, ancestorPath];
      }
    }

    return null;
  };

  const increaseItemDepth = (editor) => {
    const [, currentLiPath] = getAncestorByType(editor, 'li');
    const prevResult = editor.previous({ at: currentLiPath });

    if (!prevResult) {
      return true;
    }

    const [prevLi, prevLiPath] = prevResult;
    const [list] = editor.parent(prevLiPath);

    if (!list || !prevLi) {
      return true;
    }

    const lastItem = prevLi.children[prevLi.children.length - 1];

    if (lastItem && lastItem.type === 'ul') {
      // if it's a list
      const itemPath = [...prevLiPath, 1, lastItem.children.length];

      editor.moveNodes({
        at: currentLiPath,
        to: itemPath,
      });
    } else {
      const block = { type: 'div', children: [] };
      const listItemContent = SlateNode.get(editor, [...prevLiPath, 0]);

      if (Text.isText(listItemContent)) {
        // wrap text in a block, so we can add a list on the same level
        editor.wrapNodes(block, {
          at: [...prevLiPath, 0],
        });
      }

      const newList = {
        type: type,
        children: [],
      };

      editor.insertNode(newList, {
        at: [...prevLiPath, prevLi.children.length],
      });

      const itemPath = [...prevLiPath, prevLi.children.length, 0];

      editor.moveNodes({
        at: currentLiPath,
        to: itemPath,
      });
    }

    return true;
  };

  const decreaseItemDepth = (editor) => {
    const [currentLi, currentLiPath] = getAncestorByType(editor, 'li');

    if (currentLi.type !== 'li') {
      return true;
    }

    const [subList, subListPath] = editor.parent(currentLiPath);
    const [parentLi, parentLiPath] = editor.parent(subListPath);

    if (parentLi.type !== 'li') {
      return true;
    }

    const [parentList, parentListPath] = editor.parent(parentLiPath);
    const index = parentList.children.indexOf(parentLi);
    const followingItems = subList.children.reduce(
      (acc, item, index) => {
        if (item === currentLi) {
          acc.skip = false;
          return acc;
        }

        if (!acc.skip) {
          acc.list.push([item, [...subListPath, index - 1]]);
        }

        return acc;
      },
      { skip: true, list: [] },
    );

    if (followingItems.list.length) {
      const newList = {
        type: type,
        children: [],
      };

      const listItemContent = SlateNode.get(editor, [...currentLiPath, 0]);

      if (Text.isText(listItemContent)) {
        const block = { type: 'div', children: [] };

        // wrap text in a block, so we can add a list on the same level
        editor.wrapNodes(block, {
          at: [...currentLiPath, 0],
        });
      }

      editor.insertNode(newList, {
        at: [...currentLiPath, currentLi.children.length],
      });

      const itemPath = [...parentListPath, index + 1];

      editor.moveNodes({
        at: currentLiPath,
        to: itemPath,
      });

      // otherItems.forEach((item, index) => editor.moveNodeByKey(item.key, newList.key, newList.nodes.size + index));
      followingItems.list.forEach(([, liPath]) => {
        const [, lastPlacePath] = SlateNode.last(editor, [...itemPath, 1]);

        editor.moveNodes({
          at: liPath,
          to: lastPlacePath,
        });
      });
    } else {
      // if it's a list
      const itemPath = [...parentListPath, index + 1];

      editor.moveNodes({
        at: currentLiPath,
        to: itemPath,
      });
    }

    if (subList.children.length === followingItems.list.length + 1) {
      // we already remove one item from the list when we moved it
      // and the reference is not updated => list is empty
      editor.removeNodes({
        at: subListPath,
      });
    }

    return true;
  };

  core.onTab = (editor, event) => {
    let result;

    if (event.shiftKey) {
      result = decreaseItemDepth(editor);
    } else {
      result = increaseItemDepth(editor);
    }

    setTimeout(() => ReactEditor.focus(editor), 50);

    return result;
  };

  core.onKeyDown = (editor, event) => {
    const isActive = isBlockActive(editor, type);
    const isList = LIST_TYPES.includes(type);

    if (isActive && isList) {
      switch (event.key) {
        case KEY_TAB:
          return core.onTab(editor, event);
        default:
          return undefined;
      }
    }
  };

  return core;
};
