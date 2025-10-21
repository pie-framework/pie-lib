import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { color } from '@pie-lib/render-ui';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Translator from '@pie-lib/translator';

const { translator } = Translator;

const StyledMiniButton = styled(Button)(({ theme, selected, disabled }) => ({
  color: color.text(),
  border: `1px solid ${color.secondary()}`,
  fontSize: theme.typography.fontSize,
  ...(selected && {
    backgroundColor: color.background(),
    '& span': {
      color: color.primaryDark(),
    },
  }),
  ...(!selected && !disabled && {
    '& span': {
      color: color.primary(),
    },
    backgroundColor: color.background(),
  }),
  ...(disabled && {
    '& span': {
      color: color.primary(),
    },
    backgroundColor: color.disabled(),
  }),
}));

export const MiniButton = (props) => {
  const { disabled, className, selected, value, onClick } = props;
  return (
    <StyledMiniButton
      size="small"
      disabled={disabled}
      selected={selected}
      color={selected ? 'secondary' : 'default'}
      className={className}
      value={value}
      key={value}
      variant="outlined"
      onClick={onClick}
    >
      {value}
    </StyledMiniButton>
  );
};
MiniButton.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  disabledClassName: PropTypes.string,
  selected: PropTypes.bool,
  value: PropTypes.string,
  onClick: PropTypes.func,
};

export class ToolMenu extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    addCategory: PropTypes.func,
    disabled: PropTypes.bool,
    language: PropTypes.string,
  };

  static defaultProps = {};

  render() {
    const { className, disabled, addCategory, language } = this.props;

    return (
      <div className={classNames(className)}>
        {!disabled && (
          <MiniButton value={translator.t('charting.addCategory', { lng: language })} onClick={addCategory} />
        )}
      </div>
    );
  }
}

export default ToolMenu;
