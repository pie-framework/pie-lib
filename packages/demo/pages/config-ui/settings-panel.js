import { settings } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../src/withRoot';

const { Panel, toggle, radio } = settings;

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
          settingsOrientation: true,
          editChoiceLabel: false
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
    const { mounted, model } = this.state;
    const { configure } = model;

    return mounted ? (
      <div className={classes.root}>
        <Typography>Settings panel</Typography>
        <br />
        <Typography>
          Panel receives onChange (parameters: model and key of the updated property) and groups
          (settings can be grouped, eg.: Item Type, Group Two). Each key for a setting is the key
          found for that setting in the model (eg.: placementArea for model.placementArea,
          choiceAreaLayout for model.choiceAreaLayout) or the path to the key (eg.:
          `configure.editChoiceLabel` for model.configure.editChoiceLabel). Each setting can be one
          of these types: toggle or radio.
        </Typography>
        <div className={classes.settingsPanel}>
          <pre>
            Model:
            {JSON.stringify(model, null, '  ')}
          </pre>

          <Panel
            model={model}
            onChange={(model, key) => {
              this.setState({ model, lastKey: key });
            }}
            groups={{
              'Item Type': {
                placementArea:
                  configure.settingsPlacementArea && toggle(configure.placementAreaLabel),
                choiceAreaLayout:
                  configure.settingsOrientation &&
                  radio(configure.orientationLabel, 'vertical', 'horizontal'),
                'configure.editChoiceLabel': toggle('Edit choice label')
              },
              'Group Two': {
                bar: toggle('This is bar')
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
