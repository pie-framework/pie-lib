import { settings } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../src/withRoot';

const { Panel, toggle, radio, dropdown, numberFields, numberField } = settings;

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
        equationEditor: 'geometry',
        graph: {
          domain: 1,
          range: 12,
          width: 100
        }
      },
      configuration: {
        orientationLabel: 'Orientation',
        placementAreaLabel: 'Placement Area',

        settingsPlacementArea: true,
        settingsOrientation: true,
        editChoiceLabel: false,
        height: 200
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
    const { mounted, model, configuration } = this.state;

    return mounted ? (
      <div className={classes.root}>
        <Typography>Settings panel</Typography>
        <br />
        <Typography>
          Panel receives onChangeModel (parameters: model and key of the updated property) and
          onChangeConfiguration (parameters: configuration and key of the updated property) and
          groups (settings can be grouped, eg.: Item Type, Group Two). Each key for a setting is the
          key found for that setting in the model (eg.: placementArea for model.placementArea,
          choiceAreaLayout for model.choiceAreaLayout, editChoiceLabel for
          configuration.editChoiceLabel). Each setting can be one of these types: toggle or radio.
          If the key that has to be updated is found in configuration not in model, then toggle &
          radio require a new parameter that has to be set on true.
        </Typography>
        <div className={classes.settingsPanel}>
          <pre>
            Model:
            {JSON.stringify(model, null, '  ')}
            {'\n'}
            Configuration:
            {JSON.stringify(configuration, null, '  ')}
          </pre>

          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={(model, key) => {
              this.setState({ model, lastKey: key });
            }}
            onChangeConfiguration={(configuration, key) => {
              this.setState({ configuration, lastKey: key });
            }}
            groups={{
              'Item Type': {
                placementArea:
                  configuration.settingsPlacementArea && toggle(configuration.placementAreaLabel),
                choiceAreaLayout:
                  configuration.settingsOrientation &&
                  radio(configuration.orientationLabel, ['vertical', 'horizontal']),
                editChoiceLabel: toggle('Edit choice label', true),
                equationEditor: dropdown('Dropdown', [
                  'geometry',
                  'advanced-algebra',
                  'statistics',
                  'miscellaneous'
                ]),
                graph: numberFields('Graph Display Size', {
                  domain: {
                    label: 'Domain',
                    suffix: 'px'
                  },
                  range: {
                    label: 'Range',
                    suffix: 'px'
                  },
                  width: {
                    label: 'Width',
                    suffix: 'px',
                    min: 50,
                    max: 250
                  }
                })
              },
              'Group Two': {
                bar: toggle('This is bar'),
                height: numberField('Height', null, true)
              }
            }}
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
