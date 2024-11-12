import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import classNames from 'classnames';

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
}))(({ checked, label, toggle, classes, customClasses }) => (
  <div className={classes.toggle}>
    <InputLabel className={classes.label}>{label}</InputLabel>
    <Switch
        classes={{
          checked: classNames(customClasses?.checkedThumb),
          bar: classNames( {
            [customClasses?.checkedBar]: checked,
          }),
        }}
        checked={checked}
        onChange={(e) => toggle(e.target.checked)}
    />
  </div>
));

Toggle.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  customClasses: PropTypes.shape({
    checkedThumb: PropTypes.string, 
    checkedBar: PropTypes.string,   
  }),
};

export default Toggle;
