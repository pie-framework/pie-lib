import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';

export class IconMenu extends React.Component {
  static propTypes = {
    opts: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: undefined,
      open: false
    };
  }

  handleClick = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { opts, onClick, classes } = this.props;
    const keys = Object.keys(opts);

    const handleMenuClick = key => () => {
      onClick(key);
      this.handleRequestClose();
    };

    const iconColor = this.state.open ? 'inherit' : 'disabled';

    return (
      <div>
        <div onClick={this.handleClick}>
          <IconButton className={classes.icon}>
            {this.state.open ? (
              <MoreVertIcon color={iconColor} />
            ) : (
              <MoreHorizIcon color={iconColor} />
            )}
          </IconButton>
        </div>
        <Menu
          id="point-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
          style={{ transform: 'translate(-15px, -15px)' }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right'
          }}
        >
          {keys.map((k, index) => (
            <MenuItem key={index} onClick={handleMenuClick(k)}>
              {opts[k]}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

export default class PointMenu extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    sampleAnswer: PropTypes.string
  };

  static defaultProps = {
    classes: {}
  };

  render() {
    const { onChange, classes, sampleAnswer } = this.props;
    const sampleText = sampleAnswer === null ? 'Provide Sample Response' : 'Remove Sample Response';

    return (
      <IconMenu
        onClick={key => onChange(key)}
        opts={{
          text: 'Use Default Text',
          sample: sampleText
        }}
        classes={classes}
      />
    );
  }
}
