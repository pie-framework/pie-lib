import PropTypes from 'prop-types';
import RadioWithLabel from '../radio-with-label';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = () => ({
  radioLabel: {
    fontSize: '12px'
  },
  choice: {
    display: 'flex',
    alignItems: 'center'
  },
  choiceHolder: {
    display: 'flex',
    alignItems: 'center'
  }
});

const Group = props => {
  const { feedbackLabels, value, classes, className, onChange, keys } = props;

  return (
    <div className={classNames(classes.choiceHolder, className)}>
      {keys.map(key => {
        return (
          <div className={classes.choice} key={key}>
            <RadioWithLabel
              value={key}
              checked={value === key}
              classes={{
                label: classes.radioLabel
              }}
              onChange={e => onChange(e.currentTarget.value)}
              label={feedbackLabels[key]}
            />
          </div>
        );
      })}
    </div>
  );
};

Group.propTypes = {
  className: PropTypes.string,
  feedbackLabels: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  keys: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func
};

export default withStyles(styles)(Group);
