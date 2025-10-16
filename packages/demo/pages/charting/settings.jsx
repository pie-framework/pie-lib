import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import { DisplaySize } from '@pie-lib/config-ui';
import { grey } from '@mui/material/colors';

const SettingsContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  background: grey[100],
  border: `solid 1px ${grey[300]}`,
}));

export class Settings extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    model: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  updateSize = (size) => {
    const { model, onChange } = this.props;
    onChange({ ...model, size });
  };

  render() {
    const { model, className } = this.props;
    return (
      <SettingsContainer className={className}>
        {/* <DisplaySize label={'Chart Display Size'} size={model.size} onChange={this.updateSize} />*/}
      </SettingsContainer>
    );
  }
}

export default Settings;
