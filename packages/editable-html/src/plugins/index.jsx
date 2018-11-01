import Bold from '@material-ui/icons/FormatBold';
import Code from '@material-ui/icons/Code';
import BulletedListIcon from '@material-ui/icons/FormatListBulleted';
import NumberedListIcon from '@material-ui/icons/FormatListNumbered';
import ImagePlugin from './image';
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

const log = debug('@pie-lib:editable-html:plugins');

function MarkHotkey(options) {
  const { type, key, icon, tag } = options;

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    toolbar: {
      isMark: true,
      type,
      icon,
      onToggle: change => {
        log('[onToggleMark] type: ', type);
        return change.toggleMark(type);
      }
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
    }
  };
}

export const DEFAULT_PLUGINS = [
  'bold',
  'code',
  'italic',
  'underline',
  'strikethrough',
  'bulleted-list',
  'numbered-list',
  'image',
  'math',
  'table'
];

export const buildPlugins = (activePlugins, opts) => {
  log('[buildPlugins] opts: ', opts);

  activePlugins = activePlugins || DEFAULT_PLUGINS;

  const addIf = (key, p) => activePlugins.includes(key) && p;
  const imagePlugin = opts.image && opts.image.onDelete && ImagePlugin(opts.image);
  const mathPlugin = MathPlugin(opts.math);

  return compact([
    addIf('table', TablePlugin(opts.table, imagePlugin, mathPlugin)),
    addIf(
      'bold',
      MarkHotkey({ key: 'b', type: 'bold', icon: <Bold />, tag: 'strong' })
    ),
    addIf('code', MarkHotkey({ key: '`', type: 'code', icon: <Code /> })),
    addIf(
      'italic',
      MarkHotkey({ key: 'i', type: 'italic', icon: <Italic />, tag: 'em' })
    ),
    addIf(
      'strikethrough',
      MarkHotkey({
        key: '~',
        type: 'strikethrough',
        icon: <Strikethrough />,
        tag: 'del'
      })
    ),
    addIf(
      'underline',
      MarkHotkey({ key: 'u', type: 'underline', icon: <Underline />, tag: 'u' })
    ),
    addIf(
      'image',
      imagePlugin
    ),
    addIf('math', mathPlugin),
    addIf(
      'bulleted-list',
      List({ key: 'l', type: 'ul_list', icon: <BulletedListIcon /> })
    ),
    addIf(
      'numbered-list',
      List({ key: 'n', type: 'ol_list', icon: <NumberedListIcon /> })
    ),
    ToolbarPlugin(opts.toolbar),
    SoftBreakPlugin()
  ]);
};
