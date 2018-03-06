import { Data } from 'slate';
import { stub } from 'sinon';

export default function MockChange() {

  this.setNodeByKey = stub().returns(this);

  this.removeNodeByKey = stub().returns(this);
  this.insertInline = stub().returns(this);
}

export function MockDocument() {

  this.getChild = stub().returns({ data: Data.create({}) });

  this.getDescendant = stub();
}