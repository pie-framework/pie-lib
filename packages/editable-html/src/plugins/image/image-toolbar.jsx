import { Button, MarkButton } from '../toolbar/toolbar-buttons';

import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import injectSheet from 'react-jss';

const log = debug('editable-html:plugins:image:image-toolbar');

const PercentButton = ({ percent, active, onClick }) => {
  const label = `${percent}%`;
  return (
    <MarkButton
      active={active}
      onToggle={() => onClick(percent)}
      label={label}>{label}</MarkButton>
  );
}

export class ImageToolbar extends React.Component {

  onPercentClick = (percent) => {
    const { node, value, onChange } = this.props;
    const update = node.data.set('resizePercent', percent);
    const change = value.change().setNodeByKey(node.key, { data: update });
    onChange(change);
  }

  render() {
    const { node, classes } = this.props;
    const percent = node.data.get('resizePercent');
    return (
      <div className={classes.holder}>
        <PercentButton
          percent={25}
          active={percent === 25}
          onClick={this.onPercentClick} />
        <PercentButton
          percent={50}
          active={percent === 50}
          onClick={this.onPercentClick} />
        <PercentButton
          active={percent === 75}
          percent={75}
          onClick={this.onPercentClick} />
        <PercentButton
          percent={100}
          active={percent === 100 || !percent}
          onClick={this.onPercentClick} />
      </div>
    );
  }
}
ImageToolbar.propTypes = {}

const styles = {
  holder: {
    paddingLeft: '5px',
    display: 'flex',
    alignItems: 'center'
  }
}

export default injectSheet(styles)(ImageToolbar);