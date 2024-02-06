import { MathMLToLaTeX } from '@pie-framework/mathml-to-latex';

export default (mathml) => {
  // Check if mathml is defined and log it
  if (mathml) {
    console.log('MathML input:', mathml);
    return MathMLToLaTeX.convert(mathml);
  } else {
    console.error('MathML input is undefined or null');
    return ''; // Return an empty string or handle this case as needed
  }
};
