import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';

import { MarkButton } from '../toolbar/toolbar-buttons';

const log = debug('@pie-lib:editable-html:plugins:image:image-toolbar');

const AlignmentButton = ({ alignment, active, onClick }) => {
  return (
    <MarkButton active={active} onToggle={() => onClick(alignment)} label={alignment}>
      {alignment}
    </MarkButton>
  );
};

AlignmentButton.propTypes = {
  alignment: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export class ImageToolbar extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  onAlignmentClick = alignment => {
    log('[onAlignmentClick]: alignment:', alignment);
    this.props.onChange(alignment);
  };

  render() {
    const { classes, alignment } = this.props;

    return (
      <div className={classes.holder}>
        <AlignmentButton
          alignment={'left'}
          active={alignment === 'left'}
          onClick={this.onAlignmentClick}
        />
        <AlignmentButton
          alignment={'center'}
          active={alignment === 'center'}
          onClick={this.onAlignmentClick}
        />
        <AlignmentButton
          alignment={'right'}
          active={alignment === 'right'}
          onClick={this.onAlignmentClick}
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
