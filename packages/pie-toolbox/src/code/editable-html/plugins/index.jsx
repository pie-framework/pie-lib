import Hotkeys from 'slate-hotkeys';
import { IS_IOS } from 'slate-dev-environment';
import { Mark } from 'slate';
import Bold from '@material-ui/icons/FormatBold';
import FormatQuote from '@material-ui/icons/FormatQuote';
//import Code from '@material-ui/icons/Code';
import BulletedListIcon from '@material-ui/icons/FormatListBulleted';
import NumberedListIcon from '@material-ui/icons/FormatListNumbered';
import Redo from '@material-ui/icons/Redo';
import Undo from '@material-ui/icons/Undo';
import ImagePlugin from './image';
import MediaPlugin from './media';
import CharactersPlugin from './characters';
import Italic from '@material-ui/icons/FormatItalic';
import MathPlugin from './math';
import React from 'react';
import Strikethrough from '@material-ui/icons/FormatStrikethrough';
import ToolbarPlugin from './toolbar';
import Underline from '@material-ui/icons/FormatUnderlined';
import compact from 'lodash/compact';
import SoftBreakPlugin from 'slate-soft-break';
import debug from 'debug';
import List from './list';
import TablePlugin from './table';
import RespAreaPlugin from './respArea';
import HtmlPlugin from './html';
import CustomPlugin from './customPlugin';

const log = debug('@pie-lib:editable-html:plugins');

const HeadingIcon = () => (
  <svg
    width="30"
    height="28"
    viewBox="0 0 30 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '20px', height: '18px' }}
  >
    <path
      d="M27 4V24H29C29.5 24 30 24.5 30 25V27C30 27.5625 29.5 28 29 28H19C18.4375 28 18 27.5625 18 27V25C18 24.5 18.4375 24 19 24H21V16H9V24H11C11.5 24 12 24.5 12 25V27C12 27.5625 11.5 28 11 28H1C0.4375 28 0 27.5625 0 27V25C0 24.5 0.4375 24 1 24H3V4H1C0.4375 4 0 3.5625 0 3V1C0 0.5 0.4375 0 1 0H11C11.5 0 12 0.5 12 1V3C12 3.5625 11.5 4 11 4H9V12H21V4H19C18.4375 4 18 3.5625 18 3V1C18 0.5 18.4375 0 19 0H29C29.5 0 30 0.5 30 1V3C30 3.5625 29.5 4 29 4H27Z"
      fill="currentColor"
    />
  </svg>
);
const STYLES_MAP = {
  h3: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
  },
  blockquote: {
    background: '#f9f9f9',
    borderLeft: '5px solid #ccc',
    margin: '1.5em 10px',
    padding: '.5em 10px',
  },
};

function MarkHotkey(options) {
  const { type, key, icon, tag } = options;

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    name: type,
    toolbar: {
      isMark: true,
      type,
      icon,
      onToggle: (change) => {
        log('[onToggleMark] type: ', type);
        const { selection } = change.value;

        if (['blockquote', 'h3'].includes(type)) {
          const texts = change.value.document.getTextsAtRangeAsArray(selection);
          const onlyOneText = texts.length === 1;
          let hasMark = false;
          let sameMark = true;

          texts.forEach((t) => {
            const marks = t.getMarksAsArray();
            const markIsThere = marks.find((m) => m.type === type);

            if (!markIsThere) {
              // not all texts have this mark
              sameMark = false;
            } else {
              // at least one mark
              hasMark = true;
            }
          });

          const shouldContinue = onlyOneText || sameMark || !hasMark;

          if (!shouldContinue) {
            return change;
          }

          if (selection.startKey === selection.endKey && selection.anchorOffset === selection.focusOffset) {
            const textNode = change.value.document.getNode(selection.startKey);

            // select the whole line if there is no selection
            change.moveFocusTo(textNode.key, 0).moveAnchorTo(textNode.key, textNode.text.length);

            // remove toggle
            const hasMark = change.value.activeMarks.find((entry) => {
              return entry.type === type;
            });

            if (hasMark) {
              change.removeMark(hasMark);
            } else {
              const newMark = Mark.create(type);

              change.addMark(newMark);
            }

            // move focus to end of text
            return change
              .moveFocusTo(textNode.key, textNode.text.length)
              .moveAnchorTo(textNode.key, textNode.text.length);
          }
        }

        return change.toggleMark(type);
      },
    },
    renderMark(props) {
      if (props.mark.type === type) {
        const { data } = props.node || {};
        const jsonData = data?.toJSON() || {};
        const K = tag || type;
        const additionalStyles = STYLES_MAP[K];

        if (additionalStyles) {
          if (!jsonData.attributes) {
            jsonData.attributes = {};
          }

          jsonData.attributes.style = {
            ...jsonData.attributes.style,
            ...additionalStyles,
          };
        }

        return <K {...jsonData.attributes}>{props.children}</K>;
      }
    },
    onKeyDown(event, change) {
      // Check that the key pressed matches our `key` option.
      if (!event.metaKey || event.key != key) return;

      // Prevent the default characters from being inserted.
      event.preventDefault();

      // Toggle the mark `type`.
      change.toggleMark(type);
      return true;
    },
  };
}

export const ALL_PLUGINS = [
  'bold',
  // 'code',
  'html',
  'italic',
  'underline',
  'strikethrough',
  'bulleted-list',
  'numbered-list',
  'image',
  'math',
  'languageCharacters',
  'blockquote',
  'h3',
  'table',
  'video',
  'audio',
  'responseArea',
  'redo',
  'undo',
  'superscript',
  'subscript',
];

export const DEFAULT_PLUGINS = ALL_PLUGINS.filter((plug) => !['responseArea', 'h3', 'blockquote'].includes(plug));

const ICON_MAP = {
  undo: Undo,
  redo: Redo,
};
function UndoRedo(type) {
  const IconToUse = ICON_MAP[type];

  return {
    name: type,
    toolbar: {
      type,
      icon: <IconToUse />,
      onClick: (value, onChange) => {
        const change = value.change();

        onChange(change[type]());
      },
    },
  };
}

function EnterHandlingPlugin() {
  return {
    name: 'enterHandling',
    onKeyDown: (event, change) => {
      if (Hotkeys.isSplitBlock(event) && !IS_IOS) {
        if (change.value.isInVoid) {
          return change.collapseToStartOfNextText();
        }

        change.splitBlock();

        const range = change.value.selection;
        const newBlock = change.value.document.getClosestBlock(range.startKey);

        if (newBlock.type !== 'paragraph') {
          change.setNodeByKey(newBlock.key, {
            type: 'paragraph',
          });
        }

        return change;
      }

      return undefined;
    },
  };
}

export const buildPlugins = (activePlugins, customPlugins, opts) => {
  log('[buildPlugins] opts: ', opts);

  activePlugins = activePlugins || DEFAULT_PLUGINS;

  const addIf = (key, p) => activePlugins.includes(key) && p;

  const imagePlugin = opts.image && opts.image.onDelete && ImagePlugin(opts.image);
  const mathPlugin = MathPlugin(opts.math);
  const respAreaPlugin =
    opts.responseArea && opts.responseArea.type && RespAreaPlugin(opts.responseArea, compact([mathPlugin]));
  const languageCharactersPlugins = (opts?.languageCharacters || []).map((config) => CharactersPlugin(config));

  const tablePlugins = [imagePlugin, mathPlugin, respAreaPlugin, ...languageCharactersPlugins];

  if (opts.responseArea && opts.responseArea.type === 'math-templated') {
    tablePlugins.push(respAreaPlugin);
  }

  const builtPlugins = compact([
    EnterHandlingPlugin(),
    addIf('table', TablePlugin(opts.table, compact(tablePlugins))),
    addIf('bold', MarkHotkey({ key: 'b', type: 'bold', icon: <Bold />, tag: 'strong' })),
    // addIf('code', MarkHotkey({ key: '`', type: 'code', icon: <Code /> })),
    addIf('italic', MarkHotkey({ key: 'i', type: 'italic', icon: <Italic />, tag: 'em' })),
    addIf(
      'strikethrough',
      MarkHotkey({
        key: '~',
        type: 'strikethrough',
        icon: <Strikethrough />,
        tag: 'del',
      }),
    ),
    addIf('underline', MarkHotkey({ key: 'u', type: 'underline', icon: <Underline />, tag: 'u' })),
    // icon should be modifies accordingly
    addIf('superscript', MarkHotkey({ type: 'sup', icon: <Underline />, tag: 'sup' })),
    // icon should be modifies accordingly
    addIf('subscript', MarkHotkey({ type: 'sub', icon: <Underline />, tag: 'sub' })),
    addIf('image', imagePlugin),
    addIf('video', MediaPlugin('video', opts.media)),
    addIf('audio', MediaPlugin('audio', opts.media)),
    addIf('math', mathPlugin),
    ...languageCharactersPlugins.map((plugin) => addIf('languageCharacters', plugin)),
    addIf('blockquote', MarkHotkey({ key: 'q', type: 'blockquote', icon: <FormatQuote />, tag: 'blockquote' })),
    addIf('h3', MarkHotkey({ key: 'h3', type: 'h3', icon: <HeadingIcon />, tag: 'h3' })),
    addIf('bulleted-list', List({ key: 'l', type: 'ul_list', icon: <BulletedListIcon /> })),
    addIf('numbered-list', List({ key: 'n', type: 'ol_list', icon: <NumberedListIcon /> })),
    addIf('redo', UndoRedo('redo')),
    addIf('undo', UndoRedo('undo')),
    ToolbarPlugin(opts.toolbar),
    SoftBreakPlugin({ shift: true }),
    addIf('responseArea', respAreaPlugin),
    addIf('html', HtmlPlugin(opts.html)),
  ]);

  customPlugins.forEach((customPlugin) => {
    const { event, icon, iconType, iconAlt } = customPlugin || {};

    function isValidEventName(eventName) {
      // Check if eventName is a non-empty string
      if (typeof eventName !== 'string' || eventName.length === 0) {
        return false;
      }

      // Regular expression to match valid event names (only alphanumeric characters and underscore)
      const regex = /^[a-zA-Z0-9_]+$/;

      // Check if the eventName matches the regular expression
      return regex.test(eventName);
    }

    if (!isValidEventName(event)) {
      console.error(`The event name: ${event} is not a valid event name!`);
      return;
    }

    if (!icon && !iconType && !iconAlt) {
      console.error('Your custom button requires icon, iconType and iconAlt');
      return;
    }

    builtPlugins.push(CustomPlugin('custom-plugin', customPlugin));
  });

  return builtPlugins;
};
