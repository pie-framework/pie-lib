import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Expander extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show || false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      show: nextProps.show
    });
  }

  render() {
    const { className, children } = this.props;
    const { show } = this.state;
    const names = classNames(className, show ? 'show' : 'hide');

    return <div className={names}>{children}</div>;
  }
}

Expander.propTypes = {
  show: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};
