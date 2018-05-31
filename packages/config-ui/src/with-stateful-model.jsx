import React from 'react';
import PropTypes from 'prop-types';

const withStatefulModel = Component => {
  class Stateful extends React.Component {
    static propTypes = {
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      this.state = {
        model: props.model
      };
    }

    componentWillReceiveProps(props) {
      this.setState({ model: props.model });
    }

    onChange = model => {
      this.setState({ model }, () => {
        this.props.onChange(this.state.model);
      });
    };

    render() {
      return <Component model={this.state.model} onChange={this.onChange} />;
    }
  }

  return Stateful;
};

export default withStatefulModel;
