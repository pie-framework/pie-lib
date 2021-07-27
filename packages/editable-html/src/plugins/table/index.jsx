import React from 'react';
import EditTable from 'slate-edit-table';
import { Block, Inline } from 'slate';
import debug from 'debug';
import GridOn from '@material-ui/icons/GridOn';
import TableToolbar from './table-toolbar';
import PropTypes from 'prop-types';
import SlatePropTypes from 'slate-prop-types';
import { withStyles } from '@material-ui/core/styles';
import convert from 'react-attr-converter';
import { object as toStyleObject } from 'to-style';

const log = debug('@pie-lib:editable-html:plugins:table');

const Table = withStyles(() => ({
  table: {}
}))(props => {
  const nodeAttributes = dataToAttributes(props.node.data);

  return (
    <table
      className={props.classes.table}
      {...props.attributes}
      {...nodeAttributes}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      <tbody>{props.children}</tbody>
    </table>
  );
});

Table.propTypes = {
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  node: SlatePropTypes.node,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

const TableRow = props => <tr {...props.attributes}>{props.children}</tr>;

TableRow.propTypes = {
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

const TableCell = withStyles(() => ({
  td: {
    minWidth: '25px'
  }
}))(props => {
  const Tag = props.node.data.get('header') ? 'th' : 'td';

  const nodeAttributes = dataToAttributes(props.node.data);
  delete nodeAttributes.header;

  return (
    <Tag
      {...props.attributes}
      {...nodeAttributes}
      colSpan={props.node.data.get('colspan')}
      className={props.classes[Tag]}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      {props.children}
    </Tag>
  );
});

TableCell.propTypes = {
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default (opts, toolbarPlugins /* :  {toolbar: {}}[] */) => {
  const core = EditTable({
    typeContent: 'div'
  });

  // fix outdated schema

  if (core.schema && core.schema.blocks) {
    Object.keys(core.schema.blocks).forEach(key => {
      const block = core.schema.blocks[key];

      if (block.parent) {
        if (block.nodes[0].types) {
          block.nodes[0] = {
            type: block.nodes[0].types[0]
          };
        }

        if (block.nodes[0].objects) {
          block.nodes[0] = {
            object: block.nodes[0].objects[0]
          };
        }

        block.parent = {
          type: block.parent.types[0]
        };
      } else {
        block.nodes[0] = { type: block.nodes[0].types[0] };
      }
    });
  }

  core.utils.getTableBlock = (containerNode, key) => {
    const node = containerNode.getDescendant(key);
    const ancestors = containerNode.getAncestors(key).push(node);
    return ancestors.findLast(p => p.type === 'table');
  };

  core.toolbar = {
    icon: <GridOn />,
    onClick: (value, onChange) => {
      log('insert table');
      const c = core.changes.insertTable(value.change(), 2, 2);
      onChange(c);
    },
    supports: (node, value) =>
      node && node.object === 'block' && core.utils.isSelectionInTable(value),
    /**
     * Note - the node may not be a table node - it may be a node inside a table.
     */
    customToolbar: (node, value, onToolbarDone) => {
      log('[customToolbar] node.data: ', node.data);

      const tableBlock = core.utils.getTableBlock(value.document, node.key);
      log('[customToolbar] tableBlock: ', tableBlock);

      const hasBorder = () =>
        tableBlock.data.get('border') && tableBlock.data.get('border') !== '0';
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
          plugins={toolbarPlugins}
          onChange={c => onToolbarDone(c, false)}
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
    }
  };

  const Node = props => {
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
    node: PropTypes.object
  };

  core.normalizeNode = node => {
    if (node.object !== 'document') {
      return;
    }

    let shouldAddTextAfterNode = false;
    const indexToNotHaveTableOn = node.nodes.size - 1;
    const indexOfLastTable = node.nodes.findLastIndex(d => d.type === 'table');

    // if the last table in the document is of type table, we need to do the change
    if (indexOfLastTable === indexToNotHaveTableOn) {
      shouldAddTextAfterNode = true;
    }

    if (!shouldAddTextAfterNode) {
      return;
    }

    const tableNode = node.nodes.get(indexOfLastTable);

    return change => {
      if (shouldAddTextAfterNode) {
        const tableJSON = tableNode.toJSON();

        // we remove the table node because otherwise we can't add the empty block after it
        // we need a block that contains text in order to do it
        change.removeNodeByKey(tableNode.key);

        const newBlock = Block.create({
          object: 'block',
          type: 'div'
        });

        // we add an empty block but that it's going to be normalized
        // because it will add the empty text to it like it should
        change.insertBlock(newBlock);

        change.withoutNormalization(() => {
          // we do these changes without normalization

          // we get the text previous to the new block added
          const prevText = change.value.document.getPreviousText(newBlock.key);

          if (prevText) {
            // we move focus to the previous text
            change
              .moveFocusTo(prevText.key, prevText.text.length)
              .moveAnchorTo(prevText.key, prevText.text.length);
          }

          // we insert the table block between the first block with text and the last block with text
          change.insertBlock(tableJSON);
        });
      }
    };
  };

  core.renderNode = Node;

  return core;
};

export const parseStyleString = s => {
  const regex = /([\w-]*)\s*:\s*([^;]*)/g;
  let match;
  const result = {};
  while ((match = regex.exec(s))) {
    result[match[1]] = match[2].trim();
  }
  return result;
};

export const reactAttributes = o => toStyleObject(o, { camelize: true });

const attributesToMap = el => (acc, attribute) => {
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

const dataToAttributes = data => {
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
          data: attributes.reduce(attributesToMap(el), {})
        };
      }
      case 'th': {
        return {
          object: 'block',
          type: 'table_cell',
          nodes: next(el.childNodes),
          data: cellAttributes.reduce(attributesToMap(el), { header: true })
        };
      }
      case 'tr': {
        return {
          object: 'block',
          type: 'table_row',
          nodes: next(Array.from(el.children))
        };
      }
      case 'td': {
        return {
          object: 'block',
          type: 'table_cell',
          nodes: next(Array.from(el.childNodes)),
          data: cellAttributes.reduce(attributesToMap(el), { header: false })
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
  }
};
