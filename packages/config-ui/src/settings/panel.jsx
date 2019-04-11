import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import Toggle from './toggle';
import TwoChoice from '../two-choice';
const log = debug('pie-lib:config-ui:settings:panel');
import _ from 'lodash';

const labelValue = {
  label: PropTypes.string,
  value: PropTypes.string
};

const baseTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const Radio = props => {
  return (
    <TwoChoice
      value={props.value}
      header={props.label}
      one={props.choices[0]}
      two={props.choices[1]}
      onChange={props.onChange}
    />
  );
};

Radio.propTypes = { ...baseTypes, choices: PropTypes.arrayOf(PropTypes.shape(labelValue)) };

const ToggleWrapper = props => (
  <Toggle label={props.label} checked={!!props.value} toggle={props.onChange} />
);

ToggleWrapper.propTypes = {
  ...baseTypes,
  value: PropTypes.bool
};

const tagMap = {
  toggle: ToggleWrapper,
  radio: Radio
};

const Group = withStyles(theme => ({
  group: {
    marginTop: theme.spacing.unit * 3
  },
  groupHeader: {
    fontSize: '10px',
    fontWeight: 500
  }
}))(props => {
  const { classes, model, label, group } = props;

  return (
    <div className={classes.group}>
      <div className={classes.groupHeader}>{label.toUpperCase()}</div>

      {Object.keys(group).map(key => {
        if (!group[key]) {
          return null;
        }
        const tagProps = { ...group[key], key, value: _.get(model, key) };
        const Tag = tagMap[tagProps.type];
        return <Tag key={key} {...tagProps} onChange={v => props.onChange(key, v)} />;
      })}
    </div>
  );
});

export class Panel extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    groups: PropTypes.object,
    onChange: PropTypes.func
  };

  changeModel = (key, value) => {
    log('[changeModel]', key, value);
    const { onChange } = this.props;
    const model = { ...this.props.model };

    _.set(model, key, value);

    onChange(model, key);
  };

  render() {
    const { groups, model } = this.props;
    log('render:', model);
    return (
      <div>
        {Object.keys(groups).map(g => (
          <Group label={g} key={g} model={model} group={groups[g]} onChange={this.changeModel} />
        ))}
      </div>
    );
  }
}

export default Panel;
