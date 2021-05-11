import React from 'react';
import PropTypes from 'prop-types';
import GuppyWrapper from '../GuppyComponents/GuppyWrapper';
import ExplorerErrorBoundary from './ExplorerErrorBoundary';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter from './ExplorerFilter';
import ExplorerTopMessageBanner from './ExplorerTopMessageBanner';
import ExplorerCohort from './ExplorerCohort';
import { capitalizeFirstLetter } from '../utils';
import { validateFilter } from './utils';
import {
  GuppyConfigType,
  FilterConfigType,
  TableConfigType,
  ButtonConfigType,
  ChartConfigType,
  SurvivalAnalysisConfigType,
} from './configTypeDef';
import './GuppyDataExplorer.css';

class GuppyDataExplorer extends React.Component {
  constructor(props) {
    super(props);

    const searchParams = new URLSearchParams(props.history.location.search);

    let initialAppliedFilters = {};
    if (searchParams.has('filter')) {
      try {
        const filterInUrl = JSON.parse(decodeURI(searchParams.get('filter')));
        if (validateFilter(filterInUrl, props.filterConfig))
          initialAppliedFilters = filterInUrl;
        else throw undefined;
      } catch (e) {
        console.error('Invalid filter value in URL.', e);
        props.history.push({ search: '' });
      }
    }

    const patientIds = searchParams.has('patientIds')
      ? searchParams.get('patientIds').split(',')
      : [];

    this.state = {
      initialAppliedFilters,
      patientIds,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateInitialAppliedFilters = ({ filters }) => {
    if (this._isMounted) this.setState({ initialAppliedFilters: filters });
  };

  handleFilterChange = (filter) => {
    let search = '';
    if (filter && Object.keys(filter).length > 0) {
      const allSearchFields = [];
      for (const { searchFields } of this.props.filterConfig.tabs)
        if (searchFields?.length > 0) allSearchFields.push(...searchFields);

      if (allSearchFields.length === 0) {
        search = `filter=${JSON.stringify(filter)}`;
      } else {
        const allSearchFieldSet = new Set(allSearchFields);
        const filterWithoutSearchFields = {};
        for (const field of Object.keys(filter))
          if (!allSearchFieldSet.has(field))
            filterWithoutSearchFields[field] = filter[field];

        if (Object.keys(filterWithoutSearchFields).length > 0)
          search = `filter=${JSON.stringify(filterWithoutSearchFields)}`;
      }
    }

    this.props.history.push({ search });
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
              survivalAnalysisConfig={this.props.survivalAnalysisConfig}
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
  survivalAnalysisConfig: SurvivalAnalysisConfigType.isRequired,
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
