import React, { useEffect } from 'react';
import { Change, Editor, Element as SlateElement, Text, Node } from 'slate';
import { useSlate, useSlateSelection } from 'slate-react';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debug from 'debug';
import debounce from 'lodash/debounce';

import { DoneButton } from './done-button';

import { withStyles } from '@material-ui/core/styles';
import DefaultToolbar from './default-toolbar';
import { removeDialogs as removeCharacterDialogs } from '../characters';

const log = debug('@pie-lib:editable-html:plugins:toolbar');

const getCustomToolbar = (plugin, node, nodePath, editor, handleDone) => {
  if (!plugin) {
    return;
  }
  if (!plugin.toolbar) {
    return;
  }
  if (plugin.toolbar.CustomToolbarComp) {
    /**
     * Using a pre-defined Component should be preferred
     * as the rendering of it (and it's children) can be optimized by React.
     * If you keep re-defining the comp with an inline function
     * then react will have to re-render.
     */
    return plugin.toolbar.CustomToolbarComp;
  } else if (typeof plugin.toolbar.customToolbar === 'function') {
    log('deprecated - use CustomToolbarComp');
    return plugin.toolbar.customToolbar(node, nodePath, editor, handleDone);
  }
};

const style = {
  toolbar: {
    position: 'absolute',
    zIndex: 10,
    cursor: 'pointer',
    justifyContent: 'space-between',
    background: 'var(--editable-html-toolbar-bg, #efefef)',
    minWidth: '280px',
    margin: '5px 0 0 0',
    padding: '2px',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    boxSizing: 'border-box',
    display: 'none',
  },
  toolbarWithNoDone: {
    minWidth: '265px',
  },
  toolbarTop: {
    top: '-45px',
  },
  toolbarRight: {
    right: 0,
  },
  fullWidth: {
    width: '100%',
  },
  autoWidth: {
    width: 'auto',
  },
  focused: {
    display: 'flex',
  },
  iconRoot: {
    width: '28px',
    height: '28px',
    padding: '4px',
    verticalAlign: 'top',
  },
  label: {
    color: 'var(--editable-html-toolbar-check, #00bb00)',
  },
  shared: {
    display: 'flex',
  },
};

export const Toolbar = (props) => {
  useEffect(() => {
    return () => removeCharacterDialogs();
  }, []);

  const hasMark = (type) => {
    const { value } = props;
    return value.marks.some((mark) => mark.type === type);
  };

  const hasBlock = (type) => {
    const { value } = props;
    return value.blocks.some((node) => node.type === type);
  };

  const onToggle = (plugin) => {
    const { value, onChange } = props;

    if (!plugin.onToggle) return;

    const change = plugin.onToggle(value.change());
    onChange(change);
  };

  const onClick = (e) => {
    log('[onClick]');
    e.preventDefault();
  };

  const onButtonClick = (fn) => {
    return (e) => {
      e.preventDefault();
      fn();
    };
  };

  const onToolbarDone = (editor, finishEditing) => {
    log('[onToolbarDone] change: ', editor, 'finishEditing: ', finishEditing);
    const { onChange, onDone } = props;

    if (editor) {
      onChange(editor, () => {
        if (finishEditing) {
          onDone();
        }
      });
    } else {
      if (finishEditing) {
        log('[onToolbarChange] call onDone');
        onDone();
      }
    }
  };

  const onDeleteClick = debounce(
    (e, plugin, node, nodePath, editor, onChange) => plugin.deleteNode(e, node, nodePath, editor, onChange),
    500,
  );

  const onDeleteMouseDown = (e) => {
    e.persist();
    onDeleteClick(e, plugin, node, nodePath, editor, onChange);
  };

  const {
    classes,
    plugins,
    pluginProps,
    toolbarOpts,
    value,
    autoWidth,
    onChange,
    getFocusedValue,
    isFocused,
    onDone,
    toolbarRef,
  } = props;

  const editor = useSlate();
  const selection = useSlateSelection();
  const getNode = (editor, selection, depth) => {
    if (!selection) {
      return null;
    }

    // this means we have selected text
    if (selection.anchor.offset !== selection.focus.offset) {
      return null;
    }

    const [node, path] = Editor.node(editor, selection, depth ? { depth } : undefined);

    if (!node) {
      return null;
    }

    if (!Text.isText(node)) {
      return [node, path];
    }

    return getNode(editor, selection, path.length - 1);
  };
  const getParentNode = (editor, path) => Array.isArray(path) && path.length > 0 && Editor.parent(editor, path);

  const [node, nodePath] = getNode(editor, selection) || [];
  const [parentNode] = getParentNode(editor, nodePath) || [];

  log(' --------------> [render] node: ', node);
  log('[render] node: ', node);

  const plugin = plugins.find((p) => {
    if (!node) {
      return;
    }

    if (p.toolbar) {
      return p.supports && p.supports(node, editor, value);
    }
  });
  const parentPlugin = plugins.find((p) => {
    if (!parentNode) {
      return;
    }

    if (p.toolbar) {
      return p.supports && p.supports(parentNode, editor, value);
    }
  });

  log('[render] plugin: ', plugin);

  const handleDone = (done) => {
    const isDone = done ? editor : null;
    let handler = onDone;

    if (plugin && plugin.toolbar && plugin.toolbar.customToolbar) {
      handler = onToolbarDone;
    }

    if (isDone) {
      editor.selection = null;
    }

    handler(isDone);

    if (parentPlugin && parentPlugin.handleDone) {
      parentPlugin.handleDone(isDone, node, plugin);
    }
  };

  const CustomToolbar =
    getCustomToolbar(plugin, node, nodePath, editor, handleDone) ||
    getCustomToolbar(parentPlugin, node, nodePath, editor, handleDone);

  const filteredPlugins = plugin && plugin.filterPlugins ? plugin.filterPlugins(node, plugins) : plugins;

  log('[render] CustomToolbar: ', CustomToolbar);
  const parentExtraStyles =
    parentPlugin && parentPlugin.pluginStyles ? parentPlugin.pluginStyles(node, parentNode, plugin) : {};
  const pluginExtraStyles = plugin && plugin.pluginStyles ? plugin.pluginStyles(node, parentNode, plugin) : {};
  const extraStyles = {
    ...pluginExtraStyles,
    ...parentExtraStyles,
  };

  const deletable = node && plugin && typeof plugin.deleteNode === 'function';
  const customToolbarShowDone =
    node && plugin && plugin.toolbar && plugin.toolbar.showDone && !toolbarOpts.alwaysVisible;

  // If there is a toolbarOpts we check if the showDone is not equal to false
  const defaultToolbarShowDone = !toolbarOpts || toolbarOpts.showDone !== false;

  const hasDoneButton = defaultToolbarShowDone || customToolbarShowDone;

  const names = classNames(classes.toolbar, {
    [classes.toolbarWithNoDone]: !hasDoneButton,
    [classes.toolbarTop]: toolbarOpts.position === 'top',
    [classes.toolbarRight]: toolbarOpts.alignment === 'right',
    [classes.focused]: toolbarOpts.alwaysVisible || isFocused,
    [classes.autoWidth]: autoWidth,
    [classes.fullWidth]: !autoWidth,
  });

  return (
    <div className={names} style={extraStyles} onClick={onClick} ref={toolbarRef}>
      {CustomToolbar ? (
        <CustomToolbar
          editor={editor}
          node={node}
          nodePath={nodePath}
          value={value}
          onToolbarDone={onToolbarDone}
          pluginProps={pluginProps}
        />
      ) : (
        <DefaultToolbar
          editor={editor}
          nodePath={nodePath}
          plugins={filteredPlugins}
          pluginProps={pluginProps}
          value={value}
          onChange={onChange}
          getFocusedValue={getFocusedValue}
          showDone={defaultToolbarShowDone}
          onDone={handleDone}
          deletable={deletable}
        />
      )}

      <div className={classes.shared}>
        {deletable && (
          <IconButton
            aria-label="Delete"
            className={classes.iconRoot}
            onMouseDown={(e) => onDeleteMouseDown(e)}
            classes={{
              root: classes.iconRoot,
            }}
          >
            <Delete />
          </IconButton>
        )}
        {customToolbarShowDone && <DoneButton onClick={handleDone} />}
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  editor: PropTypes.object.isRequired,
  zIndex: PropTypes.number,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      children: PropTypes.array,
      data: PropTypes.object,
    }),
  ),
  plugins: PropTypes.array,
  plugin: PropTypes.object,
  onImageClick: PropTypes.func,
  onDone: PropTypes.func.isRequired,
  toolbarRef: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  isFocused: PropTypes.bool,
  autoWidth: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  getFocusedValue: PropTypes.func.isRequired,
  pluginProps: PropTypes.object,
  toolbarOpts: PropTypes.shape({
    position: PropTypes.oneOf(['bottom', 'top']),
    alignment: PropTypes.oneOf(['left', 'right']),
    alwaysVisible: PropTypes.bool,
    ref: PropTypes.func,
    showDone: PropTypes.bool,
  }),
};

export default withStyles(style, { index: 1000 })(Toolbar);
