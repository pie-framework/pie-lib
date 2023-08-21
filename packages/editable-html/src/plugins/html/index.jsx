import React from 'react';
import HtmlModeIcon from './icons';
import { htmlToValue, valueToHtml } from './../../serialization';

export default function HtmlPlugin(opts) {
  const { isHtmlMode, toggleHtmlMode } = opts;

  return {
    name: 'html',
    toolbar: {
      icon: <HtmlModeIcon isHtmlMode={isHtmlMode} />,
      buttonStyles: {
        margin: '0 20px 0 auto',
      },
      type: 'html',
      onClick: (value, onChange) => {
        let change;

        if (isHtmlMode) {
          const plainText = value.document.text;
          console.log('plainTEXT');

          const slateValue = htmlToValue(plainText);
          change = value
            .change()
            .selectAll()
            .delete()
            .insertFragment(slateValue.document);
        } else {
          change = value
            .change()
            .selectAll()
            .delete()
            .insertText(valueToHtml(value));
        }

        onChange(change);
        toggleHtmlMode();
      },
    },
  };
}
