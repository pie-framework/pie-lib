import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { ExtendedTableCell, ExtendedTableHeader } from '../extensions/extended-table-cell';
import { DivNode } from '../extensions/div-node';
import { EnsureEmptyRootIsDiv } from '../extensions/ensure-empty-root-div';
import { EnsureListItemContentIsDiv } from '../extensions/ensure-list-item-content-is-div';
import { TableRow } from '@tiptap/extension-table-row';
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
import { ExtendedListItem } from '../extensions/extended-list-item';
import { HeadingParagraph } from '../extensions/heading-paragraph';

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

// ProseMirror puts these on the contenteditable element. Without them the browser
// spellchecks the editor regardless of the spellCheck prop.
const spellCheckAttributes = (enabled) => ({
  spellcheck: enabled ? 'true' : 'false',
  autocorrect: enabled ? 'on' : 'off',
  autocapitalize: enabled ? 'on' : 'off',
});

export const EditableHtml = (props) => {
  const { showParagraphs, separateParagraphs } = props.pluginProps || {};
  const [pendingImages, setPendingImages] = useState([]);
  const [scheduled, setScheduled] = useState(false);
  const { toolbarOpts } = props;

  const removePendingImage = useCallback(
    (imagePos) => {
      setPendingImages((prev) => {
        const next = prev.filter((img) => img.pos !== imagePos);
        if (next.length === 0) {
          setScheduled(false);
        }
        return next;
      });
    },
    [setPendingImages],
  );

  const toolbarOptsToUse = {
    ...defaultToolbarOpts,
    ...toolbarOpts,
  };

  const commitEditorContent = useCallback(
    (editor) => {
      const html = editor.getHTML();

      if (props.markup !== html) {
        props.onChange?.(html);
      }

      if (toolbarOptsToUse.doneOn === 'blur') {
        props.onDone?.(html);
      }
    },
    [props.markup, props.onChange, props.onDone, toolbarOptsToUse.doneOn],
  );

  const responseAreaPropsToUse = useMemo(
    () => ({
      ...defaultResponseAreaProps,
      ...props.responseAreaProps,
      onInlineDropdownToolbarClose: commitEditorContent,
    }),
    [props.responseAreaProps, commitEditorContent],
  );

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
        type: responseAreaPropsToUse.type,
      },
      languageCharacters: props.languageCharactersProps,
      keyPadCharacterRef: {},
      setKeypadInteraction: {},
      media: {},
    });
  }, [props, responseAreaPropsToUse.type]);

  const extensions = [
    TextAlign.configure({
      types: ['heading', 'paragraph', 'div', 'headingParagraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'th'],
      alignments: ['left', 'right', 'center', 'justify'],
    }),
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
    ExtendedListItem,
    DivNode,
    HeadingParagraph,
    EnsureEmptyRootIsDiv,
    EnsureListItemContentIsDiv,
    Placeholder.configure({
      placeholder: props.placeholder,
      // show placeholder even when editor is focused
      showOnlyWhenEditable: true,
      showOnlyCurrent: false, // show on all empty nodes, not only the current one
      includeChildren: true,
    }),
    ExtendedTable,
    TableRow,
    ExtendedTableHeader,
    ExtendedTableCell,
    ResponseAreaExtension.configure(responseAreaPropsToUse),
    ExplicitConstructedResponseNode.configure(responseAreaPropsToUse),
    DragInTheBlankNode.configure(responseAreaPropsToUse),
    InlineDropdownNode.configure(responseAreaPropsToUse),
    MathTemplatedNode.configure(responseAreaPropsToUse),
    MathNode.configure({
      toolbarOpts: toolbarOptsToUse,
      math: props.pluginProps?.math || {},
    }),
    SubScript,
    SuperScript,
    Image,
    ImageUploadNode.configure({
      toolbarOpts: toolbarOptsToUse,
      imageHandling: {
        disableImageAlignmentButtons: props.disableImageAlignmentButtons,
        onDone: (editor) => props.onDone?.(editor.getHTML()),
        onDelete:
          props.imageSupport &&
          props.imageSupport.delete &&
          ((node) => {
            const { src } = node.attrs;

            props.imageSupport.delete(src, (e) => {
              removePendingImage(node.pos);
            });
          }),
        insertImageRequested:
          props.imageSupport &&
          ((editor, imageInfo, getHandler) => {
            const [addedImage, pos] = imageInfo;

            const onFinish = (result) => {
              let cb;

              if (scheduled && result) {
              // finish editing only on success
                cb = props.onChange;
              }

              removePendingImage(pos);
              cb?.(editor.getHTML());
            };

            const callback = () => {
              /**
               * The handler is the object through which the outer context
               * communicates file upload events like: fileChosen, cancel, progress
               */
              const handler = getHandler(onFinish);

              // If the user closes the file picker without choosing a file, the window regains
              // focus while _insertingImage is still true — drop the stale pending entry.
              const focusHandler = debounce(() => {
                const detach = () => window.removeEventListener('focus', focusHandler);

                if (!editor._insertingImage) {
                  detach();
                  return;
                }

                removePendingImage(pos);
                editor._insertingImage = false;
                detach();
              }, 500);

              window.addEventListener('focus', focusHandler);

              props.imageSupport.add(handler);
            };

            editor._insertingImage = true;
            setPendingImages((prev) => [...prev, addedImage]);
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

  // Callers that don't pass spellCheck keep the browser default (on), as they did with the
  // slate-based editor. Players that have to default to off - extended-text-entry, see
  // PIE-978 - resolve that in their controller and pass an explicit false.
  const spellCheckEnabled = props.spellCheck !== false;

  const editor = useEditor(
    {
      extensions,
      immediatelyRender: false,
      editorProps: {
        attributes: spellCheckAttributes(spellCheckEnabled),
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
      onBlur: ({ editor }) => {
        const otherToolbarOpened =
          editor._insertingImage ||
          editor._toolbarOpened ||
          editor.isActive('inline_dropdown') ||
          editor.isActive('explicit_constructed_response');

        if (otherToolbarOpened || !editor.schema) {
          return;
        }

        commitEditorContent(editor);
      },
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

  // useEditor only re-applies options on its own when it is called with an empty dependency
  // array, and this call site depends on charactersLimit, so a spellCheck change on a mounted
  // editor has to be pushed in. Only the attributes are replaced - the rest of editorProps
  // stays as the editor already has it.
  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentEditorProps = editor.options?.editorProps;
    const attributes = spellCheckAttributes(spellCheckEnabled);

    if (currentEditorProps?.attributes?.spellcheck === attributes.spellcheck) {
      return;
    }

    editor.setOptions({ editorProps: { ...currentEditorProps, attributes } });
  }, [spellCheckEnabled, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }
    const nextMarkup = normalizeInitialMarkup(props.markup);

    if (nextMarkup !== editor.getHTML()) {
      editor.commands.setContent(nextMarkup, { emitUpdate: false });
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

    // Out of flow so the caret stays at the start of the block; in-flow ::before pushes the caret after the hint text.
    // :only-child ensures the placeholder is hidden whenever the editor has other content (images, upload nodes, etc.)
    // and covers the type+backspace edge case where Tiptap only adds is-empty (not is-editor-empty).
    '& p[data-placeholder].is-empty:only-child, & div[data-placeholder].is-empty:only-child': {
      position: 'relative',
    },
    '& p[data-placeholder].is-empty:only-child::before, & div[data-placeholder].is-empty:only-child::before': {
      content: 'attr(data-placeholder)',
      position: 'absolute',
      left: 0,
      top: 0,
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
      '& > p:has(+ p)': {
        marginBottom: '1em',
      },
    }),
  },
}));

export default EditableHtml;
