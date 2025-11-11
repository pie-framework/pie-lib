import { Data } from 'slate';

export default function MockChange() {
  this.setNodeByKey = jest.fn().mockReturnValue(this);
  this.removeNodeByKey = jest.fn().mockReturnValue(this);
  this.insertInline = jest.fn().mockReturnValue(this);
  this.moveFocusTo = jest.fn().mockReturnValue(this);
  this.moveAnchorTo = jest.fn().mockReturnValue(this);
}

export function MockDocument() {
  this.getChild = jest.fn().mockReturnValue({ data: Data.create({}) });

  this.getDescendant = jest.fn();
}
