import InputLabel from 'material-ui/Input/InputLabel';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormHelperText } from 'material-ui/Form';

const RawInputContainer = (props) => {
  const { label, className, children, classes, extraClasses } = props;
  const names = classNames(classes.formControl, className);
  return (
    <FormControl className={names}>
      <InputLabel className={''} shrink={true}>{label}</InputLabel>
      {children}
    </FormControl>
  );
}

RawInputContainer.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  extraClasses: PropTypes.object
}

export default withStyles(theme => ({
  formControl: {
    marginLeft: 0,
    marginRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    flex: '1 0 auto',
    minWidth: theme.spacing.unit * 4
  }
}))(RawInputContainer);
