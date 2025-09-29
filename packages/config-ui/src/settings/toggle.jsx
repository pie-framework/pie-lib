import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import classNames from 'classnames';
import { color } from '@pie-lib/render-ui';

const Toggle = withStyles((theme) => ({
  toggle: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  label: {
    color: 'rgba(0, 0, 0, 0.89)',
    fontSize: theme.typography.fontSize,
    paddingTop: theme.spacing.unit * 2,
  },
  checkedThumb: {
    color: `${color.tertiary()} !important`,
  },
  checkedBar: {
    backgroundColor: `${color.tertiaryLight()} !important`,
  },
}))(({ checked, disabled, label, toggle, classes }) => (
  <div className={classes.toggle}>
    <InputLabel className={classes.label}>{label}</InputLabel>
    <Switch
      classes={{
        checked: classNames(classes.checkedThumb),
        bar: classNames({
          [classes.checkedBar]: checked,
        }),
      }}
      checked={checked}
      disabled={disabled}
      onChange={(e) => toggle(e.target.checked)}
    />
  </div>
));

Toggle.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Toggle;
