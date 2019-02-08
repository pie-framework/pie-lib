import Base, { styles } from './base';

import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const mkIcon = (N, noBase) =>
  withStyles(styles)(props =>
    noBase ? (
      <N {...props} />
    ) : (
      <Base className={props.className}>
        <N {...props} />
      </Base>
    )
  );
const mkTextIcon = N => mkIcon(N, true);

export const AbsoluteValue = mkIcon(props => (
  <g>
    <line
      className={props.classes.root}
      x1="23.7"
      y1="15.5"
      x2="23.7"
      y2="42.5"
    />
    <line
      className={props.classes.root}
      x1="34.3"
      y1="15.5"
      x2="34.3"
      y2="42.5"
    />
  </g>
));

export const Fraction = mkIcon(props => (
  <g>
    <rect
      x="17"
      y="27.5"
      className={props.classes.fillOnly}
      width="24.1"
      height="2.1"
    />
    <rect
      x="21.7"
      y="14.4"
      className={props.classes.root}
      width="14.6"
      height="8.5"
    />
    <rect
      x="21.7"
      y="34.3"
      className={props.classes.root}
      width="14.6"
      height="8.5"
    />
  </g>
));

export const GreaterThan = mkIcon(props => (
  <path
    className={props.classes.fillOnly}
    d="M37.9,28.3l-19.9,8.1v-2.3l16.8-6.7l-16.8-6.7v-2.3l19.9,8.1V28.3z"
  />
));

export const LessThan = mkIcon(props => (
  <path
    className={`${props.classes.fillOnly} ${props.className}`}
    d="M22.1,27.4l16.8,6.7v2.3l-19.9-8.1v-1.9l19.9-8.1v2.3L22.1,27.4z"
  />
));

export const NthRoot = mkIcon(props => (
  <g>
    <polyline
      className={props.classes.root}
      points="15.4,32.4 25.4,42.4 25.4,20.4 48.4,20.4 "
    />
    <rect
      x="32.8"
      y="29.4"
      className={props.classes.root}
      width="9"
      height="12"
    />
    <rect
      x="10"
      y="12.1"
      className={props.classes.root}
      width="9"
      height="12"
    />
  </g>
));

export const Parenthesis = mkIcon(props => (
  <g>
    <path
      className={props.classes.fillOnly}
      d="M25.1,16.4c-1.9,1.6-3.3,3.5-4.2,5.7s-1.4,4.8-1.4,7.7c0,1.5,0.1,2.8,0.3,4.1s0.5,2.5,1,3.6s1,2.1,1.7,3.1
  s1.5,1.9,2.5,2.7l-1.4,0.9c-1.3-0.8-2.5-1.8-3.4-2.9s-1.6-2.3-2.2-3.5s-1-2.5-1.2-3.9s-0.4-2.6-0.4-3.9c0-1.4,0.1-2.8,0.4-4.2
				s0.7-2.7,1.2-4s1.3-2.5,2.2-3.5s2-2,3.4-2.8L25.1,16.4z"
    />
    <path
      className={props.classes.fillOnly}
      d="M34.5,15.4c1.3,0.9,2.3,1.9,3.2,3s1.6,2.3,2.2,3.5s1,2.5,1.2,3.8s0.4,2.6,0.4,4c0,1.4-0.1,2.7-0.4,4.1
    s-0.7,2.7-1.2,4s-1.3,2.5-2.2,3.6s-2.1,2.1-3.4,3l-1.4-0.9c1.9-1.7,3.3-3.6,4.2-5.8s1.4-4.8,1.4-7.8c0-1.5-0.1-2.8-0.3-4.1
				s-0.6-2.5-1-3.6s-1-2.1-1.7-3.1s-1.5-1.9-2.5-2.7c0.3-0.1,0.5-0.3,0.8-0.4S34.2,15.6,34.5,15.4z"
    />
  </g>
));

export const Percent = mkIcon(props => (
  <path
    className={props.classes.fillOnly}
    d="M20.6,18.4c0.8,0,1.6,0.1,2.2,0.4s1.2,0.7,1.6,1.2s0.8,1.2,1,1.9s0.3,1.6, 0.3, 2.6c0, 2-0.5,3.6-1.4,4.6 s-2.2, 1.6-3.9, 1.6c-1.7, 0-3-0.5-3.9-1.6s-1.4-2.6-1.4-4.6c0-2, 0.5-3.5,1.4-4.6S18.9 18.4,20.6,18.4z M20.5,19.7c-2,0-2.9,1.7-2.9,5 c0, 1.6,0.2,2.8,0.7,3.7s1.2,1.2,2.2,1.2c1,0,1.7-0.4,2.2-1.2s0.8-2,0.8-3.7c0-1.7-0.3-2.9-0.8-3.7S21.6,19.7,20.5,19.7z M37.8,18.6 L22, 41.8h-1.9l15.8-23.2H37.8z M37.4, 29.5c1.7,0,3,0.5,3.9,1.6s1.3,2.6,1.3,4.7c0, 1.9-0.5,3.4-1.4, 4.5s-2.2, 1.6-3.9, 1.6 c-1.7,0-3-0.5-3.9-1.6s-1.4-2.6-1.4-4.6c0-2, 0.5-3.5, 1.4-4.6S35.7, 29.5, 37.4, 29.5z M37.3,30.8c-1,0-1.7,0.4-2.2, 1.3 s-0.7,2.1-0.7,3.7c0,1.6,0.3,2.8,0.8,3.6s1.3,1.2,2.2,1.2s1.8-0.4,2.3-1.2s0.8-2,0.8-3.6c0-1.7-0.3-3-0.8-3.8S38.4,30.8,37.3,30.8z"
  />
));

export const SquareRoot = mkIcon(props => (
  <g>
    <polyline
      className={props.classes.root}
      points="14.4,32.4 24.4,42.4 24.4,20.4 47.4,20.4 "
    />
    <rect
      x="31.8"
      y="29.4"
      className={props.classes.root}
      width="9"
      height="12"
    />
  </g>
));

export const Subscript = mkIcon(props => (
  <g>
    <rect
      x="14"
      y="12.6"
      className={props.classes.root}
      width="15.8"
      height="25"
    />
    <rect
      x="36.2"
      y="35.6"
      className={props.classes.root}
      width="9"
      height="12"
    />
  </g>
));

export const Superscript = mkIcon(props => (
  <g>
    <rect
      x="15"
      y="23.6"
      className={props.classes.root}
      width="15.8"
      height="25"
    />
    <rect
      x="37.2"
      y="13.6"
      className={props.classes.root}
      width="9"
      height="12"
    />
  </g>
));

export const Degree = mkIcon(props => (
  <circle className={props.classes.root} cx="28.7" cy="22.7" r="4.7" />
));

export const Approx = mkIcon(props => (
  <g>
    <path
      className={props.classes.fillOnly}
      d="M20.8,25.4c0.5-0.3,1.1-0.6,1.5-0.8c0.3-0.2,0.7-0.2,1-0.3l0.2,0c0.4-0.1,0.9-0.1,1.2-0.1c0.3,0,0.6,0.1,1,0.1
      l0.3,0.1c0.5,0.1,0.9,0.2,1.5,0.4c0.2,0.1,0.3,0.1,0.5,0.2c0.4,0.1,0.7,0.2,1.2,0.4c0.7,0.3,1.3,0.5,1.9,0.7l0.4,0.1
		c0.5,0.2,0.9,0.3,1.4,0.4l0.3,0c0.5,0.1,0.9,0.2,1.4,0.2c1,0,2-0.2,2.9-0.6c0.7-0.3,1.9-0.9,3.1-1.8v-3.1l-0.4,0.3
		c-0.3,0.2-0.6,0.4-0.9,0.6c-0.3,0.2-0.6,0.4-0.9,0.6c-0.3,0.3-0.7,0.4-1.1,0.6c-0.1,0.1-0.3,0.1-0.4,0.2c-0.4,0.2-0.7,0.3-1.2,0.4
		C35.2,24,34.8,24,34.4,24c-0.5,0-1.1-0.1-1.7-0.3l-0.3-0.1c-0.8-0.2-1.5-0.5-2.6-0.9c-0.2-0.1-0.4-0.2-0.7-0.2
		c-0.3-0.1-0.5-0.2-0.7-0.3c-0.4-0.2-0.8-0.3-1.3-0.4c-0.2-0.1-0.4-0.1-0.6-0.1c-0.2,0-0.3,0-0.5-0.1c-0.4-0.1-0.8-0.1-1.2-0.1
		c-0.9,0-1.7,0.3-2.6,0.5L22,22.1c-1,0.3-2.1,0.9-3.3,1.7l-0.1,0.1v3l0.4-0.3C19.7,26.1,20.3,25.7,20.8,25.4z"
    />
    <path
      className={props.classes.fillOnly}
      d="M40.5,30.4l-0.4,0.3c-0.3,0.2-0.6,0.4-0.9,0.6c-0.3,0.2-0.6,0.4-0.9,0.6c-0.3,0.3-0.7,0.4-1.1,0.6
      c-0.1,0.1-0.3,0.1-0.4,0.2c-0.4,0.2-0.7,0.3-1.2,0.4c-0.5,0.1-0.9,0.1-1.3,0.1c-0.5,0-1.1-0.1-1.7-0.3l-0.3-0.1
		c-0.8-0.2-1.5-0.5-2.6-0.9c-0.2-0.1-0.4-0.2-0.7-0.2c-0.3-0.1-0.5-0.2-0.7-0.3c-0.4-0.2-0.8-0.3-1.2-0.4c-0.2-0.1-0.4-0.1-0.6-0.1
		c-0.2,0-0.3,0-0.5-0.1c-0.4-0.1-0.8-0.1-1.2-0.1c-0.9,0-1.7,0.3-2.6,0.5L22,31.3c-1,0.3-2.1,0.9-3.3,1.7l-0.1,0.1v3l0.4-0.3
		c0.7-0.5,1.3-0.9,1.8-1.2c0.5-0.3,1.1-0.6,1.5-0.8c0.3-0.2,0.7-0.2,1.1-0.3l0.2,0c0.4-0.1,0.9-0.1,1.2-0.1c0.3,0,0.6,0.1,1,0.1
		l0.3,0.1c0.5,0.1,0.9,0.2,1.5,0.4c0.2,0.1,0.3,0.1,0.5,0.2c0.4,0.1,0.7,0.2,1.2,0.4c0.7,0.3,1.3,0.5,1.9,0.7l0.4,0.1
		c0.5,0.2,0.9,0.3,1.4,0.4l0.3,0c0.5,0.1,0.9,0.2,1.4,0.2c1,0,2-0.2,2.9-0.6c0.7-0.3,1.9-0.9,3.1-1.8V30.4z"
    />
  </g>
));

export const LessThanEqual = mkIcon(props => (
  <g>
    <path
      className={props.classes.fillOnly}
      d="M22.1,27.4l16.8,6.7v2.3l-19.9-8.1v-1.9l19.9-8.1v2.3L22.1,27.4z"
    />
    <line
      className={props.classes.root}
      x1="19"
      y1="41.4"
      x2="39.7"
      y2="41.4"
    />
  </g>
));

export const GreaterThanEqual = mkIcon(props => (
  <g>
    <path
      className={props.classes.fillOnly}
      d="M38.9,28.3l-19.9,8.1v-2.3l16.8-6.7l-16.8-6.7v-2.3l19.9,8.1V28.3z"
    />
    <line
      className={props.classes.root}
      x1="18.8"
      y1="41.4"
      x2="39.5"
      y2="41.4"
    />
  </g>
));

export const NotEqual = mkTextIcon(props => (
  <span className={props.classes.textIcon}>≠</span>
));

export const SameOrder = mkTextIcon(props => (
  <span className={props.classes.textIcon}>~</span>
));

export const NotSameOrder = mkTextIcon(props => (
  <span className={props.classes.textIcon}>≁</span>
));

export const NotApprox = mkTextIcon(props => (
  <span className={props.classes.textIcon}>≉</span>
));

export const Cong = mkTextIcon(props => (
  <span className={props.classes.textIcon}>≅</span>
));

export const NotCong = mkTextIcon(props => (
  <span className={props.classes.textIcon}>≇</span>
));

// Geometry

export const RightArrow = mkTextIcon(props => (
  <span className={props.classes.textIcon} style={{ fontSize: '25px' }}>
    ⟶
  </span>
));

export const LeftRightArrow = mkTextIcon(props => (
  <span className={props.classes.textIcon} style={{ fontSize: '25px' }}>
    ⟷
  </span>
));

export const Segment = mkTextIcon(props => (
  <span className={props.classes.textIcon} style={{ fontSize: '25px' }}>
    AB
  </span>
));

export const Parallel = mkTextIcon(props => (
  <span className={props.classes.textIcon}>∥</span>
));

export const Perpendicular = mkTextIcon(props => (
  <span className={props.classes.textIcon}>⊥</span>
));

export const Angle = mkTextIcon(props => (
  <span className={props.classes.textIcon}>∠</span>
));

export const MeasuredAngle = mkTextIcon(props => (
  <span className={props.classes.textIcon}>∡</span>
));

export const Triangle = mkTextIcon(props => (
  <span className={props.classes.textIcon}>▵</span>
));

export const Parallelogram = mkTextIcon(props => (
  <span className={props.classes.textIcon}>▱</span>
));

export const CircledDot = mkTextIcon(props => (
  <span className={props.classes.textIcon}>⊙</span>
));

export const X = mkIcon(props => (
  <path
    className={props.classes.fillOnly}
    d="M23.1, 30.3c0.9-2.2, 2.5-5.5, 5.3-5.5c2.4,0, 2.9, 2.4,3.4,4.3c0.9-1.4, 2.5-4.3,4.4-4.3c1.2,0,2.1,0.7,2.1,1.9 c0,1.3-0.8,2-2,2c-0.4,0-0.8-0.2-1.2-0.4c-0.4-0.2-0.6-0.4-0.8-0.4c-0.9,0.1-2.3,2.2-2.2,2.8l1.2 5.4c0.2,0.9,0.3,1.7,1,1.7	c0.8,0,2.3-2.8,2.6-3.6l0.8,0.3c-0.9,2.3-2.6,5.3-5.4,5.3c-3,0-3.5-3.1-4-5.4c-1.2,2-2.4,5.4-5.3, 5.4c-1.3, 0-1.9-1.1-1.9-2.3 c0-1,0.9-1.9 1.9-1.9c0.7,0,1.3,0.4, 1.7,0.6c0.3,0.1, 0.6, 0.4,0.7,0.4c0.5,0,2.2-2.1 2.6-3.3l-1.3-5.7c0-0.1-0.2-0.4-0.4-0.4 c-1, 0-2.1,2.7-2.5,3.4L23.1,30.3z"
  />
));

export const Y = mkIcon(props => (
  <path
    className={props.classes.fillOnly}
    d="M31.2,34.3l2.4-6.6c0.4-1.1,0.9-2.9,2.4-2.9c1,0,1.7,0.8,1.7 1.8c0,0.9-0.4,2-1.5,2c-0.3 , 0-0.7-0.3-1-0.3 c-0.6-0.1-0.9,1-1.1,1.4l-3.7,9.6c-1.2, 3-3.5, 7.7-7.2, 7.7c-1.4,0-2.6-1-2.6-2.4c0-1.2,0.8-2.2,2.1-2.2c1.2,0,2.2,0.8,1.9, 1.9 c-0.1,0.6,0.2,0.8,0.6,0.8c0.8,0,3-3,3.1-3.8c0.1-0.3,0.1-0.6,0.1-0.9c0-0.6-0.3-1.3-0.5-1.9l-3-8.7c-0.2-0.5-0.5-2.2-1.2-2.2 c-0.8,0-1.9,2.2-2.2,2.8l-0.8-0.3c0.8-2,2.8-5.3,5.2-5.3c1.2,0,2.6,0.1,3.3,2.8L31.2,34.3z"
  />
));
