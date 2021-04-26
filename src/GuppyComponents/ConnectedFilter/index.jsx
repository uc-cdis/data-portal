/* eslint react/forbid-prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { askGuppyAboutArrayTypes } from '../Utils/queries';
import {
  getFilterSections,
  mergeFilters,
  updateCountsInInitialTabsOptions,
  sortTabsOptions,
} from '../Utils/filters';

class ConnectedFilter extends React.Component {
  constructor(props) {
    super(props);

    const initialFilter = mergeFilters(
      props.initialAppliedFilters,
      props.adminAppliedPreFilters
    );

    this.initialTabsOptions = {};
    this.state = {
      initialAggsData: {},
      receivedAggsData: {},
      filter: { ...initialFilter },
    };
    this.filterGroupRef = React.createRef();
    this.arrayFields = [];
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    askGuppyAboutArrayTypes(this.props.guppyConfig.path).then((res) => {
      const keys = Object.keys(res);
      for (const key of keys)
        if (res[key].arrayFields && res[key].arrayFields.length > 0)
          this.arrayFields = this.arrayFields.concat(res[key].arrayFields);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    if (
      Object.keys(this.state.initialAggsData).length === 0 &&
      Object.keys(this.props.receivedAggsData).length !== 0 &&
      this._isMounted
    )
      // Save initial aggregation data, especially for range slider
      // so that we still have min/max values for range slider
      this.setState({ initialAggsData: this.props.receivedAggsData });
  }

  /**
   * Handler function that is called everytime filter changes
   * What this function does:
   * 1. Ask guppy for aggregation data using (processed) filter
   * 2. After get aggregation response, process new received agg data
   * 3. If there's `onFilterChange` callback function from parent, call it
   * @param {object} filterResults
   */
  handleFilterChange(filterResults) {
    const mergedFilterResults = mergeFilters(
      filterResults,
      this.props.adminAppliedPreFilters
    );
    if (this._isMounted) this.setState({ filter: mergedFilterResults });

    if (this.props.onFilterChange) {
      this.props.onFilterChange(mergedFilterResults);
    }
  }

  /**
   * This function contains partial rendering logic for filter components.
   * It transfers aggregation data (`this.props.receivedAggsData`) to items inside filters.
   * But before that, the function first calls `this.props.onProcessFilterAggsData`, which is
   * a callback function passed by `ConnectedFilter`'s parent component, so that the parent
   * component could do some pre-processing modification about filter.
   */
  getFilterTabs() {
    if (this.props.hidden) return null;

    const tabsOptions = this.props.onProcessFilterAggsData(
      this.props.receivedAggsData
    );
    if (Object.keys(this.initialTabsOptions).length === 0)
      this.initialTabsOptions = tabsOptions;

    const processedTabsOptions = sortTabsOptions(
      updateCountsInInitialTabsOptions(
        this.initialTabsOptions,
        tabsOptions,
        this.state.filter
      )
    );
    if (Object.keys(processedTabsOptions).length === 0) return null;

    const { FilterList } = this.props.filterComponents;
    return this.props.filterConfig.tabs.map(
      ({ fields, searchFields }, index) => (
        <FilterList
          key={index}
          sections={getFilterSections(
            fields,
            searchFields,
            this.props.fieldMapping,
            processedTabsOptions,
            this.state.initialAggsData,
            this.props.adminAppliedPreFilters,
            this.props.guppyConfig,
            this.arrayFields
          )}
          tierAccessLimit={this.props.tierAccessLimit}
          lockedTooltipMessage={this.props.lockedTooltipMessage}
          disabledTooltipMessage={this.props.disabledTooltipMessage}
          arrayFields={this.arrayFields}
        />
      )
    );
  }

  render() {
    if (this.props.hidden) return null;

    const filterTabs = this.getFilterTabs();
    if (!filterTabs || filterTabs.length === 0) return null;

    const { FilterGroup } = this.props.filterComponents;
    return (
      <FilterGroup
        ref={this.filterGroupRef}
        className={this.props.className}
        tabs={filterTabs}
        filterConfig={{
          tabs: this.props.filterConfig.tabs.map(
            ({ title, fields, searchFields }) => ({
              title,
              // If there are any search fields, insert them at the top of each tab's fields.
              fields: searchFields ? searchFields.concat(fields) : fields,
            })
          ),
        }}
        onFilterChange={(e) => this.handleFilterChange(e)}
        hideZero={this.props.hideZero}
        initialAppliedFilters={this.props.initialAppliedFilters}
      />
    );
  }
}

ConnectedFilter.propTypes = {
  filterConfig: PropTypes.shape({
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        fields: PropTypes.arrayOf(PropTypes.string),
        searchFields: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }).isRequired,
  guppyConfig: PropTypes.shape({
    path: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func,
  className: PropTypes.string,
  fieldMapping: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  tierAccessLimit: PropTypes.number,
  onProcessFilterAggsData: PropTypes.func,
  adminAppliedPreFilters: PropTypes.object,
  initialAppliedFilters: PropTypes.object,
  receivedAggsData: PropTypes.object,
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
  className: '',
  fieldMapping: [],
  tierAccessLimit: undefined,
  onProcessFilterAggsData: (data) => data,
  adminAppliedPreFilters: {},
  initialAppliedFilters: {},
  receivedAggsData: {},
  lockedTooltipMessage: '',
  disabledTooltipMessage: '',
  hideZero: false,
  hidden: false,
};

export default ConnectedFilter;
