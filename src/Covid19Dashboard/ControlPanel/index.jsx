import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { InfoCircleOutlined } from '@ant-design/icons';
import LegendPanel from './LegendPanel';
import MapStylePanel from './MapStylePanel';
import LayerSelector from './LayerSelector';
import DataSelector from './DataSelector';

import './ControlPanel.less';

class ControlPanel extends PureComponent {
  render() {
    const tooltipText1 = 'Google Mobility Data shows movement trends as a percentage variance from an established baseline for a given day and place.';
    const tooltipText2 = 'Additional data of interest to display in map tool-tip pop-up.  These data will not influence color gradients on the map.';

    return (
      <div className='control-panel'>
        <h3>{this.props.legendTitle}</h3>
        <p>
          Data source:&nbsp;
          <a href={this.props.legendDataSource.link} target='_blank' rel='noreferrer'>
            {this.props.legendDataSource.title}
          </a>
          {this.props.legendTitle === 'Mobility Data'
            && (
              <Tooltip
                placement='right'
                overlay={tooltipText1}
                overlayClassName='g3-filter-section__and-or-toggle-helper-tooltip'
                arrowContent={<div className='rc-tooltip-arrow-inner' />}
                width='300px'
                trigger={['hover', 'focus']}
                id={'controlPanelTooltipMobilityData'}
              >
                <span
                  role='button'
                  tabIndex='0'
                  aria-describedby={'controlPanelTooltipMobilityData'}
                  className={'g3-helper-tooltip'}
                >
                  <InfoCircleOutlined />
                </span>
              </Tooltip>
            )}
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
                  overlay={tooltipText2}
                  overlayClassName='g3-filter-section__and-or-toggle-helper-tooltip'
                  arrowContent={<div className='rc-tooltip-arrow-inner' />}
                  width='300px'
                  trigger={['hover', 'focus']}
                  id={'controlPanelTooltipAdditional_data'}
                >
                  <span
                    role='button'
                    tabIndex='0'
                    aria-describedby={'controlPanelTooltipAdditional_data'}
                    className={'g3-helper-tooltip'}
                  >
                    <InfoCircleOutlined />
                  </span>
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
