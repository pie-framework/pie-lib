import { utils } from '@pie-lib/chart-toolbox/plot';
const { xy } = utils;
const fromTo = (fx, fy, tx, ty) => ({ from: xy(fx, fy), to: xy(tx, ty) });

export const marks = [
  //{ type: 'parabola', root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
  // { type: 'parabola', root: { x: 2, y: 2 }, edge: { x: -1, y: 1 } },
  //{ type: 'sine', root: xy(-5, 0), edge: xy(-4, 1) },
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
  //   disabled: false,
  //   center: {
  //     x: -4,
  //     y: 3
  //   },
  //   outerPoint: {
  //     x: -3,
  //     y: 2
  //   }
  // }
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
  //   // correctness: 'incorrect',
  //   disabled: false,
  //   root: {
  //     x: 1,
  //     y: 3
  //   },
  //   edge: {
  //     x: 2,
  //     y: 4
  //   }
  // },
  // {
  //   type: 'point',
  //   x: 3,
  //   y: 3,
  //   label: 'A'
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
  //   points: [xy(-1, 1), xy(4, 2), xy(5, -3), xy(-1, -2)]
  // }
  // { type: 'line', from: { x: -5, y: 0 }, to: { x: -5, y: 2 } }
  //  { type: 'segment', ...fromTo(1, 2, 3, 3) }
  // { type: 'ray', ...fromTo(1, -1, -2, -2) },
  // { type: 'vector', ...fromTo(0, 0, -5, 5) }
  // { type: 'point', x: 1, y: 1 },
  // {
  //   type: 'circle',
  //   center: { x: -2, y: 2 },
  //   outerPoint: { x: -3, y: 3 }
  // }
];

export const backgroundMarks = [
  {
    type: 'circle',
    building: false,
    root: {
      label: 'bgf',
      x: -3.25,
      y: 4.02,
    },
    edge: {
      label: 'fgb',
      x: -3,
      y: 3.35,
    },
  },
  {
    type: 'line',
    building: false,
    from: {
      label: 'afgb',
      x: -1.75,
      y: 4.69,
    },
    to: {
      label: 'fgb',
      x: -0.75,
      y: 4.69,
    },
  },
  {
    type: 'parabola',
    closed: true,
    building: false,
    root: {
      label: 'fgb',
      x: -3.5,
      y: -5.36,
    },
    edge: {
      label: 'gfb',
      x: -3,
      y: -6.03,
    },
  },
  {
    label: 'fgbbg',
    type: 'point',
    x: -3,
    y: -2.0100000000000007,
  },
  {
    type: 'polygon',
    points: [
      {
        x: -3.75,
        y: 2.0099999999999993,
        label: 'fgbgb',
      },
      {
        label: 'bg',
        x: -2,
        y: 1.34,
      },
      {
        label: 'fgbbg',
        x: -0.25,
        y: 1.34,
      },
      {
        label: 'bgbgfb',
        x: -0.75,
        y: 3.35,
      },
      {
        label: 'gb',
        x: -2,
        y: 2.68,
      },
    ],
    closed: true,
    building: false,
  },
  {
    type: 'ray',
    building: false,
    from: {
      label: 'bg',
      x: 2,
      y: 1.34,
    },
    to: {
      label: 'fgb',
      x: 3.25,
      y: 1.34,
    },
  },
  {
    type: 'segment',
    building: false,
    from: {
      label: 'fgb',
      x: 2.5,
      y: 2.68,
    },
    to: {
      label: 'gb',
      x: 4,
      y: 2.68,
    },
  },
  {
    type: 'sine',
    closed: true,
    building: false,
    root: {
      label: 'fgb',
      x: -0.75,
      y: -4.69,
    },
    edge: {
      label: 'fgb',
      x: 0,
      y: -5.36,
    },
  },
  {
    type: 'vector',
    building: false,
    from: {
      label: 'bg',
      x: 1.25,
      y: -2.01,
    },
    to: {
      label: 'bfgb',
      x: 3.25,
      y: -2.01,
    },
  },
];
//   {
//     type: 'polygon',
//     points: [
//       {
//         x: -2,
//         y: -2
//       },
//       {
//         x: -2,
//         y: -3
//       },
//       {
//         x: -1,
//         y: -4
//       },
//       {
//         x: 1,
//         y: -3
//       },
//       {
//         x: 1,
//         y: -2
//       },
//       {
//         x: -1,
//         y: -3
//       },
//       {
//         x: 0,
//         y: -1
//       },
//       {
//         x: -3,
//         y: -1
//       },
//       {
//         x: -3,
//         y: -2
//       }
//     ],
//     closed: true
//   },
//   {
//     type: 'segment',
//     from: {
//       x: -5,
//       y: 5
//     },
//     to: {
//       x: -4,
//       y: 5
//     }
//   },
//   {
//     type: 'vector',
//     from: {
//       x: 5,
//       y: 5
//     },
//     to: {
//       x: 4,
//       y: 5
//     }
//   }
// ];
