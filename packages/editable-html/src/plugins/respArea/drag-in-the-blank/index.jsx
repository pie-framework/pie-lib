import React from 'react';
import PropTypes from 'prop-types';
import DragDropTile from './choice';
import { onValueChange, onRemoveResponse } from './utils';

const DragDrop = ({ attributes, data, n, nodeProps, opts }) => {
  const { inTable } = data;

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
          targetId={`drop-${n.key}`}
          value={data}
          duplicates={opts.options.duplicates}
          onChange={(value) => onValueChange(nodeProps, n, value)}
          removeResponse={(value) => onRemoveResponse(nodeProps, value)}
          instanceId={nodeProps.editor?.props?.instanceId || 'default'}
          nodeProps={nodeProps}
          opts={opts}
        >
          {nodeProps.children}
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
