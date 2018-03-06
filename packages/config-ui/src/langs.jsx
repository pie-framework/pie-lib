import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import debug from 'debug';

const log = debug('pie-elements:config-ui:langs');

const styles = theme => ({
  root: {
    flexDirection: 'column',
    alignItems: 'start',
    display: 'flex',
    position: 'relative',
    paddingTop: '0px',
    paddingRight: '0px'
  },
  formControl: {
    position: 'initial'
  },
  inputLabel: {
    paddingBottom: theme.spacing.unit
  }
});

class RawLangs extends React.Component {

  constructor(props) {
    super(props);
    this.uid = (Math.random() * 10000).toFixed();
  }

  choose = (event) => {
    log('[choose] event: ', event);
    if (this.props.onChange) {
      this.props.onChange(event.currentTarget.getAttribute('value'));
    }
  }

  render() {
    let { langs, selected, onChange, label, classes } = this.props;
    log('[render] selected:', selected);
    return <div className={classes.root}>
      <FormControl
        className={classes.formControl}>
        <InputLabel
          className={classes.inputLabel}
          htmlFor={this.uid}>{label}</InputLabel>
        <Select
          value={selected}
          onChange={this.choose}
          input={<Input id={this.uid} />}>
          {langs.map((l, index) => <MenuItem
            key={index}
            value={l}>{l}</MenuItem>)}
        </Select>
      </FormControl>
    </div>;
  }
}

const Langs = withStyles(styles, { name: 'Langs' })(RawLangs);
export default Langs;

export const LanguageControls = withStyles({
  languageControls: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: '1fr',
    gridGap: '8px'
  }
})(({
  classes,
  langs,
  activeLang,
  defaultLang,
  onActiveLangChange,
  onDefaultLangChange,
  className }) => {
  const names = classNames(classes.languageControls, className);

  return <div className={names}>
    <Langs
      label="Choose language to edit"
      langs={langs}
      selected={activeLang}
      onChange={l => onActiveLangChange(l)} />
    <Langs
      label="Default language"
      langs={langs}
      selected={defaultLang}
      onChange={l => onDefaultLangChange(l)} />
  </div>
});

LanguageControls.propTypes = {
  langs: PropTypes.array,
  activeLang: PropTypes.string.isRequired,
  defaultLang: PropTypes.string.isRequired,
  onActiveLangChange: PropTypes.func.isRequired,
  onDefaultLangChange: PropTypes.func.isRequired
}