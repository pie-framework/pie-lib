import React from 'react';
import PropTypes from 'prop-types';
import { NodeViewWrapper } from '@tiptap/react';
import DragDropTile from './choice';
import omit from 'lodash-es/omit';

export const onValueChange = (editor, node, pos, choice) => {
  const { tr } = editor.state;

  // Merge old and new attributes
  tr.setNodeMarkup(pos, undefined, {
    ...node.attrs,
    ...choice.value,
  });
  tr.isDone = true;
  editor.view.dispatch(tr);
};

export const onRemoveResponse = (editor, node, choice) => {
  const { tr } = editor.state;

  // Merge old and new attributes
  tr.setNodeMarkup(choice.pos, undefined, omit(node.attrs, ['value', 'id']));
  tr.isDone = true;
  editor.view.dispatch(tr);
};

const DragDrop = (props) => {
  const { editor, node, getPos, options, selected } = props;
  const { attrs: attributes } = node;
  const { inTable } = attributes;
  const pos = getPos();

  // console.log({nodeProps.children})
  return (
    <NodeViewWrapper className="drag-in-the-blank" data-selected={selected}>
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
          n={attributes}
          dragKey={attributes.id}
          targetId="0"
          pos={pos}
          value={attributes}
          duplicates={options.duplicates}
          onChange={(choice) => onValueChange(editor, node, pos, choice)}
          removeResponse={(choice) => onRemoveResponse(editor, node, choice)}
        ></DragDropTile>
      </span>
    </NodeViewWrapper>
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
