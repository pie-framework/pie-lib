import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { JssProvider, SheetsRegistry, createGenerateClassName } from 'react-jss';
import CssBaseline from '@material-ui/core/CssBaseline';
import Root from './root';

function createPageContext() {
  const theme = createMuiTheme({}); // customize your theme here
  return {
    theme,
    sheetsManager: new Map(),
    sheetsRegistry: new SheetsRegistry(),
    generateClassName: createGenerateClassName(),
  };
}

export default function withRoot(Component) {
  class WithRoot extends React.Component {
    constructor(props) {
      super(props);

      // Use the pageContext passed from _document.js (SSR) or create a new one on client
      this.pageContext = props.pageContext || createPageContext();
    }

    componentDidMount() {
      // Remove the server-side injected CSS to prevent duplication
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return (
        <JssProvider registry={this.pageContext.sheetsRegistry} generateClassName={this.pageContext.generateClassName}>
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
            generateClassName={this.pageContext.generateClassName}
          >
            <CssBaseline />
            <Root gitInfo={process.env.gitInfo} links={process.env.links} packageInfo={process.env.packageInfo}>
              <Component {...this.props} />
            </Root>
          </MuiThemeProvider>
        </JssProvider>
      );
    }
  }

  WithRoot.propTypes = {
    pageContext: PropTypes.object,
  };

  WithRoot.getInitialProps = async (ctx) => {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return pageProps;
  };

  return WithRoot;
}
