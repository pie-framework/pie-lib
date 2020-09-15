import { CHTMLWrapper, CHTMLConstructor } from 'mathjax-full/js/output/chtml/Wrapper';
//'../Wrapper.js';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  const ignoreKeys = [
    'factory',
    'parent',
    'attributes',
    'font',
    'bbox',
    'removedStyles',
    'styles',
    '_factory'
  ];
  return (key, value) => {
    if (ignoreKeys.includes(key)) {
      return;
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
import _ from 'lodash';
// JSON.stringify(circularReference, getCircularReplacer());

const rowStack = child => {
  if (!child || !child.kind) {
    return;
  }

  if (child.kind === 'msrow') {
    return _.flatten(child.childNodes.map(rowStack));
  }

  if (child.kind === 'mn') {
    const tn = child.childNodes[0];
    const parts = tn.text.split('');
    return parts;
  }

  if (child.kind === 'mo') {
    const tn = child.childNodes[0];
    return tn.text.split('');
  }

  if (child.kind === 'msline') {
    return ['line'];
  }
};
export const getStackData = mstack => {
  if (!mstack || !mstack.childNodes) {
    return [];
  }

  return mstack.childNodes.map(rowStack);
  // return [];
};

export class CHTMLmstack extends CHTMLWrapper {
  static styles = {
    'mjx-mstack > table': {
      'border-spacing': '0.0rem 1rem',
      'border-collapse': 'separate'
    },
    'mjx-mstack > table > tr > td': {
      // padding: '1.2rem',
    },
    'mjx-mstack > table > tr > .mjx-line': {
      padding: 0,
      'border-top': 'solid 1px black'
    }
  };

  constructor(factory, node, parent = null) {
    super(factory, node, parent);

    this.ce = this.adaptor.document.createElement.bind(this.adaptor.document);
  }

  row(node, parent) {
    if (!node || !node.kind) {
      return;
    }

    if (node.kind === 'msrow') {
      // msrow is implicit - so skip to the content
      this.row(node.childNodes);
    }

    if (!node.childNodes || node.childNodes.length === 0) {
      return;
    }

    const out = [];

    node.childNodes.forEach(n => {
      if (n.kind === 'mn') {
        const numbers = n.childNodes[0].text;
        out.push(number.split(''));
      }
    });
  }

  /**
   * return an array of rows
   */

  mkStackData() {
    return this.childNodes.map(n => this.row);
  }
  /**
   * @override
   */
  toCHTML(parent) {
    //
    //  Create the rows inside an mjx-itable (which will be used to center the table on the math axis)
    //
    const chtml = this.standardCHTMLnode(parent);

    console.log('chtml: ', chtml); // => <mjx-mstack/>

    console.log(JSON.stringify(this, ['kind', 'childNodes', 'node', 'text'], '  '));

    //1. this.node == the math node and root of the AST that we want to work with.
    // only issue w/ this is what if we want chtml for this? we only have the math node here right?

    console.log('>> childNodes: ', this.childNodes, this.childNodes.map(n => n.kind));

    // const stackData = this.mkStackData();

    // this.childNodes.forEach( ch => {

    //   this.row(ch, chtml)
    // })

    // const stackData = [['', 3, 5, 8, 9], ['+', '', 1, 2, 3], ['line'], ['']];
    // const ce = this.adaptor.document.createElement.bind(this.adaptor.document);

    // const createRow = maxCols => rowData => {
    //   const tr = ce('tr');

    //   const cells = rowData.map(r => {
    //     const td = ce('td');
    //     if (typeof r === 'number') {
    //       td.textContent = r;
    //     }
    //     if (r === 'line') {
    //       td.setAttribute('colspan', maxCols);
    //       td.setAttribute('class', 'mjx-line');
    //       // td.setAttribute('style', 'border-top: solid 1px black');
    //       td.textContent = '';
    //     } else if (typeof r === 'string') {
    //       td.textContent = r;
    //     }

    //     return td;
    //   });

    //   cells.forEach(c => tr.appendChild(c));
    //   return tr;
    // };

    // const generateStack = (rows, parent) => {
    //   const maxCols = rows.reduce((acc, r) => {
    //     if (r && r.length > acc) {
    //       acc = r.length;
    //     }

    //     return acc;
    //   }, 0);

    //   console.log('maxCols:', maxCols);

    //   if (rows.length <= 0) {
    //     return;
    //   }

    //   const table = ce('table');
    //   parent.appendChild(table);

    //   const tableRows = rows.map(createRow(maxCols));

    //   tableRows.forEach(r => table.appendChild(r));
    // };

    // console.log('chtml?', chtml);

    // generateStack(stackData, chtml);
  }
}
