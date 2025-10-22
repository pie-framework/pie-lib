import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { color } from '@pie-lib/render-ui';
import Translator from '@pie-lib/translator';

const { translator } = Translator;

const StyledButton = styled(Button)(({ theme }) => ({
  color: color.text(),
  fontWeight: 'bold',
  marginBottom: theme.spacing(0.5),
  '&:not(:last-of-type)': {
    marginRight: theme.spacing(0.5),
  },
}));

export class UndoRedo extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onReset: PropTypes.func.isRequired,
    language: PropTypes.string,
  };
  static defaultProps = {};

  render() {
    const { className, onReset = false, language } = this.props;
    return (
      <div className={className}>
        <StyledButton onClick={() => onReset()}>
          {translator.t('graphing.reset', { lng: language })}
        </StyledButton>
      </div>
    );
  }
}

export default UndoRedo;
