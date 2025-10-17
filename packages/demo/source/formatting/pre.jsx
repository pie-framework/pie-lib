import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const StyledPre = styled('pre')({});

export class Pre extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.any,
  };
  
  static defaultProps = {};
  
  render() {
    const { className, value } = this.props;
    return <StyledPre className={className}>{JSON.stringify(value, null, '  ')}</StyledPre>;
  }
}

export default Pre;
