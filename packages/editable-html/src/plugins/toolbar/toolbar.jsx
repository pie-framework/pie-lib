import { DoneButton } from './done-button';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import SlatePropTypes from 'slate-prop-types';

import { findSingleNode, findParentNode } from '../utils';
import { withStyles } from '@material-ui/core/styles';
import DefaultToolbar from './default-toolbar';
const log = debug('@pie-lib:editable-html:plugins:toolbar');

export class Toolbar extends React.Component {
  static propTypes = {
    zIndex: PropTypes.number,
    value: SlatePropTypes.value.isRequired,
    plugins: PropTypes.array,
    onImageClick: PropTypes.func,
    onDone: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    isFocused: PropTypes.bool,
    autoWidth: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    pluginProps: PropTypes.object,
    toolbarOpts: PropTypes.shape({
      position: PropTypes.oneOf(['bottom', 'top']),
      alwaysVisible: PropTypes.bool
    })
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

    const CustomToolbar =
      plugin && plugin.toolbar && plugin.toolbar.customToolbar
        ? plugin.toolbar.customToolbar(node, value, handleDone)
        : null;
    const filteredPlugins =
      plugin && plugin.filterPlugins ? plugin.filterPlugins(node, plugins) : plugins;

    log('[render] CustomToolbar: ', CustomToolbar);
    const parentExtraStyles =
      parentPlugin && parentPlugin.pluginStyles
        ? parentPlugin.pluginStyles(parentNode, plugin)
        : {};
    const pluginExtraStyles =
      plugin && plugin.pluginStyles ? plugin.pluginStyles(parentNode, plugin) : {};
    const extraStyles = {
      ...pluginExtraStyles,
      ...parentExtraStyles
    };

    const names = classNames(classes.toolbar, {
      [classes.toolbarTop]: toolbarOpts.position === 'top',
      [classes.focused]: toolbarOpts.alwaysVisible || isFocused,
      [classes.autoWidth]: autoWidth,
      [classes.fullWidth]: !autoWidth
    });

    const deletable = node && plugin && plugin.deleteNode;
    const showDone =
      node && plugin && plugin.toolbar && plugin.toolbar.showDone && !toolbarOpts.alwaysVisible;

    return (
      <div className={names} style={extraStyles} onClick={this.onClick}>
        {CustomToolbar ? (
          <CustomToolbar />
        ) : (
          <DefaultToolbar
            plugins={filteredPlugins}
            pluginProps={pluginProps}
            value={value}
            onChange={onChange}
            onDone={handleDone}
          />
        )}

        <div className={classes.shared}>
          {deletable && (
            <IconButton
              aria-label="Delete"
              style={{ width: '28px', height: '28px' }}
              className={classes.iconRoot}
              onClick={e => plugin.deleteNode(e, node, value, onChange)}
              classes={{
                root: classes.iconRoot
              }}
            >
              <Delete />
            </IconButton>
          )}
          {showDone && <DoneButton onClick={handleDone} />}
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
    margin: '5px 0 0 0',
    padding: '2px',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    boxSizing: 'border-box',
    display: 'none'
  },
  toolbarTop: {
    top: '-45px'
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
    height: '28px'
  },
  label: {
    color: 'var(--editable-html-toolbar-check, #00bb00)'
  }
};
export default withStyles(style, { index: 1000 })(Toolbar);
