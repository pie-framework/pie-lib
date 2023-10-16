import Draggable, { DraggableCore } from 'react-draggable';

export default class LocalDraggable extends Draggable {
  componentWillReceiveProps(next) {
    super.componentWillReceiveProps(next);
    //Remove the x/y state as these values have now been updated and will come through as props.
    this.setState({ x: 0, y: 0 });
  }
}

export { DraggableCore };
