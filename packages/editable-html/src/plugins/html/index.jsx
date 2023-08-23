import React from 'react';
import HtmlModeIcon from './icons';
import { htmlToValue, valueToHtml } from './../../serialization';

export default function HtmlPlugin(opts) {
  const { isHtmlMode, toggleHtmlMode, handleAlertDialog } = opts;

  const handleHtmlModeOn = (value, onChange) => {
    const dialogProps = {
      title: 'Warning',
      text: 'Returning to rich text mode may cause edits to be lost.',
      onConfirm: () => {
        const plainText = value.document.text;
        const slateValue = htmlToValue(plainText);
        const change = value
          .change()
          .selectAll()
          .delete()
          .insertFragment(slateValue.document);
        onChange(change);
        toggleHtmlMode();
        handleAlertDialog(false);
      },
      onClose: () => {
        handleAlertDialog(false);
      },
    };

    handleAlertDialog(true, dialogProps);
  };

  const handleHtmlModeOff = (value, onChange) => {
    const change = value
      .change()
      .selectAll()
      .delete()
      .insertText(valueToHtml(value));
    onChange(change);
    toggleHtmlMode();
  };

  return {
    name: 'html',
    toolbar: {
      icon: <HtmlModeIcon isHtmlMode={isHtmlMode} />,
      buttonStyles: {
        margin: '0 20px 0 auto',
      },
      type: 'html',
      onClick: (value, onChange) => {
        if (isHtmlMode) {
          handleHtmlModeOn(value, onChange);
        } else {
          handleHtmlModeOff(value, onChange);
        }
      },
    },
  };
}
