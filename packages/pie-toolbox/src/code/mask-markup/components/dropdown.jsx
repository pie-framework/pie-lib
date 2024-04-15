import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CorrectInput from './correct-input';
import { withStyles } from '@material-ui/core/styles';
import { color } from '../../render-ui';

class Dropdown extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    classes: PropTypes.object,
    correct: PropTypes.bool,
    choices: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })),
    showCorrectAnswer: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      highlightedOptionId: null,
    };
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleHighlight = (index) => {
    const highlightedOptionId = `dropdown-option-${this.props.id}-${index}`;
    this.setState({ highlightedOptionId });
  }
  
  handleSelect = (value, index) => {
    this.props.onChange(this.props.id, value);
    this.handleHighlight(index);
    this.handleClose();
  };

  getLabel(choices, value) {
    // Find the object in the array where the value matches the provided value
    const found = choices.find((choice) => choice.value === value);
    console.log(found, 'label');

    // If an object is found, return its label; otherwise, return undefined
    return found ? found.label.trim() : undefined;
  }
  render() {
    const { classes, id, correct, disabled, value, onChange, choices, showCorrectAnswer, singleQuery } = this.props;

    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const buttonId = `dropdown-button-${id}`;
    const menuId = `dropdown-menu-${id}`;
    const valueDisplayId = `dropdown-value-${id}`;

    console.log(this.props, 'props');

    // Create distinct, visually hidden labels for each dropdown
    const incrementedId = parseInt(id, 10) + 1;
    const labelId = singleQuery ? 'Query-label' : `Query-label-${incrementedId}`;
    const labelText = singleQuery ? 'Query' : `Query ${incrementedId}`;

    return (
      <>
        <InputLabel className={classes.srOnly} id={labelId}>
          {labelText}
        </InputLabel>
        {showCorrectAnswer && <CorrectInput correct={showCorrectAnswer || correct} value={value} disabled />}
        {!showCorrectAnswer && (
          <Button
            aria-controls={open ? menuId : undefined}
            aria-haspopup="listbox"
            aria-expanded={open ? 'true' : undefined}
            aria-activedescendant={this.state.highlightedOptionId}
            onClick={this.handleClick}
            classes={{
              root: classes.root,
              selectMenu: classes.selectMenu,
              disabled: classes.selectMenu,
            }}
            disabled={disabled}
            id={buttonId}
            role="combobox"
            aria-label="Select answer"
            aria-labelledby={valueDisplayId}
          >
            <span
              id={valueDisplayId}
              className={classes.label}
              dangerouslySetInnerHTML={{ __html: this.getLabel(choices, value) ? this.getLabel(choices, value) : '' }}
            />

            <ArrowDropDownIcon />
          </Button>
        )}
        <Menu
          id={menuId}
          anchorEl={anchorEl}
          className={classes.selectMenu}
          keepMounted
          open={open}
          onClose={this.handleClose}
          MenuListProps={{
            'aria-labelledby': buttonId,
            role: 'listbox',
          }}
        >
          {(choices || []).map((c, index) => {
    const optionId = `dropdown-option-${id}-${index}`;
    console.log(this.state.highlightedOptionId, "this.state.highlightedOptionId")
    console.log(optionId, "optionId")
    return (
      <MenuItem
        id={optionId}
        classes={{ root: classes.menuRoot, selected: classes.selected }}
        key={`${c.label}-${index}`}
        value={c.value}
        onClick={() => this.handleSelect(c.value, index)}
        role="option"
        aria-selected={this.state.highlightedOptionId === optionId ? 'true' : undefined}  // Dynamically set aria-selected
      >
        <span
          className={classes.label}
          dangerouslySetInnerHTML={{ __html: c.label }}
        />
        <span
          className={classes.label}
          dangerouslySetInnerHTML={{ __html: c.value === value ? ' &check;' : '' }}
        />
      </MenuItem>
    );
  })}
        </Menu>
      </>
    );
  }
}

const styles = (theme) => ({
  root: {
    color: color.text(),
    border: `1px solid ${color.text()}`,
    borderColor: 'initial',
    borderRadius: '4px',
    justifyContent: 'space-between',
    backgroundColor: color.background(),
    position: 'relative',
    height: '45px',
    width: 'fit-content',
    margin: '2px',
    textTransform: 'none',
    '& span': {
      paddingRight: '5px',
    },
    '& ul': {
      paddingTop: 0,
      paddingBottom: 0,
      border: `1px solid ${color.text()}`,
      borderRadius: '5px',
      color: color.text(),
      backgroundColor: color.background(),
    },
    '& svg': {
      position: 'absolute',
      right: 0,
      top: 'calc(50% - 12px)',
      pointerEvents: 'none',
      color: color.text(),
      marginLeft: '5px',
    },
  },
  select: {
    '&:focus': {
      borderRadius: '4px',
    },
  },
  selectMenu: {
    backgroundColor: color.background(),
    border: `1px solid ${color.correct()} !important`,
    '&:hover': {
      border: `1px solid ${color.text()} `,
      borderColor: 'initial',
    },
    '&:focus': {
      border: `1px solid ${color.text()}`,
      borderColor: 'initial',
    },
  },
  selected: {
    color: `${color.text()} !important`,
    backgroundColor: `${color.background()} !important`,
    '&:hover': {
      color: color.text(),
      backgroundColor: `${color.secondaryLight()} !important`,
    },
  },
  menuRoot: {
    color: color.text(),
    backgroundColor: color.background(),
    '&:focus': {
      color: color.text(),
      backgroundColor: color.background(),
    },
    '&:hover': {
      color: color.text(),
      backgroundColor: color.secondaryLight(),
    },
    boxSizing: 'border-box',
    padding: '25px',
    '&:first-of-type': {
      borderRadius: '3px 3px 0 0',
    },
    '&:last-of-type': {
      borderRadius: '0 0 3px 3px',
    },
  },
  label: {
    fontSize: 'max(1rem, 14px)',
  },
  srOnly: {
    position: 'absolute',
    left: '-10000px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  },
});

export default withStyles(styles)(Dropdown);
