import React from 'react';
import TextAlignIcon from './icons';

/**
 * Plugin in order to be able to change alignment for the selected text(s) element(s).
 * @param opts
 * @constructor
 */
export default function TextAlign(opts) {
  const plugin = {
    name: 'textAlign',
    toolbar: {
      icon: <TextAlignIcon {...opts} />,
      ariaLabel: 'Text Align',
      onClick: () => {},
    },
  };

  return plugin;
}
