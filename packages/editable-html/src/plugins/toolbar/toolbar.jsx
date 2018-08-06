import { Button, MarkButton } from './toolbar-buttons';
import { DoneButton } from './done-button';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import SlatePropTypes from 'slate-prop-types';

import { findSingleNode, hasBlock, hasMark } from '../utils';
import { withStyles } from '@material-ui/core/styles';

const log = debug('editable-html:plugins:toolbar');

const ToolbarButton = props => {
  const onToggle = () => {
    const c = props.onToggle(props.value.change(), props);
    props.onChange(c);
  };

  if (props.isMark) {
    const isActive = hasMark(props.value, props.type);
    log('[ToolbarButton] mark:isActive: ', isActive);
    return (
      <MarkButton
        active={isActive}
        label={props.type}
        onToggle={onToggle}
        mark={props.type}
      >
        {props.icon}
      </MarkButton>
    );
  } else {
    const isActive = props.isActive
      ? props.isActive(props.value, props.type)
      : hasBlock(props.value, props.type);
    log('[ToolbarButton] block:isActive: ', isActive);
    return (
      <Button
        onClick={() => props.onClick(props.value, props.onChange)}
        active={isActive}
      >
        {props.icon}
      </Button>
    );
  }
};

const RawDefaultToolbar = ({ plugins, value, onChange, onDone, classes }) => {
  const toolbarPlugins = plugins.filter(p => p.toolbar).map(p => p.toolbar);
  return (
    <div className={classes.defaultToolbar}>
      <div>
        {toolbarPlugins.map((p, index) => {
          return (
            <ToolbarButton
              {...p}
              key={index}
              value={value}
              onChange={onChange}
            />
          );
        })}
      </div>
      <DoneButton onClick={onDone} />
    </div>
  );
};

RawDefaultToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  plugins: PropTypes.array.isRequired,
  value: SlatePropTypes.value.isRequired,
  onChange: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired
};

const toolbarStyles = () => ({
  defaultToolbar: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  }
});

const DefaultToolbar = withStyles(toolbarStyles)(RawDefaultToolbar);

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
    onChange: PropTypes.func.isRequired
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

  render() {
    const { classes, plugins, value, autoWidth, onChange, isFocused, onDone } = this.props;

    const node = findSingleNode(value);

    log(' --------------> [render] node: ', node);
    log('[render] node: ', node);

    const plugin = plugins.find(p => {
      if (!node) {
        return;
      }

      if (p.toolbar) {
        return p.toolbar.supports && p.toolbar.supports(node);
      }
    });

    log('[render] plugin: ', plugin);

    const toolbarChangeHandler = callOnDone => (key, update) => {
      log('[toolbarChangeHandler] node update: key:', key, 'node: ', update);
      if (!plugin.toolbar.applyChange) {
        throw new Error(
          'if you have a custom toolbar you must supply "plugin.toolbar.applyChange(key, data, value: Slate.Value): Slate.Change"'
        );
      }
      const pluginChange = plugin.toolbar.applyChange(key, update, value);
      if (pluginChange) {
        log('[toolbarChangeHandler] trigger onChange...', pluginChange.value);
        onChange(pluginChange, () => {
          if (callOnDone) {
            onDone();
          }
        });
      }
    };

    const CustomToolbar =
      plugin && plugin.toolbar && plugin.toolbar.customToolbar
        ? plugin.toolbar.customToolbar(
            node,
            toolbarChangeHandler(true),
            toolbarChangeHandler(false)
          )
        : null;

    log('[render] CustomToolbar: ', CustomToolbar);

    const names = classNames(
      classes.toolbar,
      autoWidth ? classes.autoWidth : classes.fullWidth,
      isFocused && classes.focused
    );

    const deletable = node && plugin && plugin.deleteNode;

    return (
      <div className={names} onClick={this.onClick}>
        {CustomToolbar ? (
          <CustomToolbar />
        ) : (
          <DefaultToolbar
            plugins={plugins}
            value={value}
            onChange={onChange}
            onDone={onDone}
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
    margin: '0px',
    padding: '2px',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    boxSizing: 'border-box',
    display: 'none'
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
