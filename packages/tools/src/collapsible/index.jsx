import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';

import PropTypes from 'prop-types';

export class Collapsible extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    content: PropTypes.string,
    extendTitle: PropTypes.string,
    collapseTitle: PropTypes.string
  };

  static defaultProps = {};

  state = {
    expanded: false
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, content, extendTitle, collapseTitle } = this.props;
    const title = this.state.expanded ? collapseTitle || 'Hide' : extendTitle || 'Show';

    return (
      <div>
        <div key="rationale-show-more" onClick={this.handleExpandClick}>
          <span className={classes.showRationale}>{title}</span>
        </div>
        <Collapse
          in={this.state.expanded}
          timeout="auto"
          unmountOnExit
          className={classes.collapseRationale}
        >
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Collapse>
      </div>
    );
  }
}

export default withStyles(theme => ({
  showRationale: {
    color: theme.palette.primary.light,
    borderBottom: `1px dotted ${theme.palette.primary.light}`
  },
  collapseRationale: {
    paddingTop: theme.spacing.unit * 2
  }
}))(Collapsible);
