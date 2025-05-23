import React from 'react';
import { withStyles } from '@material-ui/core/styles/index';
import Collapse from '@material-ui/core/Collapse/index';
import { renderMath } from '../../math-rendering';
import PropTypes from 'prop-types';

export class Collapsible extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    children: PropTypes.object,
    labels: PropTypes.shape({
      visible: PropTypes.string,
      hidden: PropTypes.string,
    }),
  };

  static defaultProps = {
    labels: {},
  };

  state = {
    expanded: false,
  };

  toggleExpanded = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
  };

  componentDidMount() {
    renderMath(this.root);
  }

  componentDidUpdate() {
    renderMath(this.root);
  }

  render() {
    const { classes, labels, children, className } = this.props;
    const title = this.state.expanded ? labels.visible || 'Hide' : labels.hidden || 'Show';

    return (
      <div className={className} ref={(r) => (this.root = r)}>
        <div onClick={this.toggleExpanded}>
          <span className={classes.title}>{title}</span>
        </div>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit className={classes.collapsible}>
          {children}
        </Collapse>
      </div>
    );
  }
}

export default withStyles((theme) => ({
  title: {
    color: theme.palette.primary.light,
    borderBottom: `1px dotted ${theme.palette.primary.light}`,
    cursor: 'pointer',
  },
  collapsible: {
    paddingTop: theme.spacing.unit * 2,
  },
}))(Collapsible);
