import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import { color } from '../../render-ui';
import { renderMath } from '../../../math-rendering';

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
    singleQuery: PropTypes.bool,
    correctValue: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      highlightedOptionId: null,
      menuWidth: null,
      previewValue: null,
    };
    this.hiddenRef = React.createRef();
    this.buttonRef = React.createRef();
    this.previewRef = React.createRef();
    this.elementRefs = [];
  }

  componentDidMount() {
    // measure hidden menu width once
    if (this.hiddenRef.current && this.state.menuWidth === null) {
      this.setState({ menuWidth: this.hiddenRef.current.clientWidth });
    }
  }

  componentDidUpdate(prevProps) {
    // recalculate hidden menu width if available
    const { choices } = this.props;

    if (this.hiddenRef.current && !isEqual(choices, prevProps.choices)) {
      const newWidth = this.hiddenRef.current.clientWidth;
      if (newWidth !== this.state.menuWidth) {
        this.setState({ menuWidth: newWidth });
      }
    }

    if (!isEqual(choices, prevProps.choices)) {
      this.elementRefs.forEach((ref) => {
        if (ref) renderMath(ref);
      });
    }
  }

  handleClick = (event) => this.setState({ anchorEl: event.currentTarget });

  handleClose = () => this.setState({ anchorEl: null, previewValue: null });

  handleHighlight = (index) => {
    const highlightedOptionId = `dropdown-option-${this.props.id}-${index}`;

    // preview on hover if nothing selected
    const stateUpdate = { highlightedOptionId };
    if (!this.props.value) {
      stateUpdate.previewValue = this.props.choices[index].value;
    }
    this.setState(stateUpdate);
  };

  handleSelect = (value, index) => {
    this.props.onChange(this.props.id, value);
    this.handleHighlight(index);
    this.handleClose();
  };

  handleHover = (index) => {
    const selectedValue = this.props.value;

    if (selectedValue) return;

    const highlightedOptionId = `dropdown-option-${this.props.id}-${index}`;
    const previewValue = this.state.previewValue;

    this.setState({ highlightedOptionId, previewValue }, () => {
      // On hover, preview the math-rendered content inside the button if no value is selected.
      const ref = this.elementRefs[index];
      const preview = this.previewRef.current;

      if (ref && preview) {
        preview.innerHTML = ref.innerHTML;
      }
    });
  };

  getLabel(choices, value) {
    const found = (choices || []).find((choice) => choice.value === value);

    return found ? found.label.trim() : undefined;
  }

  render() {
    const { classes, id, correct, disabled, value, choices, showCorrectAnswer, singleQuery, correctValue } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const buttonId = `dropdown-button-${id}`;
    const menuId = `dropdown-menu-${id}`;
    const valueDisplayId = `dropdown-value-${id}`;

    // Determine the class for disabled state, view mode and evaluate mode
    let disabledClass;
    // Reset elementRefs before each render to avoid stale references
    this.elementRefs = [];

    if (disabled && correct !== undefined) {
      disabledClass = correct || showCorrectAnswer ? classes.disabledCorrect : classes.disabledIncorrect;
    }

    // Create distinct, visually hidden labels for each dropdown
    const incrementedId = parseInt(id, 10) + 1;
    const labelId = singleQuery ? 'Query-label' : `Query-label-${incrementedId}`;
    const labelText = singleQuery ? 'Query' : `Query ${incrementedId}`;

    // Changed from Select to Button for dropdown to enhance accessibility. This modification offers explicit control over aria attributes and focuses management, ensuring the dropdown is compliant with accessibility standards. The use of Button and Menu components allows for better handling of keyboard interactions and provides accessible labels and menus, aligning with WCAG guidelines and improving usability for assistive technology users.
    let correctnessIcon = null;
    if (disabled && correct !== undefined) {
      correctnessIcon =
        correct || showCorrectAnswer ? (
          <Check className={classNames(classes.correctnessIndicatorIcon, classes.correctIcon)} />
        ) : (
          <Close className={classNames(classes.correctnessIndicatorIcon, classes.incorrectIcon)} />
        );
    }

    return (
      <>
        <div ref={this.hiddenRef} style={{ position: 'absolute', visibility: 'hidden', top: 0, left: 0 }}>
          {(choices || []).map((c, index) => (
            <MenuItem key={index} classes={{ root: classes.menuRoot, selected: classes.selected }}>
              <span className={classes.label} dangerouslySetInnerHTML={{ __html: c.label }} />
            </MenuItem>
          ))}
        </div>
        <InputLabel className={classes.srOnly} id={labelId}>
          {labelText}
        </InputLabel>
        <Button
          ref={this.buttonRef}
          style={{
            ...(this.state.menuWidth && { minWidth: `calc(${this.state.menuWidth}px + 8px)` }),
            borderWidth: open ? '2px' : '1px',
            transition: 'border-width 0.2s ease-in-out',
          }}
          aria-controls={open ? menuId : undefined}
          aria-haspopup="listbox"
          aria-expanded={open ? 'true' : undefined}
          aria-activedescendant={this.state.highlightedOptionId}
          onClick={this.handleClick}
          classes={{
            root: classes.root,
            disabled: disabledClass,
          }}
          disabled={disabled}
          id={buttonId}
          role="combobox"
          aria-label="Select answer"
          aria-labelledby={valueDisplayId}
        >
          {correctnessIcon}
          <span
            id={valueDisplayId}
            ref={this.previewRef}
            className={classes.label}
            dangerouslySetInnerHTML={{
              __html: correctValue
                ? correctValue
                : open && this.state.previewValue
                ? this.getLabel(choices, this.state.previewValue)
                : this.getLabel(choices, value) || '',
            }}
          />
          {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </Button>
        <Menu
          id={menuId}
          anchorEl={anchorEl}
          className={classes.selectMenu}
          keepMounted
          open={open}
          onClose={this.handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={this.state.menuWidth ? { style: { minWidth: this.state.menuWidth, padding: '4px' } } : undefined}
          MenuListProps={{
            'aria-labelledby': buttonId,
            role: 'listbox',
            disablePadding: true,
          }}
        >
          {(choices || []).map((c, index) => {
            const optionId = `dropdown-option-${id}-${index}`;

            return (
              <MenuItem
                id={optionId}
                classes={{ root: classes.menuRoot, selected: classes.selected }}
                key={`${c.label}-${index}`}
                value={c.value}
                onClick={() => this.handleSelect(c.value, index)}
                role="option"
                aria-selected={this.state.highlightedOptionId === optionId ? 'true' : undefined}
                onMouseOver={() => this.handleHover(index)}
              >
                <span
                  ref={(ref) => (this.elementRefs[index] = ref)}
                  className={classes.label}
                  dangerouslySetInnerHTML={{ __html: c.label }}
                />
                <span
                  className={classes.selectedIndicator}
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

const styles = () => ({
  root: {
    color: color.text(),
    border: `1px solid ${color.borderGray()}`,
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
    '& svg': {
      position: 'absolute',
      right: 0,
      top: 'calc(50% - 12px)',
      pointerEvents: 'none',
      color: color.text(),
      marginLeft: '5px',
    },
  },
  disabledCorrect: {
    borderWidth: '2px',
    borderColor: color.correct(),
    color: `${color.text()} !important`,
  },
  disabledIncorrect: {
    borderWidth: '2px',
    borderColor: color.incorrectWithIcon(),
    color: `${color.text()} !important`,
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
    // remove default padding on the inner list
    '& .MuiList-root': {
      padding: 0,
    },
  },
  selected: {
    color: `${color.text()} !important`,
    backgroundColor: `${color.background()} !important`,
    '&:hover': {
      color: color.text(),
      backgroundColor: `${color.dropdownBackground()} !important`,
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
      backgroundColor: color.dropdownBackground(),
    },
    boxSizing: 'border-box',
    padding: '25px',
    borderRadius: '4px',
  },
  label: {
    fontSize: 'max(1rem, 14px)',
  },
  selectedIndicator: {
    fontSize: 'max(1rem, 14px)',
    position: 'absolute',
    right: '10px',
  },
  srOnly: {
    position: 'absolute',
    left: '-10000px',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  },
  correctnessIndicatorIcon: {
    color: `${color.white()} !important`,
    position: 'absolute',
    top: '-8px !important',
    left: '-8px',
    marginLeft: '0 !important',
    borderRadius: '50%',
    fontSize: '16px',
    padding: '2px',
  },
  correctIcon: {
    backgroundColor: color.correct(),
  },
  incorrectIcon: {
    backgroundColor: color.incorrectWithIcon(),
  },
});

export default withStyles(styles)(Dropdown);
