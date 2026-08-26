import { KeyboardCode } from '@dnd-kit/core';
import { closestDroppableKeyboardCoordinates } from '../keyboard-coordinates';

function rectsToContext(rects) {
  const droppableRects = new Map(Object.entries(rects));
  const droppableContainers = new Map(Object.keys(rects).map((id) => [id, { disabled: false }]));

  return { droppableRects, droppableContainers };
}

function makeEvent(code, shiftKey = false) {
  return { code, preventDefault: () => {}, shiftKey };
}

// Mirrors dnd-kit's own KeyboardSensor, which always derives collisionRect's top-left
// from the dragged item's current on-screen position on every keydown — so a test's
// collisionRect must track currentCoordinates the same way on every simulated press,
// not stay fixed while currentCoordinates changes across multiple presses.
function press(rects, currentCoordinates, itemSize, event, active) {
  const context = {
    ...rectsToContext(rects),
    collisionRect: { left: currentCoordinates.x, top: currentCoordinates.y, ...itemSize },
  };

  return closestDroppableKeyboardCoordinates(event, { active, context, currentCoordinates });
}

describe('closestDroppableKeyboardCoordinates', () => {
  describe('arrow keys', () => {
    it("nudges the dragged item by dnd-kit's own default step (25px), unchanged", () => {
      const context = { ...rectsToContext({}), collisionRect: { left: 0, top: 0, width: 100, height: 40 } };
      const currentCoordinates = { x: 10, y: 20 };

      expect(
        closestDroppableKeyboardCoordinates(makeEvent(KeyboardCode.Down), { context, currentCoordinates }),
      ).toEqual({ x: 10, y: 45 });
      expect(
        closestDroppableKeyboardCoordinates(makeEvent(KeyboardCode.Up), { context, currentCoordinates }),
      ).toEqual({ x: 10, y: -5 });
      expect(
        closestDroppableKeyboardCoordinates(makeEvent(KeyboardCode.Right), { context, currentCoordinates }),
      ).toEqual({ x: 35, y: 20 });
      expect(
        closestDroppableKeyboardCoordinates(makeEvent(KeyboardCode.Left), { context, currentCoordinates }),
      ).toEqual({ x: -15, y: 20 });
    });
  });

  describe('Tab / Shift+Tab', () => {
    const blank0Rect = { left: 0, top: 0, width: 120, height: 40, right: 120, bottom: 40 };
    const blank1Rect = { left: 0, top: 60, width: 120, height: 40, right: 120, bottom: 100 };
    const boardRect = { left: 0, top: 120, width: 400, height: 300, right: 400, bottom: 420 };
    const baseRects = {
      'mask-blank-drop-0': blank0Rect,
      'mask-blank-drop-1': blank1Rect,
      'drag-in-the-blank-droppable': boardRect,
    };

    it('jumps to the next droppable in top-to-bottom order, landing at its center-left point', () => {
      const currentCoordinates = { x: blank0Rect.left, y: blank0Rect.top };

      const next = press(baseRects, currentCoordinates, { width: 120, height: 40 }, makeEvent('Tab'));

      expect(next).toEqual({ x: blank1Rect.left, y: blank1Rect.top + blank1Rect.height / 2 });
    });

    it('cycles backwards with Shift+Tab, wrapping to the choice board', () => {
      const currentCoordinates = { x: blank0Rect.left, y: blank0Rect.top };

      const next = press(baseRects, currentCoordinates, { width: 120, height: 40 }, makeEvent('Tab', true));

      expect(next).toEqual({ x: boardRect.left, y: boardRect.top + boardRect.height / 2 });
    });

    it("excludes a dragged blank's own drop-zone from the cycle", () => {
      // A blank is simultaneously draggable and droppable for its own slot (the same
      // shape as match-list's placed "target" tiles). Without excluding it, containment
      // would match the blank to itself and cycle relative to itself instead of its
      // real neighbors — this test is constructed so the two behaviors give different,
      // distinguishable results (not just coincidentally the same answer).
      const blankARect = { left: 0, top: 0, width: 120, height: 40, right: 120, bottom: 40 };
      const blankBRect = { left: 0, top: 60, width: 120, height: 40, right: 120, bottom: 100 };
      const blankCRect = { left: 0, top: 120, width: 120, height: 40, right: 120, bottom: 160 };
      const rects = {
        'mask-blank-drop-a': blankARect,
        'mask-blank-drop-b': blankBRect,
        'mask-blank-drop-c': blankCRect,
      };
      const active = { data: { current: { id: 'b', fromChoice: false, type: 'MaskBlank' } } };
      // Sitting exactly at blank B's own position.
      const currentCoordinates = { x: blankBRect.left, y: blankBRect.top };

      const next = press(rects, currentCoordinates, { width: 120, height: 40 }, makeEvent('Tab', true), active);

      // With B's own slot excluded, Shift+Tab from B's position falls back to
      // nearest-by-dropPosition among the remaining targets (A and C) — A is closer to
      // B's actual position, making A the resolved "current", so reverse from there
      // lands on C. Without the exclusion, containment would match B to itself
      // directly (index 1 of [A, B, C] sorted by position), landing on A instead.
      expect(next).toEqual({ x: blankCRect.left, y: blankCRect.top + blankCRect.height / 2 });
    });

    it('keeps advancing on repeated Shift+Tab when the choice board is much wider than the dragged item', () => {
      // Regression case for the bug already found and fixed in match-list/image-cloze-
      // association: matching the "current" target by reconstructing a center from the
      // dragged item's own small size (instead of checking which target's rect actually
      // contains it) makes the *next* press re-match a completely different droppable
      // once the item is actually sitting on a wide target, so it looks like the press
      // does nothing.
      const wideBlankRect = { left: 0, top: 0, width: 900, height: 40, right: 900, bottom: 40 };
      const rects = { 'mask-blank-drop-0': wideBlankRect, 'drag-in-the-blank-droppable': boardRect };
      const itemSize = { width: 100, height: 40 };

      const afterFirst = press(rects, { x: boardRect.left, y: boardRect.top }, itemSize, makeEvent('Tab', true));

      expect(afterFirst).toEqual({ x: 0, y: 20 }); // wide blank's center-left point

      const afterSecond = press(rects, afterFirst, itemSize, makeEvent('Tab', true));

      expect(afterSecond).toEqual({ x: boardRect.left, y: boardRect.top + boardRect.height / 2 });
    });

    it('correctly identifies the choice board as the current target when picking up an item positioned near its edge, close to a small neighboring blank', () => {
      // Regression case for the OTHER failure mode: matching "current target" purely by
      // nearest-dropPosition (instead of containment first) can misidentify a large
      // droppable as some small, unrelated nearby one, because a large droppable's
      // dropPosition is anchored at its own vertical middle.
      const tallBoardRect = { left: 0, top: 0, width: 400, height: 600, right: 400, bottom: 600 };
      const smallBlankRect = { left: 0, top: -60, width: 100, height: 40, right: 100, bottom: -20 };
      const rects = { 'mask-blank-drop-0': smallBlankRect, 'drag-in-the-blank-droppable': tallBoardRect };
      const itemSize = { width: 100, height: 40 };

      const currentCoordinates = { x: 0, y: 10 };

      const next = press(rects, currentCoordinates, itemSize, makeEvent('Tab'));

      expect(next).toEqual({ x: smallBlankRect.left, y: smallBlankRect.top + smallBlankRect.height / 2 });
    });

    it('keeps the choice board as a fixed last stop instead of sorting it in by its own center, when the board spans multiple blank rows', () => {
      // Regression case for a real bug found via manual browser testing: with 3
      // choices stacked beside wrapped inline text (`choicePosition: 'right'`), the
      // tall choice board's own center fell numerically BETWEEN blank 2 and blank 3's
      // rows. Sorting it by position the same way as a blank interleaved it into the
      // middle of the cycle, so the very first Tab press after picking up a pool
      // choice jumped straight to blank 3, skipping blanks 1 and 2 entirely.
      const blank0Rect = { left: 0, top: 200, width: 50, height: 50, right: 50, bottom: 250 };
      const blank1Rect = { left: 0, top: 250, width: 50, height: 50, right: 50, bottom: 300 };
      const blank2Rect = { left: 0, top: 285, width: 50, height: 50, right: 50, bottom: 335 };
      // Spans all three choices stacked beside the text — its center (287.5) falls
      // between blank1's (275) and blank2's (310), more than 10px from either, so the
      // old position-based sort placed it between them.
      const tallBoardRect = { left: 400, top: 195, width: 80, height: 185, right: 480, bottom: 380 };
      const rects = {
        'mask-blank-drop-0': blank0Rect,
        'mask-blank-drop-1': blank1Rect,
        'mask-blank-drop-2': blank2Rect,
        'drag-in-the-blank-droppable': tallBoardRect,
      };
      const active = { data: { current: { fromChoice: true, choice: { id: 'x' }, type: 'MaskBlank' } } };
      const itemSize = { width: 48, height: 50 };
      // Picking up a choice from within the board — its own current position, before
      // any movement, sits inside the board's rect.
      const currentCoordinates = { x: 415, y: 205 };

      const next = press(rects, currentCoordinates, itemSize, makeEvent('Tab'), active);

      expect(next).toEqual({ x: blank0Rect.left, y: blank0Rect.top + blank0Rect.height / 2 });
    });

    it('cycles through every blank in position order, then the board, then wraps — even when the board would otherwise sort into the middle', () => {
      const blank0Rect = { left: 0, top: 200, width: 50, height: 50, right: 50, bottom: 250 };
      const blank1Rect = { left: 0, top: 250, width: 50, height: 50, right: 50, bottom: 300 };
      const blank2Rect = { left: 0, top: 285, width: 50, height: 50, right: 50, bottom: 335 };
      const tallBoardRect = { left: 400, top: 195, width: 80, height: 185, right: 480, bottom: 380 };
      const rects = {
        'mask-blank-drop-0': blank0Rect,
        'mask-blank-drop-1': blank1Rect,
        'mask-blank-drop-2': blank2Rect,
        'drag-in-the-blank-droppable': tallBoardRect,
      };
      const active = { data: { current: { fromChoice: true, choice: { id: 'x' }, type: 'MaskBlank' } } };
      const itemSize = { width: 48, height: 50 };

      let coords = { x: 415, y: 205 };
      const visited = [];

      for (let i = 0; i < 5; i++) {
        coords = press(rects, coords, itemSize, makeEvent('Tab'), active);
        visited.push(coords);
      }

      expect(visited).toEqual([
        { x: blank0Rect.left, y: blank0Rect.top + blank0Rect.height / 2 },
        { x: blank1Rect.left, y: blank1Rect.top + blank1Rect.height / 2 },
        { x: blank2Rect.left, y: blank2Rect.top + blank2Rect.height / 2 },
        { x: tallBoardRect.left, y: tallBoardRect.top + tallBoardRect.height / 2 },
        { x: blank0Rect.left, y: blank0Rect.top + blank0Rect.height / 2 }, // wraps
      ]);
    });
  });
});
