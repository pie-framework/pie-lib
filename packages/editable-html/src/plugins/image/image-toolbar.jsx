import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { MarkButton } from '../toolbar/toolbar-buttons';
import AltDialog from './alt-dialog';

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
    classes: PropTypes.object.isRequired,
    alignment: PropTypes.string,
    alt: PropTypes.string,
    imageLoaded: PropTypes.bool
  };

  onAltTextDone = newAlt => {
    log('[onAltTextDone]: alt:', newAlt);

    this.props.onChange({ alt: newAlt });
  };

  onAlignmentClick = alignment => {
    log('[onAlignmentClick]: alignment:', alignment);
    this.props.onChange({ alignment });
  };

  renderDialog = () => {
    const { alt } = this.props;
    const popoverEl = document.createElement('div');

    const el = <AltDialog alt={alt} onDone={this.onAltTextDone} />;

    ReactDOM.render(el, popoverEl);

    document.body.appendChild(popoverEl);
  };

  render() {
    const { classes, alignment, imageLoaded } = this.props;

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
        <span
          className={classNames({
            [classes.disabled]: !imageLoaded
          })}
          onMouseDown={event => imageLoaded && this.renderDialog(event)}
        >
          Alt text
        </span>
      </div>
    );
  }
}

const styles = theme => ({
  holder: {
    paddingLeft: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center'
  },
  disabled: {
    opacity: 0.5
  },
  root: {
    // position: 'absolute',
  },
  backdrop: {
    // position: 'absolute',
  }
});

export default withStyles(styles)(ImageToolbar);
