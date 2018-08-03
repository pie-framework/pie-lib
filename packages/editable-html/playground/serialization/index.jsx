import { htmlToValue } from '../../src/serialization';

const html = `<div>
      <p>
        foo
        <img src="img.jpg"/>
        bar
      </p>
    </div>`;
const v = htmlToValue(html);

console.log('v: ', JSON.stringify(v.toJSON(), null, '  '));
