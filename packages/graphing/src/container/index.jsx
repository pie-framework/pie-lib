import { connect } from 'react-redux';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducer';
import { changeMarks } from './actions';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { ActionCreators } from 'redux-undo';
import GraphWithControls from '../graph-with-controls';

const mapStateToProps = (s) => ({
  marks: s.marks.present,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeMarks: (m) => dispatch(changeMarks(m)),
  onUndo: () => dispatch(ActionCreators.undo()),
  onRedo: () => dispatch(ActionCreators.redo()),
  onReset: () => dispatch(changeMarks([])),
});

export const GraphContainer = connect(mapStateToProps, mapDispatchToProps)(GraphWithControls);

/**
 * The graph component entry point with undo/redo
 * Redux is an implementation detail, hide it in the react component.
 */
class Root extends React.Component {
  static propTypes = {
    onChangeMarks: PropTypes.func,
    marks: PropTypes.array,
  };

  constructor(props) {
    super(props);

    const r = reducer();
    this.store = createStore(r, { marks: props.marks });

    this.store.subscribe(this.onStoreChange);
  }

  componentDidUpdate(prevProps) {
    const { marks } = this.props;
    const storeState = this.store.getState();

    if (isEqual(storeState.marks.present, marks)) {
      return;
    }

    if (!isEqual(prevProps.marks, marks)) {
      this.store.dispatch(changeMarks(marks));
    }
  }

  onStoreChange = () => {
    const { marks, onChangeMarks } = this.props;
    const storeState = this.store.getState();

    if (!isEqual(storeState.marks.present, marks)) {
      onChangeMarks(storeState.marks.present);
    }
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { onChangeMarks, marks, ...rest } = this.props;
    const correctnessSet = marks && marks.find((m) => m.correctness);

    if (correctnessSet) {
      return <GraphWithControls {...rest} marks={marks} disabled={correctnessSet} />;
    }

    return (
      <Provider store={this.store}>
        <GraphContainer {...rest} />
      </Provider>
    );
  }
}

export default Root;
