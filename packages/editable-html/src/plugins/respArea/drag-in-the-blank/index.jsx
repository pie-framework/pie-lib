import React from 'react';
import PropTypes from 'prop-types';
import { DragProvider } from '@pie-lib/drag';
import DragDropTile from './choice';

export const onValueChange = (nodeProps, n, value) => {
  const val = nodeProps.editor.value;
  const change = val.change();

  change.setNodeByKey(n.key, {
    data: {
      ...value,
      index: n.data.get('index'),
    },
  });

  nodeProps.editor.props.onChange(change, () => {
    nodeProps.editor.props.onEditingDone();
  });
};

export const onRemoveResponse = (nodeProps, value) => {
  const val = nodeProps.editor.value;
  const change = val.change();
  const dragInTheBlank = val.document.findDescendant((n) => n.data && n.data.get('index') === value.index);

  change.setNodeByKey(dragInTheBlank.key, {
    data: {
      index: dragInTheBlank.data.get('index'),
    },
  });

  nodeProps.editor.props.onChange(change, () => {
    nodeProps.editor.props.onEditingDone();
  });
};

const DragDrop = (props) => {
  const { attributes, data, n, nodeProps, opts } = props;
  const { inTable } = data;

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || !active) return;

    const draggedData = active.data.current;
    const dropData = over.data.current;

    // Check if this is a valid drop for drag-in-the-blank
    if (
      draggedData &&
      dropData &&
      dropData.instanceId === draggedData.instanceId &&
      over.id.startsWith('drop-')
    ) {
      // Handle the drop
      const shouldDrop =
        !draggedData.value?.index ||
        !data.index ||
        draggedData.value.index !== data.index;

      if (shouldDrop) {
        onValueChange(nodeProps, n, draggedData.value);
      }

      // Remove from source if not duplicates
      if (!opts.options.duplicates && draggedData.fromChoice) {
        onRemoveResponse(nodeProps, draggedData.value);
      }
    }
  };

  return (
    <DragProvider onDragEnd={handleDragEnd}>
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
          duplicates={opts.options.duplicates}
          onChange={(value) => onValueChange(nodeProps, n, value)}
          removeResponse={(value) => onRemoveResponse(nodeProps, value)}
          instanceId={nodeProps.editor?.props?.instanceId || 'default'}
        >
          {nodeProps.children}
        </DragDropTile>
      </span>
    </DragProvider>
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
