import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import { GraphContainer as Graph, tools } from '@pie-lib/graphing';
import withRoot from '../../src/withRoot';
import Typography from '@material-ui/core/Typography';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import { marks, backgroundMarks } from './demo-data';
import { Checkbox, FormControlLabel } from '@material-ui/core';

import { Tabs, Tab0, Tab1 } from './components/tabs';

const { allTools } = tools;

const log = debug('pie-lib:charting:graph-lines-demo');

export class GridDemo extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    tools: allTools,
    settings: {
      includeArrows: true,
      labels: true,
      graphTitle: false,
      coordinatesOnHover: false,
      size: {
        width: 600,
        height: 600
      }
    },
    model: {
      labels: {
        bottom: 'TEST FOR THE LABELS',
        top: 'TEST FOR THE LABELS',
        left: 'TEST FOR THE LABELS',
        right: 'TEST FOR THE LABELS'
      },
      title: 'Title',
      domain: {
        axisLabel: '<i>domain</i>',
        min: -4.3,
        max: 5.9,
        padding: 0,
        step: 0.25,
        labelStep: 0.5
      },
      range: {
        axisLabel: '<em>range</em>',
        min: -6.2,
        max: 5.1,
        padding: 0,
        step: 0.67,
        labelStep: 0.67
      },
      backgroundMarks: backgroundMarks,
      marks: marks
    }
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  change = model => {
    log('[change] model:', model);
    this.setState({ model });
  };

  changeTab = (event, tabIndex) => this.setState({ indexTab: tabIndex });

  changeMarks = marks => this.setState({ model: { ...this.state.model, marks } });

  addMark = mark => {
    const model = {
      ...this.state.model,
      marks: this.state.model.marks.concat(mark)
    };

    this.setState({ model });
  };

  toggleToolDisplay = tool => {
    const index = this.state.tools.findIndex(t => t === tool);

    if (index < 0) {
      this.setState({ tools: [...this.state.tools, tool] });

      return;
    }

    const update = [...this.state.tools];

    update.splice(index, 1);

    this.setState({ tools: update });
  };

  setCorrectness = correctness => {
    const { model } = this.state;

    const marks = model.marks.map(m => ({ ...m, correctness }));

    this.setState({ model: { ...model, marks } });
  };

  renderToolsSelector = () => {
    const { hideLabel, tools } = this.state;

    return (
      <div>
        <Typography>Show tool in Toolbar:</Typography>
        {allTools.map((t, index) => {
          return (
            <FormControlLabel
              key={`${index}-${t}`}
              label={t}
              control={
                <Checkbox
                  checked={!!tools.find(tool => tool === t)}
                  value={tools.find(tool => tool === t)}
                  onChange={() => this.toggleToolDisplay(t)}
                />
              }
            />
          );
        })}
        <FormControlLabel
          key="label"
          label="label"
          control={
            <Checkbox
              checked={!hideLabel}
              value="hideLabel"
              onChange={() => this.setState({ hideLabel: !hideLabel })}
            />
          }
        />
      </div>
    );
  };

  render() {
    log('render..');
    const { classes } = this.props;
    const { model, settings, mounted, tabIndex = 0, hideLabel, tools: stateTools } = this.state;

    return mounted ? (
      <div>
        <div className={classes.demo}>
          <div>
            <Tabs value={tabIndex} onChange={this.changeTab}>
              <Tab label="Config" />
              <Tab label="State" />
            </Tabs>
            {tabIndex === 0 && (
              <Tab0
                model={model}
                settings={settings}
                onChange={this.change}
                onSettingsChange={settings => this.setState({ settings })}
              />
            )}
            {tabIndex === 1 && <Tab1 marks={model.marks} />}
          </div>

          <div>
            <div>
              <Button onClick={() => this.setCorrectness('correct')}>Correct</Button>
              <Button onClick={() => this.setCorrectness('incorrect')}>Incorrect</Button>
              <Button onClick={() => this.setCorrectness()}>none</Button>
            </div>

            {this.renderToolsSelector()}

            <Graph
              axesSettings={{ includeArrows: settings.includeArrows }}
              backgroundMarks={model.backgroundMarks}
              domain={model.domain}
              hideLabel={hideLabel}
              labels={settings.labels && model.labels}
              marks={model.marks}
              onChangeMarks={this.changeMarks}
              range={model.range}
              size={settings.size}
              title={model.title}
              toolbarTools={stateTools}
              coordinatesOnHover={settings.coordinatesOnHover}
            />
          </div>
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
