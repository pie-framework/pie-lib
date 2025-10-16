import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Nt from './nt';
import PropTypes from 'prop-types';
import Switch from '@mui/material/Switch';

const CategoryContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(2),
}));

const StyledNt = styled(Nt)({
  marginTop: 0,
});

class Category extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.number,
    interactive: PropTypes.boolean,
    onChange: PropTypes.func,
  };
  changeLabel = (event) => {
    const { onChange, value } = this.props;
    const label = event.target.value;
    onChange(label, value);
    setTimeout(() => {
      if (this.tf) {
        console.log('_____________________ focus', this.tf);
        this.tf.focus();
      }
    }, 1000);
  };

  changeValue = (value) => {
    const { onChange, label } = this.props;
    onChange(label, value);
  };

  changeInteractive = (event) => {
    const { onChange, label, value } = this.props;
    onChange(label, value, event.target.checked);
  };

  render() {
    const { value, label, interactive } = this.props;

    return (
      <CategoryContainer>
        <TextField
          value={label}
          variant="outlined"
          label="Label"
          inputRef={(r) => (this.tf = r)}
          onChange={this.changeLabel}
        />
        <StyledNt value={value} label="Value" onChange={this.changeValue} />
        <Switch checked={interactive} onChange={this.changeInteractive} value={interactive} />
      </CategoryContainer>
    );
  }
}

export default Category;
