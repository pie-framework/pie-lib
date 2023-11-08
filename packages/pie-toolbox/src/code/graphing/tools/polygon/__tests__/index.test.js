import { addPointToArray, tool } from '../index';

const xy = (x, y) => ({ x, y });

describe('polygon', () => {
  describe('addPointToArray', () => {
    const assertAddPoint = (point, arr, expected) => {
      it(`returns ${expected} when adding ${point} to ${arr}`, () => {
        const result = addPointToArray(point, arr);
        expect(result).toEqual(expected);
      });
    };
    assertAddPoint(xy(0, 0), [], { closed: false, points: [xy(0, 0)] });
    assertAddPoint(xy(0, 0), [xy(0, 0)], { closed: false, points: [xy(0, 0)] });
    assertAddPoint(xy(1, 1), [xy(0, 0)], {
      closed: false,
      points: [xy(0, 0), xy(1, 1)],
    });
    assertAddPoint(xy(1, 1), [xy(0, 0)], {
      closed: false,
      points: [xy(0, 0), xy(1, 1)],
    });
  });
});

describe('tool', () => {
  let t;
  beforeEach(() => {
    t = tool();
  });

  it('creates polygon type', () => {
    expect(t.type).toEqual('polygon');
  });

  describe('complete', () => {
    it('closes polygon', () => {
      expect(t.complete()).toEqual({ building: false, closed: true });
    });
  });

  describe('addPoint', () => {
    it('creates new point', () => {
      const mark = t.addPoint({ x: 0, y: 0 });
      expect(mark).toEqual({
        type: 'polygon',
        points: [{ x: 0, y: 0 }],
        closed: false,
        building: true,
      });
    });

    it('adds the point', () => {
      const mark = t.addPoint({ x: 0, y: 0 }, { points: [{ x: 1, y: 1 }] });
      expect(mark).toEqual({
        building: true,
        closed: false,
        points: [
          { x: 1, y: 1 },
          { x: 0, y: 0 },
        ],
      });
    });
  });
});
