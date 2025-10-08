let lastAction = null;
export const getLastAction = () => lastAction;

export const lastActionMiddleware = () => (next) => (action) => {
  lastAction = action;
  return next(action);
};
