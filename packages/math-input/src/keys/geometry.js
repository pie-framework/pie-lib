const set = o => ({ ...o, category: 'geometry' });

export const overline = set({
  name: 'Overline',
  latex: '\\overline{}',
  command: '\\overline'
});

export const overRightArrow = set({
  name: 'Overline',
  latex: '\\overrightarrow{}',
  command: '\\overrightarrow'
});

export const overLeftRightArrow = set({
  name: 'Overline',
  latex: '\\overleftrightarrow{\\overline{}}', // used this notation to display the pink box
  symbol: 'AB',
  command: '\\overleftrightarrow'
});

export const segment = set({
  name: 'Segment',
  latex: '\\overleftrightarrow{AB}',
  write: '\\overleftrightarrow{AB}',
  label: 'AB'
});

export const parallel = set({
  name: 'Parallel',
  latex: '\\parallel',
  command: '\\parallel'
});

export const notParallel = set({
  name: 'Not Parallel',
  latex: '\\nparallel',
  command: '\\nparallel'
});

export const perpindicular = set({
  name: 'Perpendicular',
  latex: '\\perp',
  command: '\\perpendicular'
});

export const angle = set({
  name: 'Angle',
  latex: '\\angle',
  command: '\\angle'
});
export const overArc = set({
  name: 'Over arc',
  latex: '\\overarc{\\overline{}}', // used this notation to display the pink box
  command: '\\overarc'
});
export const measureOfAngle = set({
  name: 'Measure Of Angle',
  latex: '\\measuredangle',
  command: ['m', '\\angle']
});

export const triangle = set({
  name: 'Triangle',
  latex: '\\triangle',
  command: '\\triangle'
});

export const parallelogram = set({
  name: 'Parallelogram',
  latex: '\\parallelogram',
  command: '\\parallelogram'
});

export const circledDot = set({
  name: 'Circled Dot',
  latex: '\\odot',
  command: '\\odot'
});

export const degree = set({
  name: 'Degree',
  latex: '\\degree',
  command: '\\degree'
});

export const similarTo = set({
  name: 'Similar To',
  command: '\\sim',
  latex: '\\sim'
});

export const congruentTo = set({
  name: 'Congruent To',
  command: '\\cong',
  latex: '\\cong'
});
export const notCongruentTo = set({
  name: 'Not Congruent To',
  command: '\\ncong',
  latex: '\\ncong'
});

export const primeArcminute = set({
  name: 'Prime',
  label: 'pam',
  // eslint-disable-next-line
  latex: "'",
  // eslint-disable-next-line
  write: "'"
});
export const doublePrimeArcSecond = set({
  name: 'Double Prime/Arcsecond',
  latex: '"',
  write: '"'
});
