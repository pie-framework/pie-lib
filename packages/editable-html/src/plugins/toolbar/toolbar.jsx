import { Button, MarkButton } from './toolbar-buttons';

import Bold from 'material-ui-icons/FormatBold';
import Check from 'material-ui-icons/Check';
import Code from 'material-ui-icons/Code';
import Delete from 'material-ui-icons/Delete';
import Functions from 'material-ui-icons/Functions';
import IconButton from 'material-ui/IconButton';
import Image from 'material-ui-icons/Image';
import Italic from 'material-ui-icons/FormatItalic';
import PropTypes from 'prop-types';
import React from 'react';
import Strikethrough from 'material-ui-icons/FormatStrikethrough';
import Underlined from 'material-ui-icons/FormatUnderlined';
import _ from 'lodash';
import classNames from 'classnames';
import debug from 'debug';
import { findSingleNode } from './utils';
//TODO: use mui createStyleSheet (ensures the class overrides work).
import injectSheet from 'react-jss';

const log = debug('editable-html:plugins:toolbar');

const toolbarStyle = {
  toolbar: {
    position: 'absolute',
    zIndex: 10,
    cursor: 'pointer',
    justifyContent: 'space-between',
    background: 'var(--editable-html-toolbar-bg, #efefef)',
    margin: '0px',
    padding: '2px',
    width: '100%',
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    boxSizing: 'border-box',
    display: 'none'
  },
  focused: {
    display: 'flex',
  },
  iconRoot: {
    width: '28px',
    height: '28px'
  },
  label: {
    color: 'var(--editable-html-toolbar-check, #00bb00)'
  }
}

const ToolbarButton = (props) => {

  const hasMark = (type) => {
    const { value } = props;
    return value.marks.some(mark => mark.type == type)
  }

  if (props.isMark) {
    const isActive = hasMark(props.type);
    return <MarkButton
      active={isActive}
      label={props.type}
      onToggle={() => {
        const c = props.onToggle(props.value.change())
        props.onChange(c);
      }}
      mark={props.type}
    >{props.icon}</MarkButton>
  } else {
    return <Button
      onClick={() => props.onClick(props.value, props.onChange)}>{props.icon}</Button>
  }
}

const RawDefaultToolbar = ({ plugins, value, onChange, classes }) => {
  const toolbarPlugins = plugins.filter(p => p.toolbar).map(p => p.toolbar);
  return (
    <div className={classes.inline}>
      {toolbarPlugins.map((p, index) => {
        return <ToolbarButton
          {...p}
          key={index}
          value={value}
          onChange={onChange} />
      })}
    </div>);
}

const DefaultToolbar = injectSheet(toolbarStyle)(RawDefaultToolbar);

export class RawToolbar extends React.Component {

  constructor(props) {
    super(props);
    this.hasMark = (type) => {
      const { value } = this.props;
      return value.marks.some(mark => mark.type == type)
    }

    this.hasBlock = (type) => {
      const { value } = this.props;
      return value.blocks.some(node => node.type == type)
    }
  }

  onToggle = (plugin) => {
    const { value, onChange } = this.props;

    if (!plugin.onToggle) return;

    const change = plugin.onToggle(value.change())
    onChange(change);
  }

  onClick = (e) => {
    log('[onClick]')
    e.preventDefault();
  }

  onButtonClick = (fn) => {
    return e => {
      e.preventDefault();
      fn();
    }
  }

  render() {
    const {
      classes,
      onDone,
      zIndex,
      onFocus,
      onBlur,
      plugins,
      value,
      onChange,
      isFocused,
      onClick } = this.props;

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

    const CustomToolbar = plugin && plugin.toolbar && plugin.toolbar.customToolbar ? plugin.toolbar.customToolbar(node) : null;

    log('[render] CustomToolbar: ', CustomToolbar);

    const style = zIndex ? { zIndex } : {};

    const names = classNames(classes.toolbar, isFocused && classes.focused)

    const doneFn = this.onButtonClick(onDone);

    const deletable = node && plugin && plugin.deleteNode;

    return (
      <div className={names}
        onClick={this.onClick}>
        {CustomToolbar ?
          <CustomToolbar
            value={value}
            onChange={onChange}
            node={node} /> :
          <DefaultToolbar
            plugins={plugins}
            value={value}
            onChange={onChange} />}

        <div className={classes.shared} >
          {deletable && <IconButton
            aria-label="Delete"
            style={{ width: '28px', height: '28px' }}
            className={classes.iconRoot}
            onClick={(e) => plugin.deleteNode(e, node, value, onChange)}
            classes={{
              root: classes.iconRoot
            }}>
            <Delete />
          </IconButton>}
          <IconButton
            aria-label="Done"
            style={{ width: '28px', height: '28px' }}
            className={classes.iconRoot}
            onClick={(plugin && plugin.onDone) ? (e) => plugin.onDone(e, node, value, onChange, doneFn) : doneFn}
            classes={{
              label: classes.label,
              root: classes.iconRoot
            }}>
            <Check />
          </IconButton>
        </div>
      </div >
    );
  }
}

RawToolbar.propTypes = {
  zIndex: PropTypes.number,
  value: PropTypes.object.isRequired,
  plugins: PropTypes.array,
  onImageClick: PropTypes.func,
  onDone: PropTypes.func.isRequired
}

export default injectSheet(_.clone(toolbarStyle), { index: 1000 })(RawToolbar);