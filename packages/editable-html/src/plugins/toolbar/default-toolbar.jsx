import { DoneButton } from './done-button';
import PropTypes from 'prop-types';
import React from 'react';
import SlatePropTypes from 'slate-prop-types';

import { hasBlock, hasMark } from '../utils';
import { withStyles } from '@material-ui/core/styles';

import { Button, MarkButton } from './toolbar-buttons';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:plugins:toolbar');

export const ToolbarButton = (props) => {
  const onToggle = () => {
    const c = props.onToggle(props.value.change(), props);

    props.onChange(c);
  };

  if (props.isMark) {
    const isActive = hasMark(props.value, props.type);
    const fnToCall =
      props.type === 'css' ? () => props.onClick(props.value, props.onChange, props.getFocusedValue) : onToggle;

    log('[ToolbarButton] mark:isActive: ', isActive);

    let ariaLabel;

    if (props.type === 'sup') {
      ariaLabel = 'Superscript (marks text as superscripted)';
    } else if (props.type === 'sub') {
      ariaLabel = 'Subscript (marks text as subscripted)';
    } else {
      ariaLabel = props.type;
    }

    return (
      <MarkButton active={isActive} onToggle={fnToCall} mark={props.type} label={ariaLabel}>
        {props.icon}
      </MarkButton>
    );
  }

  const { disabled } = props;
  const isActive = props.isActive ? props.isActive(props.value, props.type) : hasBlock(props.value, props.type);

  log('[ToolbarButton] block:isActive: ', isActive);
  const newIcon = React.cloneElement(props.icon);

  return (
    <Button
      ariaLabel={props.ariaLabel}
      active={isActive}
      disabled={disabled}
      onClick={(event) => props.onClick(props.value, props.onChange, props.getFocusedValue, event)}
      extraStyles={props.buttonStyles}
    >
      {newIcon}
    </Button>
  );
};

ToolbarButton.propTypes = {
  buttonStyles: PropTypes.object,
  disabled: PropTypes.bool,
  icon: PropTypes.any,
  isActive: PropTypes.bool,
  isMark: PropTypes.bool,
  getFocusedValue: PropTypes.func,
  onToggle: PropTypes.func,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.object,
  ariaLabel: PropTypes.string,
};

const isActiveToolbarPlugin = (props) => (plugin) => {
  const isDisabled = (props[plugin.name] || {}).disabled;

  return plugin && plugin.toolbar && !isDisabled;
};

export const DefaultToolbar = ({
  plugins,
  pluginProps,
  value,
  onChange,
  getFocusedValue,
  onDone,
  classes,
  showDone,
  deletable,
  isHtmlMode,
  doneButtonRef,
  onBlur,
  onFocus,
}) => {
  pluginProps = {
    // disable HTML plugin by default, at least for now
    html: { disabled: true },
    ...pluginProps,
  };
  let filtered;

  const handleFocus = (event) => {
    const doneButtonClassName = doneButtonRef?.current?.className;
    const isRawDoneButton = doneButtonClassName && event.target?.closest(`[class*="${doneButtonClassName}"]`);

    if (onFocus && !isRawDoneButton) {
      onFocus(event);
    }
  };

  if (isHtmlMode) {
    filtered = plugins
      .filter((plugin) => {
        return isActiveToolbarPlugin(pluginProps)(plugin) && (plugin.name === 'characters' || plugin.name === 'html');
      })
      .map((p) => p.toolbar);
  } else {
    filtered = plugins.filter(isActiveToolbarPlugin(pluginProps)).map((p) => p.toolbar);
  }

  const isListActive = plugins.some(
    (plugin) =>
      isActiveToolbarPlugin(pluginProps)(plugin) &&
      ['ul_list', 'ol_list'].includes(plugin.name) &&
      plugin.toolbar.isActive(value, plugin.name),
  );

  const isTableActive = plugins.some(
    (plugin) =>
      isActiveToolbarPlugin(pluginProps)(plugin) &&
      plugin.name === 'table' &&
      plugin.utils &&
      plugin.utils.isSelectionInTable &&
      plugin.utils.isSelectionInTable(value),
  );

  const isToolbarButtonDisabled = (plugin) => {
    if (plugin.type === 'table') {
      return isListActive;
    } else if (plugin.type === 'ul_list' || plugin.type === 'ol_list') {
      return isTableActive;
    }
    return plugin.disabled;
  };

  return (
    <div className={classes.defaultToolbar} onFocus={handleFocus} tabIndex="1" onBlur={onBlur}>
      <div className={classes.buttonsContainer}>
        {filtered.map((p, index) => {
          return (
            <ToolbarButton
              {...p}
              key={index}
              value={value}
              onChange={onChange}
              getFocusedValue={getFocusedValue}
              disabled={isToolbarButtonDisabled(p)}
            />
          );
        })}
      </div>
      {showDone && !deletable && <DoneButton doneButtonRef={doneButtonRef} onClick={onDone} />}
    </div>
  );
};

DefaultToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  plugins: PropTypes.array.isRequired,
  pluginProps: PropTypes.object,
  value: SlatePropTypes.value.isRequired,
  onChange: PropTypes.func.isRequired,
  getFocusedValue: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  showDone: PropTypes.bool,
  addArea: PropTypes.bool,
  deletable: PropTypes.bool,
  isHtmlMode: PropTypes.bool,
  doneButtonRef: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

DefaultToolbar.defaultProps = {
  pluginProps: {},
};

const toolbarStyles = () => ({
  defaultToolbar: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    alignItems: 'center',
    display: 'flex',
    width: '100%',
  },
});

export default withStyles(toolbarStyles)(DefaultToolbar);
