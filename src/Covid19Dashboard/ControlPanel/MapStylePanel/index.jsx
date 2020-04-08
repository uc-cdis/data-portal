import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './MapStylePanel.less';

class MapStylePanel extends PureComponent {
	render() {
		return (
			<div className='map-style-panel'>
				<h3>Map style</h3>
				<div>
					<input
						className='map-style-panel__radio'
						type='radio'
						name='map-style'
						defaultChecked={true}
						onClick={() => this.props.onMapStyleChange('confirmed-dots')}
					/>
					<label>Dot distribution</label>
				</div>
				<div>
					<input
						className='map-style-panel__radio'
						type='radio'
						name='map-style'
						onClick={() => this.props.onMapStyleChange('confirmed-choropleth')}
					/>
					<label>Choropleth</label>
				</div>
			</div>
		);
	}
}

MapStylePanel.propTypes = {
	onMapStyleChange: PropTypes.func.isRequired,
	defaultMapStyle: PropTypes.string,
};

MapStylePanel.defaultProps = {
	defaultMapStyle: '',
}

export default MapStylePanel;
