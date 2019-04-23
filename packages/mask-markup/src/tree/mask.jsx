import React from 'react';
import PropTypes from 'prop-types';

const renderChildren = value => {
  if (!value) {
    return null;
  }

  const children = [];
  value.nodes.forEach(n => {
    if (n.type === 'div') {
      return;
    }
  });
  return children;
};
const Container = () => {
  const Tag = props.value.type;
  const children = renderChildren(props.value);
  return <Tag>{children}</Tag>;
};
export default class Mask extends React.Component {
  static propTypes = {
    value: PropTypes.any
  };

  static defaultProps = {
    foo: 'foo'
  };

  render() {
    return <Container value={this.props.value} />;
  }
}
