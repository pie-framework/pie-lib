import { AbstractMmlNode, TEXCLASS } from 'mathjax-full/js/core/MmlTree/MmlNode';

export class MmlNone extends AbstractMmlNode {
  properties = {
    useHeight: 1
  };

  texClass = TEXCLASS.ORD;

  get kind() {
    return 'none';
  }

  get linebreakContainer() {
    return true;
  }

  setTeXclass(prev) {
    this.getPrevClass(prev);
    for (const child of this.childNodes) {
      child.setTeXclass(null);
    }
    return this;
  }
}

export class MmlMstack extends AbstractMmlNode {
  properties = {
    useHeight: 1
  };

  texClass = TEXCLASS.ORD;

  get kind() {
    return 'mstack';
  }

  get linebreakContainer() {
    return true;
  }

  setTeXclass(prev) {
    this.getPrevClass(prev);
    for (const child of this.childNodes) {
      child.setTeXclass(null);
    }
    return this;
  }
}

export class MmlMsrow extends AbstractMmlNode {
  properties = {
    useHeight: 1
  };

  texClass = TEXCLASS.ORD;

  get kind() {
    return 'msrow';
  }

  get linebreakContainer() {
    return true;
  }

  setTeXclass(prev) {
    this.getPrevClass(prev);
    for (const child of this.childNodes) {
      child.setTeXclass(null);
    }
    return this;
  }
}
export class MmlMsline extends AbstractMmlNode {
  properties = {
    useHeight: 1
  };

  texClass = TEXCLASS.ORD;

  get kind() {
    return 'msline';
  }

  get linebreakContainer() {
    return true;
  }

  setTeXclass(prev) {
    this.getPrevClass(prev);
    for (const child of this.childNodes) {
      child.setTeXclass(null);
    }
    return this;
  }
}
