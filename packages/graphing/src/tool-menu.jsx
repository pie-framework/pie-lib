import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ToggleBar, { MiniButton } from './toggle-bar';
import debug from 'debug';
const log = debug('pie-lib:graphing:tool-menu');

export class ToolMenu extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    tools: PropTypes.array,
    currentTool: PropTypes.string,
    onChange: PropTypes.func,
    onToggleLabelMode: PropTypes.func,
    labelModeEnabled: PropTypes.bool,
    disabled: PropTypes.bool,
    hideLabel: PropTypes.bool
  };

  static defaultProps = {
    tools: []
  };

  changeTool = selected => {
    log('[changeTool]: ', selected);
    const { onChange } = this.props;
    onChange(selected);
  };

  render() {
    const {
      className,
      disabled,
      tools,
      currentTool,
      onToggleLabelMode,
      labelModeEnabled,
      hideLabel
    } = this.props;

    const t = tools.filter(t => t.toolbar);
    return (
      <div className={classNames(className)}>
        <ToggleBar
          disabled={disabled}
          options={t.map(t => t.type)}
          selected={currentTool}
          onChange={this.changeTool}
        />
        {!hideLabel && (
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
