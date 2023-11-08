import React from 'react';
import HtmlModeIcon from './icons';
import { htmlToValue, valueToHtml } from './../../serialization';

const toggleToRichText = (value, onChange, dismiss) => {
  const plainText = value.document.text;
  const slateValue = dismiss ? value : htmlToValue(plainText);

  const change = value
    .change()
    .selectAll()
    .delete()
    .insertFragment(slateValue.document);
  onChange(change);
};

export default function HtmlPlugin(opts) {
  const { isHtmlMode, isEditedInHtmlMode, toggleHtmlMode, handleAlertDialog, currentValue } = opts;

  const handleHtmlModeOn = (value, onChange) => {
    const dialogProps = {
      title: 'Warning',
      text: 'Returning to rich text mode without saving will cause edits to be lost.',
      onConfirmText: 'Dismiss changes',
      onCloseText: 'Continue Editing',
      onConfirm: () => {
        handleAlertDialog(false);
        toggleToRichText(currentValue, onChange, true);
        toggleHtmlMode();
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
          if (isEditedInHtmlMode) {
            handleHtmlModeOn(value, onChange);
          } else {
            toggleToRichText(value, onChange);
            toggleHtmlMode();
          }
        } else {
          handleHtmlModeOff(value, onChange);
          toggleHtmlMode();
        }
      },
    },
  };
}
