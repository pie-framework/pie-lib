import React from 'react';
import { PlaceHolder, Choice, withDragContext, uid, DropTarget } from '@pie-lib/drag';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import withRoot from '../source/withRoot';

const { Provider: IdProvider } = uid;

export const DRAG_TYPE = 'CHOICE';

const Container = styled('div')({
  background: '#fff',
  border: '1px solid black',
  height: '500px',
  marginTop: '40px',
  width: '500px',
});

const StyledPlaceHolder = styled(PlaceHolder)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const StyledWrapper = styled('div')(({ theme }) => ({
  backgroundColor: 'blue',
  '& .redLabel': {
    '--correct-answer-toggle-label-color': 'red',
  },
}));

const TargetContainer = ({ connectDropTarget, val }) => {
  return connectDropTarget(<Container>{val}</Container>);
};

const tileTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();

    props.onDrop(item.children);

    return {
      dropped: true,
    };
  },
  canDrop() {
    return true;
  },
};

const DropContainer = DropTarget(DRAG_TYPE, tileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  dragItem: monitor.getItem(),
}))(TargetContainer);

export class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.uid = uid.generateId();
    this.state = {
      toggled: false,
      show: true,
    };
  }

  onDrop = (children) => {
    this.setState({
      containerVal: children,
    });
  };

  render() {
    const { containerVal } = this.state;

    return (
      <IdProvider value={this.uid}>
        <StyledWrapper>
          <Typography variant="h6">Drag</Typography>

          <Divider />

          <PlaceHolder grid={{ columns: 3 }}>
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

          <StyledPlaceHolder isOver={true} grid={{ columns: 3 }}>
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
          </StyledPlaceHolder>

          <StyledPlaceHolder disabled={true} grid={{ columns: 3 }}>
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
          </StyledPlaceHolder>

          <DropContainer val={containerVal} onDrop={this.onDrop} />
        </StyledWrapper>
      </IdProvider>
    );
  }
}

const DndWrapper = withDragContext(Wrapper);

export default withRoot(DndWrapper);
