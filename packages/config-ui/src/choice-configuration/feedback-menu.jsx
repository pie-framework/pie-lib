import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ActionFeedback from '@material-ui/icons/Feedback';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';

export class IconMenu extends React.Component {
  static propTypes = {
    opts: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    iconButtonElement: PropTypes.any
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
    const { opts, onClick } = this.props;

    const keys = Object.keys(opts);

    const handleMenuClick = key => () => {
      onClick(key);
      this.handleRequestClose();
    };

    return (
      <div>
        <div onClick={this.handleClick}>{this.props.iconButtonElement}</div>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
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

export default class FeedbackMenu extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  static defaultProps = {
    classes: {}
  };

  render() {
    const { value, onChange, classes } = this.props;

    const t = value && value.type;
    const iconColor = t === 'custom' || t === 'default' ? 'primary' : 'disabled';

    const tooltip =
      t === 'custom'
        ? 'Custom Feedback'
        : t === 'default'
        ? 'Default Feedback'
        : 'Feedback disabled';

    const icon = (
      <IconButton className={classes.icon} aria-label={tooltip}>
        <ActionFeedback color={iconColor} />
      </IconButton>
    );

    return (
      <IconMenu
        iconButtonElement={icon}
        onClick={key => onChange(key)}
        opts={{
          none: 'No Feedback',
          default: 'Default',
          custom: 'Custom'
        }}
      />
    );
  }
}
