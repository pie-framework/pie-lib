import { DoneButton } from './done-button';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import SlatePropTypes from 'slate-prop-types';
import debounce from 'lodash/debounce';

import { findSingleNode, findParentNode } from '../utils';
import { withStyles } from '@material-ui/core/styles';
import DefaultToolbar from './default-toolbar';

const log = debug('@pie-lib:editable-html:plugins:toolbar');

const getCustomToolbar = (plugin, node, value, handleDone, onDataChange) => {
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
    return plugin.toolbar.customToolbar(node, value, handleDone, onDataChange);
  }
};

export class Toolbar extends React.Component {
  static propTypes = {
    zIndex: PropTypes.number,
    value: SlatePropTypes.value.isRequired,
    plugins: PropTypes.array,
    plugin: PropTypes.object,
    onImageClick: PropTypes.func,
    onDone: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    isFocused: PropTypes.bool,
    autoWidth: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    pluginProps: PropTypes.object,
    toolbarOpts: PropTypes.shape({
      position: PropTypes.oneOf(['bottom', 'top']),
      alignment: PropTypes.oneOf(['left', 'right']),
      alwaysVisible: PropTypes.bool,
      showDone: PropTypes.bool
    }),
    onDataChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      change: null
    };
  }

  hasMark = type => {
    const { value } = this.props;
    return value.marks.some(mark => mark.type == type);
  };

  hasBlock = type => {
    const { value } = this.props;
    return value.blocks.some(node => node.type == type);
  };

  onToggle = plugin => {
    const { value, onChange } = this.props;

    if (!plugin.onToggle) return;

    const change = plugin.onToggle(value.change());
    onChange(change);
  };

  onClick = e => {
    log('[onClick]');
    e.preventDefault();
  };

  onButtonClick = fn => {
    return e => {
      e.preventDefault();
      fn();
    };
  };

  onToolbarDone = (change, finishEditing) => {
    log('[onToolbarDone] change: ', change, 'finishEditing: ', finishEditing);
    const { onChange, onDone } = this.props;

    if (change) {
      onChange(change, () => {
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

  onDeleteClick = debounce(
    (e, plugin, node, value, onChange) => plugin.deleteNode(e, node, value, onChange),
    500
  );

  onDeleteMouseDown = (e, plugin, node, value, onChange) => {
    e.persist();
    this.onDeleteClick(e, plugin, node, value, onChange);
  };

  render() {
    const {
      classes,
      plugins,
      pluginProps,
      toolbarOpts,
      value,
      autoWidth,
      onChange,
      isFocused,
      onDone
    } = this.props;

    const node = findSingleNode(value);
    const parentNode = findParentNode(value, node);

    log(' --------------> [render] node: ', node);
    log('[render] node: ', node);

    const plugin = plugins.find(p => {
      if (!node) {
        return;
      }

      if (p.toolbar) {
        return p.toolbar.supports && p.toolbar.supports(node, value);
      }
    });
    const parentPlugin = plugins.find(p => {
      if (!parentNode) {
        return;
      }

      if (p.toolbar) {
        return p.toolbar.supports && p.toolbar.supports(parentNode, value);
      }
    });

    log('[render] plugin: ', plugin);

    const handleDone = (change, done) => {
      let handler = onDone;

      if (plugin && plugin.toolbar && plugin.toolbar.customToolbar) {
        handler = this.onToolbarDone;
      }

      handler(change, done);

      if (parentPlugin && parentPlugin.handleDone) {
        parentPlugin.handleDone(value, node, plugin, onChange);
      }
    };

    const handleDataChange = (key, data) => {
      this.props.onDataChange(key, data);
    };

    const CustomToolbar = getCustomToolbar(
      plugin,
      node,
      value,
      handleDone,
      this.props.onDataChange
    );

    const filteredPlugins =
      plugin && plugin.filterPlugins ? plugin.filterPlugins(node, plugins) : plugins;

    log('[render] CustomToolbar: ', CustomToolbar);
    const parentExtraStyles =
      parentPlugin && parentPlugin.pluginStyles
        ? parentPlugin.pluginStyles(node, parentNode, plugin)
        : {};
    const pluginExtraStyles =
      plugin && plugin.pluginStyles ? plugin.pluginStyles(node, parentNode, plugin) : {};
    const extraStyles = {
      ...pluginExtraStyles,
      ...parentExtraStyles
    };

    const deletable = node && plugin && plugin.deleteNode;
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
      [classes.fullWidth]: !autoWidth
    });

    return (
      <div className={names} style={extraStyles} onClick={this.onClick}>
        {CustomToolbar ? (
          <CustomToolbar
            node={node}
            value={value}
            onToolbarDone={this.onToolbarDone}
            onDataChange={handleDataChange}
            pluginProps={pluginProps}
          />
        ) : (
          <DefaultToolbar
            plugins={filteredPlugins}
            pluginProps={pluginProps}
            value={value}
            onChange={onChange}
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
              onMouseDown={e => this.onDeleteMouseDown(e, plugin, node, value, onChange)}
              classes={{
                root: classes.iconRoot
              }}
            >
              <Delete />
            </IconButton>
          )}
          {customToolbarShowDone && <DoneButton onClick={handleDone} />}
        </div>
      </div>
    );
  }
}

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
    display: 'none'
  },
  toolbarWithNoDone: {
    minWidth: '265px'
  },
  toolbarTop: {
    top: '-45px'
  },
  toolbarRight: {
    right: 0
  },
  fullWidth: {
    width: '100%'
  },
  autoWidth: {
    width: 'auto'
  },
  focused: {
    display: 'flex'
  },
  iconRoot: {
    width: '28px',
    height: '28px',
    padding: '4px',
    verticalAlign: 'top'
  },
  label: {
    color: 'var(--editable-html-toolbar-check, #00bb00)'
  },
  shared: {
    display: 'flex'
  }
};
export default withStyles(style, { index: 1000 })(Toolbar);
