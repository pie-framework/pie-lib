import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ToggleBar from './toggle-bar';
import debug from 'debug';
const log = debug('pie-lib:graphing:tool-menu');

export class ToolMenu extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    tools: PropTypes.array,
    currentTool: PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.string
    }),
    onChange: PropTypes.func
  };

  static defaultProps = {
    tools: []
  };

  changeTool = selected => {
    log('[changeTool]: ', selected);

    const { onChange, tools } = this.props;

    const tool = tools.find(t => t.label === selected || t.type === selected);
    if (tool) {
      onChange(tool);
    }
  };

  render() {
    const { className, tools, currentTool } = this.props;
    return (
      <div className={classNames(className)}>
        <ToggleBar
          options={tools.map(t => t.label || t.type)}
          selected={currentTool.label || currentTool.type}
          onChange={this.changeTool}
        />
      </div>
    );
  }
}

export default ToolMenu;
