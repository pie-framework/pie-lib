import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const StyledFormControl = styled(FormControl)({
  width: '100%',
});

const ItalicText = styled('em')({
  fontSize: '11px',
});

const StyledTextArea = styled('textarea')({
  width: '100%',
  height: '100px',
});

export class InputChooser extends React.Component {
  constructor(props) {
    super(props);

    const selected = props.inputOptions[0];
    this.state = {
      selected,
      userHtml: selected.html,
    };
  }

  changeSelection = (e) => {
    const newSelection = this.props.inputOptions.find((i) => i.html === e.target.value);

    this.setState({ selected: newSelection, userHtml: newSelection.html }, () => {
      this.props.onChange(this.state.userHtml);
    });
  };

  render() {
    const { inputOptions } = this.props;
    const { userHtml, selected } = this.state;
    return (
      <div>
        <div>
          <ItalicText>You can enter your own markup here to see how it works with the editor.</ItalicText>
        </div>
        <br />
        <StyledFormControl>
          <InputLabel htmlFor="markup">Example Markup</InputLabel>
          <Select
            value={selected.html}
            onChange={this.changeSelection}
            inputProps={{
              name: 'markup',
              id: 'markup',
            }}
          >
            {inputOptions.map((i) => (
              <MenuItem key={i.label} value={i.html}>
                {i.label}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        <br />
        <br />
        <StyledTextArea
          onChange={(e) => this.setState({ userHtml: e.target.value })}
          value={userHtml}
        />
        <Button variant="contained" color="primary" onClick={() => this.props.onChange(this.state.userHtml)}>
          Update Editor
        </Button>
      </div>
    );
  }
}

export default InputChooser;
