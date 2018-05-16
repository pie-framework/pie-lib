import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import { buttonStyle } from './styles';
import merge from 'lodash/merge';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridRowGap: '0px',
    gridColumnGap: '0px'
  }
};

export const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
const extras = ['.', '='];
export const defaults = numbers.concat(extras);

const baseStyles = merge(buttonStyle(), {
  root: {
    backgroundColor: '#cacaca',
    height: '100%'
  }
});

const NumberPadButton = withStyles(baseStyles)(props => {
  return (
    <IconButton
      tabIndex={'-1'}
      onClick={() => {
        props.onClick(props.value);
      }}
      classes={props.classes}
    >
      {props.children}
    </IconButton>
  );
});

const EqualsButton = withStyles(
  merge(buttonStyle(), {
    root: {
      backgroundColor: 'orange',
      height: '100%'
    }
  })
)(props => {
  return <NumberPadButton {...props} />;
});

export class NumberPad extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(value) {
    this.props.onClick(value);
  }

  render() {
    const { classes, values } = this.props;
    return (
      <div className={classes.root}>
        {values.map(v => {
          const Button = v === '=' ? EqualsButton : NumberPadButton;
          return (
            <Button key={v} onClick={this.onClick} value={v}>
              {v}
            </Button>
          );
        })}
      </div>
    );
  }
}

NumberPad.propTypes = {
  onClick: PropTypes.func,
  classes: PropTypes.object.isRequired,
  values: PropTypes.arrayOf(PropTypes.string)
};

NumberPad.defaultProps = {
  values: defaults
};

export default withStyles(styles)(NumberPad);
