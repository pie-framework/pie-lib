import React from 'react';
import PropTypes from 'prop-types';

export default class InfoPanel extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    className: PropTypes.string
  };

  render() {
    const { model, className } = this.props;
    return <pre className={className}>{JSON.stringify(model, null, '  ')}</pre>;
  }
}
