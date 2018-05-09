import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import { buttonStyle } from './styles';
import merge from 'lodash/merge';
import { withStyles } from 'material-ui/styles';

const styles = {
  root: {
    display: 'grid',
    gridRowGap: '0px',
    gridColumnGap: '0px'
  }
};

export const defaults = [
  { label: '&divide;', value: '\\div' },
  { label: '*', value: '\\times' },
  '-',
  '+'
];

const baseStyles = merge(buttonStyle(), {
  root: {
    backgroundColor: 'orange',
    height: '100%'
  }
});

const BasicOperatorsPadButton = withStyles(baseStyles, {
  name: 'BasicOperators'
})(props => {
  const label = props.children.toString();

  return (
    <IconButton
      tabIndex={'-1'}
      onClick={() => props.onClick(props.value)}
      classes={props.classes}
    >
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </IconButton>
  );
});

export class BasicOperatorsPad extends React.Component {
  static propTypes = {
    onClick: PropTypes.object.isRequired,
    values: PropTypes.array,
    classes: PropTypes.isRequired
  };

  static defaultProps = {
    values: defaults
  };

  constructor(props) {
    super(props);
    this.onClick = value => {
      this.props.onClick(value);
    };
  }

  render() {
    const { classes, values } = this.props;
    return (
      <div className={classes.root}>
        {values.map(v => {
          const label = v.label || v;
          const value = v.value || v;
          return (
            <BasicOperatorsPadButton
              key={label}
              onClick={this.onClick}
              value={value}
            >
              {label}
            </BasicOperatorsPadButton>
          );
        })}
      </div>
    );
  }
}

const StyledBasicOperatorsPad = withStyles(styles, {
  name: 'BasicOperatorsPad'
})(BasicOperatorsPad);
export default StyledBasicOperatorsPad;
