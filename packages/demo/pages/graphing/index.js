import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import { GraphContainer as Graph, tools } from '@pie-lib/graphing';
import { types } from '@pie-lib/plot';
import withRoot from '../../src/withRoot';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import Settings from './settings';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const log = debug('pie-lib:charting:graph-lines-demo');

const Nt = withStyles(theme => ({
  nt: {
    marginTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit
  },
  thin: {
    // maxWidth: '100px'
  }
}))(({ className, label, value, onChange, classes, variant }) => (
  <TextField
    label={label}
    className={classNames(classes.nt, classes[variant], className)}
    type="number"
    variant="outlined"
    value={value}
    onChange={e => onChange(parseInt(e.target.value, 10))}
  />
));

class RawMinMax extends React.Component {
  static propTypes = {
    model: PropTypes.shape(types.BaseDomainRangeType),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
  };

  change = (key, pair) => {
    const { model, onChange } = this.props;
    onChange({ ...model, [key]: pair });
  };

  render() {
    const { model, label, classes } = this.props;
    return (
      <div>
        <Typography variant="overline">{label}</Typography>
        <div className={classes.minMax}>
          <Nt label="min" value={model.min} variant="thin" onChange={n => this.change('min', n)} />
          <Nt label="max" value={model.max} variant="thin" onChange={n => this.change('max', n)} />
        </div>
        <Nt
          label="tick frequency"
          value={model.step}
          className={classes.fill}
          onChange={n => this.change('step', n)}
        />
        <Nt
          label="tick label frequency"
          value={model.labelStep}
          className={classes.fill}
          onChange={n => this.change('labelStep', n)}
        />
        <TextField
          label="axis label"
          value={model.axisLabel}
          className={classes.fill}
          onChange={e => this.change('axisLabel', e.target.value)}
        />
      </div>
    );
  }
}

const MinMax = withStyles(theme => ({
  minMax: {
    display: 'flex',
    flex: '0 0 auto'
  },
  fill: {
    width: '100%'
  }
}))(RawMinMax);

export class RawLabels extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      left: PropTypes.string,
      top: PropTypes.string,
      bottom: PropTypes.string,
      right: PropTypes.string
    }),
    onChange: PropTypes.func,
    classes: PropTypes.object
  };

  static defaultProps = {
    left: '',
    top: '',
    bottom: '',
    right: ''
  };

  change = (key, e) => {
    const { onChange, value } = this.props;
    onChange({ ...value, [key]: e.target.value });
  };

  render() {
    let { value, classes } = this.props;

    value = value || {};
    return (
      <div className={classes.labels}>
        <div className={classes.row}>
          <TextField
            variant="outlined"
            label="left label"
            className={classes.field}
            value={value.left}
            onChange={e => this.change('left', e)}
          />
          <TextField
            variant="outlined"
            className={classNames(classes.field, classes.rightField)}
            label="top label"
            value={value.top}
            onChange={e => this.change('top', e)}
          />
        </div>
        <div className={classes.row}>
          <TextField
            variant="outlined"
            label="bottom label"
            className={classes.field}
            value={value.bottom}
            onChange={e => this.change('bottom', e)}
          />
          <TextField
            variant="outlined"
            className={classNames(classes.field, classes.rightField)}
            label="right label"
            value={value.right}
            onChange={e => this.change('right', e)}
          />
        </div>
      </div>
    );
  }
}
const LabelsConfig = withStyles(theme => ({
  labels: {
    width: '100%',
    paddingRight: theme.spacing.unit
  },
  row: {
    width: '100%',
    display: 'flex',
    paddingTop: theme.spacing.unit
  },
  field: {
    width: '100%',
    paddingRight: theme.spacing.unit
  },
  rightField: {
    paddingRight: 0
  }
}))(RawLabels);

export class RawOptions extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    classes: PropTypes.object,
    onChange: PropTypes.func,
    graphTitle: PropTypes.bool,
    labels: PropTypes.bool
  };
  change = (name, value) => {
    const { model, onChange } = this.props;
    onChange({ ...model, [name]: value });
  };

  render = () => {
    const { model, classes, graphTitle, labels } = this.props;
    return (
      <div className={classes.options}>
        {graphTitle && (
          <TextField
            variant="outlined"
            label="Graph Title"
            className={classes.graphTitle}
            value={model.title || ''}
            onChange={e => this.change('title', e.target.value)}
          />
        )}
        {labels && <LabelsConfig value={model.labels} onChange={l => this.change('labels', l)} />}
        <div className={classes.domainAndRange}>
          <MinMax
            label={'Domain (X)'}
            model={model.domain}
            onChange={d => this.change('domain', d)}
          />
          <MinMax label={'Range (Y)'} model={model.range} onChange={d => this.change('range', d)} />
        </div>
      </div>
    );
  };
}

const Options = withStyles(theme => ({
  domainAndRange: {
    display: 'flex',
    paddingTop: theme.spacing.unit
  },
  options: {
    paddingTop: theme.spacing.unit
  },
  graphTitle: {
    width: '100%',
    paddingRight: theme.spacing.unit
  }
}))(RawOptions);

export class GridDemo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const toolsArr = [
      tools.point(),
      tools.circle(),
      tools.polygon(),
      tools.segment(),
      tools.vector()
    ];
    this.state = {
      currentTool: toolsArr[2],
      tools: toolsArr,
      settings: {
        includeArrows: true,
        labels: true,
        padding: true,
        graphTitle: false,
        coordinatesOnHover: false,
        size: {
          width: 600,
          height: 600
        }
      },
      model: {
        title: undefined,
        domain: {
          min: -5,
          max: 5,
          padding: 0,
          step: 1,
          labelStep: 1
        },
        range: {
          min: -5,
          max: 5,
          padding: 0,
          step: 1,
          labelStep: 1
        },
        backgroundMarks: [
          {
            type: 'polygon',
            points: [
              {
                x: -2,
                y: -2
              },
              {
                x: -2,
                y: -3
              },
              {
                x: -1,
                y: -4
              },
              {
                x: 1,
                y: -3
              },
              {
                x: 1,
                y: -2
              },
              {
                x: -1,
                y: -3
              },
              {
                x: 0,
                y: -1
              },
              {
                x: -3,
                y: -1
              },
              {
                x: -3,
                y: -2
              }
            ],
            closed: true
          },
          {
            type: 'segment',
            from: {
              x: -5,
              y: 5
            },
            to: {
              x: -4,
              y: 5
            }
          },
          {
            type: 'vector',
            from: {
              x: 5,
              y: 5
            },
            to: {
              x: 4,
              y: 5
            }
          }
        ],
        marks: [
          // {
          //   disabled: true,
          //   type: 'polygon',
          //   points: [
          //     {
          //       x: -2,
          //       y: -2
          //     },
          //     {
          //       x: -2,
          //       y: -3
          //     },
          //     {
          //       x: -1,
          //       y: -4
          //     },
          //     {
          //       x: 1,
          //       y: -3
          //     },
          //     {
          //       x: 1,
          //       y: -2
          //     },
          //     {
          //       x: -1,
          //       y: -3
          //     },
          //     {
          //       x: 0,
          //       y: -1
          //     },
          //     {
          //       x: -3,
          //       y: -1
          //     },
          //     {
          //       x: -3,
          //       y: -2
          //     }
          //   ],
          //   closed: true
          // },
          // {
          //   type: 'circle',
          //   disabled: true,
          //   correctness: 'correct',
          //   center: {
          //     x: -4,
          //     y: 3
          //   },
          //   outerPoint: {
          //     x: -3,
          //     y: 2
          //   }
          // },
          // {
          //   type: 'circle',
          //   disabled: true,
          //   center: {
          //     x: -4,
          //     y: -4
          //   },
          //   outerPoint: {
          //     x: -3,
          //     y: -3
          //   }
          // },
          // {
          //   type: 'circle',
          //   correctness: 'incorrect',
          //   disabled: true,
          //   center: {
          //     x: 1,
          //     y: 3
          //   },
          //   outerPoint: {
          //     x: 2,
          //     y: 4
          //   }
          // },
          {
            type: 'point',
            x: 3,
            y: 3
          }
          // {
          //   disabled: true,
          //   correctness: 'correct',
          //   type: 'point',
          //   x: 2,
          //   y: 3
          // }
          // {
          //   type: 'polygon',
          //   //??
          //   closed: true,
          //   points: [
          //     { x: -1, y: 1 },
          //     { x: 4, y: 2 },
          //     { x: 3, y: 1 },
          //     { x: 5, y: -3 }
          //   ]
          // }
          // { type: 'point', x: 1, y: 1 },
          // {
          //   type: 'circle',
          //   center: { x: -2, y: 2 },
          //   outerPoint: { x: -3, y: 3 }
          // }
        ]
      }
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  change = model => {
    log('[change] model:', model);
    this.setState({ model });
  };

  changeTab = (event, tabIndex) => {
    this.setState({ indexTab: tabIndex });
  };

  changeMarks = marks => {
    log('[changeMarks]  ---->', marks);
    const model = { ...this.state.model, marks };
    this.setState({ model });
  };

  addMark = mark => {
    const model = {
      ...this.state.model,
      marks: this.state.model.marks.concat(mark)
    };

    this.setState({ model });
  };

  changeCurrentTool = currentTool => {
    this.setState({ currentTool });
  };

  render() {
    log('render..');
    const { classes } = this.props;
    const { model, settings, mounted, tabIndex = 0 } = this.state;

    log('settings:', settings);
    return mounted ? (
      <div>
        <div className={classes.demo}>
          <div>
            <Tabs value={tabIndex} onChange={this.changeTab}>
              <Tab label="Config" />
              <Tab label="State" />
            </Tabs>
            {tabIndex === 0 && (
              <TabContainer>
                <Settings model={settings} onChange={settings => this.setState({ settings })} />
                <Options
                  model={model}
                  graphTitle={settings.graphTitle}
                  labels={settings.labels}
                  onChange={this.change}
                />
              </TabContainer>
            )}
            {tabIndex === 1 && (
              <TabContainer>
                <pre>{JSON.stringify(this.state.model.marks, null, ' ')}</pre>
              </TabContainer>
            )}
          </div>
          <div>
            <Graph
              size={settings.size}
              domain={model.domain}
              range={model.range}
              title={model.title}
              axesSettings={{
                includeArrows: settings.includeArrows
              }}
              labels={settings.labels && model.labels}
              marks={model.marks}
              backgroundMarks={model.backgroundMarks}
              onChangeMarks={this.changeMarks}
              tools={this.state.tools}
              currentTool={this.state.currentTool}
              defaultTool={this.state.tools[0].type}
            />
          </div>
        </div>

        <div>
          <h4>Question</h4>
          <ul>
            <li>How to delete marks? </li>
            <li>Can marks be selected? </li>
            <li>Padding toggle what does it do? </li>
          </ul>
        </div>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const styles = {
  demo: {
    width: '100%',
    display: 'flex'
  }
};

export const Styled = withStyles(styles)(GridDemo);
const Demo = () => <Styled />;
export default withRoot(Demo);
