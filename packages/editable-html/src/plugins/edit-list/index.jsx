import debug from 'debug';
import React from 'react';
import { hasBlock } from '../utils';

export default (options) => {
  const { type, key, icon } = options;
  
  return {
    toolbar : {
      isMark: false,
      canToggle: true,
      type,
      icon,
      onClick : (value, onChange) => {
        const change = value.change();
        const { document } = value;

        const DEFAULT_NODE = 'paragraph';

        // Handle everything but list buttons.
        if (type != 'bulleted-list' && type != 'numbered-list') {
          const isActive = hasBlock(value, type)
          const isList = hasBlock(value, 'list-item')
    
          if (isList) {
            change
              .setBlocks(isActive ? DEFAULT_NODE : type)
              .unwrapBlock('numbered-list')
              .unwrapBlock('bulleted-list')
          } else {
            change.setBlocks(isActive ? DEFAULT_NODE : type)
          }
        } else {
          // Handle the extra wrapping required for list buttons.
          const isList = hasBlock(value, 'list-item')
          const isType = value.blocks.some(block => {
            return !!document.getClosest(block.key, parent => parent.type == type)
          })
    
          if (isList && isType) {
            change
              .setBlocks(DEFAULT_NODE)
              .unwrapBlock('numbered-list')
              .unwrapBlock('bulleted-list')
          } else if (isList) {
            change
              .unwrapBlock(
                type == 'numbered-list' ? 'bulleted-list' : 'numbered-list'
              )
              .wrapBlock(type)
          } else {
            change.setBlocks('list-item').wrapBlock(type)
          }
        }
    
        onChange(change)  
      }
    },

    renderNode(props) {
      const { attributes, children, node } = props
      
      const type = node && node.get('type');
      switch (type) {
        case 'bulleted-list':
          return <ul {...attributes}>{children}</ul>
        case 'numbered-list':
          return <ol {...attributes}>{children}</ol>  
        case 'list-item':
          return <li {...attributes}>{children}</li>  
      }
    }
  }

}