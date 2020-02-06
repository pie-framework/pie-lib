import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

const comp = (variant, styles) => {
  const out = withStyles(theme => {
    styles = _.isFunction(styles) ? styles(theme) : styles;
    return {
      comp: {
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        ...styles
      }
    };
  })(({ children, classes }) => (
    <Typography className={classes.comp} variant={variant}>
      {children}
    </Typography>
  ));

  out.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
  };

  return out;
};

export const Body = comp('body1', { paddingTop: '0px' });
export const Header = comp('title');
