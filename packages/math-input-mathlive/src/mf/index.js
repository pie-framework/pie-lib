import Input from './input';
import Static from './static';
import CommonMqStyles, {
  commonMathLiveStyles,
  commonKeyboardStyles,
  commonMqFontStyles,
  commonMqKeyboardStyles,
  longdivStyles,
  supsubStyles,
  placeholderStyles,
} from './common-styles';

export {
  Input,
  Static,
  // Same object shape as @pie-lib/math-input's `mq.CommonMqStyles`, so
  // `const { commonMqFontStyles, ... } = mq.CommonMqStyles` keeps working.
  CommonMqStyles,
  commonMathLiveStyles,
  commonKeyboardStyles,
  commonMqFontStyles,
  commonMqKeyboardStyles,
  longdivStyles,
  supsubStyles,
  placeholderStyles,
};
