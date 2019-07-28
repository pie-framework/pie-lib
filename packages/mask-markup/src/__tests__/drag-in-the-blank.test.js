import * as React from 'react';
import { shallow } from 'enzyme';
import DragInTheBlank from '../drag-in-the-blank';

const markup = `<div>
  <img src="https://image.shutterstock.com/image-vector/cow-jumped-over-moon-traditional-260nw-1152899330.jpg"></img>
   <h5>Hey Diddle Diddle <i>by ?</i></h5>
 <p>1: Hey, diddle, diddle,</p>
 <p>2: The cat and the fiddle,</p>
 <p>3: The cow {{0}} over the moon;</p>
 <p>4: The little dog {{1}},</p>
 <p>5: To see such sport,</p>
 <p>6: And the dish ran away with the {{2}}.</p>
</div>`;
const choice = (v, id) => ({ value: v, id });

describe('DragInTheBlank', () => {
  const defaultProps = {
    disabled: false,
    feedback: {},
    markup,
    choices: [
      choice('Jumped', '0'),
      choice('Laughed', '1'),
      choice('Spoon', '2'),
      choice('Fork', '3'),
      choice('Bumped', '4'),
      choice('Smiled', '5')
    ],

    value: {
      0: undefined
    }
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DragInTheBlank {...defaultProps} />);
  });

  describe('render', () => {
    it('renders correctly with default props', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with disabled prop as true', () => {
      wrapper.setProps({ disabled: true });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with feedback', () => {
      wrapper.setProps({
        feedback: {
          0: {
            value: 'Jumped',
            correct: 'Jumped'
          },
          1: {
            value: 'Laughed',
            correct: 'Laughed'
          },
          2: {
            value: 'Spoon',
            correct: 'Spoon'
          }
        }
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
