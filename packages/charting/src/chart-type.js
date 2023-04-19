import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const ChartType = withStyles(() => ({
  chartType: {
    width: '160px',
  },
  chartTypeLabel: {
    backgroundColor: 'transparent',
  },
}))(({ onChange, value, classes }) => (
  <div className={classes.chartType}>
    <FormControl variant={'outlined'} className={classes.chartType}>
      <InputLabel htmlFor="type-helper" className={classes.chartTypeLabel}>
        ChartType
      </InputLabel>

      <Select value={value} onChange={onChange} labelWidth={0} input={<OutlinedInput name="type" id="type-helper" />}>
        <MenuItem value={'histogram'}>Histogram</MenuItem>
        <MenuItem value={'bar'}>Bar Chart</MenuItem>
        <MenuItem value={'lineDot'}>Line Chart &#9679;</MenuItem>
        <MenuItem value={'lineCross'}>Line Chart x</MenuItem>
        <MenuItem value={'dotPlot'}>Dot/Line Plot &#11044;</MenuItem>
        <MenuItem value={'linePlot'}>Dot/Line Plot X</MenuItem>
      </Select>
    </FormControl>
  </div>
));

export default ChartType;
