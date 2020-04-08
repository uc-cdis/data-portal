import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LegendPanel from './LegendPanel';
import MapStylePanel from './MapStylePanel';

import './ControlPanel.less';

class ControlPanel extends PureComponent {
  render() {
    return (
      <div className='control-panel'>
        <h3>Confirmed cases</h3>
        <p>
          Data source: <a href='https://systems.jhu.edu'>Johns Hopkins University CSSE</a>
        </p>
        {this.props.showMapStyle ? <MapStylePanel
          onMapStyleChange={this.props.onMapStyleChange}
          defaultMapStyle={this.props.defaultMapStyle}
        /> : null }
        {this.props.showLegend ? <LegendPanel
          colors={this.props.colors}
        /> : null }
      </div>
    );
  }
}

ControlPanel.propTypes = {
  onMapStyleChange: PropTypes.func,
  showLegend: PropTypes.bool,
  colors: PropTypes.object,
  showMapStyle: PropTypes.bool,
  defaultMapStyle: PropTypes.string,
};

ControlPanel.defaultProps = {
  onMapStyleChange: () => {},
  showLegend: false,
  colors: {},
  showMapStyle: false,
  defaultMapStyle: '',
};

export default ControlPanel;
