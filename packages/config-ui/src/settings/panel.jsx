import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import get from 'lodash/get';
import set from 'lodash/set';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import debug from 'debug';

import Toggle from './toggle';
import { NChoice } from '../two-choice';
import SettingsRadioLabel from './settings-radio-label';
import NumberTextField from '../number-text-field';
import Checkbox from '../checkbox';
import Typography from '@mui/material/Typography';

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

const StyledNChoice = styled(NChoice)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  width: '100%',
  '& > label': {
    color: 'rgba(0, 0, 0, 0.89)',
    transform: 'translate(0, 10px) scale(1)',
    fontSize: '14px',
  },
  '& > div': {
    marginTop: theme.spacing(2.5),
  },
}));

const Radio = ({ label, value, onChange, choices }) => {
  return (
    <StyledNChoice
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

const StyledRadio = Radio;

const StyledLabel = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.fontSize,
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  border: '2px solid lightgrey',
  borderRadius: '4px',
  padding: `0 ${theme.spacing(1)}px`,
}));

const Dropdown = ({ label, value, onChange, choices = [] }) => {
  const getItemLabel = (l) => (typeof l === 'string' ? l : l.label);
  const getItemValue = (l) => (typeof l === 'string' ? l : l.value);
  return (
    <div>
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledSelect
        value={value || (choices && choices[0])}
        onChange={({ target }) => onChange(target.value)}
        input={<Input id={`dropdown-${label}`} />}
        disableUnderline
      >
        {choices.map((l, index) => (
          <MenuItem key={index} value={getItemValue(l)}>
            {getItemLabel(l)}
          </MenuItem>
        ))}
      </StyledSelect>
    </div>
  );
};

Dropdown.propTypes = { ...baseTypes, choices: PropTypes.arrayOf(PropTypes.string) };

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(3),
  marginTop: theme.spacing(1),
}));

const TextField = ({ label }) => {
  return <StyledTypography>{label}</StyledTypography>;
};

const StyledNumberTextField = styled(NumberTextField)(({ theme }) => ({
  width: '35%',
  marginRight: theme.spacing(3),
  marginTop: theme.spacing(1),
  '& .MuiInputBase-root': {
    marginTop: theme.spacing(0.5),
    border: '2px solid lightgrey',
    borderRadius: '4px',
    padding: `0 ${theme.spacing(1)}px`,
  },
}));

const NumberField = ({ label, value, onChange = () => {}, suffix, min, max }) => {
  return (
    <StyledNumberTextField
      label={label || 'Label'}
      value={value}
      max={max}
      min={min}
      onChange={(ev, value) => onChange(value)}
      suffix={suffix}
      showErrorWhenOutsideRange
      disableUnderline
    />
  );
};

NumberField.propTypes = {
  ...baseTypes,
  suffix: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
};

TextField.propTypes = {
  ...baseTypes,
};

const ToggleWrapper = ({ disabled, label, value, onChange }) => (
  <Toggle label={label} checked={!!value} disabled={!!disabled} toggle={onChange} />
);

ToggleWrapper.propTypes = { ...baseTypes, value: PropTypes.bool };

const tagMap = {
  toggle: ToggleWrapper,
  radio: StyledRadio,
  dropdown: Dropdown,
  numberField: NumberField,
  checkbox: CheckboxChoice,
  textField: TextField,
};

const StyledGroup = styled('div')(({ theme }) => ({
  margin: `0 0 ${theme.spacing(2)}px 0`,
}));

const StyledGroupHeader = styled('div')(({ theme }) => ({
  color: '#495B8F',
  fontSize: theme.typography.fontSize + 2,
  fontWeight: 600,
  marginBottom: theme.spacing(1),
}));

const StyledNumberFields = styled('p')(({ theme }) => ({
  fontSize: theme.typography.fontSize,
  marginBottom: 0,
}));

const Group = (props) => {
  const { model, label, group, configuration, onChange } = props;

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
          <StyledNumberFields>{label}</StyledNumberFields>
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
    <StyledGroup>
      <StyledGroupHeader>{label}</StyledGroupHeader>

      {Object.keys(group).map((key) => {
        return content(group, key);
      })}
    </StyledGroup>
  );
};

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
