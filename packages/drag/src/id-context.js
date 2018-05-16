import React from 'react';

const { Consumer, Provider } = React.createContext(-1);

export { Provider, Consumer };

export const generateId = () => (Math.random() * 1000001).toFixed(0);

export const withUid = Component => {
  const Wrapped = props => (
    <Consumer>{uid => <Component {...props} uid={uid} />}</Consumer>
  );
  return Wrapped;
};
