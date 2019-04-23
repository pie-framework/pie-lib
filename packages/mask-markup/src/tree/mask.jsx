import React from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Blank from './blank';

const renderChildren = (value, data, onChange) => {
  if (!value) {
    return null;
  }

  console.log('renderChildren:', value);
  const children = [];
  (value.nodes || []).forEach(n => {
    // console.log('node:', n, n.data.component);
    const component = n.data ? n.data.component : undefined;
    if (component === 'input') {
      children.push(
        <Input value={data[n.data.id]} onChange={e => onChange(n.data.id, e.target.value)} />
      );
    } else if (component === 'blank') {
      console.log('got a blank..---------------------------.');
      children.push(<Blank value={data[n.data.id]} id={n.data.id} onChange={onChange} />);
    } else if (n.type === 'div') {
      children.push(<div>{renderChildren(n, data, onChange)}</div>);
    } else if (n.type === 'span') {
      children.push(<span>{renderChildren(n, data, onChange)}</span>);
    } else if (n.object === 'text') {
      const content = n.leaves.reduce((acc, l) => {
        return acc + l.text;
      }, '');
      children.push(<span>{content}</span>);
    } else if (n.data.component === 'input') {
      children.push(
        <Input value={data[n.data.id]} onChange={e => onChange(n.data.id, e.target.value)} />
      );
    }
  });
  return children;
};

const Container = ({ value, data, onChange }) => {
  // const Tag = value.type;
  const children = renderChildren(value, data, onChange);
  return <div>{children}</div>;
};

export default class Mask extends React.Component {
  static propTypes = {
    value: PropTypes.any
  };

  static defaultProps = {
    foo: 'foo'
  };

  handleChange = (id, value) => {
    const data = { ...this.props.data, [id]: value };
    this.props.onChange(data);
  };
  render() {
    return (
      <Container value={this.props.layout} data={this.props.data} onChange={this.handleChange} />
    );
  }
}
