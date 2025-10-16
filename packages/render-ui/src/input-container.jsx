import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginLeft: 0,
  marginRight: 0,
  paddingBottom: theme.spacing(1),
  flex: '1 0 auto',
  minWidth: theme.spacing(4),
}));

const StyledInputLabel = styled(InputLabel)({
  fontSize: 'inherit',
  whiteSpace: 'nowrap',
});

const InputContainer = (props) => {
  const { label, className, children } = props;

  return (
    <StyledFormControl className={className}>
      <StyledInputLabel shrink={true}>{label}</StyledInputLabel>
      {children}
    </StyledFormControl>
  );
};

InputContainer.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default InputContainer;
