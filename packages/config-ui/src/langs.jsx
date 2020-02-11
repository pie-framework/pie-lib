import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
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

export class RawLangs extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    langs: PropTypes.array,
    selected: PropTypes.string,
    label: PropTypes.string,
    classes: PropTypes.object.isRequired,
    uid: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.uid = props.uid || (Math.random() * 10000).toFixed();
  }

  choose = event => {
    log('[choose] event: ', event);
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  };

  render() {
    let { langs, selected, label, classes } = this.props;
    log('[render] selected:', selected);
    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <InputLabel className={classes.inputLabel} htmlFor={this.uid}>
            {label}
          </InputLabel>
          <Select value={selected} onChange={this.choose} input={<Input id={this.uid} />}>
            {langs.map((l, index) => (
              <MenuItem key={index} value={l}>
                {l}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
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
})(
  ({
    classes,
    langs,
    activeLang,
    defaultLang,
    onActiveLangChange,
    onDefaultLangChange,
    className
  }) => {
    const names = classNames(classes.languageControls, className);

    return (
      <div className={names}>
        <Langs
          label="Choose language to edit"
          langs={langs}
          selected={activeLang}
          onChange={l => onActiveLangChange(l)}
        />
        <Langs
          label="Default language"
          langs={langs}
          selected={defaultLang}
          onChange={l => onDefaultLangChange(l)}
        />
      </div>
    );
  }
);

LanguageControls.propTypes = {
  langs: PropTypes.array,
  activeLang: PropTypes.string.isRequired,
  defaultLang: PropTypes.string.isRequired,
  onActiveLangChange: PropTypes.func.isRequired,
  onDefaultLangChange: PropTypes.func.isRequired
};
