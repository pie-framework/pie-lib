import Label from './component';

export const tool = () => ({
  label: 'Label',
  type: 'label',
  Component: Label,
  addPoint: label => {
    return {
      type: 'label',
      ...label
    };
  }
});
