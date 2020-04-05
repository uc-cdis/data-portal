import React, { PureComponent } from 'react';
import LegendPanel from '../LegendPanel';
import './ControlPanel.less';

export default class ControlPanel extends PureComponent {
  render() {
    const { settings, colors } = this.props;

    return (
      <div className='control-panel'>
        <h3>Confirmed cases</h3>
        <p>
          Data source: <a href='https://systems.jhu.edu'>Johns Hopkins University CSSE</a>
        </p>
        {settings.showLegend ? <LegendPanel colors={colors}/> : null }

        {/* TODO: fix or remove */}
        {/* <hr />
        <div key={'year'} className="input">
          <label>Day</label>
          <input
            type="range"
            value={settings.year}
            min={1995}
            max={2015}
            step={1}
            onChange={evt => this.props.onChange('year', evt.target.value)}
          />
        </div> */}
      </div>
    );
  }
}
