import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ToggleBar, { MiniButton } from './toggle-bar';

export class ToolMenu extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    currentToolType: PropTypes.string,
    disabled: PropTypes.bool,
    labelModeEnabled: PropTypes.bool,
    onChange: PropTypes.func,
    onToggleLabelMode: PropTypes.func,
    toolbarTools: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    toolbarTools: []
  };

  render() {
    const {
      className,
      currentToolType,
      disabled,
      labelModeEnabled,
      onToggleLabelMode,
      onChange
    } = this.props;
    let { toolbarTools } = this.props;

    const showLabel = toolbarTools && toolbarTools.some(t => t === 'label');

    toolbarTools = (toolbarTools || []).filter(tT => tT !== 'label');

    return (
      <div className={classNames(className)}>
        <ToggleBar
          disabled={disabled}
          options={toolbarTools}
          selectedToolType={currentToolType}
          onChange={onChange}
        />

        {showLabel && (
          <MiniButton
            disabled={disabled}
            value={'Label'}
            onClick={onToggleLabelMode}
            selected={labelModeEnabled}
          />
        )}
      </div>
    );
  }
}

export default ToolMenu;
