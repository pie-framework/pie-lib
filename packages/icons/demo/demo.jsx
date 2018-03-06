import {
  Correct,
  CorrectResponse,
  Incorrect,
  Instructions,
  LearnMore,
  NothingSubmitted,
  PartiallyCorrect,
  ShowRationale,
} from '../src';

import React from 'react';
import { render } from 'react-dom';

console.log('Correct: ', Correct);


class DemoApp extends React.Component {
  render() {
    return <table>
      <thead>
        <tr>
          <th>
            Rendering
          </th>
          <th>
            Markup
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><Correct iconSet="emoji" /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;emoji&#x22; /&#x3E;</code></pre></td>
        </tr>

        <tr>
          <td><Correct iconSet="check" /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;check&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="emoji" shape="square" /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;emoji&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="check" shape="square" /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;check&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="emoji" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;emoji&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="emoji" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;emoji&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="check" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;check&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="check" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;check&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="emoji" category="feedback" /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="check" category="feedback" /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="emoji" category="feedback" shape="square" /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="check" category="feedback" shape="square" /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="emoji" category="feedback" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="check" category="feedback" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="emoji" category="feedback" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Correct iconSet="check" category="feedback" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;Correct iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="emoji" /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;emoji&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="check" /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;check&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="emoji" shape="square" /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;emoji&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="check" shape="square" /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;check&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="emoji" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;emoji&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="emoji" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;emoji&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="check" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;check&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="check" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;check&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="emoji" category="feedback" /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="check" category="feedback" /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="emoji" category="feedback" shape="square" /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="check" category="feedback" shape="square" /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="emoji" category="feedback" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="check" category="feedback" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="emoji" category="feedback" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><PartiallyCorrect iconSet="check" category="feedback" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;PartiallyCorrect iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="emoji" /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;emoji&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="check" /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;check&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="emoji" shape="square" /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;emoji&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="check" shape="square" /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;check&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="emoji" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;emoji&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="emoji" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;emoji&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="check" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;check&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="check" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;check&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="emoji" category="feedback" /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="check" category="feedback" /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="emoji" category="feedback" shape="square" /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="check" category="feedback" shape="square" /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="emoji" category="feedback" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="check" category="feedback" shape="round" open={true} /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; shape=&#x22;round&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="emoji" category="feedback" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Incorrect iconSet="check" category="feedback" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;Incorrect iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><NothingSubmitted iconSet="check" /></td>
          <td><pre><code>&#x3C;NothingSubmitted iconSet=&#x22;check&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><NothingSubmitted iconSet="emoji" /></td>
          <td><pre><code>&#x3C;NothingSubmitted iconSet=&#x22;emoji&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><NothingSubmitted iconSet="check" category="feedback" /></td>
          <td><pre><code>&#x3C;NothingSubmitted iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><NothingSubmitted iconSet="emoji" category="feedback" /></td>
          <td><pre><code>&#x3C;NothingSubmitted iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><NothingSubmitted iconSet="check" category="feedback" shape="square" /></td>
          <td><pre><code>&#x3C;NothingSubmitted iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><NothingSubmitted iconSet="emoji" category="feedback" shape="square" /></td>
          <td><pre><code>&#x3C;NothingSubmitted iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><NothingSubmitted iconSet="check" category="feedback" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;NothingSubmitted iconSet=&#x22;check&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><NothingSubmitted iconSet="emoji" category="feedback" shape="square" open={true} /></td>
          <td><pre><code>&#x3C;NothingSubmitted iconSet=&#x22;emoji&#x22; category=&#x22;feedback&#x22; shape=&#x22;square&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><ShowRationale iconSet="emoji" /></td>
          <td><pre><code>&#x3C;ShowRationale iconSet=&#x22;emoji&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><ShowRationale iconSet="check" /></td>
          <td><pre><code>&#x3C;ShowRationale iconSet=&#x22;check&#x22; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><ShowRationale iconSet="emoji" open={true} /></td>
          <td><pre><code>&#x3C;ShowRationale iconSet=&#x22;emoji&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><ShowRationale iconSet="check" open={true} /></td>
          <td><pre><code>&#x3C;ShowRationale iconSet=&#x22;check&#x22; open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><LearnMore open={false} /></td>
          <td><pre><code>&#x3C;LearnMore open=&#123;false&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><LearnMore open={true} /></td>
          <td><pre><code>&#x3C;LearnMore open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><CorrectResponse open={false} /></td>
          <td><pre><code>&#x3C;CorrectResponse open=&#123;false&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><CorrectResponse open={true} /></td>
          <td><pre><code>&#x3C;CorrectResponse open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Instructions open={false} /></td>
          <td><pre><code>&#x3C;Instructions open=&#123;false&#125; /&#x3E;</code></pre></td>
        </tr>
        <tr>
          <td><Instructions open={true} /></td>
          <td><pre><code>&#x3C;Instructions open=&#123;true&#125; /&#x3E;</code></pre></td>
        </tr>
      </tbody>
    </table>;
  }
}

render(<DemoApp />, document.getElementById('app'));