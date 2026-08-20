import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';

const StyledSettingsBox = styled('div')(() => ({
  /*
   * Surface and stroke have to move together. `background.paper` is MUI's #fff
   * regardless of scheme, so tokenising the stroke alone would put a scheme's
   * border colour on a fixed white panel -- under white-on-black that is a white
   * stroke on white. `--pie-white` inverts with the scheme, which is what the
   * panel wanted from `background.paper` in the first place.
   */
  backgroundColor: color.white(),
  border: `2px solid ${color.border()}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  minWidth: '275px',
  maxWidth: '300px',
  padding: '20px 4px 4px 20px',
  zIndex: 99,
}));

export class SettingsBox extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  };

  static defaultProps = {};

  render() {
    const { className, children } = this.props;

    return <StyledSettingsBox className={className}>{children}</StyledSettingsBox>;
  }
}

export default SettingsBox;
