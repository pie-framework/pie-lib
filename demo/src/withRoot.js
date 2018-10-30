import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import getPageContext from './getPageContext';
import Root from './root';

const links = [
  { label: 'correct-answer-toggle', path: '/correct-answer-toggle' },
  { label: 'charting - PlotPoints', path: '/charting/plot-points' },
  { label: 'charting - GraphLines', path: '/charting/graph-lines' },
  { label: 'charting - config', path: '/charting-config' },
  { label: 'icons', path: '/icons' },
  { label: 'math-input', path: '/math-input' },
  { label: 'math-evaluator', path: '/math-evaluator' },
  { label: 'config-ui', path: '/config-ui' },
  { label: 'config-ui - numbers', path: '/config-ui/numbers' },
  { label: 'config-ui - tabs', path: '/config-ui/tabs' },
  { label: 'render-ui', path: '/render-ui' },
  { label: 'scoring-config', path: '/scoring-config' },
  { label: 'editable-html', path: '/editable-html' },
  { label: 'tools - ruler', path: '/tools/ruler' },
  { label: 'tools - protractor', path: '/tools/protractor' },
  { label: 'tools - rotatable', path: '/tools/rotatable' },
  { label: 'text-select', path: '/text-select' },
  { label: 'drag', path: '/drag' }
];

function withRoot(Component) {
  class WithRoot extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.pageContext = this.props.pageContext || getPageContext();
    }

    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    pageContext = null;

    render() {
      // MuiThemeProvider makes the theme available down the React tree thanks to React context.
      return (
        <MuiThemeProvider
          theme={this.pageContext.theme}
          sheetsManager={this.pageContext.sheetsManager}
        >
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Root links={links}>
            <Component {...this.props} />
          </Root>
        </MuiThemeProvider>
      );
    }
  }

  WithRoot.propTypes = {
    pageContext: PropTypes.object
  };

  WithRoot.getInitialProps = ctx => {
    if (Component.getInitialProps) {
      return Component.getInitialProps(ctx);
    }

    return {};
  };

  return WithRoot;
}

export default withRoot;
