import React from 'react';
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

  handleReceiveNewAggsData = (newAggsData, filter) => {
    this.setState({ aggsData: newAggsData });
  }

  render() {
    return (
      <div className='guppy-data-explorer'>
        <GuppyWrapper
          filterConfig={this.props.filterConfig}
          guppyConfig={this.props.guppyConfig}
          onReceiveNewAggsData={this.handleReceiveNewAggsData}
          onFilterChange={this.handleFilterChange}
          tableConfig={this.props.tableConfig}
        >
          <ConnectedFilter className='guppy-data-explorer__filter' />
          <ExplorerVisualization
            className='guppy-data-explorer__visualization'
            chartConfig={this.props.chartConfig}
            tableConfig={this.props.tableConfig}
            buttonConfig={this.props.buttonConfig}
            guppyConfig={this.props.guppyConfig}
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
};

GuppyDataExplorer.defaultProps = {
};

export default GuppyDataExplorer;
