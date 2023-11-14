import React from 'react';
import { Node as SlateNode, Element as SlateElement, Editor, Transforms } from 'slate';
import debug from 'debug';
import GridOn from '@material-ui/icons/GridOn';
import TableToolbar from './table-toolbar';
import PropTypes from 'prop-types';
import { jsx } from 'slate-hyperscript';
import { makeStyles } from '@material-ui/styles';
import convert from 'react-attr-converter';
import { object as toStyleObject } from 'to-style';
import get from 'lodash/get';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';

const log = debug('@pie-lib:editable-html:plugins:table');

const Table = React.forwardRef((props) => {
  const nodeAttributes = omit(dataToAttributes(props.element.data), 'newTable');
  const attrs = omit(props.attributes, 'newTable');

  return (
    <table {...attrs} {...nodeAttributes} onFocus={props.onFocus} onBlur={props.onBlur}>
      {props.children}
    </table>
  );
});

Table.propTypes = {
  attributes: PropTypes.object,
  element: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  node: PropTypes.shape({
    type: PropTypes.string,
    children: PropTypes.array,
    data: PropTypes.object,
  }),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const TableRow = React.forwardRef((props) => <tr {...props.attributes}>{props.children}</tr>);

TableRow.propTypes = {
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const TableBody = React.forwardRef((props) => <tbody {...props.attributes}>{props.children}</tbody>);

TableBody.propTypes = {
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const useCellStyles = makeStyles({
  td: {
    minWidth: '25px',
  },
});

const TableCell = React.forwardRef((props) => {
  const classes = useCellStyles();
  const { node } = props;
  const Tag = get(node, 'data.header') ? 'th' : 'td';

  const nodeAttributes = dataToAttributes(props.element.data);
  delete nodeAttributes.header;

  return (
    <Tag
      {...props.attributes}
      {...nodeAttributes}
      colSpan={get(node, 'data.colspan')}
      className={classes[Tag]}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      {props.children}
    </Tag>
  );
});

TableCell.propTypes = {
  node: PropTypes.object,
  element: PropTypes.object,
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
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

const moveToBeginningOfTable = (editor) => {
  const [tableBlock, tablePath] = getAncestorByType(editor, 'table');
  let firstTdPath;

  for (const [descendant, descendantPath] of SlateNode.descendants(tableBlock, { reverse: true })) {
    if (descendant.type === 'td') {
      firstTdPath = descendantPath;
    }
  }

  Transforms.select(editor, [...tablePath, ...firstTdPath]);
};

const TABLE_TYPES = ['tbody', 'tr', 'td', 'table'];

export default (opts, toolbarPlugins /* :  {toolbar: {}}[] */) => {
  const core = {
    utils: {},
    rules: (editor) => {
      const { normalizeNode } = editor;

      editor.normalizeNode = (entry) => {
        const [tableNode, tablePath] = entry;
        const tableParent = SlateNode.get(editor, tablePath.slice(0, -1));

        // If the element is a paragraph, ensure its children are valid.
        if (SlateElement.isElement(tableNode) && tableNode.type === 'table') {
          const emptyBlock = {
            type: 'paragraph',
            children: [{ text: '' }],
          };
          const tableIndex = tablePath.slice(-1)[0];

          // if table is the first element, we need to add a space before
          // so users can focus before the table
          if (tableIndex === 0) {
            const beforeTablePath = [...tablePath.slice(0, -1), 0];

            editor.apply({
              type: 'insert_node',
              path: beforeTablePath,
              node: emptyBlock,
            });
            editor.continueNormalization();
            return;
          }

          // if table is the last element, we add element after it
          if (tableParent.children.length - 1 === tableIndex) {
            const afterTablePath = [...tablePath.slice(0, -1), tableIndex + 1];

            editor.apply({
              type: 'insert_node',
              path: afterTablePath,
              node: emptyBlock,
            });
            editor.continueNormalization();
            return;
          }

          // if table does not have a tbody, we add it
          if (tableNode.children[0].type !== 'tbody') {
            const tBodyNode = { type: 'tbody', children: [] };

            Transforms.wrapNodes(editor, tBodyNode, {
              at: {
                anchor: { path: [...tablePath, 0], offset: 0 },
                focus: { path: [...tablePath, tableNode.children.length], offset: 0 },
              },
            });
            editor.continueNormalization();
            return;
          }
        }

        // Fall back to the original `normalizeNode` to enforce other constraints.
        normalizeNode(entry);
      };

      return editor;
    },
  };

  core.utils.createTable = (row = 2, columns = 2) => {
    const tableRows = [];
    const rowLength = new Array(row).fill(0).length;
    const columnsLength = new Array(columns).fill(0).length;

    for (let i = 0; i < rowLength; i++) {
      const tableRow = { type: 'tr', children: [] };

      for (let j = 0; j < columnsLength; j++) {
        tableRow.children.push({
          type: 'td',
          children: [
            {
              text: '',
            },
          ],
        });
      }

      tableRows.push(tableRow);
    }

    return {
      type: 'table',
      children: [
        {
          type: 'tbody',
          children: tableRows,
        },
      ],
    };
  };

  core.utils.getTableBlock = (editor) => getAncestorByType(editor, 'table');

  core.utils.isSelectionInTable = (editor) => !!core.utils.getTableBlock(editor);

  core.utils.createTableWithOptions = (row, columns, extra) => {
    const createdTable = core.utils.createTable(row, columns);
    const newTable = { ...createdTable, ...extra };

    return newTable;
  };

  core.toolbar = {
    icon: <GridOn />,
    onClick: (editor) => {
      log('insert table');
      const newTable = core.utils.createTableWithOptions(2, 2, {
        data: {
          border: '1',
          newTable: true,
        },
      });

      editor.insertNode(newTable);
      moveToBeginningOfTable(editor, newTable);
    },
    /**
     * Note - the node may not be a table node - it may be a node inside a table.
     */
    customToolbar: (node, nodePath, editor, onToolbarDone) => {
      log('[customToolbar] node.data: ', node.data);

      const [tableBlock] = core.utils.getTableBlock(editor);
      log('[customToolbar] tableBlock: ', tableBlock);

      const hasBorder = () => get(tableBlock, 'data.border') !== '0';
      const addRow = () => {
        const [trNode, trPath] = getAncestorByType(editor, 'tr');

        log('[addRow]');

        if (trNode) {
          const newTr = { type: 'tr', children: [] };
          const columnsLength = trNode.children.length;

          for (let i = 0; i < columnsLength; i++) {
            newTr.children.push({
              type: 'td',
              children: [
                {
                  text: '',
                },
              ],
            });
          }

          Transforms.insertNodes(editor, [newTr], { at: trPath });
        }
      };

      const removeRow = () => {
        const [tBodyNode, tBodyPath] = getAncestorByType(editor, 'tbody');

        log('[removeRow]');

        if (tBodyPath) {
          if (tBodyNode.children.length > 1) {
            const [, trPath] = getAncestorByType(editor, 'tr');

            log('[removeRow]');

            if (trPath) {
              Transforms.removeNodes(editor, { at: trPath });
            }
          }
        }
      };

      const addColumn = () => {
        const [tBodyNode, tBodyPath] = getAncestorByType(editor, 'tbody');

        log('[addColumn]');

        if (tBodyNode) {
          const emptyTd = {
            type: 'td',
            children: [{ text: '' }],
          };
          const trElements = Editor.nodes(editor, {
            at: tBodyPath, // Path of Editor
            match: (node) => 'tr' === node.type,
          });

          for (const [trNode, nodePath] of trElements) {
            Transforms.insertNodes(editor, [emptyTd], {
              at: [...nodePath, trNode.children.length],
            });
          }
        }
      };

      const removeColumn = () => {
        const [tBodyNode, tBodyPath] = getAncestorByType(editor, 'tbody');

        log('[addColumn]');

        if (tBodyNode) {
          const currentPath = Editor.path(editor, editor.selection);
          const columnIndex = currentPath[currentPath.length - 2];
          const trElements = Editor.nodes(editor, {
            at: tBodyPath, // Path of Editor
            match: (node) => 'tr' === node.type,
          });

          for (const [trNode, nodePath] of trElements) {
            if (trNode.children.length > 1) {
              Transforms.removeNodes(editor, { at: [...nodePath, columnIndex] });
            }
          }
        }
      };

      const removeTable = () => {
        const [tableNode, tablePath] = getAncestorByType(editor, 'table');

        editor.apply({
          type: 'remove_node',
          path: tablePath,
          node: tableNode,
        });
      };

      const toggleBorder = () => {
        const { data } = tableBlock;
        const update = {
          ...data,
          border: hasBorder() ? '0' : '1',
        };
        const [, tablePath] = getAncestorByType(editor, 'table');

        log('[toggleBorder] update: ', update);

        editor.apply({
          type: 'set_node',
          path: tablePath,
          properties: {
            data: node.data,
          },
          newProperties: { data: update },
        });
      };

      const onDone = () => {
        log('[onDone] call onToolbarDone...');
        onToolbarDone(true);
      };

      const Tb = () => (
        <TableToolbar
          editor={editor}
          plugins={toolbarPlugins}
          onChange={(c) => onToolbarDone(c, false)}
          onAddRow={addRow}
          onRemoveRow={removeRow}
          onAddColumn={addColumn}
          onRemoveColumn={removeColumn}
          onRemoveTable={removeTable}
          hasBorder={hasBorder()}
          onToggleBorder={toggleBorder}
          onDone={onDone}
        />
      );
      return Tb;
    },
  };

  core.supports = (node) => TABLE_TYPES.includes(node.type);

  const Node = (props) => {
    switch (props.node.type) {
      case 'table':
        return <Table {...props} onFocus={opts.onFocus} onBlur={opts.onBlur} />;
      case 'tbody':
        return <TableBody {...props} onFocus={opts.onFocus} onBlur={opts.onBlur} />;
      case 'tr':
        return <TableRow {...props} />;
      case 'td':
        return <TableCell {...props} onFocus={opts.onFocus} onBlur={opts.onBlur} />;
      default:
        return null;
    }
  };
  Node.propTypes = {
    node: PropTypes.object,
  };

  core.renderNode = Node;

  return core;
};

export const parseStyleString = (s) => {
  const regex = /([\w-]*)\s*:\s*([^;]*)/g;
  let match;
  const result = {};
  while ((match = regex.exec(s))) {
    result[match[1]] = match[2].trim();
  }
  return result;
};

export const reactAttributes = (o) => toStyleObject(o, { camelize: true, addUnits: false });

const attributesToMap = (el) => (acc, attribute) => {
  const value = el.getAttribute(attribute);
  if (value) {
    if (attribute === 'style') {
      const styleString = el.getAttribute(attribute);
      const reactStyleObject = reactAttributes(parseStyleString(styleString));
      acc['style'] = reactStyleObject;
    } else {
      acc[attribute] = el.getAttribute(attribute);
    }
  }
  return acc;
};

const dataToAttributes = (data) => {
  return reduce(
    data,
    (acc, v, name) => {
      if (v) {
        acc[convert(name)] = v;
      }
      return acc;
    },
    {},
  );
};

const attributes = ['border', 'cellpadding', 'cellspacing', 'class', 'style'];

const cellAttributes = ['colspan', 'rowspan', 'class', 'style'];

export const serialization = {
  deserialize(el, next) {
    const tag = el.tagName.toLowerCase();

    switch (tag) {
      case 'table': {
        const children =
          el.children.length === 1 && el.children[0].tagName.toLowerCase() === 'tbody'
            ? el.children[0].children
            : el.children;
        const c = Array.from(children);

        return jsx(
          'element',
          {
            type: 'table',
            data: attributes.reduce(attributesToMap(el), {}),
          },
          next(c),
        );
      }
      case 'tbody': {
        return jsx(
          'element',
          {
            type: 'tbody',
          },
          next(el.childNodes),
        );
      }

      case 'th': {
        return jsx(
          'element',
          {
            type: 'th',
            data: cellAttributes.reduce(attributesToMap(el), { header: true }),
          },
          next(el.childNodes),
        );
      }

      case 'tr': {
        return jsx(
          'element',
          {
            type: 'tr',
          },
          next(Array.from(el.children)),
        );
      }

      case 'td': {
        return jsx(
          'element',
          {
            type: 'td',
            data: cellAttributes.reduce(attributesToMap(el), { header: true }),
          },
          next(el.childNodes),
        );
      }
    }
  },
  serialize(object, children) {
    switch (object.type) {
      case 'table': {
        const attributes = dataToAttributes(object.data);

        return <table {...attributes}>{children}</table>;
      }
      case 'tbody': {
        return <tbody>{children}</tbody>;
      }
      case 'tr': {
        return <tr>{children}</tr>;
      }
      case 'td': {
        const attributes = dataToAttributes(object.data);
        return <td {...attributes}>{children}</td>;
      }
      case 'th': {
        const attributes = dataToAttributes(object.data);
        return <th {...attributes}>{children}</th>;
      }
    }
  },
};
