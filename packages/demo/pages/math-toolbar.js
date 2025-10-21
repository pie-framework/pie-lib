import React from 'react';

import withRoot from '../source/withRoot';
// import { MathToolbar } from '@pie-lib/math-toolbar'; - mathquill error window not defined
let MathToolbar;

if (typeof window !== 'undefined') {
  MathToolbarPackage = require('@pie-lib/math-toolbar');
  MathToolbar = MathToolbarPackage.MathToolbar;
}

export class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted } = this.state;
    return mounted ? (
      <div>
        <MathToolbar keypadMode={1} />
        <MathToolbar keypadMode={3} />
        <MathToolbar keypadMode={6} />
        <MathToolbar keypadMode={8} />
        <MathToolbar keypadMode="geometry" />
        <MathToolbar keypadMode="advanced-algebra" />
        <MathToolbar keypadMode="statistics" />
        <MathToolbar latex={'\\frac{1}{2}'} />
      </div>
    ) : (
      <div>loading</div>
    );
  }
}

export default withRoot(Demo);
