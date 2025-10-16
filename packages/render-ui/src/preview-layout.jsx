import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import UiLayout from './ui-layout';

const StyledUiLayout = styled(UiLayout)({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
});

class PreviewLayout extends React.Component {
  static propTypes = {
    ariaLabel: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    role: PropTypes.string,
    extraCSSRules: PropTypes.shape({
      names: PropTypes.arrayOf(PropTypes.string),
      rules: PropTypes.string,
    }),
    fontSizeFactor: PropTypes.number,
  };

  render() {
    const { children, ariaLabel, role, extraCSSRules, fontSizeFactor } = this.props;
    const accessibility = ariaLabel ? { 'aria-label': ariaLabel, role } : {};

    return (
      <StyledUiLayout {...accessibility} extraCSSRules={extraCSSRules} fontSizeFactor={fontSizeFactor}>
        {children}
      </StyledUiLayout>
    );
  }
}

export default PreviewLayout;
