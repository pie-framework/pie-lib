import React from 'react';
import { styled } from '@mui/material/styles';
import debug from 'debug';
import { GraphContainer as Graph, tools } from '@pie-lib/graphing';
import withRoot from '../../source/withRoot';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import { marks, backgroundMarks } from './demo-data';
import { Checkbox, FormControlLabel } from '@mui/material';

import { Tabs, Tab0, Tab1 } from './components/tabs';

const { allTools } = tools;

const log = debug('pie-lib:charting:graph-lines-demo');

const DemoContainer = styled('div')({
  width: '100%',
  display: 'flex',
});

export class GridDemo extends React.PureComponent {
  state = {
    settings: {
      includeArrows: {
        left: true,
        right: true,
        up: true,
        down: true,
      },
      labels: true,
      graphTitle: false,
      coordinatesOnHover: false,
      size: {
        width: 600,
        height: 600,
      },
    },
    model: {
      labels: {},
      "promptEnabled": true,
      "domain": { "min": -10, "max": 10, "step": 1, "labelStep": 0 },
      "range": { "min": -10, "max": 10, "step": 1, "labelStep": 0 },
      "backgroundMarks": [{ "type": "point", "x": 2, "y": 2 }],
      "answers": { "correctAnswer": { "name": "Correct Answer", "marks": [] } },
      "arrows": { "left": true, "right": true, "up": true, "down": true },
      "coordinatesOnHover": false,
      "defaultGridConfiguration": 0,
      "graph": { "width": 500, "height": 500 },
      "includeAxes": true,
      "labelsEnabled": true,
      "padding": true,
      "prompt": "",
      "rationale": "",
      "rationaleEnabled": true,
      "standardGrid": false,
      "studentInstructionsEnabled": true,
      "teacherInstructions": "",
      "teacherInstructionsEnabled": true,
      "title": "",
      "titleEnabled": true,
      "toolbarTools": [
        "circle",
        "line",
        "label",
        "parabola",
        "point",
        "polygon",
        "ray",
        "segment",
        "sine",
        "vector"
      ],
      "defaultTool": "circle",
      "dimensionsEnabled": true,
      "marks": marks,
    },
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  change = (model) => {
    log('[change] model:', model);
    this.setState({ model });
  };

  changeTab = (event, tabIndex) => this.setState({ indexTab: tabIndex });

  changeMarks = (marks) => this.setState({ model: { ...this.state.model, marks } });

  changeLabel = (value, position) => {
    this.setState({ model: { ...this.state.model, label: { ...this.state.model.label, [position]: value } } });
  };

  changeTitle = (title) => {
    this.setState({ model: { ...this.state.model, title } });
  };

  updateModel = (update) => {
    console.log('Updating model with:', update);
    this.setState({ model: { ...this.state.model, ...update } });
  }

  addMark = (mark) => {
    const model = {
      ...this.state.model,
      marks: this.state.model.marks.concat(mark),
    };

    this.setState({ model });
  };

  toggleToolDisplay = (tool) => {
    const { model } = this.state;
    const { toolbarTools } = model;
    const index = toolbarTools.findIndex((t) => t === tool);

    if (index < 0) {
      this.updateModel({ toolbarTools: [...toolbarTools, tool] });
      return;
    }

    const update = [...toolbarTools];
    update.splice(index, 1);
    this.updateModel({ toolbarTools: update });
  };

  setCorrectness = (correctness) => {
    const { model } = this.state;

    const marks = model.marks.map((m) => ({ ...m, correctness }));

    this.setState({ model: { ...model, marks } });
  };

  renderToolsSelector = () => {
    const { hideLabel, model } = this.state;
    const { toolbarTools } = model;

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
                  checked={!!toolbarTools.find((tool) => tool === t)}
                  value={toolbarTools.find((tool) => tool === t)}
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
    const { model, settings, mounted, tabIndex = 0, hideLabel } = this.state;

    return mounted ? (
      <div>
        <DemoContainer>
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
                onSettingsChange={(settings) => this.setState({ settings })}
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
              onChangeLabel={this.changeLabel}
              onChangeTitle={this.changeTitle}
              range={model.range}
              size={settings.size}
              disabledTitle={!settings.graphTitle}
              title={settings.graphTitle && model.title}
              toolbarTools={model.toolbarTools}
              coordinatesOnHover={settings.coordinatesOnHover}
              draggableTools={true}
              onChangeTools={(toolbarTools) => this.updateModel({ toolbarTools })}
            />
          </div>
        </DemoContainer>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const Demo = () => <GridDemo />;
export default withRoot(Demo);
