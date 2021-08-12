/* eslint react/forbid-prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import FilterGroup from '../../gen3-ui-component/components/filters/FilterGroup';
import FilterList from '../../gen3-ui-component/components/filters/FilterList';
import { queryGuppyForStatus } from '../Utils/queries';
import {
  getFilterSections,
  mergeFilters,
  updateCountsInInitialTabsOptions,
  sortTabsOptions,
  unnestAggsData,
} from '../Utils/filters';
import '../typedef';

/**
 * @typedef {Object} ConnectedFilterProps
 * @property {FilterConfig} filterConfig
 * @property {GuppyConfig} guppyConfig
 * @property {(x: FilterState) => void} onFilterChange
 * @property {(x: string[]) => void} onPatientIdsChange
 * @property {string} className
 * @property {number} tierAccessLimit
 * @property {(x: AggsData) => AggsData} onProcessFilterAggsData
 * @property {{ [x: string]: OptionFilter }} adminAppliedPreFilters
 * @property {string[]} patientIds
 * @property {FilterState} initialAppliedFilters
 * @property {SimpleAggsData} initialTabsOptions
 * @property {AggsData} receivedAggsData
 * @property {boolean} hideZero
 * @property {boolean} hidden
 */

/**
 * @typedef {Object} ConnectedFilterState
 * @property {AggsData} initialAggsData
 * @property {FilterState} filter
 */

/** @augments {React.Component<ConnectedFilterProps, ConnectedFilterState>} */
class ConnectedFilter extends React.Component {
  /** @param {ConnectedFilterProps} props */
  constructor(props) {
    super(props);

    const initialFilter = mergeFilters(
      props.initialAppliedFilters,
      props.adminAppliedPreFilters
    );
    /** @type {ConnectedFilterState} */
    this.state = {
      initialAggsData: {},
      filter: { ...initialFilter },
    };
    /** @type {string[][]} */
    this.arrayFields = [];
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    // get array types info from guppy
    queryGuppyForStatus(this.props.guppyConfig.path).then((res) => {
      for (const { arrayFields } of Object.values(res.indices))
        if (arrayFields?.length > 0)
          this.arrayFields = this.arrayFields.concat(arrayFields);
    });
  }

  componentDidUpdate() {
    if (
      Object.keys(this.state.initialAggsData).length === 0 &&
      Object.keys(this.props.receivedAggsData).length !== 0 &&
      this._isMounted
    )
      // Save initial aggregation data, especially for range slider
      // so that we still have min/max values for range slider
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ initialAggsData: this.props.receivedAggsData });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * Handler function that is called everytime filter changes
   * What this function does:
   * 1. Ask guppy for aggregation data using (processed) filter
   * 2. After get aggregation response, process new received agg data
   * 3. If there's `onFilterChange` callback function from parent, call it
   * @param {FilterState} filterResults
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

    const tabsOptions = unnestAggsData(
      this.props.onProcessFilterAggsData(this.props.receivedAggsData)
    );

    const processedTabsOptions = sortTabsOptions(
      updateCountsInInitialTabsOptions(
        this.props.initialTabsOptions,
        tabsOptions,
        this.state.filter
      )
    );
    if (Object.keys(processedTabsOptions).length === 0) return null;

    const lockedTooltipMessage = `You may only view summary information for this project. You do not have ${this.props.guppyConfig.dataType}-level access.`;
    const disabledTooltipMessage = `This resource is currently disabled because you are exploring restricted data. When exploring restricted data you are limited to exploring cohorts of ${
      this.props.tierAccessLimit
    } ${
      this.props.guppyConfig.nodeCountTitle.toLowerCase() ||
      this.props.guppyConfig.dataType
    } or more.`;

    return this.props.filterConfig.tabs.map(
      ({ fields, searchFields }, index) => (
        <FilterList
          key={index}
          sections={getFilterSections(
            fields,
            searchFields,
            this.props.guppyConfig.fieldMapping,
            processedTabsOptions,
            this.props.initialTabsOptions,
            this.props.adminAppliedPreFilters,
            this.props.guppyConfig,
            this.arrayFields
          )}
          tierAccessLimit={this.props.tierAccessLimit}
          lockedTooltipMessage={lockedTooltipMessage}
          disabledTooltipMessage={disabledTooltipMessage}
          arrayFields={this.arrayFields}
        />
      )
    );
  }

  render() {
    if (this.props.hidden) return null;

    const filterTabs = this.getFilterTabs();
    if (!filterTabs || filterTabs.length === 0) return null;

    return (
      <FilterGroup
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
        onPatientIdsChange={this.props.onPatientIdsChange}
        patientIds={this.props.patientIds}
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
    dataType: PropTypes.string.isRequired,
    fieldMapping: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.string,
        name: PropTypes.string,
      })
    ),
    nodeCountTitle: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func,
  onPatientIdsChange: PropTypes.func,
  className: PropTypes.string,
  tierAccessLimit: PropTypes.number,
  onProcessFilterAggsData: PropTypes.func,
  adminAppliedPreFilters: PropTypes.object,
  patientIds: PropTypes.arrayOf(PropTypes.string),
  initialAppliedFilters: PropTypes.object,
  initialTabsOptions: PropTypes.object,
  receivedAggsData: PropTypes.object,
  hideZero: PropTypes.bool,
  hidden: PropTypes.bool,
};

ConnectedFilter.defaultProps = {
  onFilterChange: () => {},
  onPatientIdsChange: () => {},
  className: '',
  tierAccessLimit: undefined,
  onProcessFilterAggsData: (data) => data,
  adminAppliedPreFilters: {},
  initialAppliedFilters: {},
  initialTabsOptions: {},
  receivedAggsData: {},
  hideZero: false,
  hidden: false,
};

export default ConnectedFilter;
