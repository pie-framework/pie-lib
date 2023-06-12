import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { color } from '@pie-lib/render-ui';

import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import Button from '@material-ui/core/Button';
import Translator from '@pie-lib/translator';

const { translator } = Translator;

const buttonStyles = (theme) => ({
  root: {
    backgroundColor: color.background(),
    color: color.text(),
    border: `1px solid ${color.secondary()}`,
    '&:hover': {
      backgroundColor: color.secondaryLight(),
    },
    fontSize: theme.typography.fontSize,
  },
  selected: {
    backgroundColor: color.background(),
    '& span': {
      color: color.primaryDark(),
    },
  },
  notSelected: {
    '& span': {
      color: color.primary(),
    },
    backgroundColor: color.background(),
  },
  disabled: {
    '& span': {
      color: color.primary(),
    },
    backgroundColor: color.disabled(),
  },
});

export const MiniButton = withStyles(buttonStyles)((props) => {
  const { disabled, classes, className, selected, value, onClick } = props;
  return (
    <Button
      size="small"
      disabled={disabled}
      color={selected ? 'secondary' : 'default'}
      className={cn(classes.root, selected && classes.selected, className)}
      classes={{ disabled: cn(disabled && classes.disabled) }}
      value={value}
      key={value}
      variant="outlined"
      onClick={onClick}
    >
      {value}
    </Button>
  );
});
MiniButton.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  disabledClassName: PropTypes.string,
  selected: PropTypes.bool,
  value: PropTypes.string,
  onClick: PropTypes.func,
};

export class ToolMenu extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    addCategory: PropTypes.func,
    disabled: PropTypes.bool,
    language: PropTypes.string,
  };

  static defaultProps = {};

  render() {
    const { className, disabled, addCategory, language } = this.props;

    return (
      <div className={classNames(className)}>
        {!disabled && (
          <MiniButton value={translator.t('charting.addCategory', { lng: language })} onClick={addCategory} />
        )}
      </div>
    );
  }
}

export default ToolMenu;
