import { CHTMLWrapper } from 'mathjax-full/js/output/chtml/Wrapper';
import _ from 'lodash';

const reduceText = (acc, n) => {
  if (n.node && n.node.kind === 'text') {
    acc += n.node.text;
  }
  return acc;
};

export class Line {
  constructor() {
    this.kind = 'line';
  }

  get columns() {
    return [];
  }
}

export class Row {
  constructor(columns, operator) {
    this.kind = 'row';
    this.operator = operator;
    this.columns = columns;
  }

  pad(count, direction = 'right') {
    if (count < this.columns.length) {
      throw new Error('no');
    }

    const diff = count - this.columns.length;

    const padding = _.times(diff).map(n => '__pad__');
    return direction === 'right' ? [...padding, ...this.columns] : [...this.columns, ...padding];
  }
}

const mathNodeToCharArray = mn => {
  const text = mn.childNodes.reduce(reduceText, '');
  return text.split('');
};

/**
 * Convert child a column entry
 * @param {*} child
 * @return an array of column content
 */
const toColumnArray = child => {
  if (!child || !child.kind) {
    return [];
  }

  if (child.kind === 'msrow') {
    throw new Error('msrow in msrow?');
  }

  if (child.kind === 'mo') {
    // We are going to treat this operator as a text array.
    // It's probably going to be a decimal point
    console.warn('mo that is not 1st node in msrow?');
    return mathNodeToCharArray(child);
    // throw new Error('mo must be first child of msrow');
  }

  if (child.kind === 'mn') {
    return mathNodeToCharArray(child);
  }

  if (child.toCHTML) {
    return child;
  }
};

/**
 *  convert mstack chtml childNodes into a Row
 *  @param child chtml child node of mstack
 *  @return Row | Line
 */
const rowStack = child => {
  if (!child || !child.kind) {
    return;
  }

  if (child.kind === 'msrow') {
    if (!child.childNodes || child.childNodes.length === 0) {
      return new Row([]);
    }
    const f = _.first(child.childNodes);
    const nodes = f && f.kind === 'mo' ? _.tail(child.childNodes) : child.childNodes;

    const columns = _.flatten(nodes.map(toColumnArray));

    return new Row(columns, f.kind === 'mo' ? f : undefined);
  }

  if (child.kind === 'mn') {
    const columns = mathNodeToCharArray(child);
    return new Row(columns, undefined);
  }

  if (child.kind === 'mo') {
    console.warn('mo on its own row?');
    return new Row([], child);
  }

  if (child.kind === 'msline') {
    return new Line();
  }

  if (child.toCHTML) {
    return new Row([child]);
  }
};

/** convert MathJax chtml tree to Row[]
 * @param mstack the root of the mathjax chtml tree
 * @return Row[]
 */

export const getStackData = mstack => {
  if (!mstack || !mstack.childNodes) {
    return [];
  }
  return _.compact(mstack.childNodes.map(rowStack));
};

export class CHTMLmstack extends CHTMLWrapper {
  constructor(factory, node, parent = null) {
    super(factory, node, parent);

    this.ce = this.adaptor.document.createElement.bind(this.adaptor.document);
  }

  toCHTML(parent) {
    const chtml = this.standardCHTMLnode(parent);

    const stackData = getStackData(this);

    // console.log('stackData', stackData);
    const maxCols = stackData.reduce((acc, r) => {
      if (r && r.columns.length > acc) {
        acc = r.columns.length;
      }
      return acc;
    }, 0);

    const table = this.ce('table');
    chtml.appendChild(table);

    stackData.forEach(row => {
      const tr = this.ce('tr');
      table.appendChild(tr);

      if (row.kind === 'row') {
        const td = this.ce('td');
        tr.appendChild(td);
        if (row.operator && row.operator.toCHTML) {
          td.setAttribute('class', 'inner');
          row.operator.toCHTML(td);
        } else {
          td.textContent = '';
        }

        // align right for now:
        const cols = row.pad(maxCols, 'right');
        cols.forEach(c => {
          const t = this.ce('td');
          tr.appendChild(t);
          if (c === '__pad__') {
            t.textContent = '';
          } else if (typeof c === 'string') {
            t.textContent = c;
          } else if (c.kind === 'none') {
            t.textContent = '';
          } else if (c.toCHTML) {
            t.setAttribute('class', 'inner');
            c.toCHTML(t);
          }
        });
      } else if (row.kind === 'line') {
        const td = this.ce('td');
        tr.appendChild(td);
        td.setAttribute('colspan', maxCols + 1);
        td.setAttribute('class', 'mjx-line');
        td.textContent = '';
      }
    });
  }
}
CHTMLmstack.styles = {
  'mjx-mstack > table': {
    'line-height': 'initial',
    border: 'solid 0px red',
    'border-spacing': '0em',
    'border-collapse': 'separate'
  },
  'mjx-mstack > table > tr': {
    'line-height': 'initial'
  },
  'mjx-mstack > table > tr > td': {
    // padding: '1.2rem',
    border: 'solid 0px blue',
    'font-family': 'sans-serif',
    'line-height': 'initial'
  },
  'mjx-mstack > table > tr > td.inner': {
    'font-family': 'inherit'
  },
  'mjx-mstack > table > tr > .mjx-line': {
    padding: 0,
    'border-top': 'solid 1px black'
  },
  '.TEX-A': {
    'font-family': 'MJXZERO, MJXTEX !important'
  }
};
