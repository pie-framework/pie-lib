import React from 'react';
import PropTypes from 'prop-types';

export default class Tokenizer extends React.Component {
  static propTypes = {
    foo: PropTypes.string
  };

  static defaultProps = {
    foo: 'foo'
  };

  render() {
    return <div>Tokenizer</div>;
  }
}
