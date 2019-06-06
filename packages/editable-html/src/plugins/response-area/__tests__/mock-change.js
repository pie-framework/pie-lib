import { Data } from 'slate';

export default function MockChange() {
  this.moveFocusTo = jest.fn().mockReturnValue(this);
  this.moveAnchorTo = jest.fn().mockReturnValue(this);
  this.removeNodeByKey = jest.fn().mockReturnValue(this);
  this.setNodeByKey = jest.fn().mockReturnValue(this);
}

export function MockDocument(options) {
  const { docFindDescendant, filterDescendants, findDescendant, getClosest } = { ...options };

  this.filterDescendants = jest
    .fn()
    .mockReturnValue([
      { key: '0', data: Data.create({ clicked: false }) },
      { key: '1', data: Data.create({ clicked: false }) },
      { key: '2', data: Data.create({ clicked: false }) },
      { key: '3', data: Data.create({ clicked: true }) }
    ]);
  this.getClosest =
    getClosest ||
    jest.fn().mockReturnValue({
      key: '4',
      data: Data.create({ open: true }),
      findDescendant:
        findDescendant ||
        jest.fn().mockReturnValue({ key: '0', data: Data.create({ id: '0', clicked: false }) }),
      filterDescendants
    });
  this.getNextText = jest.fn().mockReturnValue({ key: '5' });

  if (docFindDescendant) {
    this.findDescendant = docFindDescendant;
  }
}
