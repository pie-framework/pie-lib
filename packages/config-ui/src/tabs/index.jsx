import React from 'react';

import MuiTabs from '@material-ui/core/Tabs';
import MuiTab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

export class Tabs extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
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
    const { children, className, contentClassName, classes } = this.props;

    const tabClasses = {
      root: classes.tabRoot
    };
    return (
      <div className={className}>
        <MuiTabs indicatorColor="primary" value={value} onChange={this.handleChange}>
          {React.Children.map(children, (c, index) =>
            c && c.props.title ? (
              <MuiTab classes={tabClasses} key={index} label={c.props.title} />
            ) : null
          )}
        </MuiTabs>
        <div className={contentClassName}>{children[value]}</div>
      </div>
    );
  }
}

export default withStyles(() => ({
  tabRoot: {}
}))(Tabs);
