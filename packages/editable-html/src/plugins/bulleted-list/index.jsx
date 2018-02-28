import debug from 'debug';
import React from 'react';
import { hasBlock } from '../utils';

const log = debug('pie-elements:editable-html:bulleted-list');

const isActive = value => value &&
  value.blocks.some(b => b.type === 'bulleted-list' || b.type === 'list-item');

export default (options) => {
  const { type, key, icon } = options;

  log('type: ', type, key);
  return {
    toolbar: {
      isMark: false,
      type,
      canToggle: true,
      icon,
      isActive,
      onClick: (value, onChange) => {
        log('[onClick]');
        const active = isActive(value);
        log('[onClick] active: ', active);
        if (active) {
          const c = value.change()
            .setBlocks('div')
            .unwrapBlock('bulleted-list');
          onChange(c);

        } else {
          log('value.change.setBlocks: ', value.change().setBlocks);
          const c = value.change()
            .setBlocks('list-item')
            .wrapBlock('bulleted-list');
          onChange(c);
        }
      }
    },
    renderNode(props) {
      log('[renderNode]', props);
      const { node, attributes, children } = props;
      const type = node && node.get('type');
      if (type === 'bulleted-list') {
        return <ul {...attributes}>{children}</ul>
      } else if (type === 'list-item') {
        return <li {...attributes}>{children}</li>
      }
    }
  }
}
