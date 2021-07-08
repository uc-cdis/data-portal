import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LegendPanel from './LegendPanel';
import MapStylePanel from './MapStylePanel';
import LayerSelector from './LayerSelector';
import DataSelector from './DataSelector';
import Tooltip from 'rc-tooltip';

import './ControlPanel.less';

class ControlPanel extends PureComponent {
  render() {
    const tooltipText = 'Additional data of interest to display in map tool-tip pop-up.  These data will not influence color gradients on the map.';

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
            Additional Data 
            <Tooltip
                placement='right'
                overlay={tooltipText}
                overlayClassName='g3-filter-section__and-or-toggle-helper-tooltip'
                arrowContent={<div className='rc-tooltip-arrow-inner' />}
                width='300px'
                trigger={['hover', 'focus']}
              >
                <div id='g3-accessibility-links-tooltip-explorer' className='g3-helper-tooltip g3-ring-on-focus' role='tooltip' tabIndex='0'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="g3-icon g3-icon--sm" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path></svg>
                </div>
            </Tooltip>
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
