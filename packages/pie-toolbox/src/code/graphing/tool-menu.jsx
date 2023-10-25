import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ToggleBar, { MiniButton } from './toggle-bar';

export class ToolMenu extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    currentToolType: PropTypes.string,
    disabled: PropTypes.bool,
    draggableTools: PropTypes.bool,
    labelModeEnabled: PropTypes.bool,
    onChange: PropTypes.func,
    onToggleLabelMode: PropTypes.func,
    onChangeTools: PropTypes.func,
    toolbarTools: PropTypes.arrayOf(PropTypes.string),
    language: PropTypes.string,
  };

  static defaultProps = {
    toolbarTools: [],
  };

  updateToolsOrder = (tools, showLabel) => {
    const { onChangeTools } = this.props;

    if (showLabel) {
      tools.push('label');
    }

    onChangeTools(tools);
  };

  render() {
    const {
      className,
      currentToolType,
      disabled,
      draggableTools,
      labelModeEnabled,
      onToggleLabelMode,
      onChange,
      language
    } = this.props;
    let { toolbarTools } = this.props;

    const showLabel = toolbarTools && toolbarTools.some((t) => t === 'label');

    toolbarTools = (toolbarTools || []).filter((tT) => tT !== 'label');

    return (
      <div className={classNames(className)}>
        <ToggleBar
          disabled={disabled}
          draggableTools={draggableTools}
          options={toolbarTools}
          selectedToolType={currentToolType}
          onChange={onChange}
          onChangeToolsOrder={(tools) => this.updateToolsOrder(tools, showLabel)}
          language={language}
        />

        {showLabel && (
          <MiniButton disabled={disabled} value={'Label'} onClick={onToggleLabelMode} selected={labelModeEnabled} language={language} />
        )}
      </div>
    );
  }
}

export default ToolMenu;
