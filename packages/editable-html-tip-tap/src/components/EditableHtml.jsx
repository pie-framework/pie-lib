import React, { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash-es/debounce';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { styled } from '@mui/material/styles';
import StarterKit from '@tiptap/starter-kit';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { CharacterCount } from '@tiptap/extension-character-count';
import SuperScript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { normalizeInitialMarkup } from '../utils/helper';

import ExtendedTable from '../extensions/extended-table';
import { DivNode } from '../extensions/div-node';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import {
  DragInTheBlankNode,
  ExplicitConstructedResponseNode,
  InlineDropdownNode,
  MathTemplatedNode,
  ResponseAreaExtension,
} from '../extensions/responseArea';
import { MathNode } from '../extensions/math';
import { ImageUploadNode } from '../extensions/image';
import { Media } from '../extensions/media';
import { CSSMark } from '../extensions/css';

import EditorContainer from './TiptapContainer';
import { valueToSize } from '../utils/size';
import { buildExtensions, PLUGINS_MAP } from '../extensions';

const defaultToolbarOpts = {
  position: 'bottom',
  alignment: 'left',
  alwaysVisible: false,
  showDone: true,
  doneOn: 'blur',
};

const defaultResponseAreaProps = {
  options: {},
  respAreaToolbar: () => {},
  onHandleAreaChange: () => {},
};

const DEFAULT_ACTIVE_PLUGINS = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
  'bulleted-list',
  'numbered-list',
  'image',
  'math',
  'languageCharacters',
  'text-align',
  'table',
  'video',
  'audio',
  'responseArea',
  'superscript',
  'subscript',
  'css',
  'h3',
  'undo',
  'redo',
];

const cssVariables = {
  '--white': '#fff',
  '--black': '#2e2b29',
  '--black-contrast': '#110f0e',
  '--gray-1': 'rgba(61, 37, 20, .05)',
  '--gray-2': 'rgba(61, 37, 20, .08)',
  '--gray-3': 'rgba(61, 37, 20, .12)',
  '--gray-4': 'rgba(53, 38, 28, .3)',
  '--gray-5': 'rgba(28, 25, 23, .6)',
  '--green': '#22c55e',
  '--purple': '#6a00f5',
  '--purple-contrast': '#5800cc',
  '--purple-light': 'rgba(88, 5, 255, .05)',
  '--yellow-contrast': '#facc15',
  '--yellow': 'rgba(250, 204, 21, .4)',
  '--yellow-light': '#fffae5',
  '--red': '#ff5c33',
  '--red-light': '#ffebe5',
  '--shadow': `0px 12px 33px 0px rgba(0, 0, 0, .06),
               0px 3.618px 9.949px 0px rgba(0, 0, 0, .04)`,
};

export const EditableHtml = (props) => {
  const { showParagraphs, separateParagraphs } = props.pluginProps || {};
  const [pendingImages, setPendingImages] = useState([]);
  const [scheduled, setScheduled] = useState(false);
  const { toolbarOpts } = props;

  const toolbarOptsToUse = {
    ...defaultToolbarOpts,
    ...toolbarOpts,
  };

  const activePluginsToUse = useMemo(() => {
    let { customPlugins, ...otherPluginProps } = props.pluginProps || {};

    customPlugins = customPlugins || [];

    const filteredActivePlugins = (props.activePlugins || DEFAULT_ACTIVE_PLUGINS)?.filter((pluginName) => {
      const nameToUse = PLUGINS_MAP[pluginName] || pluginName;
      const pluginInfo = otherPluginProps[nameToUse] || {};

      return !pluginInfo || !pluginInfo.disabled;
    });

    return buildExtensions(filteredActivePlugins, customPlugins, {
      math: {},
      textAlign: props.textAlign,
      html: {},
      extraCSSRules: props.extraCSSRules || {},
      image: {
        ...props.imageSupport,
      },
      toolbar: {},
      table: {},
      responseArea: {
        type: props.responseAreaProps?.type,
      },
      languageCharacters: props.languageCharactersProps,
      keyPadCharacterRef: {},
      setKeypadInteraction: {},
      media: {},
    });
  }, [props]);

  const extensions = [
    TextStyleKit,
    CharacterCount.configure({
      limit: props.charactersLimit || 1000000,
    }),
    StarterKit.configure({
      trailingNode: {
        node: 'paragraph',
        notAfter: ['paragraph', 'div'],
      },
    }),
    DivNode,
    Placeholder.configure({
      placeholder: props.placeholder,
      // show placeholder even when editor is focused
      showOnlyWhenEditable: true,
      showOnlyCurrent: false, // show on all empty nodes, not only the current one
      includeChildren: true,
    }),
    ExtendedTable,
    TableRow,
    TableHeader,
    TableCell,
    ResponseAreaExtension.configure(props.responseAreaProps),
    ExplicitConstructedResponseNode.configure(props.responseAreaProps),
    DragInTheBlankNode.configure(props.responseAreaProps),
    InlineDropdownNode.configure(props.responseAreaProps),
    MathTemplatedNode.configure(props.responseAreaProps),
    MathNode.configure({
      toolbarOpts: toolbarOptsToUse,
    }),
    SubScript,
    SuperScript,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'right', 'center'],
    }),
    Image,
    ImageUploadNode.configure({
      toolbarOpts: toolbarOptsToUse,
      imageHandling: {
        disableImageAlignmentButtons: props.disableImageAlignmentButtons,
        onDone: () => props.onDone?.(editor.getHTML()),
        onDelete:
          props.imageSupport &&
          props.imageSupport.delete &&
          ((node) => {
            const { src } = node.attrs;

            props.imageSupport.delete(src, (e) => {
              const newPendingImages = pendingImages.filter((img) => img.key !== node.key);
              const newState = {
                pendingImages: newPendingImages,
                scheduled: scheduled && newPendingImages.length === 0 ? false : scheduled,
              };

              setPendingImages(newState.pendingImages);
              setScheduled(newState.scheduled);
            });
          }),
        insertImageRequested:
          props.imageSupport &&
          ((addedImage, getHandler) => {
            const onFinish = (result) => {
              let cb;

              if (scheduled && result) {
                // finish editing only on success
                cb = props.onChange;
              }

              const newPendingImages = pendingImages.filter((img) => img.key !== addedImage.key);
              const newState = {
                pendingImages: newPendingImages,
              };

              if (newPendingImages.length === 0) {
                newState.scheduled = false;
              }

              setPendingImages(newState.pendingImages);
              setScheduled(newState.scheduled);
              cb?.(editor.getHTML());
            };
            const callback = () => {
              /**
               * The handler is the object through which the outer context
               * communicates file upload events like: fileChosen, cancel, progress
               */
              const handler = getHandler(onFinish);
              props.imageSupport.add(handler);
            };

            setPendingImages([...pendingImages, addedImage]);
            callback();
          }),
        maxImageWidth: props.maxImageWidth,
        maxImageHeight: props.maxImageHeight,
      },
      limit: 3,
    }),
    Media.configure({
      uploadSoundSupport: props.uploadSoundSupport,
    }),
    CSSMark.configure({
      extraCSSRules: props.extraCSSRules,
    }),
  ];

  const editor = useEditor(
    {
      extensions,
      immediatelyRender: false,
      editorProps: {
        handleKeyDown(view, event) {
          if (props.onKeyDown) {
            return props.onKeyDown(event);
          }

          // Return false to let default behavior continue
          return false;
        },
      },
      editable: !props.disabled,
      content: normalizeInitialMarkup(props.markup),
      onUpdate: ({ editor, transaction }) => {
        if (transaction.isDone) {
          props.onChange?.(editor.getHTML());
        }
      },
      onBlur: debounce(({ editor }) => {
        const otherToolbarOpened =
          editor._toolbarOpened ||
          editor.isActive('inline_dropdown') ||
          editor.isActive('explicit_constructed_response');

        if (otherToolbarOpened) {
          return;
        }

        if (props.markup !== editor.getHTML()) {
          props.onChange?.(editor.getHTML());
        }

        if (toolbarOptsToUse.doneOn === 'blur') {
          props.onDone?.(editor.getHTML());
        }
      }, 200),
    },
    [props.charactersLimit],
  );

  useEffect(() => {
    if (props.editorRef) {
      props.editorRef(editor);
    }
  }, [props.editorRef, editor]);

  useEffect(() => {
    editor?.setEditable(!props.disabled);
  }, [props.disabled, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }
    const nextMarkup = normalizeInitialMarkup(props.markup);

    if (nextMarkup !== editor.getHTML()) {
      editor.commands.setContent(nextMarkup, false);
    }
  }, [props.markup, editor]);

  useEffect(() => {
    Object.entries(cssVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, []);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isFocused: ctx.editor?.isFocused,
    }),
  });

  const sizeStyle = useMemo(() => {
    const { minWidth, width, maxWidth, minHeight, height, maxHeight } = props;

    return {
      width: valueToSize(width),
      minWidth: valueToSize(minWidth),
      maxWidth: valueToSize(maxWidth),
      height: valueToSize(height),
      minHeight: valueToSize(minHeight),
      maxHeight: valueToSize(maxHeight),
    };
  }, [props]);

  return (
    <EditorContainer
      {...{
        ...props,
        activePlugins: activePluginsToUse,
        toolbarOpts: toolbarOptsToUse,
      }}
      editorState={editorState}
      editor={editor}
    >
      {editor && (
        <StyledEditorContent
          style={{
            minHeight: sizeStyle.minHeight,
            height: sizeStyle.height,
            maxHeight: sizeStyle.maxHeight,
          }}
          showParagraph={showParagraphs && !showParagraphs.disabled}
          separateParagraph={separateParagraphs && !separateParagraphs.disabled}
          editor={editor}
        />
      )}
    </EditorContainer>
  );
};

const StyledEditorContent = styled(EditorContent, {
  shouldForwardProp: (prop) => !['showParagraph', 'separateParagraph'].includes(prop),
})(({ showParagraph, separateParagraph }) => ({
  display: 'flex',
  outline: 'none !important',
  '& .ProseMirror': {
    flex: 1,
    padding: '5px',
    maxHeight: '500px',
    outline: 'none !important',
    position: 'initial',

    // reset default margins for all block paragraphs/divs in the editor
    '& > p, & > div': {
      margin: '0',
    },

    '& p.is-editor-empty:first-child::before, & div.is-editor-empty:first-child::before': {
      content: 'attr(data-placeholder)',
      float: 'left',
      height: 0,
      color: '#9CA3AF',
      pointerEvents: 'none',
      whiteSpace: 'pre-wrap',
    },

    ...(showParagraph && {
      '& > p:has(+ p)::after, & > div:has(+ div)::after': {
        display: 'block',
        content: '"¶"',
        fontSize: '1em',
        color: '#146EB3',
      },
    }),
    ...(separateParagraph && {
      '& > div:has(+ div)': {
        marginBottom: '1em',
      },
    }),
  },
}));

export default EditableHtml;
