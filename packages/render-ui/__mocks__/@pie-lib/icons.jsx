import React from 'react';

const comp = (name) => () => <div>{name}</div>;

export const Correct = comp('correct');
export const Incorrect = comp('incorrect');
export const NothingSubmitted = comp('nothing-submitted');
export const PartiallyCorrect = comp('partially-correct');