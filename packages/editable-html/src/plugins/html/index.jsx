import React from 'react';
import HtmlIcon from '@mui/icons-material/Html';

export default function HtmlPlugin(opts) {
  return {
    name: 'html',
    toolbar: {
      icon: <HtmlIcon />,
      type: 'html',
      isMark: true,
      onClick: (value, onChange) => {},
    },
  };
}
