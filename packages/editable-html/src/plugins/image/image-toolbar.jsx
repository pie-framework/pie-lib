import { MarkButton } from '../toolbar/toolbar-buttons';

import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import { withStyles } from 'material-ui/styles';
import SlatePropTypes from 'slate-prop-types';

const log = debug('@pie-lib:editable-html:plugins:image:image-toolbar');

const PercentButton = ({ percent, active, onClick }) => {
  const label = `${percent}%`;
  return (
    <MarkButton active={active} onToggle={() => onClick(percent)} label={label}>
      {label}
    </MarkButton>
  );
};

PercentButton.propTypes = {
  percent: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export class ImageToolbar extends React.Component {
  static propTypes = {
    node: SlatePropTypes.node.isRequired,
    value: SlatePropTypes.value.isRequired,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  onPercentClick = percent => {
    log('[onPercentClick]: percent:', percent);
    const { node, value, onChange } = this.props;
    const update = node.data.set('resizePercent', percent);
    log('[onPercentClick]: update:', update);
    const change = value.change().setNodeByKey(node.key, { data: update });
    onChange(change);
  };

  render() {
    const { node, classes } = this.props;
    const percent = node.data.get('resizePercent');
    return (
      <div className={classes.holder}>
        <PercentButton
          percent={25}
          active={percent === 25}
          onClick={this.onPercentClick}
        />
        <PercentButton
          percent={50}
          active={percent === 50}
          onClick={this.onPercentClick}
        />
        <PercentButton
          active={percent === 75}
          percent={75}
          onClick={this.onPercentClick}
        />
        <PercentButton
          percent={100}
          active={percent === 100 || !percent}
          onClick={this.onPercentClick}
        />
      </div>
    );
  }
}

const styles = theme => ({
  holder: {
    paddingLeft: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center'
  }
});

export default withStyles(styles)(ImageToolbar);
