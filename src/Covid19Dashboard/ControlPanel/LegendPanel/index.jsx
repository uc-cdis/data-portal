import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './LegendPanel.less';

class LegendPanel extends PureComponent {
	render() {
		const { colors } = this.props;
		return (
			<div className='legend-panel'>
				<h3>Legend</h3>
				<div>
				{
					Object.keys(colors).map((value, i)=> <p key={value}><span className='legend-panel__item' style={{backgroundColor: colors[value]}}/> {i === Object.keys(colors).length - 1 ? `${value}+` : value}</p>)
				}
				</div>
			</div>
		);
	}
}

LegendPanel.propTypes = {
	colors: PropTypes.object,
};

LegendPanel.defaultProps = {
	colors: {},
}

export default LegendPanel;
