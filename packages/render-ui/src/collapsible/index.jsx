import React from 'react';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import { renderMath } from '@pie-lib/math-rendering';
import PropTypes from 'prop-types';

const Title = styled('span')(({ theme }) => ({
  color: theme.palette.primary.light,
  borderBottom: `1px dotted ${theme.palette.primary.light}`,
  cursor: 'pointer',
}));

const StyledCollapse = styled(Collapse)(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

export class Collapsible extends React.Component {
  static propTypes = {
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
    const { labels, children, className } = this.props;
    const title = this.state.expanded ? labels.visible || 'Hide' : labels.hidden || 'Show';

    return (
      <div className={className} ref={(r) => (this.root = r)}>
        <div onClick={this.toggleExpanded}>
          <Title>{title}</Title>
        </div>
        <StyledCollapse in={this.state.expanded} timeout="auto" unmountOnExit>
          {children}
        </StyledCollapse>
      </div>
    );
  }
}

export default Collapsible;
