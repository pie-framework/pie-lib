import React from 'react';
import { PlaceHolder, Choice, withDragContext, DropTarget } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import withRoot from '../src/withRoot';

export const DRAG_TYPE = 'CHOICE';

const TargetContainer = withStyles(() => ({
  container: {
    background: '#fff',
    border: '1px solid black',
    height: '500px',
    marginTop: '40px',
    width: '500px'
  }
}))(({ classes, connectDropTarget, val }) => {
  return connectDropTarget(<div className={classes.container}>{val}</div>);
});

const tileTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();

    props.onDrop(item.children);

    return {
      dropped: true
    };
  },
  canDrop() {
    return true;
  }
};

const DropContainer = DropTarget(DRAG_TYPE, tileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  dragItem: monitor.getItem()
}))(TargetContainer);

export class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: false,
      show: true
    };
  }

  onDrop = children => {
    this.setState({
      containerVal: children
    });
  };

  render() {
    const { containerVal } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <Typography variant="h6">Drag</Typography>

        <Divider />

        <PlaceHolder className={classes.grid} grid={{ columns: 3 }}>
          <Choice>foo bar</Choice>
          <Choice>
            <h1>Some Text</h1>
            <p>foo</p>
          </Choice>
          <Choice>
            <img
              width="200"
              src="http://cdn.skim.gs/images/c_fill,dpr_2.0,f_auto,fl_lossy,h_391,q_auto,w_695/fajkx3pdvvt9ax6btssg/20-of-the-cutest-small-dog-breeds-on-the-planet"
            />
          </Choice>
        </PlaceHolder>

        <PlaceHolder isOver={true} className={classes.grid} grid={{ columns: 3 }}>
          <Choice>foo bar</Choice>
          <Choice>
            <h1>Some Text</h1>
            <p>foo</p>
          </Choice>
          <Choice>
            <img
              width="200"
              src="http://cdn.skim.gs/images/c_fill,dpr_2.0,f_auto,fl_lossy,h_391,q_auto,w_695/fajkx3pdvvt9ax6btssg/20-of-the-cutest-small-dog-breeds-on-the-planet"
            />
          </Choice>
        </PlaceHolder>

        <PlaceHolder disabled={true} className={classes.grid} grid={{ columns: 3 }}>
          <Choice>foo bar</Choice>
          <Choice>
            <h1>Some Text</h1>
            <p>foo</p>
          </Choice>
          <Choice>
            <img
              width="200"
              src="http://cdn.skim.gs/images/c_fill,dpr_2.0,f_auto,fl_lossy,h_391,q_auto,w_695/fajkx3pdvvt9ax6btssg/20-of-the-cutest-small-dog-breeds-on-the-planet"
            />
          </Choice>
        </PlaceHolder>

        <DropContainer val={containerVal} onDrop={this.onDrop} />
      </div>
    );
  }
}

const StyledWrapper = withStyles(theme => ({
  root: {
    backgroundColor: 'blue'
  },
  grid: {
    marginTop: theme.spacing.unit
  },
  redLabel: {
    '--correct-answer-toggle-label-color': 'red'
  }
}))(Wrapper);

const DndWrapper = withDragContext(StyledWrapper);

export default withRoot(DndWrapper);
