import withRoot from '../../source/withRoot';
import React from 'react';
import { Rotatable, utils } from '@pie-lib/tools';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const square = (opts) => {
  return { ...opts };
};

const BoxContainer = styled('div')({
  width: '100px',
  height: '100px',
  position: 'absolute',
  backgroundColor: 'none',
  left: 0,
  top: 0,
  opacity: 0.5,
});

const BoxLabel = styled('span')({});

class Box extends React.Component {
  componentDidMount() {
    if (this.props.div) {
      this.props.div(this.div);
    } else {
      // setup timeout
    }
  }

  render() {
    const { label, className, style } = this.props;

    return (
      <BoxContainer ref={(r) => (this.div = r)} className={className} style={style}>
        <BoxLabel>{label}</BoxLabel>
      </BoxContainer>
    );
  }
}

const PlaygroundRoot = styled('div')({
  position: 'relative',
  width: '150px',
  height: '150px',
});

const BaseBox = styled(Box)(square({
  backgroundColor: 'pink',
  transformOrigin: '50% 50%',
}));

const FromBox = styled(Box)(square({
  backgroundColor: 'green',
  transformOrigin: '50% 50%',
}));

const ToBox = styled(Box)({
  backgroundColor: 'none',
  border: 'solid 1px blue',
});

class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {
    this.setTranslation();
  }

  componentDidMount() {
    this.setTranslation();
  }

  setTranslation = () => {
    // translateXY()

    if (this.state.positionSet) {
      return;
    }
    if (!this.toBox) {
      return;
    }

    const { degrees, from, to } = this.props;
    const { clientWidth: width, clientHeight: height } = this.toBox;
    const distance = utils.distanceBetween({ width, height }, degrees, from, to);

    this.setState({
      positionSet: true,
      toPosition: {
        left: distance.x,
        top: distance.y,
      },
    });
  };

  render() {
    const { degrees, from, to } = this.props;
    const { toPosition } = this.state;

    const fromStyle = {
      transform: `rotate(${degrees}deg)`,
      transformOrigin: from,
    };

    const toStyle = {
      transform: `rotate(${degrees}deg)`,
      transformOrigin: to,
    };

    if (toPosition) {
      toStyle.left = `${toPosition.left}px`;
      toStyle.top = `${toPosition.top}px`;
    }

    return (
      <PlaygroundRoot>
        <BaseBox label={'base'} />
        <FromBox style={fromStyle} label={'from: ' + from} />
        <ToBox div={(r) => (this.toBox = r)} style={toStyle} label={'to: ' + to} />
      </PlaygroundRoot>
    );
  }
}

const OneDiv = styled('div')({
  position: 'absolute',
  backgroundColor: 'mistyrose',
  top: 0,
  left: 0,
});

const TwoDiv = styled('div')({
  position: 'absolute',
  backgroundColor: 'cyan',
  right: 0,
  top: 0,
});

const MainBox = styled('div')(({ theme }) => ({
  width: '200px',
  height: '200px',
  backgroundColor: theme.palette.primary.dark,
}));

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted } = this.state;
    return mounted ? (
      <div>
        <Typography variant="h6">Rotatable</Typography>
        <Typography variant="body2">This is the underlying component for Ruler/Protractor</Typography>
        <Rotatable
          handle={[
            { class: 'one', origin: 'bottom right' },
            { class: 'two', origin: 'bottom left' },
          ]}
        >
          <div>
            <OneDiv className="one">one</OneDiv>
            <TwoDiv className="two">two</TwoDiv>
            <MainBox>I am a box</MainBox>
          </div>
        </Rotatable>

        <br />
        <br />
        <Typography variant="body2">This is an example of using anchor-utils distanceBetween</Typography>
        <Playground degrees={-15} from={'bottom right'} to={'bottom left'} />
        <Playground degrees={-15} from={'bottom left'} to={'bottom right'} />
        <Playground degrees={-15} from={'top left'} to={'bottom right'} />
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(Demo);
