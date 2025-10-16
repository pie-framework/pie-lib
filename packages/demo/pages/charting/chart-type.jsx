import React from 'react';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';

const ChartTypeContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

const StyledFormControl = styled(FormControl)({
  width: '100%',
});

const ChartType = ({ onChange, value }) => {
  return (
    <ChartTypeContainer>
      <StyledFormControl variant="outlined">
        <InputLabel htmlFor="type-helper">ChartType</InputLabel>

        <Select value={value} onChange={onChange} input={<OutlinedInput name="type" id="type-helper" />}>
          <MenuItem value={'histogram'}>Histogram</MenuItem>
          <MenuItem value={'bar'}>Bar</MenuItem>
          <MenuItem value={'lineDot'}>Line Dot</MenuItem>
          <MenuItem value={'lineCross'}>Line Cross</MenuItem>
          <MenuItem value={'dotPlot'}>Dot Plot</MenuItem>
          <MenuItem value={'linePlot'}>Line Plot</MenuItem>
        </Select>
      </StyledFormControl>
    </ChartTypeContainer>
  );
};

export default ChartType;
