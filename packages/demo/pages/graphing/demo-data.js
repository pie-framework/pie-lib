import { xy } from '../../../plot/lib/utils';
const fromTo = (fx, fy, tx, ty) => ({ from: xy(fx, fy), to: xy(tx, ty) });

export const marks = [
  //{ type: 'parabola', root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
  // { type: 'parabola', root: { x: 2, y: 2 }, edge: { x: -1, y: 1 } },
  { type: 'sine', root: xy(-5, 0), edge: xy(-4, 1) },
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
  {
    type: 'circle',
    disabled: false,
    center: {
      x: -4,
      y: 3
    },
    outerPoint: {
      x: -3,
      y: 2
    }
  }
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
  //   points: [{ x: -1, y: 1 }, { x: 4, y: 2 }, { x: 5, y: -3 }]
  // },
  // { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
  // { type: 'line-two', ...fromTo(-1, 0, 0, 1) },
  // { type: 'segment-two', ...fromTo(0, 2, 2, 3) }
  // { type: 'ray-two', ...fromTo(-1, -1, -4, -2) }
  // { type: 'point', x: 1, y: 1 },
  // {
  //   type: 'circle',
  //   center: { x: -2, y: 2 },
  //   outerPoint: { x: -3, y: 3 }
  // }
];

export const backgroundMarks = [];
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
