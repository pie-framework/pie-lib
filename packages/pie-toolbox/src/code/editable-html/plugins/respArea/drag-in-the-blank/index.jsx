import React from 'react';
import { Editor } from 'slate';
import PropTypes from 'prop-types';
import DragDropTile from './choice';
import omit from 'lodash/omit';

export const onValueChange = (nodeProps, newNode, nodeData, onEditingDone) => {
  const { editor } = nodeProps;
  const [result] = Array.from(
    Editor.nodes(editor, {
      at: [0],
      match: (n) => !Editor.isEditor(n) && n.data && n.data.index === newNode.data.index,
    }),
  );

  if (!result) {
    return;
  }

  const [, nodePath] = result;

  editor.apply({
    type: 'set_node',
    path: nodePath,
    properties: {
      data: nodeData,
    },
    newProperties: {
      data: {
        ...nodeData,
        index: newNode.data.index,
      },
    },
  });

  onEditingDone(editor);
};

export const onRemoveResponse = (nodeProps, nodeData, onEditingDone) => {
  const { editor } = nodeProps;
  const [result] = Array.from(
    Editor.nodes(editor, {
      at: [0],
      match: (n) => !Editor.isEditor(n) && n.data && n.data.index === nodeData.index,
    }),
  );

  if (!result) {
    return;
  }

  const [, nodePath] = result;

  editor.apply({
    type: 'set_node',
    path: nodePath,
    properties: {
      data: nodeData,
    },
    newProperties: { data: { ...omit(nodeData, 'value') } },
  });

  onEditingDone(editor);
};

const DragDrop = (props) => {
  const { attributes, children, data, n, nodeProps, opts } = props;
  const { editor } = nodeProps || {};
  const { inTable } = data;
  const { onEditingDone } = opts;

  return (
    <span
      {...attributes}
      style={{
        display: 'inline-flex',
        minHeight: '50px',
        minWidth: '178px',
        position: 'relative',
        margin: inTable ? '10px' : '0 10px',
        cursor: 'pointer',
      }}
    >
      <DragDropTile
        n={n}
        dragKey={n.key}
        targetId="0"
        value={data}
        editor={editor}
        duplicates={opts.options.duplicates}
        onChange={(value) => onValueChange(nodeProps, n, value, onEditingDone)}
        removeResponse={(value) => onRemoveResponse(nodeProps, value, onEditingDone)}
      >
        {nodeProps.children}
        {children}
      </DragDropTile>
    </span>
  );
};

DragDrop.propTypes = {
  attributes: PropTypes.object,
  data: PropTypes.object,
  n: PropTypes.object,
  nodeProps: PropTypes.object,
  opts: PropTypes.object,
};

export default DragDrop;
