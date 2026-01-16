import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Settings from '../settings';
import { Options } from './fields';
import Tabs from '@mui/material/Tabs';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const Tab0 = ({ settings, model, onChange, onSettingsChange }) => (
  <TabContainer>
    <Settings model={settings} onChange={onSettingsChange} />
    <Options model={model} graphTitle={settings.graphTitle} labels={settings.labels} onChange={onChange} />
  </TabContainer>
);

const Tab1 = ({ marks }) => (
  <TabContainer>
    <pre>{JSON.stringify(marks, null, ' ')}</pre>
  </TabContainer>
);

export { Tab0, Tab1, Tabs };
