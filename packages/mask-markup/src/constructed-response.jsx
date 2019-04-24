import React from 'react';
import Input from './components/input';
import { withMask } from './with-mask';

const Out = withMask('input', props => (node, data, onChange) => {
  const dataset = node.data ? node.data.dataset || {} : {};
  if (dataset.component === 'input') {
    const { feedback, disabled } = props;
    return (
      <Input
        key={`${node.type}-input-${dataset.id}`}
        correct={feedback && feedback[dataset.id] && feedback[dataset.id].correct}
        disabled={disabled}
        value={data[dataset.id]}
        id={dataset.id}
        onChange={onChange}
      />
    );
  }
});
export default Out;
// export default class ConstructedResponse extends React.Component {
//   static propTypes = {
//     markup: PropTypes.string,
//     layout: PropTypes.object,
//     value: PropTypes.object,
//     onChange: PropTypes.func,
//     disabled: PropTypes.bool
//   };

//   renderChildren = (node, data, onChange) => {
//     const dataset = node.data ? node.data.dataset || {} : {};
//     if (dataset.component === 'input') {
//       const { feedback } = this.props;
//       return (
//         <Input
//           key={`${node.type}-input-${dataset.id}`}
//           correct={feedback && feedback[dataset.id] && feedback[dataset.id].correct}
//           disabled={this.props.disabled}
//           value={data[dataset.id]}
//           id={dataset.id}
//           onChange={onChange}
//         />
//       );
//     }
//   };
//   render() {
//     const { markup, layout, value, onChange } = this.props;

//     const maskLayout = layout ? layout : buildLayoutFromMarkup(markup);

//     return (
//       <div>
//         <Mask
//           layout={maskLayout}
//           data={value}
//           onChange={onChange}
//           renderChildren={this.renderChildren}
//         />
//       </div>
//     );
//   }
// }
