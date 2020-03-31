import React, {PureComponent} from 'react';

import './ControlPanel.less';

export default class ControlPanel extends PureComponent {
  render() {
    const {settings} = this.props;

    return (
      <div className="control-panel">
        <h3>Confirmed cases of Coronavirus</h3>
        <p>
          Data source: <a href="https://systems.jhu.edu">Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE)</a>
        </p>

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