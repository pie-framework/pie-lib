import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import getPageContext from './getPageContext';
import Root from './root';
// import links from './links';

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
          <Root
            // eslint-disable-next-line
            gitInfo={process.env.gitInfo}
            // eslint-disable-next-line
            links={process.env.links}
            // eslint-disable-next-line
            packageInfo={process.env.packageInfo}
          >
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
