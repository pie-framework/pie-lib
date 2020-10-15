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

    return (
      <Select
        classes={{ root: classes.root, icon: classes.icon, selectMenu: classes.selectMenu }}
        disabled={disabled}
        value={value || ''}
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
              ref={ref => {
                if (ref) {
                  ref.innerHTML = c.label;
                }
              }}
            />
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
    '& ul': {
      color: color.text(),
      backgroundColor: color.background()
    }
  },
  selectMenu: {
    backgroundColor: color.background()
  },
  icon: {
    color: color.text()
  },
  selected: {
    color: `${color.primary()} !important`,
    backgroundColor: `${color.secondary()} !important`
  },
  menuRoot: {
    color: color.primaryDark(),
    backgroundColor: color.secondaryDark(),
    '&:focus': {
      color: color.primary(),
      backgroundColor: color.secondary()
    },
    '&:hover': {
      color: color.primary(),
      backgroundColor: color.secondary()
    }
  }
});

export default withStyles(styles)(Dropdown);
