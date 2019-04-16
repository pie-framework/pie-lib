import React from 'react';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';

const Comp = props => (
  <Input
    value={props.value}
    onChange={e => {
      props.onChange(props.id, e.target.value);
    }}
  />
);
Comp.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};
export default Comp;
