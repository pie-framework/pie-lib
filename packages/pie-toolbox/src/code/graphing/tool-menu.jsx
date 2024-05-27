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
    onChangeTools: PropTypes.func,
    toolbarTools: PropTypes.arrayOf(PropTypes.string),
    language: PropTypes.string,
  };

  static defaultProps = {
    toolbarTools: [],
  };

  updateToolsOrder = (tools) => {
    const { onChangeTools } = this.props;
    onChangeTools(tools);
  };

  render() {
    const { className, currentToolType, disabled, draggableTools, onChange, language } = this.props;
    let { toolbarTools } = this.props;

    return (
      <div className={classNames(className)}>
        <ToggleBar
          disabled={disabled}
          draggableTools={draggableTools}
          options={toolbarTools}
          selectedToolType={currentToolType}
          onChange={onChange}
          onChangeToolsOrder={(tools) => this.updateToolsOrder(tools)}
          language={language}
        />
      </div>
    );
  }
}

export default ToolMenu;
