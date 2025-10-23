import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import debug from 'debug';

const log = debug('pie-elements:config-ui:langs');

const StyledRoot = styled('div')(() => ({
  flexDirection: 'column',
  alignItems: 'start',
  display: 'flex',
  position: 'relative',
  paddingTop: '0px',
  paddingRight: '0px',
}));

const StyledFormControl = styled(FormControl)(() => ({
  position: 'initial',
}));

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

export class Langs extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    langs: PropTypes.array,
    selected: PropTypes.string,
    label: PropTypes.string,
    uid: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.uid = props.uid || (Math.random() * 10000).toFixed();
  }

  choose = (event) => {
    log('[choose] event: ', event);

    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  };

  render() {
    let { langs, selected, label } = this.props;

    log('[render] selected:', selected);

    return (
      <StyledRoot>
        <StyledFormControl>
          <StyledInputLabel htmlFor={this.uid}>
            {label}
          </StyledInputLabel>

          <Select value={selected} onChange={this.choose} input={<Input id={this.uid} />}>
            {langs.map((l, index) => (
              <MenuItem key={index} value={l}>
                {l}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </StyledRoot>
    );
  }
}
export default Langs;

const StyledLanguageControls = styled('div')(() => ({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  gridGap: '8px',
}));

export const LanguageControls = ({ langs, activeLang, defaultLang, onActiveLangChange, onDefaultLangChange, className }) => {
  return (
    <StyledLanguageControls className={className}>
      <Langs
        label="Choose language to edit"
        langs={langs}
        selected={activeLang}
        onChange={(l) => onActiveLangChange(l)}
      />
      <Langs label="Default language" langs={langs} selected={defaultLang} onChange={(l) => onDefaultLangChange(l)} />
    </StyledLanguageControls>
  );
};

LanguageControls.propTypes = {
  langs: PropTypes.array,
  activeLang: PropTypes.string.isRequired,
  defaultLang: PropTypes.string.isRequired,
  onActiveLangChange: PropTypes.func.isRequired,
  onDefaultLangChange: PropTypes.func.isRequired,
};
