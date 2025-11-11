import React, { useCallback } from 'react';
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import { DoneButton } from "../plugins/toolbar/done-button";
import classNames from "classnames";
import { PIE_TOOLBAR__CLASS } from "../constants";
import { withStyles } from "@material-ui/core/styles";
import { Toolbar } from "../plugins/toolbar/toolbar";

function CustomToolbarWrapper(props) {
  const {
    children,
    deletable,
    classes,
    toolbarOpts,
    autoWidth,
    isFocused,
    doneButtonRef,
    onDelete,
    showDone,
    onDone,
  } = props;
  const names = classNames(classes.toolbar, PIE_TOOLBAR__CLASS, {
    [classes.toolbarWithNoDone]: !showDone,
    [classes.toolbarRight]: toolbarOpts.alignment === 'right',
    [classes.focused]: toolbarOpts.alwaysVisible || isFocused,
    [classes.autoWidth]: autoWidth,
    [classes.fullWidth]: !autoWidth,
    [classes.hidden]: toolbarOpts.isHidden === true,
  });
  const customStyles = toolbarOpts.minWidth !== undefined ? { minWidth: toolbarOpts.minWidth } : {};

  return (
    <div className={names} style={{ ...customStyles }}>
      {children}

      <div className={classes.shared}>
        {deletable && (
          <IconButton
            aria-label="Delete"
            className={classes.iconRoot}
            onMouseDown={(e) => onDelete?.(e)}
            classes={{
              root: classes.iconRoot,
            }}
          >
            <Delete />
          </IconButton>
        )}
        {showDone && <DoneButton doneButtonRef={doneButtonRef} onClick={onDone} />}
      </div>
    </div>
  );
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
    display: 'flex',
    opacity: 1,
  },
  toolbarWithNoDone: {
    minWidth: '265px',
  },
  toolbarRight: {
    right: 0,
  },
  fullWidth: {
    width: '100%',
  },
  hidden: {
    visibility: 'hidden',
  },
  autoWidth: {
    width: 'auto',
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
export default withStyles(style, { index: 1000 })(CustomToolbarWrapper);
