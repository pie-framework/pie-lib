import React from 'react';

import MuiTabs, { Tab as MuiTab } from 'material-ui/Tabs';
import PropTypes from 'prop-types';

export default class Tabs extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { children, className } = this.props;
    return (
      <div className={className}>
        <MuiTabs value={value} onChange={this.handleChange}>
          {React.Children.map(children, (c, index) => (
            <MuiTab key={index} label={c.props.title} />
          ))}
        </MuiTabs>
        {children[value]}
      </div>
    );
  }
}
