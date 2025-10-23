import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import NumberTextField from '../number-text-field';

const StyledDisplaySize = styled('div')(({ theme }) => ({
  display: 'flex',
  paddingTop: theme.spacing(1),
}));

const DisplaySize = ({ size, label, onChange }) => {
  const updateSize = (key, v) => {
    onChange({ ...size, [key]: v });
  };
  
  return (
    <div>
      <Typography>{label}</Typography>
      <StyledDisplaySize>
        <NumberTextField
          label="Width"
          type="number"
          variant="outlined"
          value={size.width}
          min={150}
          max={1000}
          onChange={(e, v) => updateSize('width', v)}
        />
        <NumberTextField
          label="Height"
          type="number"
          variant="outlined"
          min={150}
          max={1000}
          value={size.height}
          onChange={(e, v) => updateSize('height', v)}
        />
      </StyledDisplaySize>
    </div>
  );
};

DisplaySize.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default DisplaySize;
