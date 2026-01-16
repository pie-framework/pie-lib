import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Root from '../source/root';

const theme = createTheme({});

const StyledTypography = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light || '#e3f2fd',
  color: theme.palette.primary.contrastText || '#1976d2',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius || '4px',
  textAlign: 'center',
}));

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mounted: false };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    if (!this.state.mounted) {
      return null; // Return nothing during SSR
    }

    return React.createElement(
      ThemeProvider,
      { theme },
      React.createElement(CssBaseline),
      React.createElement(
        Root,
        { 
          gitInfo: process.env.gitInfo, 
          links: process.env.links, 
          packageInfo: process.env.packageInfo 
        },
        React.createElement(StyledTypography, { variant: 'h4' }, 'Welcome to the @pie-libs demo')
      )
    );
  }
}

export default HomePage;
