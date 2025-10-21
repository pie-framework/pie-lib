import React from 'react';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';

const StyledContainer = styled('div')(() => ({
  width: '160px',
}));

const StyledFormControl = styled(FormControl)(() => ({
  width: '160px',
}));

const StyledInputLabel = styled(InputLabel)(() => ({
  backgroundColor: 'transparent',
}));

const ChartType = ({ onChange, value, availableChartTypes, chartTypeLabel }) => (
  <StyledContainer>
    <StyledFormControl variant={'outlined'}>
      <StyledInputLabel id="type-helper-label">
        {chartTypeLabel}
      </StyledInputLabel>
      <Select
        labelId="type-helper-label"
        value={value}
        onChange={onChange}
        input={<OutlinedInput labelWidth={75} name="type" />}
      >
        {availableChartTypes?.histogram && <MenuItem value={'histogram'}>{availableChartTypes.histogram}</MenuItem>}
        {availableChartTypes?.bar && <MenuItem value={'bar'}>{availableChartTypes.bar}</MenuItem>}
        {availableChartTypes?.lineDot && <MenuItem value={'lineDot'}>{availableChartTypes.lineDot}</MenuItem>}
        {availableChartTypes?.lineCross && <MenuItem value={'lineCross'}>{availableChartTypes.lineCross}</MenuItem>}
        {availableChartTypes?.dotPlot && <MenuItem value={'dotPlot'}>{availableChartTypes.dotPlot}</MenuItem>}
        {availableChartTypes?.linePlot && <MenuItem value={'linePlot'}>{availableChartTypes.linePlot}</MenuItem>}
      </Select>
    </StyledFormControl>
  </StyledContainer>
);

export default ChartType;
