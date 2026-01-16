import React from 'react';

import MuiTabs from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const StyledMuiTab = styled(MuiTab)(() => ({}));

export class Tabs extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    contentStyle: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { children, className, contentClassName, contentStyle = {} } = this.props;

    return (
      <div className={className}>
        <MuiTabs indicatorColor="primary" value={value} onChange={this.handleChange}>
          {React.Children.map(children, (c, index) =>
            c && c.props.title ? <StyledMuiTab key={index} label={c.props.title} /> : null,
          )}
        </MuiTabs>

        <div className={contentClassName} style={contentStyle}>
          {children[value]}
        </div>
      </div>
    );
  }
}

export default Tabs;
