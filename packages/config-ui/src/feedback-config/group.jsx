import PropTypes from 'prop-types';
import RadioWithLabel from '../radio-with-label';
import React from 'react';
import { styled } from '@mui/material/styles';

const StyledChoiceHolder = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const StyledChoice = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const StyledRadioWithLabel = styled(RadioWithLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: theme.typography.fontSize - 2,
  },
}));

const Group = (props) => {
  const { feedbackLabels, value, className, onChange, keys } = props;

  return (
    <StyledChoiceHolder className={className}>
      {keys.map((key) => {
        return (
          <StyledChoice key={key}>
            <StyledRadioWithLabel
              value={key}
              checked={value === key}
              onChange={(e) => onChange(e.currentTarget.value)}
              label={feedbackLabels[key]}
            />
          </StyledChoice>
        );
      })}
    </StyledChoiceHolder>
  );
};

Group.propTypes = {
  className: PropTypes.string,
  feedbackLabels: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  keys: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default Group;
