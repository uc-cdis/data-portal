import React from 'react';
import PropTypes from 'prop-types';
import GuppyWrapper from '@gen3/guppy/dist/components/GuppyWrapper';
import ConnectedFilter from '@gen3/guppy/dist/components/ConnectedFilter';
import ExplorerVisualization from './ExplorerVisualization';
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
    this.state = {
      aggsData: {},
      filter: {},
    };
  }

  getFilterConfigForGuppy = () => {
    const filterConfig = this.props.filterConfig.tabs.map(entry => ({
      title: entry.title,
      filters: entry.fields.map((f) => {
        const field = f;
        const fieldMappingEntry = this.props.guppyConfig.fieldMapping.find(i => i.field === field);
        if (!fieldMappingEntry) {
          throw new Error('error parsing filter configuration');
        }
        const label = fieldMappingEntry.name;
        return {
          field,
          label,
        };
      }),
    }));
    return { tabs: filterConfig };
  };

  handleReceiveNewAggsData = (newAggsData) => {
    this.setState({ aggsData: newAggsData });
  };

  render() {
    const filterConfigForGuppy = this.getFilterConfigForGuppy();
    return (
      <div className='guppy-data-explorer'>
        <GuppyWrapper
          filterConfig={filterConfigForGuppy}
          guppyConfig={{ type: this.props.guppyConfig.dataType, ...this.props.guppyConfig }}
          onReceiveNewAggsData={this.handleReceiveNewAggsData}
          onFilterChange={this.handleFilterChange}
        >
          <ConnectedFilter
            className='guppy-data-explorer__filter'
            filterConfig={filterConfigForGuppy}
            guppyConfig={{ type: this.props.guppyConfig.dataType, ...this.props.guppyConfig }}
          />
          <ExplorerVisualization
            className='guppy-data-explorer__visualization'
            chartConfig={this.props.chartConfig}
            tableConfig={this.props.tableConfig}
            buttonConfig={this.props.buttonConfig}
            guppyConfig={this.props.guppyConfig}
            history={this.props.history}
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
  history: PropTypes.object.isRequired,
};

export default GuppyDataExplorer;
