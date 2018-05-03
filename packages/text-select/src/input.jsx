import React from 'react';
import PropTypes from 'prop-types';

export default class Input extends React.Component {
  static propTypes = {
    foo: PropTypes.string
  };

  static defaultProps = {
    foo: 'foo'
  };

  render() {
    return <div>Input</div>;
  }
}
