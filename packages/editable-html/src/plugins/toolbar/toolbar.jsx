import { Button, MarkButton } from './toolbar-buttons';

import Check from '@material-ui/icons/Check';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import SlatePropTypes from 'slate-prop-types';

import { findSingleNode, hasBlock, hasMark } from '../utils';
import { withStyles } from '@material-ui/core/styles';

const log = debug('pie-elements:editable-html:plugins:toolbar');

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

const DefaultToolbar = ({ plugins, value, onChange }) => {
  const toolbarPlugins = plugins.filter(p => p.toolbar).map(p => p.toolbar);
  return (
    <div>
      {toolbarPlugins.map((p, index) => {
        return (
          <ToolbarButton {...p} key={index} value={value} onChange={onChange} />
        );
      })}
    </div>
  );
};

DefaultToolbar.propTypes = {
  plugins: PropTypes.array.isRequired,
  value: SlatePropTypes.value.isRequired,
  onChange: PropTypes.func.isRequired
};

export class Toolbar extends React.Component {
  static propTypes = {
    zIndex: PropTypes.number,
    value: SlatePropTypes.value.isRequired,
    plugins: PropTypes.array,
    onImageClick: PropTypes.func,
    onDone: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    isFocused: PropTypes.bool,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
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
    const { classes, onDone, plugins, value, onChange, isFocused } = this.props;

    const node = findSingleNode(value);

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

    const CustomToolbar =
      plugin && plugin.toolbar && plugin.toolbar.customToolbar
        ? plugin.toolbar.customToolbar(node)
        : null;

    log('[render] CustomToolbar: ', CustomToolbar);

    const names = classNames(classes.toolbar, isFocused && classes.focused);

    const doneFn = this.onButtonClick(onDone);

    const deletable = node && plugin && plugin.deleteNode;

    return (
      <div className={names} onClick={this.onClick}>
        {CustomToolbar ? (
          <CustomToolbar value={value} onChange={onChange} node={node} />
        ) : (
          <DefaultToolbar plugins={plugins} value={value} onChange={onChange} />
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
          <IconButton
            aria-label="Done"
            style={{ width: '28px', height: '28px' }}
            className={classes.iconRoot}
            onClick={
              plugin && plugin.onDone
                ? e => plugin.onDone(e, node, value, onChange, doneFn)
                : doneFn
            }
            classes={{
              label: classes.label,
              root: classes.iconRoot
            }}
          >
            <Check />
          </IconButton>
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
    width: '100%',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    boxSizing: 'border-box',
    display: 'none'
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
