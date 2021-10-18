import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CorrectInput from './correct-input';
import { withStyles } from '@material-ui/core/styles';
import { color } from '@pie-lib/render-ui';

class Dropdown extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    classes: PropTypes.object,
    correct: PropTypes.bool,
    choices: PropTypes.arrayOf(
      PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
    ),
    showCorrectAnswer: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      showCheckmark: false,
      open: false
    };
  }

  showCheckmarkAndOpen = () => {
    this.setState({
      showCheckmark: true,
      open: true
    });
  };

  hideCheckmarkAndClose = () => {
    this.setState({
      showCheckmark: false,
      open: false
    });
  };

  render() {
    const {
      classes,
      id,
      correct,
      disabled,
      value,
      onChange,
      choices,
      showCorrectAnswer
    } = this.props;

    const { showCheckmark, open } = this.state;

    return (
      <Select
        classes={{
          root: classes.root,
          icon: classes.icon,
          selectMenu: classes.selectMenu,
          select: classes.select
        }}
        disabled={disabled}
        value={value || ''}
        onOpen={this.showCheckmarkAndOpen}
        onClose={this.hideCheckmarkAndClose}
        open={open}
        input={<CorrectInput correct={showCorrectAnswer || correct} />}
        MenuProps={{
          keepMounted: true,
          disablePortal: true
        }}
        onChange={e => {
          onChange(id, e.target.value);
        }}
      >
        {(choices || []).map((c, index) => (
          <MenuItem
            classes={{ root: classes.menuRoot, selected: classes.selected }}
            key={`${c.label}-${index}`}
            value={c.value}
          >
            <span
              className={classes.label}
              dangerouslySetInnerHTML={{
                __html: c.label
              }}
            />
            {showCheckmark && (
              <span
                className={classes.label}
                dangerouslySetInnerHTML={{ __html: c.value === value ? ' &check;' : '' }}
              />
            )}
          </MenuItem>
        ))}
      </Select>
    );
  }
}

const styles = () => ({
  root: {
    color: color.text(),
    backgroundColor: color.background(),
    borderColor: color.secondaryLight(),
    '& ul': {
      paddingTop: 0,
      paddingBottom: 0,
      border: `1px solid ${color.text()}`,
      borderRadius: '5px',
      color: color.text(),
      backgroundColor: color.background()
    }
  },
  select: {
    '&:focus': {
      borderRadius: '4px'
    }
  },
  selectMenu: {
    backgroundColor: color.background(),
    '&:hover': {
      borderColor: 'initial'
    },
    '&:focus': {
      borderColor: 'initial'
    }
  },
  icon: {
    color: color.text()
  },
  selected: {
    color: `${color.text()} !important`,
    backgroundColor: `${color.background()} !important`,
    '&:hover': {
      color: color.text(),
      backgroundColor: `${color.secondaryLight()} !important`
    }
  },
  menuRoot: {
    color: color.text(),
    backgroundColor: color.background(),
    '&:focus': {
      color: color.text(),
      backgroundColor: color.background()
    },
    '&:hover': {
      color: color.text(),
      backgroundColor: color.secondaryLight()
    },
    boxSizing: 'border-box',
    padding: '25px',
    '&:first-of-type': {
      borderRadius: '3px 3px 0 0'
    },
    '&:last-of-type': {
      borderRadius: '0 0 3px 3px'
    }
  },
  label: {
    fontSize: 'max(1rem, 14px)'
  }
});

export default withStyles(styles)(Dropdown);
