import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import Toggle from './toggle';
import TwoChoice from '../two-choice';

const Setting = props => {
  const { setting, settingKey: key, classes } = props;

  if (!setting) {
    return null;
  }

  const { type, label, value, customModelUpdate, resetSession, choices } = setting;
  const change = value =>
    props.change({
      key,
      value,
      customModelUpdate,
      resetSession
    });

  switch (type) {
    case 'toggle':
      return <Toggle key={key} label={label} toggle={change} checked={!!value} />;
    case 'two-choice': {
      return (
        <TwoChoice
          key={key}
          className={classes.twoChoice}
          header={label}
          defaultSelected={choices[0]}
          value={value}
          onChange={change}
          one={{
            label: choices[0].label,
            value: choices[0].value
          }}
          two={{
            label: choices[1].label,
            value: choices[1].value
          }}
        />
      );
    }
    default:
      return null;
  }
};

Setting.propTypes = {
  setting: PropTypes.object.isRequired,
  settingKey: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired
};

const Group = props => {
  const { classes, groupKey, group } = props;

  return (
    <div className={classes.group}>
      <div className={classes.groupHeader}>{groupKey.toUpperCase()}</div>

      {Object.keys(group).map(key => (
        <Setting key={key} settingKey={key} setting={group[key]} {...props} />
      ))}
    </div>
  );
};

Group.propTypes = {
  group: PropTypes.object.isRequired,
  groupKey: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired
};

const Groups = props => {
  return Object.keys(props.settings).map(groupKey => {
    return <Group key={groupKey} groupKey={groupKey} group={props.settings[groupKey]} {...props} />;
  });
};

const styles = theme => ({
  panel: {
    backgroundColor: theme.palette.grey['100'],
    padding: '16px',
    border: `1px solid ${theme.palette.grey['300']}`,
    borderRadius: '4px'
  },
  group: {
    marginTop: '24px'
  },
  groupHeader: {
    fontSize: '10px',
    fontWeight: 500
  },
  twoChoice: {
    marginTop: '16px'
  }
});

export class SettingsPanel extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    settings: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultProps = {
    showErrorWhenOutsideRange: false,
    settings: {},
    onChange: () => {}
  };

  change = ({ key, value, customModelUpdate, resetSession }) => {
    const { onChange } = this.props;

    if (customModelUpdate) {
      onChange(customModelUpdate(key, value), resetSession);
    } else {
      onChange({ [key]: value }, resetSession);
    }
  };

  render() {
    return (
      <div className={this.props.classes.panel}>
        <Groups change={this.change} {...this.props} />
      </div>
    );
  }
}

export default withStyles(styles)(SettingsPanel);
