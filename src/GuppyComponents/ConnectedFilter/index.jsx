/* eslint react/forbid-prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  getFilterSections,
  excludeSelfFilterFromAggsData,
} from './utils';
import {
  askGuppyAboutArrayTypes,
  askGuppyForAggregationData,
  getAllFieldsFromFilterConfigs,
} from '../Utils/queries';
import {
  mergeFilters,
  updateCountsInInitialTabsOptions,
  sortTabsOptions,
} from '../Utils/filters';

class ConnectedFilter extends React.Component {
  constructor(props) {
    super(props);

    const allFields = getAllFieldsFromFilterConfigs(props.filterConfig.tabs);
    const initialFilter = mergeFilters(
      props.initialAppliedFilters,
      props.adminAppliedPreFilters,
    );

    this.initialTabsOptions = {};
    this.state = {
      allFields,
      initialAggsData: {},
      receivedAggsData: {},
      adminAppliedPreFilters: { ...this.props.adminAppliedPreFilters },
      filter: { ...initialFilter },
      filtersApplied: { ...initialFilter },
    };
    this.filterGroupRef = React.createRef();
    this.adminPreFiltersFrozen = JSON.stringify(this.props.adminAppliedPreFilters).slice();
    this.arrayFields = [];
    this._isMounted = false;
    this.controller = new AbortController();
  }

  componentDidMount() {
    this._isMounted = true;

    if (this.props.onFilterChange) {
      this.props.onFilterChange(this.state.filter);
    }
    askGuppyForAggregationData(
      this.props.guppyConfig.path,
      this.props.guppyConfig.type,
      this.state.allFields,
      this.state.filter,
    )
      .then((res) => {
        if (!res.data) {
          const msg = `error querying guppy${res.errors && res.errors.length > 0 ? `: ${res.errors[0].message}` : ''}`;
          console.error(msg); // eslint-disable-line no-console
        }
        this.handleReceiveNewAggsData(
          res.data._aggregation[this.props.guppyConfig.type],
          res.data._aggregation.accessible._totalCount,
          res.data._aggregation.all._totalCount,
          this.state.adminAppliedPreFilters,
        );
        this.saveInitialAggsData(res.data._aggregation[this.props.guppyConfig.type]);
      });

    askGuppyAboutArrayTypes(this.props.guppyConfig.path).then((res) => {
      this.arrayFields = [];
      const keys = Object.keys(res);

      for (let i = 0; i < keys.length; i += 1) {
        if (res[keys[i]].arrayFields && res[keys[i]].arrayFields.length > 0) {
          this.arrayFields = this.arrayFields.concat(res[keys[i]].arrayFields);
        }
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleReceiveNewAggsData(
    receivedAggsData,
    accessibleCount,
    totalCount,
    filterResults,
  ) {
    if (this._isMounted) this.setState({ receivedAggsData });
    if (this.props.onReceiveNewAggsData) {
      const resultAggsData = excludeSelfFilterFromAggsData(receivedAggsData, filterResults);
      this.props.onReceiveNewAggsData(resultAggsData, accessibleCount, totalCount);
    }
  }

  /**
   * Handler function that is called everytime filter changes
   * What this function does:
   * 1. Ask guppy for aggregation data using (processed) filter
   * 2. After get aggregation response, call `handleReceiveNewAggsData` handler
   *    to process new received agg data
   * 3. If there's `onFilterChange` callback function from parent, call it
   * @param {object} filterResults
   */
  handleFilterChange(filterResults) {
    this.controller.abort();
    this.controller = new AbortController();

    const adminAppliedPreFilters = JSON.parse(this.adminPreFiltersFrozen);
    if (this._isMounted) this.setState({ adminAppliedPreFilters });

    const mergedFilterResults = mergeFilters(filterResults, adminAppliedPreFilters);
    if (this._isMounted) this.setState({ filtersApplied: mergedFilterResults });

    askGuppyForAggregationData(
      this.props.guppyConfig.path,
      this.props.guppyConfig.type,
      this.state.allFields,
      mergedFilterResults,
      this.controller.signal,
    )
      .then((res) => {
        this.handleReceiveNewAggsData(
          res.data._aggregation[this.props.guppyConfig.type],
          res.data._aggregation.accessible._totalCount,
          res.data._aggregation.all._totalCount,
          mergedFilterResults,
        );
      });

    if (this.props.onFilterChange) {
      this.props.onFilterChange(mergedFilterResults);
    }
  }

  setFilter(filter) {
    if (this.filterGroupRef.current) {
      this.filterGroupRef.current.resetFilter();
    }
    this.handleFilterChange(filter);
  }

  /**
   * This function contains partial rendering logic for filter components.
   * It transfers aggregation data (`this.state.receivedAggsData`) to items inside filters.
   * But before that, the function first calls `this.props.onProcessFilterAggsData`, which is
   * a callback function passed by `ConnectedFilter`'s parent component, so that the parent
   * component could do some pre-processing modification about filter.
   */
  getFilterTabs() {
    if (this.props.hidden) return null;
    let processedTabsOptions = this.props.onProcessFilterAggsData(this.state.receivedAggsData);
    if (Object.keys(this.initialTabsOptions).length === 0) {
      this.initialTabsOptions = processedTabsOptions;
    }

    processedTabsOptions = updateCountsInInitialTabsOptions(
      this.initialTabsOptions,
      processedTabsOptions,
      this.state.filtersApplied,
    );

    processedTabsOptions = sortTabsOptions(processedTabsOptions);

    if (!processedTabsOptions || Object.keys(processedTabsOptions).length === 0) return null;
    const { fieldMapping } = this.props;
    const { FilterList } = this.props.filterComponents;
    const tabs = this.props.filterConfig.tabs.map(({ fields, searchFields }, index) => (
      <FilterList
        key={index}
        sections={
          getFilterSections(fields, searchFields, fieldMapping, processedTabsOptions,
            this.state.initialAggsData, this.state.adminAppliedPreFilters,
            this.props.guppyConfig, this.arrayFields)
        }
        tierAccessLimit={this.props.tierAccessLimit}
        lockedTooltipMessage={this.props.lockedTooltipMessage}
        disabledTooltipMessage={this.props.disabledTooltipMessage}
        arrayFields={this.arrayFields}
      />
    ));
    return tabs;
  }

  /**
   * Save initial aggregation data, especially for range slider
   * so that we still have min/max values for range slider
   * @param {object} aggsData
   */
  saveInitialAggsData(aggsData) {
    if (this._isMounted) this.setState({ initialAggsData: aggsData });
  }

  render() {
    if (this.props.hidden) return null;
    const filterTabs = this.getFilterTabs();
    if (!filterTabs || filterTabs.length === 0) {
      return null;
    }
    // If there are any search fields, insert them at the top of each tab's fields.
    const filterConfig = {
      tabs: this.props.filterConfig.tabs.map(({ title, fields, searchFields }) => {
        if (searchFields) {
          return { title, fields: searchFields.concat(fields) };
        }
        return { title, fields };
      }),
    };
    const { FilterGroup } = this.props.filterComponents;
    return (
      <FilterGroup
        ref={this.filterGroupRef}
        className={this.props.className}
        tabs={filterTabs}
        filterConfig={filterConfig}
        onFilterChange={(e) => this.handleFilterChange(e)}
        hideZero={this.props.hideZero}
        initialAppliedFilters={this.props.initialAppliedFilters}
      />
    );
  }
}

ConnectedFilter.propTypes = {
  filterConfig: PropTypes.shape({
    tabs: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      fields: PropTypes.arrayOf(PropTypes.string),
      searchFields: PropTypes.arrayOf(PropTypes.string),
    })),
  }).isRequired,
  guppyConfig: PropTypes.shape({
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func,
  onReceiveNewAggsData: PropTypes.func,
  className: PropTypes.string,
  fieldMapping: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string,
    name: PropTypes.string,
  })),
  tierAccessLimit: PropTypes.number,
  onProcessFilterAggsData: PropTypes.func,
  adminAppliedPreFilters: PropTypes.object,
  initialAppliedFilters: PropTypes.object,
  lockedTooltipMessage: PropTypes.string,
  disabledTooltipMessage: PropTypes.string,
  hideZero: PropTypes.bool,
  hidden: PropTypes.bool,
  filterComponents: PropTypes.shape({
    FilterGroup: PropTypes.elementType.isRequired,
    FilterList: PropTypes.elementType.isRequired,
  }).isRequired,
};

ConnectedFilter.defaultProps = {
  onFilterChange: () => {},
  onReceiveNewAggsData: () => {},
  className: '',
  fieldMapping: [],
  tierAccessLimit: undefined,
  onProcessFilterAggsData: (data) => (data),
  adminAppliedPreFilters: {},
  initialAppliedFilters: {},
  lockedTooltipMessage: '',
  disabledTooltipMessage: '',
  hideZero: false,
  hidden: false,
};

export default ConnectedFilter;
