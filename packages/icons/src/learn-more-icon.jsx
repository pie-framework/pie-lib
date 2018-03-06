import PropTypes from 'prop-types';
import React from 'react';
import injectSheet from 'react-jss';
import Sized from './sized';

const Glint = ({ fill }) => (
	<path fill={fill} d="M-130.4,142.1c0-2.1,1.7-3.9,3.9-3.9c0.3,0,0.5,0,0.8,0.1c-0.6-0.8-1.5-1.3-2.6-1.3c-1.8,0-3.3,1.5-3.3,3.3c0,1.1,0.5,2,1.3,2.6C-130.4,142.6-130.4,142.4-130.4,142.1z" />
)

export class LearnMore extends React.Component {

	render() {
		const { classes, size } = this.props;

		if (this.props.open === true) {
			return (
				<Sized size={size}>
					<svg preserveAspectRatio="xMinYMin meet" viewBox="-135 129 16 32">
						<path className={classes.hideBg} d="M-122,141.1c0-3.7-3.3-6.6-7.1-5.8c-2.4,0.5-4.3,2.4-4.7,4.8c-0.4,2.3,0.6,4.4,2.2,5.7c0.4,0.3,0.6,0.8,0.6,1.3v1.9h6.1v-1.9c0-0.5,0.2-1,0.6-1.3C-122.8,144.7-122,143-122,141.1z" />
						<path className={classes.hideBg} d="M-125.7,153h-4.5c-0.4,0-0.8-0.4-0.8-0.8v-1.6h6.1v1.6C-124.9,152.7-125.2,153-125.7,153z" />
						<Glint fill={classes.hideFg.fill} />
					</svg>
				</Sized>);
		} else {
			return (
				<Sized size={size}>
					<svg preserveAspectRatio="xMinYMin meet" viewBox="-135 129 16 31">
						<path fill="#D0CAC5" stroke="#E6E3E0" className="st0" d="M-120.7,142.4c0-3.7-3.3-6.6-7.1-5.8c-2.4,0.5-4.3,2.4-4.7,4.8c-0.4,2.3,0.6,4.4,2.2,5.7c0.4,0.3,0.6,0.8,0.6,1.3v1.9h6.1v-1.9c0-0.5,0.2-1,0.6-1.3C-121.6,146-120.7,144.3-120.7,142.4z" />
						<path fill="#D0CAC5" stroke="#E6E3E0" className="st0" d="M-124.4,154.3h-4.5c-0.4,0-0.8-0.4-0.8-0.8v-1.6h6.1v1.6C-123.6,153.9-123.9,154.3-124.4,154.3z" />
						<path fill="#B3ABA4" stroke="#CDC7C2" className="st1" d="M-121.3,141.8c0-3.7-3.3-6.6-7.1-5.8c-2.4,0.5-4.3,2.4-4.7,4.8c-0.4,2.3,0.6,4.4,2.2,5.7c0.4,0.3,0.6,0.8,0.6,1.3v1.9h6.1v-1.9c0-0.5,0.2-1,0.6-1.3C-122.2,145.3-121.3,143.7-121.3,141.8z" />,
			  <path fill="#B3ABA4" stroke="#CDC7C2" className="st1" d="M-125,153.7h-4.5c-0.4,0-0.8-0.4-0.8-0.8v-1.6h6.1v1.6C-124.2,153.3-124.6,153.7-125,153.7z" />
						<path className={classes.showBg} d="M-122,141.1c0-3.7-3.3-6.6-7.1-5.8c-2.4,0.5-4.3,2.4-4.7,4.8c-0.4,2.3,0.6,4.4,2.2,5.7c0.4,0.3,0.6,0.8,0.6,1.3v1.9h6.1v-1.9c0-0.5,0.2-1,0.6-1.3C-122.8,144.7-122,143-122,141.1z" />
						<path className={classes.showBg} d="M-125.7,153h-4.5c-0.4,0-0.8-0.4-0.8-0.8v-1.6h6.1v1.6C-124.9,152.7-125.2,153-125.7,153z" />
						<Glint fill={classes.hideFg.fill} />
					</svg>
				</Sized>);
		}
	}

}

const styles = {
	showBg: {
		fill: '#1a9cff'
	},
	hideFg: {
		fill: '#1a9cff'
	},
	hideBg: {
		fill: '#bce2ff'
	}

}

LearnMore.propTypes = {
	open: PropTypes.bool
};

LearnMore.defaultProps = {
	open: false
};

export default injectSheet(styles)(LearnMore);

