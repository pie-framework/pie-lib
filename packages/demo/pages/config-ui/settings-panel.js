import { SettingsPanel } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../src/withRoot';

export const generateSettingsSample = model => {
  const {
    configure: {
      placementAreaLabel,
      orientationLabel,

      settingsPlacementArea,
      settingsOrientation
    },
    choiceAreaLayout,
    placementArea
  } = model;

  const itemTypeLabel = 'Item Type';

  const itemTypeItems = {
    placementArea: settingsPlacementArea && {
      label: placementAreaLabel,
      value: placementArea,
      type: 'toggle'
    },
    choiceAreaLayout: settingsOrientation && {
      label: orientationLabel,
      value: choiceAreaLayout,
      type: 'two-choice',
      choices: [
        {
          label: 'Vertical',
          value: 'vertical'
        },
        {
          label: 'Horizontal',
          value: 'horizontal'
        }
      ],
      resetSession: true
    }
  };

  return {
    [itemTypeLabel]: itemTypeItems
  };
};

export const generateSettingsComplexSample = model => {
  const customModelUpdate = (key, value) => {
    return {
      configure: {
        ...model.configure,
        [key]: value
      }
    };
  };

  const {
    configure: {
      choiceLabel,
      scoringTypeLabel,

      settingsChoiceLabel,
      editableChoiceLabel
    },
    scoringType
  } = model;

  const itemTypeLabel = 'Item Type';

  const itemTypeItems = {
    editableChoiceLabel: settingsChoiceLabel && {
      value: editableChoiceLabel,
      label: choiceLabel,
      type: 'toggle',
      customModelUpdate,
      resetSession: true
    }
  };

  const propertiesLabel = 'Properties';

  const propertiesItems = {
    scoringType: {
      label: scoringTypeLabel || 'Scoring Type',
      value: scoringType || 'rubric',
      type: 'two-choice',
      choices: [
        {
          label: 'Auto',
          value: 'auto'
        },
        {
          label: 'Rubric',
          value: 'rubric'
        }
      ]
    }
  };

  return {
    [itemTypeLabel]: itemTypeItems,
    [propertiesLabel]: propertiesItems
  };
};

class RawContainer extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      model: {
        choiceAreaLayout: 'vertical',
        placementArea: true,
        configure: {
          orientationLabel: 'Orientation',
          placementAreaLabel: 'Placement Area',

          settingsPlacementArea: true,
          settingsOrientation: true
        }
      },
      modelCustom: {
        choiceAreaLayout: 'vertical',
        configure: {
          choiceLabel: 'Choice label',
          settingsChoiceLabel: true,
          editableChoiceLabel: false
        }
      }
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  onChange = (model, resetSession, modelKey) =>
    this.setState({ [modelKey]: { ...this.state[modelKey], ...model } });

  render() {
    const { classes } = this.props;
    const { mounted, model, modelCustom } = this.state;

    return mounted ? (
      <div className={classes.root}>
        <Typography>Settings panel</Typography>
        <br />
        <Typography>
          SettingsPanel receives onChange (updates model with params) and settings. Settings can be
          grouped (eg.: Item Type, Properties). Each key for a setting is the key found for that
          setting in the model (eg.: placementArea for model.placementArea, choiceAreaLayout for
          model.choiceAreaLayout). Each setting can have a type (toggle/two-choice) and optional
          propperties depending on setting type (eg.: choices for two-choice, resetSession if the
          session has to be reset when updating the model).
        </Typography>
        <div className={classes.settingsPanel}>
          <pre>
            Model:
            {JSON.stringify(model, null, '  ')}
            {'\n'}
            Settings:
            {JSON.stringify(generateSettingsSample(model), null, '  ')}
          </pre>
          <SettingsPanel
            key="settings-panel"
            onChange={(model, resetSession) => this.onChange(model, resetSession, 'model')}
            settings={generateSettingsSample(model)}
          />
        </div>
        <Typography>Settings panel custom</Typography>
        <br />
        <Typography>
          The key for a setting can be also the key found for that setting in the model.configure
          (eg.: editableChoiceLabel for model.configure.editableChoiceLabel). For this case, each
          setting can have customModelUpdate property, which is a function that returns the custom
          updated model which is after that used in onChange function.
        </Typography>
        <div className={classes.settingsPanel}>
          <pre>
            Model:
            {JSON.stringify(modelCustom, null, '  ')}
            {'\n'}
            Settings:
            {JSON.stringify(
              generateSettingsComplexSample(modelCustom),
              (key, value) => {
                if (typeof value === 'function') {
                  return 'function () {}';
                } else {
                  return value;
                }
              },
              '  '
            )}
          </pre>
          <SettingsPanel
            key="customized-settings-panel"
            onChange={(model, resetSession) => this.onChange(model, resetSession, 'modelCustom')}
            settings={generateSettingsComplexSample(modelCustom)}
          />
        </div>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const Container = withStyles(theme => ({
  root: {},
  tabContent: {
    padding: theme.spacing.unit
  },
  left: {
    flex: 1
  },
  code: {
    position: 'fixed'
  },
  right: {
    flex: 0.3
  },
  smallTextField: {
    width: '100px'
  },
  settingsPanel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}))(RawContainer);

export default withRoot(Container);
