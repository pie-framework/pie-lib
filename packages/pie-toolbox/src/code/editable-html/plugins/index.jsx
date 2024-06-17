import Bold from '@material-ui/icons/FormatBold';
import FormatQuote from '@material-ui/icons/FormatQuote';
//import Code from '@material-ui/icons/Code';
import BulletedListIcon from '@material-ui/icons/FormatListBulleted';
import NumberedListIcon from '@material-ui/icons/FormatListNumbered';
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

function MarkHotkey(options) {
  const { type, key, icon, tag } = options;

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    toolbar: {
      isMark: true,
      type,
      icon,
      onToggle: (change) => {
        log('[onToggleMark] type: ', type);
        const { selection } = change.value;

        if (selection.anchorOffset === selection.focusOffset) {
          const textNode = change.value.document.getNode(selection.startKey);

          // select the whole line if there is no selection
          change.moveFocusTo(textNode.key, 0).moveAnchorTo(textNode.key, textNode.text.length);

          // remove toggle
          change.toggleMark(type);

          // move focus to end of text
          return change
            .moveFocusTo(textNode.key, textNode.text.length)
            .moveAnchorTo(textNode.key, textNode.text.length);
        }

        return change.toggleMark(type);
      },
    },
    renderMark(props) {
      if (props.mark.type === type) {
        const K = tag || type;

        return <K>{props.children}</K>;
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
  'table',
  'video',
  'audio',
  'responseArea',
];

export const DEFAULT_PLUGINS = ALL_PLUGINS.filter((plug) => plug !== 'responseArea');

export const buildPlugins = (activePlugins, customPlugins, opts) => {
  log('[buildPlugins] opts: ', opts);

  activePlugins = activePlugins || DEFAULT_PLUGINS;

  const addIf = (key, p) => activePlugins.includes(key) && p;

  const imagePlugin = opts.image && opts.image.onDelete && ImagePlugin(opts.image);
  const mathPlugin = MathPlugin(opts.math);
  const respAreaPlugin =
    opts.responseArea && opts.responseArea.type && RespAreaPlugin(opts.responseArea, compact([mathPlugin]));
  const languageCharactersPlugins = (opts?.languageCharacters || []).map((config) => CharactersPlugin(config));

  const tablePlugins = [imagePlugin, mathPlugin, ...languageCharactersPlugins];

  if (opts.responseArea && opts.responseArea.type === 'math-templated') {
    tablePlugins.push(respAreaPlugin);
  }

  const builtPlugins = compact([
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
    addIf('image', imagePlugin),
    addIf('video', MediaPlugin('video', opts.media)),
    addIf('audio', MediaPlugin('audio', opts.media)),
    addIf('math', mathPlugin),
    ...languageCharactersPlugins.map((plugin) => addIf('languageCharacters', plugin)),
    addIf(
      'blockquote',
      MarkHotkey({ key: 'blockquote', type: 'blockquote', icon: <FormatQuote />, tag: 'blockquote' }),
    ),
    addIf('bulleted-list', List({ key: 'l', type: 'ul_list', icon: <BulletedListIcon /> })),
    addIf('numbered-list', List({ key: 'n', type: 'ol_list', icon: <NumberedListIcon /> })),
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
