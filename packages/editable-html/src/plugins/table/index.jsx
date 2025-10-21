import React from 'react';
import { Block } from 'slate';
import debug from 'debug';
import GridOn from '@mui/icons-material/GridOn';
import TableToolbar from './table-toolbar';
import PropTypes from 'prop-types';
import SlatePropTypes from 'slate-prop-types';
import { styled } from '@mui/material/styles';
import convert from 'react-attr-converter';
import { object as toStyleObject } from 'to-style';
import CustomTablePlugin from './CustomTablePlugin';

const log = debug('@pie-lib:editable-html:plugins:table');

const StyledTable = styled('table')({});

const StyledTableCell = styled(({ node, ...props }) => {
  const Tag = node.data.get('header') ? 'th' : 'td';
  return <Tag {...props} />;
})({
  '&': {
    minWidth: '25px',
  },
  '&[data-cell-type="td"]': {
    minWidth: '25px',
  },
});

const Table = (props) => {
  const nodeAttributes = dataToAttributes(props.node.data);

  return (
    <StyledTable
      {...props.attributes}
      {...nodeAttributes}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      <tbody>{props.children}</tbody>
    </StyledTable>
  );
};

Table.propTypes = {
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  node: SlatePropTypes.node,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const TableRow = (props) => <tr {...props.attributes}>{props.children}</tr>;

TableRow.propTypes = {
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const TableCell = (props) => {
  const Tag = props.node.data.get('header') ? 'th' : 'td';
  const nodeAttributes = dataToAttributes(props.node.data);
  delete nodeAttributes.header;

  return (
    <StyledTableCell
      as={Tag}
      node={props.node}
      {...props.attributes}
      {...nodeAttributes}
      colSpan={props.node.data.get('colspan')}
      data-cell-type={Tag}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      {props.children}
    </StyledTableCell>
  );
};

TableCell.propTypes = {
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export const moveFocusToBeginningOfTable = (change) => {
  const addedTable = change.value.document.findDescendant((d) => !!d.data && !!d.data.get('newTable'));

  if (!addedTable) {
    return;
  }

  change.collapseToStartOf(addedTable);

  const update = addedTable.data.remove('newTable');

  change.setNodeByKey(addedTable.key, { data: update });
};

export default (opts, toolbarPlugins /* :  {toolbar: {}}[] */) => {
  const core = CustomTablePlugin(opts);

  // fix outdated schema

  if (core.schema && core.schema.blocks) {
    Object.keys(core.schema.blocks).forEach((key) => {
      const block = core.schema.blocks[key];

      if (block.parent) {
        if (block.nodes[0].types) {
          block.nodes[0] = {
            type: block.nodes[0].types[0],
          };
        }

        if (block.nodes[0].objects) {
          block.nodes[0] = {
            object: block.nodes[0].objects[0],
          };
        }

        block.parent = {
          type: block.parent.types[0],
        };
      } else {
        block.nodes[0] = { type: block.nodes[0].types[0] };
      }
    });
  }

  core.utils.getTableBlock = (containerNode, key) => {
    const node = containerNode.getDescendant(key);
    const ancestors = containerNode.getAncestors(key).push(node);
    return ancestors.findLast((p) => p.type === 'table');
  };

  core.utils.createTableWithOptions = (row, columns, extra) => {
    const createdTable = core.utils.createTable(row, columns);
    const newTable = Block.create({
      ...createdTable.toJSON(),
      ...extra,
    });

    return newTable;
  };

  core.toolbar = {
    type: 'table',
    icon: <GridOn />,
    ariaLabel: 'Insert Table',
    onClick: (value, onChange) => {
      log('insert table');
      const change = value.change();
      const newTable = core.utils.createTableWithOptions(2, 2, {
        data: {
          border: '1',
          newTable: true,
        },
      });

      change.insertBlock(newTable);

      moveFocusToBeginningOfTable(change);
      onChange(change);
    },
    supports: (node, value) => node && node.object === 'block' && core.utils.isSelectionInTable(value),
    /**
     * Note - the node may not be a table node - it may be a node inside a table.
     */
    customToolbar: (node, value, onToolbarDone, getFocusedValue) => {
      log('[customToolbar] node.data: ', node.data);

      const tableBlock = core.utils.getTableBlock(value.document, node?.key);
      log('[customToolbar] tableBlock: ', tableBlock);

      const hasBorder = () => tableBlock.data.get('border') && tableBlock.data.get('border') !== '0';
      const addRow = () => {
        const change = core.changes.insertRow(value.change());
        onToolbarDone(change, false);
      };

      const addColumn = () => {
        const change = core.changes.insertColumn(value.change());
        onToolbarDone(change, false);
      };

      const removeRow = () => {
        const change = core.changes.removeRow(value.change());
        onToolbarDone(change, false);
      };

      const removeColumn = () => {
        const change = core.changes.removeColumn(value.change());
        onToolbarDone(change, false);
      };

      const removeTable = () => {
        const change = core.changes.removeTable(value.change());
        onToolbarDone(change, false);
      };

      const toggleBorder = () => {
        const { data } = tableBlock;
        const update = data.set('border', hasBorder() ? '0' : '1');
        log('[toggleBorder] update: ', update);
        const change = value.change().setNodeByKey(tableBlock.key, { data: update });
        onToolbarDone(change, false);
      };

      const onDone = () => {
        log('[onDone] call onToolbarDone...');
        onToolbarDone(null, true);
      };

      const Tb = () => (
        <TableToolbar
          getFocusedValue={getFocusedValue}
          plugins={toolbarPlugins}
          onChange={(c) => onToolbarDone(c, false)}
          value={value}
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

  const Node = (props) => {
    switch (props.node.type) {
      case 'table':
        return <Table {...props} onFocus={opts.onFocus} onBlur={opts.onBlur} />;
      case 'table_row':
        return <TableRow {...props} />;
      case 'table_cell':
        return <TableCell {...props} onFocus={opts.onFocus} onBlur={opts.onBlur} />;
      default:
        return null;
    }
  };
  Node.propTypes = {
    node: PropTypes.object,
  };

  core.normalizeNode = (node) => {
    const addNodeBeforeArray = [];

    if (node.object !== 'document') return;

    node.findDescendant((d) => {
      if (d.type === 'table') {
        const tablePath = node.getPath(d.key);
        const prevNode = node.getPreviousNode(tablePath);
        const nextNode = node.getNextNode(tablePath);

        if (!prevNode || !nextNode) {
          addNodeBeforeArray.push({
            node: d,
            prevNode,
            nextNode,
          });
        }
      }
    });

    if (!addNodeBeforeArray.length) {
      return;
    }

    return (change) => {
      const newBlock = {
        object: 'block',
        type: 'div',
      };

      addNodeBeforeArray.forEach((n) => {
        const tablePath = change.value.document.getPath(n.node.key).toJSON();
        // removing tableIndex
        let indexToAdd = tablePath.splice(-1)[0];

        if (!n.prevNode) {
          // inserting block key before table
          change.insertNodeByPath(tablePath, indexToAdd, newBlock);
          // this will trigger another normalization, which will figure out if there's not
          // a block after the table and add it, so we exit for now
          return;
        }

        if (!n.nextNode) {
          // inserting block key after table
          change.insertNodeByPath(tablePath, indexToAdd + 1, newBlock);
        }
      });
    };
  };

  core.renderNode = Node;
  core.name = 'table';

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
  if (!data || !data.get) {
    return {};
  }

  return data.reduce((acc, v, name) => {
    if (v) {
      acc[convert(name)] = v;
    }
    return acc;
  }, {});
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

        return {
          object: 'block',
          type: 'table',
          nodes: next(c),
          data: attributes.reduce(attributesToMap(el), {}),
        };
      }

      case 'th': {
        return {
          object: 'block',
          type: 'table_cell',
          nodes: next(el.childNodes),
          data: cellAttributes.reduce(attributesToMap(el), { header: true }),
        };
      }

      case 'tr': {
        return {
          object: 'block',
          type: 'table_row',
          nodes: next(Array.from(el.children)),
        };
      }

      case 'td': {
        return {
          object: 'block',
          type: 'table_cell',
          nodes: next(Array.from(el.childNodes)),
          data: cellAttributes.reduce(attributesToMap(el), { header: false }),
        };
      }
    }
  },
  serialize(object, children) {
    if (object.object !== 'block') {
      return;
    }

    switch (object.type) {
      case 'table': {
        const attributes = dataToAttributes(object.data);

        return (
          <table {...attributes}>
            <tbody>{children}</tbody>
          </table>
        );
      }

      case 'table_row': {
        return <tr>{children}</tr>;
      }

      case 'table_cell': {
        const attributes = dataToAttributes(object.data);
        delete attributes.header;

        if (object.data.get('header')) {
          return <th {...attributes}>{children}</th>;
        } else {
          return <td {...attributes}>{children}</td>;
        }
      }
    }
  },
};
