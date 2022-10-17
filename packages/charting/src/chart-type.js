import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const ChartType = withStyles(theme => ({
  chartType: {
    width: '160px'
  },
  chartTypeLabel: {
    backgroundColor: 'transparent'
  }
}))(({ onChange, value, classes }) => (
  <div className={classes.chartType}>
    <FormControl variant={'outlined'} className={classes.chartType}>
      <InputLabel htmlFor="type-helper" className={classes.chartTypeLabel}>
        ChartType
      </InputLabel>

      <Select
        value={value}
        onChange={onChange}
        labelWidth={0}
        input={<OutlinedInput name="type" id="type-helper" />}
      >
        <MenuItem value={'histogram'}>Histogram</MenuItem>
        <MenuItem value={'bar'}>Bar</MenuItem>
        <MenuItem value={'lineDot'}>Line Dot</MenuItem>
        <MenuItem value={'lineCross'}>Line Cross</MenuItem>
        <MenuItem value={'dotPlot'}>Dot Plot</MenuItem>
        <MenuItem value={'linePlot'}>Line Plot</MenuItem>
      </Select>
    </FormControl>
  </div>
));

export default ChartType;
