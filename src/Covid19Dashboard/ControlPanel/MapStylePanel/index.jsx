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
            id='confirmed-dots'
            className='map-style-panel__radio'
            type='radio'
            name='map-style'
            defaultChecked={this.props.defaultMapStyle === 'confirmed-dots'}
            onClick={() => this.props.onMapStyleChange('confirmed-dots')}
          />
          <label htmlFor='confirmed-dots'>Dot distribution</label>
        </div>
        <div>
          <input
            id='confirmed-choropleth'
            className='map-style-panel__radio'
            type='radio'
            name='map-style'
            defaultChecked={this.props.defaultMapStyle === 'confirmed-choropleth'}
            onClick={() => this.props.onMapStyleChange('confirmed-choropleth')}
          />
          <label htmlFor='confirmed-choropleth'>Choropleth</label>
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
};

export default MapStylePanel;
