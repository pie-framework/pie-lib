import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
export class InputChooser extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    inputOptions: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const selected = props.inputOptions[0];
    this.state = {
      selected,
      userHtml: selected.html
    };
  }

  changeSelection = e => {
    const newSelection = this.props.inputOptions.find(i => i.html === e.target.value);

    this.setState({ selected: newSelection, userHtml: newSelection.html }, () => {
      this.props.onChange(this.state.userHtml);
    });
  };

  render() {
    const { classes, inputOptions } = this.props;
    const { userHtml, selected } = this.state;
    return (
      <div>
        <div>
          <em className={classes.italic}>
            You can enter your own markup here to see how it works with the editor.
          </em>
        </div>
        <br />
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="markup">Example Markup</InputLabel>
          <Select
            value={selected.html}
            onChange={this.changeSelection}
            inputProps={{
              name: 'markup',
              id: 'markup'
            }}
          >
            {inputOptions.map(i => (
              <MenuItem key={i.label} value={i.html}>
                {i.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <br />
        <textarea
          className={classes.textArea}
          onChange={e => this.setState({ userHtml: e.target.value })}
          value={userHtml}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.props.onChange(this.state.userHtml)}
        >
          Update Editor
        </Button>
      </div>
    );
  }
}

const styles = {
  formControl: {
    width: '100%'
  },
  italic: {
    fontSize: '11px'
  },
  textArea: {
    width: '100%',
    height: '100px'
  }
};

export default withStyles(styles)(InputChooser);
