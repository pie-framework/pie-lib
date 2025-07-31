export const cat = (id) => ({ id });

export const cats = (choices) => ({
  choices: choices.map(cat),
});

export const choice = (id, categoryCount, correct) => {
  const out = { id, categoryCount };

  if (correct === false || correct === true) {
    out.correct = correct;
  }
  return out;
};

export const answer = (category, choices, alternateResponses) => {
  const c = choices ? (Array.isArray(choices) ? choices : [choices]) : [];
  return { alternateResponses, category, choices: c };
};
