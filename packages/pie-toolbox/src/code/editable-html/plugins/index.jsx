import { Editor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';

import Bold from '@material-ui/icons/FormatBold';
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
import MarkHotkey from './hotKeys';
import HtmlPlugin from './html';

const log = debug('@pie-lib:editable-html:plugins');

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
  'table',
  'video',
  'audio',
  'responseArea',
];

export const DEFAULT_PLUGINS = ALL_PLUGINS.filter((plug) => plug !== 'responseArea');

export const buildPlugins = (activePlugins, opts) => {
  log('[buildPlugins] opts: ', opts);

  activePlugins = activePlugins || DEFAULT_PLUGINS;

  const addIf = (key, p) => activePlugins.includes(key) && p;
  const imagePlugin = opts.image && opts.image.onDelete && ImagePlugin(opts.image);
  const mathPlugin = MathPlugin(opts.math);
  const respAreaPlugin =
    opts.responseArea && opts.responseArea.type && RespAreaPlugin(opts.responseArea, compact([mathPlugin]));

  return compact([
    addIf('table', TablePlugin(opts.table, compact([imagePlugin, mathPlugin, respAreaPlugin]))),
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
    ...opts.languageCharacters.map((config) => addIf('languageCharacters', CharactersPlugin(config))),
    addIf('bulleted-list', List({ key: 'l', type: 'ul_list', icon: <BulletedListIcon /> })),
    addIf('numbered-list', List({ key: 'n', type: 'ol_list', icon: <NumberedListIcon /> })),
    ToolbarPlugin(opts.toolbar),
    SoftBreakPlugin({ shift: true }),
    addIf('responseArea', respAreaPlugin),
    addIf('html', HtmlPlugin(opts.html)),
  ]);
};

export const withPlugins = (editor, activePlugins) => {
  editor = withHistory(withReact(editor));

  editor.continueNormalization = () => {
    Editor.setNormalizing(editor, true);
    Editor.normalize(editor, { force: true });
  };

  activePlugins.forEach((plugin) => {
    if (typeof plugin.rules === 'function') {
      plugin.rules(editor);
    }
  });

  return editor;
};
