import React from 'react';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:plugins');
export const ALL_PLUGINS = [
  'bold',
  // 'code',
  'html',
  'extraCSSRules',
  'italic',
  'underline',
  'strikethrough',
  'bulleted-list',
  'numbered-list',
  'image',
  'math',
  'languageCharacters',
  'text-align',
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

export const DEFAULT_EXTENSIONS = ALL_PLUGINS.filter((plug) => !['responseArea', 'h3', 'blockquote'].includes(plug));

export const buildExtensions = (activeExtensions, customExtensions, opts) => {
  log('[buildPlugins] opts: ', opts);

  activeExtensions = activeExtensions || DEFAULT_EXTENSIONS;

  const addIf = (key, shouldAdd = true) => activeExtensions.includes(key) && shouldAdd && key;

  const imagePlugin = opts.image && opts.image.onDelete;
  const mathPlugin = opts.math;
  const respAreaPlugin = opts.responseArea && opts.responseArea.type;
  const cssPlugin = !isEmpty(opts.extraCSSRules);

  const languageCharactersPlugins = opts?.languageCharacters || [];

  return compact([
    addIf('table'),
    addIf('bold'),
    // addIf('code', MarkHotkey({ key: '`', type: 'code', icon: <Code /> })),
    addIf('italic'),
    addIf('strikethrough'),
    addIf('underline'),
    // icon should be modifies accordingly
    addIf('superscript'),
    // icon should be modifies accordingly
    addIf('subscript'),
    addIf('image', !!imagePlugin),
    addIf('video'),
    addIf('audio'),
    addIf('math', !!mathPlugin),
    ...languageCharactersPlugins.map((plugin) => addIf('languageCharacters', plugin)),
    addIf('text-align'),
    addIf('blockquote'),
    addIf('h3'),
    addIf('bulleted-list'),
    addIf('numbered-list'),
    addIf('undo'),
    addIf('redo'),
    addIf('responseArea', !!respAreaPlugin),
    addIf('css', !!cssPlugin),
    addIf('html', !!opts.html),
  ]);
};
