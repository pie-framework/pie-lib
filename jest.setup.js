console.log('------------ jest.setup.js');
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
console.log('------------ enzyme configured with react 16 adapter');
