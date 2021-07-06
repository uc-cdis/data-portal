import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LegendPanel from './LegendPanel';
import MapStylePanel from './MapStylePanel';
import LayerSelector from './LayerSelector';
import DataSelector from './DataSelector';

import './ControlPanel.less';

class ControlPanel extends PureComponent {
  render() {
    return (
      <div className='control-panel'>
        <h3>{this.props.legendTitle}</h3>
        <p>
          Data source:
          <a href={this.props.legendDataSource.link}>
            {this.props.legendDataSource.title}
          </a>
        </p>
        {this.props.lastUpdated
          && (
            <p>
            Last updated: {this.props.lastUpdated}
            </p>
          )}
        {this.props.showMapStyle ? (
          <MapStylePanel
            onMapStyleChange={this.props.onMapStyleChange}
            defaultMapStyle={this.props.defaultMapStyle}
          />
        ) : null }
        {this.props.showLegend ? (
          <LegendPanel
            formattedColors={this.props.formattedColors}
            colors={this.props.colors}
          />
        ) : null }
        { this.props.layers
          ? (
            <div>
              <h3>Select Data</h3>
              <h4>
            Map Layers
              </h4>
              <LayerSelector
                layers={this.props.layers}
                onLayerSelectChange={this.props.onLayerSelectChange}
                activeLayer={this.props.activeLayer}
              />
              <h4>
            Additional Data Points
              </h4>
              <DataSelector
                layers={this.props.dataPoints}
                onDataSelectChange={this.props.onDataSelectChange}
              />
            </div>
          ) : null}
      </div>
    );
  }
}

ControlPanel.propTypes = {
  onMapStyleChange: PropTypes.func,
  onDataSelectChange: PropTypes.func,
  showLegend: PropTypes.bool,
  colors: PropTypes.object,
  formattedColors: PropTypes.array,
  showMapStyle: PropTypes.bool,
  defaultMapStyle: PropTypes.string,
  legendTitle: PropTypes.string,
  legendDataSource: PropTypes.object,
  activeLayer: PropTypes.string,
  dataPoints: PropTypes.object,
  layers: PropTypes.object,
  lastUpdated: PropTypes.string,
  onLayerSelectChange: PropTypes.func,
};

ControlPanel.defaultProps = {
  onMapStyleChange: () => {},
  showLegend: false,
  colors: {},
  formattedColors: [],
  showMapStyle: false,
  defaultMapStyle: '',
  lastUpdated: '',
  layers: null,
  onLayerSelectChange: () => {},
  onDataSelectChange: () => {},
  legendTitle: '',
  legendDataSource: {},
  activeLayer: '',
  dataPoints: {},
};

export default ControlPanel;
