import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { types } from '@pie-lib/plot';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
  paddingRight: theme.spacing(1),
}));

const Nt = ({ className, label, value, onChange, variant }) => (
  <StyledTextField
    label={label}
    className={className}
    type="number"
    variant="outlined"
    value={value}
    onChange={(e) => onChange(parseFloat(e.target.value))}
  />
);

const MinMaxContainer = styled('div')({
  display: 'flex',
  flex: '0 0 auto',
});

const FillWidth = styled('div')({
  width: '100%',
});

const FillTextField = styled(TextField)({
  width: '100%',
});

class MinMax extends React.Component {
  static propTypes = {
    model: PropTypes.shape(types.BaseDomainRangeType),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
  };

  change = (key, pair) => {
    const { model, onChange } = this.props;
    onChange({ ...model, [key]: pair || 0 });
  };

  render() {
    const { model, label } = this.props;
    return (
      <div>
        <Typography variant="overline">{label}</Typography>
        <MinMaxContainer>
          <Nt label="min" value={model.min} variant="thin" onChange={(n) => this.change('min', n)} />
          <Nt label="max" value={model.max} variant="thin" onChange={(n) => this.change('max', n)} />
        </MinMaxContainer>
        <Nt
          label="tick frequency"
          value={model.step}
          onChange={(n) => this.change('step', n)}
        />
        <Nt
          label="tick label frequency"
          value={model.labelStep}
          onChange={(n) => this.change('labelStep', n)}
        />
        <FillTextField
          label="axis label"
          value={model.axisLabel}
          onChange={(e) => this.change('axisLabel', e.target.value)}
        />
      </div>
    );
  }
}

const LabelsContainer = styled('div')(({ theme }) => ({
  width: '100%',
  paddingRight: theme.spacing(1),
}));

const LabelsRow = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  paddingTop: theme.spacing(1),
}));

const LabelsField = styled(TextField)(({ theme }) => ({
  width: '100%',
  paddingRight: theme.spacing(1),
}));

const RightField = styled(TextField)({
  width: '100%',
  paddingRight: 0,
});

export class LabelsConfig extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      left: PropTypes.string,
      top: PropTypes.string,
      bottom: PropTypes.string,
      right: PropTypes.string,
    }),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    left: '',
    top: '',
    bottom: '',
    right: '',
  };

  change = (key, e) => {
    const { onChange, value } = this.props;
    onChange({ ...value, [key]: e.target.value });
  };

  render() {
    let { value } = this.props;

    value = value || {};
    return (
      <LabelsContainer>
        <LabelsRow>
          <LabelsField
            variant="outlined"
            label="left label"
            value={value.left}
            onChange={(e) => this.change('left', e)}
          />
          <RightField
            variant="outlined"
            label="top label"
            value={value.top}
            onChange={(e) => this.change('top', e)}
          />
        </LabelsRow>
        <LabelsRow>
          <LabelsField
            variant="outlined"
            label="bottom label"
            value={value.bottom}
            onChange={(e) => this.change('bottom', e)}
          />
          <RightField
            variant="outlined"
            label="right label"
            value={value.right}
            onChange={(e) => this.change('right', e)}
          />
        </LabelsRow>
      </LabelsContainer>
    );
  }
}

const OptionsContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

const DomainAndRange = styled('div')(({ theme }) => ({
  display: 'flex',
  paddingTop: theme.spacing(1),
}));

const GraphTitleField = styled(TextField)(({ theme }) => ({
  width: '100%',
  paddingRight: theme.spacing(1),
}));

export class Options extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    onChange: PropTypes.func,
    graphTitle: PropTypes.bool,
    labels: PropTypes.bool,
  };
  
  change = (name, value) => {
    const { model, onChange } = this.props;
    onChange({ ...model, [name]: value });
  };

  render = () => {
    const { model, graphTitle, labels } = this.props;
    return (
      <OptionsContainer>
        {graphTitle && (
          <GraphTitleField
            variant="outlined"
            label="Graph Title"
            value={model.title || ''}
            onChange={(e) => this.change('title', e.target.value)}
          />
        )}
        {labels && <LabelsConfig value={model.labels} onChange={(l) => this.change('labels', l)} />}
        <DomainAndRange>
          <MinMax label={'Domain (X)'} model={model.domain} onChange={(d) => this.change('domain', d)} />
          <MinMax label={'Range (Y)'} model={model.range} onChange={(d) => this.change('range', d)} />
        </DomainAndRange>
      </OptionsContainer>
    );
  };
}
