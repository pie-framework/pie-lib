import { AbstractMmlNode } from 'mathjax-full/js/core/MmlTree/MmlNode';

export class MmlNone extends AbstractMmlNode {
  get kind() {
    return 'none';
  }
}

export class MmlMstack extends AbstractMmlNode {
  get kind() {
    return 'mstack';
  }
}

export class MmlMsrow extends AbstractMmlNode {
  get kind() {
    return 'msrow';
  }
}
export class MmlMsline extends AbstractMmlNode {
  get kind() {
    return 'msline';
  }
}
