import React from 'react';
import PropTypes from 'prop-types';
import GuppyWrapper from '@gen3/guppy/dist/components/GuppyWrapper';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter from './ExplorerFilter';
import ExplorerTopMessageBanner from './ExplorerTopMessageBanner';
import { capitalizeFirstLetter } from '../utils';
import {
  GuppyConfigType,
  FilterConfigType,
  TableConfigType,
  ButtonConfigType,
  ChartConfigType,
} from './configTypeDef';
import './GuppyDataExplorer.css';

class GuppyDataExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.nestedAggsData = {};
    this.state = {
      aggsData: {},
      filter: {},
    };
  }

  handleReceiveNewAggsData = (newAggsData) => {
    this.setState({ aggsData: newAggsData });
  };

  // handleFilterChange = (filters) => {
  //   const subjectIds = [
  //     "7201e9f9-715d-4853-9346-f7d73708c2c7",
  //     "5012188e-8b8d-4b6b-ba41-9a46f4e00f13",
  //     "07cdda15-27df-4d3f-aa1f-d9252b62c98f","815eb083-0928-40c5-b052-4de8d0cf9458","645962da-52ba-4cc4-879e-10a2fd4ee67f"
  //   ]
  
  //   console.log('heatMapConfig', this.props.heatMapConfig);
  //   console.log('guppyConfig', { type: this.props.guppyConfig.dataType, ...this.props.guppyConfig });
  // };

  render() {
    return (
      <div className='guppy-data-explorer'>
        <GuppyWrapper
          filterConfig={this.props.filterConfig}
          guppyConfig={{ type: this.props.guppyConfig.dataType, ...this.props.guppyConfig }}
          onReceiveNewAggsData={this.handleReceiveNewAggsData}
          onFilterChange={this.handleFilterChange}
          rawDataFields={this.props.tableConfig.fields}
          accessibleFieldCheckList={this.props.guppyConfig.accessibleFieldCheckList}
        >
          <ExplorerTopMessageBanner
            className='guppy-data-explorer__top-banner'
            tierAccessLevel={this.props.tierAccessLevel}
            tierAccessLimit={this.props.tierAccessLimit}
            guppyConfig={this.props.guppyConfig}
            getAccessButtonLink={this.props.getAccessButtonLink}
          />
          <ExplorerFilter
            className='guppy-data-explorer__filter'
            guppyConfig={this.props.guppyConfig}
            getAccessButtonLink={this.props.getAccessButtonLink}
            tierAccessLevel={this.props.tierAccessLevel}
            tierAccessLimit={this.props.tierAccessLimit}
          />
          <ExplorerVisualization
            className='guppy-data-explorer__visualization'
            chartConfig={this.props.chartConfig}
            tableConfig={this.props.tableConfig}
            buttonConfig={this.props.buttonConfig}
            guppyConfig={this.props.guppyConfig}
            history={this.props.history}
            nodeCountTitle={this.props.guppyConfig.nodeCountTitle || capitalizeFirstLetter(
              this.props.guppyConfig.dataType)}
            tierAccessLimit={this.props.tierAccessLimit}
            nestedAggsData={this.nestedAggsData}
          />
        </GuppyWrapper>
      </div>
    );
  }
}

GuppyDataExplorer.propTypes = {
  guppyConfig: GuppyConfigType.isRequired,
  filterConfig: FilterConfigType.isRequired,
  tableConfig: TableConfigType.isRequired,
  chartConfig: ChartConfigType.isRequired,
  buttonConfig: ButtonConfigType.isRequired,
  heatMapConfig: PropTypes.object,
  nodeCountTitle: PropTypes.string,
  history: PropTypes.object.isRequired,
  tierAccessLevel: PropTypes.string.isRequired,
  tierAccessLimit: PropTypes.number.isRequired,
  getAccessButtonLink: PropTypes.string,
};

GuppyDataExplorer.defaultProps = {
  nodeCountTitle: undefined,
  getAccessButtonLink: undefined,
  heatMapConfig: undefined,
};

export default GuppyDataExplorer;
