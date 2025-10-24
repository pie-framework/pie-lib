import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import debug from 'debug';
import withRoot from '../../source/withRoot';
import Settings from './settings';
// import { Chart, chartTypes } from '@pie-lib/charting'; - mathquill error window not defined
let Chart, chartTypes;

if (typeof window !== 'undefined') {
  ({ Chart, chartTypes } = require('@pie-lib/charting'));
}

import Options from './options';
import editableHtml from '../editable-html/editable-html';

const log = debug('pie-lib:charting:graph-lines-demo');

const DemoContainer = styled('div')({
  width: '100%',
  display: 'flex',
});

const createCategory = (label, value) => ({
  label,
  value,
  initial: true,
  interactive: true,
  editable: true,
  deletable: true,
});

export class ChartDemo extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    // Store base data without correctness properties
    this.baseData = [
      {
        "label": "a",
        "value": 1,
        "interactive": true
      },
      {
        "label": "b",
        "value": 2,
        "interactive": true
      },
      {
        "label": "c",
        "value": 1,
        "interactive": true
      },
      {
        "label": "d",
        "value": 2,
        "interactive": true
      },
      {
        "label": "e",
        "value": 3,
        "interactive": true
      }
    ];

    // Store correctness data separately
    this.correctnessData = [
      {
        "value": "correct",
        "label": "correct"
      },
      {
        "value": "incorrect",
        "label": "incorrect"
      },
      {
        "value": "incorrect",
        "label": "incorrect"
      },
      {
        "value": "correct",
        "label": "correct"
      },
      {
        "value": "correct",
        "label": "correct"
      }
    ];

    this.state = {
      settings: {
        size: {
          width: 600,
          height: 600,
        },
      },
      model: {
        "addCategoryEnabled": false,
        "chartType": "lineDot",
        "data": this.baseData,
        "domain": {
          "label": "<div></div>"
        },
        "graph": {
          "width": 480,
          "height": 480
        },
        "prompt": "<div></div>",
        "range": {
          "max": 5,
          "min": 0,
          "labelStep": 1,
          "step": 0.1,
          "label": "<div></div>"
        },
        "rationale": null,
        "title": "<div></div>",
        "size": {
          "width": 480,
          "height": 480
        },
        "showToggle": true,
        "correctness": {
          "correctness": "incorrect",
          "score": "0%"
        },
        "disabled": true,
        "scoringType": "all or nothing",
        "studentNewCategoryDefaultLabel": "New Category",
        "env": {
          "mode": "evaluate",
          "role": "student"
        },
        "correctAnswer": {
          "data": [
            {
              "label": "a",
              "value": 1
            },
            {
              "label": "b",
              "value": 1
            },
            {
              "label": "c",
              "value": 3
            },
            {
              "label": "d",
              "value": 2
            },
            {
              "label": "e",
              "value": 3
            }
          ]
        },
        correctData: [
          {
            "label": "a",
            "value": 1,
            "interactive": false,
            editable: false
          },
          {
            "label": "b",
            "value": 1,
            "interactive": false,
            editable: false
          },
          {
            "label": "c",
            "value": 3,
            "interactive": false,
            editable: false
          },
          {
            "label": "d",
            "value": 2,
            "interactive": false,
            editable: false
          },
          {
            "label": "e",
            "value": 3,
            "interactive": false,
            editable: false
          }
        ],
        charts: [
          chartTypes.Bar(),
          chartTypes.Histogram(),
          chartTypes.LineDot(),
          chartTypes.LineCross(),
          chartTypes.DotPlot(),
          chartTypes.LinePlot(),
        ],
        "showKeyLegend": true,
        "teacherInstructions": null
      },
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate(prevProps, prevState) {
    const currentDisplayWithCorrectness = this.state.model.displayWithCorrectness;
    const prevDisplayWithCorrectness = prevState.model.displayWithCorrectness;

    // Only update if displayWithCorrectness changed
    if (currentDisplayWithCorrectness !== prevDisplayWithCorrectness) {
      console.log('Updating data with correctness:', currentDisplayWithCorrectness);
      this.updateDataWithCorrectness(currentDisplayWithCorrectness);
    }
  }

  updateDataWithCorrectness = (displayWithCorrectness) => {
    const newData = displayWithCorrectness 
      ? this.baseData.map((item, index) => ({
          ...item,
          correctness: this.correctnessData[index]
        }))
      : this.baseData.map(item => ({ ...item }));

    this.setState(prevState => ({
      model: {
        ...prevState.model,
        data: newData
      }
    }));
  };

  change = (model) => {
    log('[change] model:', model);
    this.setState({ model });
  };

  changeTab = (event, tabIndex) => {
    this.setState({ indexTab: tabIndex });
  };

  changeData = (data) => {
    const model = { ...this.state.model, data };
    this.setState({ model });
  };

  mapCorrectData = (data) => {
    return data.map((dataPoint) => ({
      ...dataPoint,
      interactive: false,
      editable: false,
    }));
  };

  render() {
    const { model, settings, mounted } = this.state;

    log('settings:', settings);

    return mounted ? (
      <div>
        <DemoContainer>
          <div>
            <Settings model={settings} onChange={(settings) => this.setState({ settings })} />
            <Options model={model} onChange={this.change} />
          </div>
          <div>
            <Chart
              chartType={model.chartType}
              size={settings.size}
              domain={model.domain}
              range={model.range}
              charts={model.charts}
              data={model.data}
              title={model.title}
              onDataChange={this.changeData}
              editCategoryEnabled={model.editCategoryEnabled}
              addCategoryEnabled={model.addCategoryEnabled}
              categoryDefaultLabel={model.categoryDefaultLabel}
              correctData={model.displayWithCorrectness ? model.correctData : undefined}
            />
          </div>
        </DemoContainer>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(ChartDemo);
