import React from 'react';
import PropTypes from 'prop-types';

export class Pre extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.any,
  };
  static defaultProps = {};

  render() {
    const { className, value } = this.props;
    return <pre className={className}>{JSON.stringify(value, null, '  ')}</pre>;
  }
}

export default Pre;
