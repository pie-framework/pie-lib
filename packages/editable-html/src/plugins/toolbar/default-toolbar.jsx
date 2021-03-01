import { DoneButton } from './done-button';
import PropTypes from 'prop-types';
import React from 'react';
import SlatePropTypes from 'slate-prop-types';

import { hasBlock, hasMark } from '../utils';
import { withStyles } from '@material-ui/core/styles';

import { Button, MarkButton } from './toolbar-buttons';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:plugins:toolbar');

export const ToolbarButton = props => {
  const onToggle = () => {
    const c = props.onToggle(props.value.change(), props);
    props.onChange(c);
  };

  if (props.isMark) {
    const isActive = hasMark(props.value, props.type);
    log('[ToolbarButton] mark:isActive: ', isActive);
    return (
      <MarkButton active={isActive} label={props.type} onToggle={onToggle} mark={props.type}>
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
        active={isActive}
        onClick={() => props.onClick(props.value, props.onChange)}
        extraStyles={props.buttonStyles}
      >
        {props.icon}
      </Button>
    );
  }
};

const isActiveToolbarPlugin = props => plugin => {
  const isDisabled = (props[plugin.name] || {}).disabled;
  return plugin && plugin.toolbar && !isDisabled;
};

export const DefaultToolbar = ({
  plugins,
  pluginProps,
  value,
  onChange,
  onDone,
  classes,
  showDone,
  deletable
}) => {
  const filtered = plugins.filter(isActiveToolbarPlugin(pluginProps)).map(p => p.toolbar);

  return (
    <div className={classes.defaultToolbar}>
      <div className={classes.buttonsContainer}>
        {filtered.map((p, index) => {
          return <ToolbarButton {...p} key={index} value={value} onChange={onChange} />;
        })}
      </div>
      {showDone && !deletable && <DoneButton onClick={onDone} />}
    </div>
  );
};

DefaultToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  plugins: PropTypes.array.isRequired,
  pluginProps: PropTypes.object,
  value: SlatePropTypes.value.isRequired,
  onChange: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  showDone: PropTypes.bool,
  addArea: PropTypes.bool,
  deletable: PropTypes.bool
};

DefaultToolbar.defaultProps = {
  pluginProps: {}
};

const toolbarStyles = () => ({
  defaultToolbar: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  buttonsContainer: {
    alignItems: 'center',
    display: 'flex',
    width: '100%'
  }
});

export default withStyles(toolbarStyles)(DefaultToolbar);
