import React, { PureComponent } from 'react';
import './LegendPanel.less';

export default class LegendPanel extends PureComponent {
	render() {
		const caseColors = [
			{ value: 0, color: '#FFFFFF' },
			{ value: 50, color: '#EED322' },
			{ value: 75, color:'#E6B71E' },
			{ value: 100, color: '#DA9C20' },
			{ value: 250, color: '#CA8323' },
			{ value: 500, color: '#B86B25' },
			{ value: 750, color: '#A25626' },
			{ value: 1000, color: '#8B4225' },
			{ value: '2500+', color: '#723122' },
			];
		return (
			<div className='legend-panel'>
				<h3>Legend</h3>
				<div>
				{
					caseColors.map(x => <p key={x.value}><span className="legend-panel__item" style={{backgroundColor: x.color}}/> {x.value}</p>)
				}
				</div>
			</div>
		);
	}
}
