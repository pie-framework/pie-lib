import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';

const RawInputContainer = (props) => {
  const { label, className, children, classes } = props;
  const names = classNames(classes.formControl, className);

  return (
    <FormControl className={names}>
      <InputLabel className={classes.label} shrink={true}>
        {label}
      </InputLabel>
      {children}
    </FormControl>
  );
};

RawInputContainer.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles((theme) => ({
  formControl: {
    marginLeft: 0,
    marginRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    flex: '1 0 auto',
    minWidth: theme.spacing.unit * 4,
  },
  label: {
    fontSize: 'inherit',
    whiteSpace: 'nowrap',
  },
}))(RawInputContainer);
