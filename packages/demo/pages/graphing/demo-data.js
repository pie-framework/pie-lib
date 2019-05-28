export const marks = [
  // { type: 'parabola', root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
  // { type: 'parabola', root: { x: 2, y: 2 }, edge: { x: -1, y: 1 } },
  // { type: 'sine', root: { x: 0, y: 0 }, edge: { x: -1, y: 1 } },
  // {
  //   disabled: true,
  //   type: 'polygon',
  //   points: [
  //     {
  //       x: -2,
  //       y: -2
  //     },
  //     {
  //       x: -2,
  //       y: -3
  //     },
  //     {
  //       x: -1,
  //       y: -4
  //     },
  //     {
  //       x: 1,
  //       y: -3
  //     },
  //     {
  //       x: 1,
  //       y: -2
  //     },
  //     {
  //       x: -1,
  //       y: -3
  //     },
  //     {
  //       x: 0,
  //       y: -1
  //     },
  //     {
  //       x: -3,
  //       y: -1
  //     },
  //     {
  //       x: -3,
  //       y: -2
  //     }
  //   ],
  //   closed: true
  // },
  // {
  //   type: 'circle',
  //   disabled: true,
  //   correctness: 'correct',
  //   center: {
  //     x: -4,
  //     y: 3
  //   },
  //   outerPoint: {
  //     x: -3,
  //     y: 2
  //   }
  // },
  // {
  //   type: 'circle',
  //   disabled: true,
  //   center: {
  //     x: -4,
  //     y: -4
  //   },
  //   outerPoint: {
  //     x: -3,
  //     y: -3
  //   }
  // },
  // {
  //   type: 'circle',
  //   correctness: 'incorrect',
  //   disabled: true,
  //   center: {
  //     x: 1,
  //     y: 3
  //   },
  //   outerPoint: {
  //     x: 2,
  //     y: 4
  //   }
  // },
  // {
  //   type: 'point',
  //   x: 3,
  //   y: 3
  // },
  // {
  //   disabled: true,
  //   correctness: 'correct',
  //   type: 'point',
  //   x: 2,
  //   y: 3
  // },
  // {
  //   type: 'polygon',
  //   //??
  //   closed: true,
  //   points: [
  //     { x: -1, y: 1 },
  //     { x: 4, y: 2 },
  //     { x: 3, y: 1 },
  //     { x: 5, y: -3 }
  //   ]
  // },
  // { type: 'point', x: 1, y: 1 },
  // {
  //   type: 'circle',
  //   center: { x: -2, y: 2 },
  //   outerPoint: { x: -3, y: 3 }
  // }
];

export const backgroundMarks = [
  {
    type: 'polygon',
    points: [
      {
        x: -2,
        y: -2
      },
      {
        x: -2,
        y: -3
      },
      {
        x: -1,
        y: -4
      },
      {
        x: 1,
        y: -3
      },
      {
        x: 1,
        y: -2
      },
      {
        x: -1,
        y: -3
      },
      {
        x: 0,
        y: -1
      },
      {
        x: -3,
        y: -1
      },
      {
        x: -3,
        y: -2
      }
    ],
    closed: true
  },
  {
    type: 'segment',
    from: {
      x: -5,
      y: 5
    },
    to: {
      x: -4,
      y: 5
    }
  },
  {
    type: 'vector',
    from: {
      x: 5,
      y: 5
    },
    to: {
      x: 4,
      y: 5
    }
  }
];
