import React from 'react';
import PropTypes from 'prop-types';
import GuppyWrapper from '../GuppyComponents/GuppyWrapper';
import ExplorerErrorBoundary from './ExplorerErrorBoundary';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter from './ExplorerFilter';
import ExplorerTopMessageBanner from './ExplorerTopMessageBanner';
import ExplorerCohort from './ExplorerCohort';
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
    const overviewFilter =
      props.history.location.state && props.history.location.state.filter
        ? props.history.location.state.filter
        : {};

    this.state = {
      aggsData: {},
      filter: {},
      initialAppliedFilters: { ...overviewFilter },
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleReceiveNewAggsData = (newAggsData) => {
    this._isMounted && this.setState({ aggsData: newAggsData });
  };

  updateInitialAppliedFilters = ({ filters }) => {
    this.setState({ initialAppliedFilters: filters });
  };

  render() {
    return (
      <ExplorerErrorBoundary>
        <div className='guppy-data-explorer'>
          <GuppyWrapper
            adminAppliedPreFilters={this.props.adminAppliedPreFilters}
            initialAppliedFilters={this.state.initialAppliedFilters}
            filterConfig={this.props.filterConfig}
            guppyConfig={{
              type: this.props.guppyConfig.dataType,
              ...this.props.guppyConfig,
            }}
            onReceiveNewAggsData={this.handleReceiveNewAggsData}
            onFilterChange={this.handleFilterChange}
            rawDataFields={this.props.tableConfig.fields}
            accessibleFieldCheckList={
              this.props.guppyConfig.accessibleFieldCheckList
            }
          >
            <ExplorerTopMessageBanner
              className='guppy-data-explorer__top-banner'
              getAccessButtonLink={this.props.getAccessButtonLink}
              hideGetAccessButton={this.props.hideGetAccessButton}
            />
            <ExplorerCohort
              className='guppy-data-explorer__cohort'
              onOpenCohort={this.updateInitialAppliedFilters}
              onDeleteCohort={this.updateInitialAppliedFilters}
            />
            <ExplorerFilter
              className='guppy-data-explorer__filter'
              guppyConfig={this.props.guppyConfig}
              getAccessButtonLink={this.props.getAccessButtonLink}
              hideGetAccessButton={this.props.hideGetAccessButton}
              tierAccessLimit={this.props.tierAccessLimit}
              initialAppliedFilters={this.props.initialAppliedFilters}
            />
            <ExplorerVisualization
              className='guppy-data-explorer__visualization'
              chartConfig={this.props.chartConfig}
              tableConfig={this.props.tableConfig}
              buttonConfig={this.props.buttonConfig}
              guppyConfig={this.props.guppyConfig}
              history={this.props.history}
              nodeCountTitle={
                this.props.guppyConfig.nodeCountTitle ||
                capitalizeFirstLetter(this.props.guppyConfig.dataType)
              }
              tierAccessLimit={this.props.tierAccessLimit}
            />
          </GuppyWrapper>
        </div>
      </ExplorerErrorBoundary>
    );
  }
}

GuppyDataExplorer.propTypes = {
  guppyConfig: GuppyConfigType.isRequired,
  filterConfig: FilterConfigType.isRequired,
  tableConfig: TableConfigType.isRequired,
  chartConfig: ChartConfigType.isRequired,
  buttonConfig: ButtonConfigType.isRequired,
  nodeCountTitle: PropTypes.string,
  history: PropTypes.object.isRequired,
  tierAccessLimit: PropTypes.number.isRequired,
  getAccessButtonLink: PropTypes.string,
  hideGetAccessButton: PropTypes.bool,
  adminAppliedPreFilters: PropTypes.object,
};

GuppyDataExplorer.defaultProps = {
  nodeCountTitle: undefined,
  getAccessButtonLink: undefined,
  hideGetAccessButton: false,
  adminAppliedPreFilters: {},
};

export default GuppyDataExplorer;
