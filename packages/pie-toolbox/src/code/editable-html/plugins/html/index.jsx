import React from 'react';
import { Editor, Transforms, Node } from 'slate';
import HtmlModeIcon from './icons';
import { htmlToValue, valueToHtml } from './../../new-serialization';

const toggleToRichText = (editor, onChange, dismiss) => {
  const plainText = Node.string(editor);
  const slateValue = dismiss ? editor : htmlToValue(plainText);

  Transforms.select(editor, {
    anchor: Editor.start(editor, []),
    focus: Editor.end(editor, []),
  });
  Transforms.removeNodes(editor);

  editor.children = slateValue;
  Editor.normalize(editor, { force: true });
};

export default function HtmlPlugin(opts) {
  const { isHtmlMode, isEditedInHtmlMode, toggleHtmlMode, handleAlertDialog, currentValue } = opts;

  const handleHtmlModeOn = (editor, onChange) => {
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

  const handleHtmlModeOff = (editor) => {
    const textContent = valueToHtml(editor);
    const paragraphBlock = {
      type: 'paragraph',
      children: [{ text: textContent }],
    };

    Transforms.select(editor, {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    });
    Transforms.removeNodes(editor);

    editor.insertNode(paragraphBlock);
  };

  return {
    name: 'html',
    toolbar: {
      icon: <HtmlModeIcon isHtmlMode={isHtmlMode} />,
      buttonStyles: {
        margin: '0 20px 0 auto',
      },
      type: 'html',
      onClick: (editor, onChange) => {
        if (isHtmlMode) {
          if (isEditedInHtmlMode) {
            handleHtmlModeOn(editor, onChange);
          } else {
            toggleToRichText(editor, onChange);
            toggleHtmlMode();
          }
        } else {
          handleHtmlModeOff(editor, onChange);
          toggleHtmlMode();
        }
      },
    },
  };
}
