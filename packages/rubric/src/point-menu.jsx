import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';

export class IconMenu extends React.Component {
  static propTypes = {
    opts: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    classes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: undefined,
      open: false,
    };
  }

  handleClick = (event) => this.setState({ open: true, anchorEl: event.currentTarget });

  handleRequestClose = () => this.setState({ open: false });

  render() {
    const { opts, onClick, classes = {} } = this.props;
    const { open, anchorEl } = this.state;
    const keys = Object.keys(opts) || [];

    const handleMenuClick = (key) => () => {
      onClick(key);
      this.handleRequestClose();
    };

    const iconColor = open ? 'inherit' : 'disabled';

    return (
      <div>
        <div onClick={this.handleClick}>
          <IconButton className={classes.icon} size="large">
            {open ? <MoreVertIcon color={iconColor} /> : <MoreHorizIcon color={iconColor} />}
          </IconButton>
        </div>
        <Menu
          id="point-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleRequestClose}
          style={{ transform: 'translate(-15px, -15px)' }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
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
    classes: PropTypes.object,
    showSampleAnswer: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    classes: {},
  };

  render() {
    const { onChange, classes, showSampleAnswer } = this.props;
    const sampleText = showSampleAnswer ? 'Provide Sample Response' : 'Remove Sample Response';

    return (
      <IconMenu
        onClick={(key) => onChange(key)}
        opts={{
          sample: sampleText,
        }}
        classes={classes}
      />
    );
  }
}
