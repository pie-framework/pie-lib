/**
 * This is a rinse of the legacy models.
 */
//showCoordinates: false, - this is 'show point coordinates' in old comp ui
// showPointLabels: true, -
//showInputs: true,
//showAxisLabels: true, - just use domain.label/range.label
//not sure what this is for
//sigfigs: -1,

export const base = {
  width: 600,
  height: 600,
  title: 'title',
  //domain is the x-axis
  domain: {
    max: 10,
    min: -10,
    label: 'x',
    labelFrequency: 1,
    step: 1,
    snap: 1,
    padding: 100
  },
  //range is the y-axis
  range: {
    max: 10,
    min: -10,
    label: 'y',
    step: 1,
    snap: 1,
    padding: 100
  }
};

export const plotPoints = Object.assign(
  {
    maxNoOfPoints: 3,
    points: [
      { x: 1, y: 1, label: 'foo' }
      // { x: -2, y: -4 },
      // { x: 0, y: 10 },
      // { x: 10, y: 3 }
    ]
  },
  base
);

//expressions: ['2x+1', '(1/3)x+2', '-2x+5']
export const graphLines = Object.assign(
  {
    lines: [
      // { from: { x: -10, y: -2 }, to: { x: 6, y: 5 } },
      { from: { x: -1, y: -1 }, to: { x: 2, y: 2 } }
    ]
  },
  base
);
export const legacy = [
  {
    weight: 1,
    componentType: 'corespring-point-intercept',
    minimumWidth: 500,
    correctResponse: ['0,0', '1,1', '2,2', '3,3'],
    allowPartialScoring: false,
    partialScoring: [{}],
    feedback: {
      correctFeedbackType: 'none',
      partialFeedbackType: 'none',
      incorrectFeedbackType: 'none'
    },
    model: {
      config: {
        graphTitle: '',
        graphWidth: 500,
        graphHeight: 500,
        maxPoints: '',
        labelsType: 'present',
        pointLabels: ['A', 'B', 'C', 'D'],
        domainLabel: '',
        domainMin: -10,
        domainMax: 10,
        domainStepValue: 1,
        domainSnapValue: 1,
        domainLabelFrequency: 1,
        domainGraphPadding: 50,
        rangeLabel: '',
        rangeMin: -10,
        rangeMax: 10,
        rangeStepValue: 1,
        rangeSnapValue: 1,
        rangeLabelFrequency: 1,
        rangeGraphPadding: 50,
        sigfigs: -1,
        showCoordinates: false,
        showPointLabels: true,
        showInputs: true,
        showAxisLabels: true,
        showFeedback: true
      }
    }
  },
  {
    weight: 1,
    clean: true,
    title: 'Graph Lines',
    componentType: 'corespring-line',
    minimumWidth: 500,
    correctResponse: '',
    feedback: {
      correctFeedbackType: 'none',
      incorrectFeedbackType: 'none'
    },
    model: {
      config: {
        graphTitle: '',
        graphWidth: 500,
        graphHeight: 500,
        domainLabel: '',
        domainMin: -10,
        domainMax: 10,
        domainStepValue: 1,
        domainSnapValue: 1,
        domainLabelFrequency: 1,
        domainGraphPadding: 50,
        rangeLabel: '',
        rangeMin: -10,
        rangeMax: 10,
        rangeStepValue: 1,
        rangeSnapValue: 1,
        rangeLabelFrequency: 1,
        rangeGraphPadding: 50,
        sigfigs: -1,
        showCoordinates: true,
        showPointLabels: true,
        showInputs: true,
        showAxisLabels: true,
        showFeedback: true
      }
    }
  },
  {
    weight: 1,
    clean: true,
    title: 'Graph Lines (Multiple)',
    componentType: 'corespring-multiple-line',
    minimumWidth: 500,
    correctResponse: [],
    allowPartialScoring: false,
    partialScoring: [{}],
    feedback: {
      correctFeedbackType: 'none',
      partialFeedbackType: 'none',
      incorrectFeedbackType: 'none'
    },
    model: {
      config: {
        graphTitle: '',
        graphWidth: 500,
        graphHeight: 500,
        sigfigs: -1,
        showCoordinates: true,
        showPointLabels: true,
        showInputs: true,
        showAxisLabels: true,
        showFeedback: true,
        exhibitOnly: false,
        domainLabel: '',
        domainMin: -10,
        domainMax: 10,
        domainStepValue: 1,
        domainSnapValue: 1,
        domainLabelFrequency: 1,
        domainGraphPadding: 50,
        rangeLabel: '',
        rangeMin: -10,
        rangeMax: 10,
        rangeStepValue: 1,
        rangeSnapValue: 1,
        rangeLabelFrequency: 1,
        rangeGraphPadding: 50,
        lines: [
          {
            id: 1,
            equation: '',
            intialLine: '',
            label: '',
            colorIndex: 0
          }
        ]
      }
    }
  }
];
