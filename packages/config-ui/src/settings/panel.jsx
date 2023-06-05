import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import get from 'lodash/get';
import set from 'lodash/set';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import debug from 'debug';

import Toggle from './toggle';
import { NChoice } from '../two-choice';
import SettingsRadioLabel from './settings-radio-label';
import { NumberTextField } from '../index';
import Checkbox from '../checkbox';
import Typography from '@material-ui/core/Typography';

const log = debug('pie-lib:config-ui:settings:panel');

const labelValue = {
  label: PropTypes.string,
  value: PropTypes.string,
};

const baseTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const CheckboxChoice = ({ label, value, onChange }) => {
  return (
    <Checkbox
      checked={value}
      label={label}
      onChange={(event) => {
        onChange(event.target.checked);
      }}
    />
  );
};

CheckboxChoice.propTypes = {
  label: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

const Radio = ({ classes, label, value, onChange, choices }) => {
  return (
    <NChoice
      className={classes.radioSettings}
      direction="horizontal"
      customLabel={SettingsRadioLabel}
      value={value}
      header={label}
      opts={choices}
      onChange={onChange}
    />
  );
};

Radio.propTypes = { ...baseTypes, choices: PropTypes.arrayOf(PropTypes.shape(labelValue)) };

const StyledRadio = withStyles((theme) => ({
  radioSettings: {
    marginTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
    width: '100%',
    '& > label': {
      color: 'rgba(0, 0, 0, 0.89)',
      transform: 'translate(0, 10px) scale(1)',
      fontSize: '14px',
    },
    '& > div': {
      marginTop: theme.spacing.unit * 2.5,
    },
  },
  label: {
    display: 'none',
  },
}))(Radio);

const Dropdown = withStyles((theme) => ({
  label: {
    margin: 0,
    fontSize: theme.typography.fontSize,
  },
  wrapper: {
    marginTop: theme.spacing.unit / 2,
    border: '2px solid lightgrey',
    borderRadius: '4px',
    padding: `0 ${theme.spacing.unit}px`,
  },
}))(({ classes, label, value, onChange, choices = [] }) => {
  return (
    <div>
      {label && <p className={classes.label}>{label}</p>}
      <Select
        className={classes.wrapper}
        value={value || (choices && choices[0])}
        onChange={({ target }) => onChange(target.value)}
        input={<Input id={`dropdown-${label}`} />}
        disableUnderline
      >
        {choices.map((l, index) => (
          <MenuItem key={index} value={l}>
            {l}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
});

Dropdown.propTypes = { ...baseTypes, choices: PropTypes.arrayOf(PropTypes.string) };

const TextField = withStyles((theme) => ({
  field: {
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit,
  },
}))(({ classes, label }) => {
  return <Typography className={classes.field}>{label}</Typography>;
});

const NumberField = withStyles((theme) => ({
  field: {
    width: '35%',
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit,
  },
  wrapper: {
    marginTop: theme.spacing.unit / 2,
    border: '2px solid lightgrey',
    borderRadius: '4px',
    padding: `0 ${theme.spacing.unit}px`,
  },
}))(({ classes, label, value, onChange = () => {}, suffix, min, max }) => {
  return (
    <NumberTextField
      label={label || 'Label'}
      value={value}
      max={max}
      min={min}
      onChange={(ev, value) => onChange(value)}
      suffix={suffix}
      className={classes.field}
      showErrorWhenOutsideRange
      inputClassName={classes.wrapper}
      disableUnderline
    />
  );
});

NumberField.propTypes = {
  ...baseTypes,
  classes: PropTypes.object,
  suffix: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
};

TextField.propTypes = {
  ...baseTypes,
};

const ToggleWrapper = ({ label, value, onChange }) => <Toggle label={label} checked={!!value} toggle={onChange} />;

ToggleWrapper.propTypes = { ...baseTypes, value: PropTypes.bool };

const tagMap = {
  toggle: ToggleWrapper,
  radio: StyledRadio,
  dropdown: Dropdown,
  numberField: NumberField,
  checkbox: CheckboxChoice,
  textField: TextField,
};

const Group = withStyles((theme) => ({
  group: {
    margin: `0 0 ${theme.spacing.unit * 2}px 0`,
  },
  groupHeader: {
    color: '#495B8F',
    fontSize: theme.typography.fontSize + 2,
    fontWeight: 600,
    marginBottom: theme.spacing.unit,
  },
  numberFields: {
    fontSize: theme.typography.fontSize,
    marginBottom: 0,
  },
}))((props) => {
  const { classes, model, label, group, configuration, onChange } = props;

  /**
   * @param group - the group of settings
   * @param key - the key(or path) to be used to set or get from model or configuration
   * @param innerKey - the key(or path) to be used to get from the group (used only for numberField type)
   * @returns tag that corresponds to element type */
  const getTag = (group, key, innerKey) => {
    const { isConfigProperty, ...properties } = get(group, innerKey || key);
    const value = isConfigProperty ? get(configuration, key) : get(model, key);
    const tagProps = { ...properties, key, value };
    const Tag = tagMap[tagProps.type];

    return <Tag key={key} {...tagProps} onChange={(v) => onChange(key, v, isConfigProperty)} />;
  };

  const content = (group, key) => {
    const currentGroup = group[key];

    if (!currentGroup) {
      return null;
    }

    const { type, label, fields, choices } = currentGroup;

    if (type === 'numberFields') {
      return (
        <div key={`numberField-${label}`}>
          <p className={classes.numberFields}>{label}</p>
          {Object.keys(fields).map((fieldKey) => {
            return getTag(group, `${key}.${fieldKey}`, `${key}.fields.${fieldKey}`);
          })}
        </div>
      );
    }

    if (type === 'checkboxes') {
      return (
        <div key={`checkbox-${label}`}>
          <p>{label}</p>
          {Object.keys(choices).map((choiceKey) => {
            return getTag(group, `${key}.${choiceKey}`, `${key}.choices.${choiceKey}`);
          })}
        </div>
      );
    }

    // if type is toggle, radio, dropdown, numberField or numberText
    return getTag(group, key);
  };

  return (
    <div className={classes.group}>
      <div className={classes.groupHeader}>{label}</div>

      {Object.keys(group).map((key) => {
        return content(group, key);
      })}
    </div>
  );
});

export class Panel extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    configuration: PropTypes.object,
    groups: PropTypes.object,
    onChangeModel: PropTypes.func,
    onChangeConfiguration: PropTypes.func,
    modal: PropTypes.object,
  };

  static defaultProps = {
    onChangeModel: () => {},
    onChangeConfiguration: () => {},
  };

  change = (key, value, isConfigProperty = false) => {
    log('[changeModel]', key, value);

    const { onChangeModel, onChangeConfiguration } = this.props;
    const model = { ...this.props.model };
    const configuration = { ...this.props.configuration };

    if (isConfigProperty) {
      set(configuration, key, value);
      onChangeConfiguration(configuration, key);
    } else {
      set(model, key, value);
      onChangeModel(model, key);
    }
  };

  render() {
    const { groups, model, configuration, modal } = this.props;

    log('render:', model);

    const renderedGroups = Object.keys(groups || {}).map((group) => {
      const showGroup = Object.entries(groups[group]).some(([, propVal]) => !!propVal);

      if (showGroup) {
        return (
          <Group
            label={group}
            key={group}
            model={model}
            configuration={configuration}
            group={groups[group]}
            onChange={this.change}
          />
        );
      }

      return null;
    });

    return (
      <div>
        {renderedGroups}
        {modal}
      </div>
    );
  }
}

export default Panel;
