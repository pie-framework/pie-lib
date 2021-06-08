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
import TwoChoice from '../two-choice';
import SettingsRadioLabel from './settings-radio-label';
import { NumberTextField } from '../index';
import Checkbox from '../checkbox';

const log = debug('pie-lib:config-ui:settings:panel');

const labelValue = {
  label: PropTypes.string,
  value: PropTypes.string
};

const baseTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const CheckboxChoice = ({ label, value, onChange }) => {
  return (
    <Checkbox
      checked={value}
      label={label}
      onChange={event => {
        onChange(event.target.checked);
      }}
    />
  );
};

CheckboxChoice.propTypes = {
  label: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func
};

const Radio = ({ classes, label, value, onChange, choices }) => {
  return (
    <TwoChoice
      className={classes.radioSettings}
      direction="vertical"
      customLabel={SettingsRadioLabel}
      value={value}
      header={label}
      one={choices[0]}
      two={choices[1]}
      onChange={onChange}
    />
  );
};

Radio.propTypes = { ...baseTypes, choices: PropTypes.arrayOf(PropTypes.shape(labelValue)) };

const StyledRadio = withStyles({
  radioSettings: {
    marginTop: '4px',
    paddingBottom: '4px',
    width: '100%',
    '& > label': {
      color: 'rgba(0, 0, 0, 0.89)',
      transform: 'translate(0, 10px) scale(1)',
      fontSize: '14px'
    },
    '& > div': {
      marginTop: '20px'
    }
  },
  label: {
    display: 'none'
  }
})(Radio);

const Dropdown = withStyles({
  label: {
    margin: 0,
    fontSize: '14px'
  },
  wrapper: {
    marginTop: '4px',
    border: '2px solid lightgrey',
    borderRadius: '4px',
    padding: '0 8px'
  }
})(({ classes, label, value, onChange, choices = [] }) => {
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

const NumberField = withStyles({
  field: {
    width: '35%',
    marginRight: '24px',
    marginTop: '8px'
  },
  wrapper: {
    marginTop: '4px',
    border: '2px solid lightgrey',
    borderRadius: '4px',
    padding: '0 8px'
  }
})(({ classes, label, value, onChange = () => {}, suffix, min, max }) => {
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
  value: PropTypes.number
};

const ToggleWrapper = ({ label, value, onChange }) => (
  <Toggle label={label} checked={!!value} toggle={onChange} />
);

ToggleWrapper.propTypes = { ...baseTypes, value: PropTypes.bool };

const tagMap = {
  toggle: ToggleWrapper,
  radio: StyledRadio,
  dropdown: Dropdown,
  numberField: NumberField,
  checkbox: CheckboxChoice
};

const Group = withStyles(() => ({
  group: {
    margin: '0 0 25px 0'
  },
  groupHeader: {
    color: '#495B8F',
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '8px'
  },
  numberFields: {
    fontSize: '0.85rem',
    marginBottom: 0
  }
}))(props => {
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

    return <Tag key={key} {...tagProps} onChange={v => onChange(key, v, isConfigProperty)} />;
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
          {Object.keys(fields).map(fieldKey => {
            return getTag(group, `${key}.${fieldKey}`, `${key}.fields.${fieldKey}`);
          })}
        </div>
      );
    }

    if (type === 'checkboxes') {
      return (
        <div key={`checkbox-${label}`}>
          <p>{label}</p>
          {Object.keys(choices).map(choiceKey => {
            return getTag(group, `${key}.${choiceKey}`, `${key}.choices.${choiceKey}`);
          })}
        </div>
      );
    }

    // if type is toggle, radio, dropdown or numberField
    return getTag(group, key);
  };

  return (
    <div className={classes.group}>
      <div className={classes.groupHeader}>{label}</div>

      {Object.keys(group).map(key => {
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
    onChangeConfiguration: PropTypes.func
  };

  static defaultProps = {
    onChangeModel: () => {},
    onChangeConfiguration: () => {}
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
    const { groups, model, configuration } = this.props;
    log('render:', model);

    return (
      <div>
        {Object.keys(groups).map(g => (
          <Group
            label={g}
            key={g}
            model={model}
            configuration={configuration}
            group={groups[g]}
            onChange={this.change}
          />
        ))}
      </div>
    );
  }
}

export default Panel;
