import { DoneButton } from './done-button';
import PropTypes from 'prop-types';
import React from 'react';

import { hasBlock, hasMark } from '../utils';
import { withStyles } from '@material-ui/core/styles';

import { Button, MarkButton } from './toolbar-buttons';
import debug from 'debug';
import { Editor, Element as SlateElement } from 'slate';

const log = debug('@pie-lib:editable-html:plugins:toolbar');

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    }),
  );

  return !!match;
};

export const ToolbarButton = (props) => {
  const { editor } = props;
  const onToggle = () => {
    props.onToggle(editor, props);
  };

  if (props.isMark) {
    const isActive = isMarkActive(editor, props.type);

    log('[ToolbarButton] mark:isActive: ', isActive);

    return (
      <MarkButton active={isActive} label={props.type} onToggle={onToggle} mark={props.type}>
        {props.icon}
      </MarkButton>
    );
  } else {
    const { disabled } = props;
    const isActive = props.isActive ? props.isActive(editor, props.type) : isBlockActive(editor, props.type);

    log('[ToolbarButton] block:isActive: ', isActive);

    return (
      <Button
        active={isActive}
        disabled={disabled}
        onClick={() => props.onClick(editor)}
        extraStyles={props.buttonStyles}
      >
        {props.icon}
      </Button>
    );
  }
};

ToolbarButton.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.object,
  editor: PropTypes.object,
  isActive: PropTypes.func,
  isMark: PropTypes.bool,
  onClick: PropTypes.func,
  onToggle: PropTypes.func,
  type: PropTypes.string,
  buttonStyles: PropTypes.object,
};

const isActiveToolbarPlugin = (props) => (plugin) => {
  const isDisabled = (props[plugin.name] || {}).disabled;

  return plugin && plugin.toolbar && !isDisabled;
};

export const DefaultToolbar = ({
  editor,
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
}) => {
  pluginProps = {
    // disable HTML plugin by default, at least for now
    html: { disabled: true },
    ...pluginProps,
  };
  let filtered;

  if (isHtmlMode) {
    filtered = plugins
      .filter((plugin) => {
        return isActiveToolbarPlugin(pluginProps)(plugin) && (plugin.name === 'characters' || plugin.name === 'html');
      })
      .map((p) => p.toolbar);
  } else {
    filtered = plugins.filter(isActiveToolbarPlugin(pluginProps)).map((p) => p.toolbar);
  }

  return (
    <div className={classes.defaultToolbar}>
      <div className={classes.buttonsContainer}>
        {filtered.map((p, index) => {
          return (
            <ToolbarButton
              {...p}
              editor={editor}
              key={index}
              value={value}
              onChange={onChange}
              getFocusedValue={getFocusedValue}
            />
          );
        })}
      </div>
      {showDone && !deletable && <DoneButton onClick={() => onDone(editor)} />}
    </div>
  );
};

DefaultToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  plugins: PropTypes.array.isRequired,
  pluginProps: PropTypes.object,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      children: PropTypes.array,
      data: PropTypes.object,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  getFocusedValue: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  showDone: PropTypes.bool,
  addArea: PropTypes.bool,
  deletable: PropTypes.bool,
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
