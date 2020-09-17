import withRoot from '../../src/withRoot';
import React from 'react';
import { Rotatable, utils } from '@pie-lib/tools';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

const square = opts => {
  return { ...opts };
};

class RawBox extends React.Component {
  componentDidMount() {
    if (this.props.div) {
      this.props.div(this.div);
    } else {
      // setup timeout
    }
  }

  render() {
    const { label, className, classes, style } = this.props;

    return (
      <div ref={r => (this.div = r)} className={classNames(classes.box, className)} style={style}>
        <span className={classes.label}>{label}</span>
      </div>
    );
  }
}
const boxStyles = {
  box: {
    width: '100px',
    height: '100px',
    position: 'absolute',
    backgroundColor: 'none',
    left: 0,
    top: 0,
    opacity: 0.5
  }
};

const Box = withStyles(boxStyles)(RawBox);

class RawPlayground extends React.Component {
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
        top: distance.y
      }
    });
  };

  render() {
    const { classes, degrees, from, to } = this.props;
    const { toPosition } = this.state;

    const fromStyle = {
      transform: `rotate(${degrees}deg)`,
      transformOrigin: from
    };

    const toStyle = {
      transform: `rotate(${degrees}deg)`,
      transformOrigin: to
    };

    if (toPosition) {
      toStyle.left = `${toPosition.left}px`;
      toStyle.top = `${toPosition.top}px`;
    }

    return (
      <div className={classes.root}>
        <Box className={classes.base} label={'base'} />
        <Box className={classes.from} style={fromStyle} label={'from: ' + from} />
        <Box
          div={r => (this.toBox = r)}
          className={classes.to}
          style={toStyle}
          label={'to: ' + to}
        />
      </div>
    );
  }
}
const styles = theme => ({
  root: {
    position: 'relative',
    width: '150px',
    height: '150px'
  },
  base: square({
    backgroundColor: 'pink',
    transformOrigin: '50% 50%'
  }),
  from: square({
    backgroundColor: 'green',
    transformOrigin: '50% 50%'
  }),
  to: {
    backgroundColor: 'none',
    border: 'solid 1px blue'
  }
});

const Playground = withStyles(styles)(RawPlayground);

class Demo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { classes } = this.props;
    const { mounted } = this.state;
    return mounted ? (
      <div>
        <Typography variant="h6">Rotatable</Typography>
        <Typography variant="body2">
          This is the underlying component for Ruler/Protractor
        </Typography>
        <Rotatable
          handle={[
            { class: 'one', origin: 'bottom right' },
            { class: 'two', origin: 'bottom left' }
          ]}
        >
          <div>
            <div className={'one ' + classes.one}>one</div>
            <div className={'two ' + classes.two}>two</div>
            <div className={classes.box}>I am a box</div>
          </div>
        </Rotatable>

        <br />
        <br />
        <Typography variant="body2">
          This is an example of using anchor-utils distanceBetween
        </Typography>
        <Playground degrees={-15} from={'bottom right'} to={'bottom left'} />
        <Playground degrees={-15} from={'bottom left'} to={'bottom right'} />
        <Playground degrees={-15} from={'top left'} to={'bottom right'} />
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(
  withStyles(theme => ({
    one: {
      position: 'absolute',
      backgroundColor: 'mistyrose',
      top: 0,
      left: 0
    },
    two: {
      position: 'absolute',
      backgroundColor: 'cyan',
      right: 0,
      top: 0
    },
    box: {
      width: '200px',
      height: '200px',
      backgroundColor: theme.palette.primary.dark
    },
    tester: {
      width: '100px',
      height: '100px',
      transform: 'rotate(45deg)',
      backgroundColor: theme.palette.secondary.dark
    }
  }))(Demo)
);
