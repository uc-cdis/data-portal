import React from 'react';
import PropTypes from 'prop-types';
import {
  queryGuppyForAggregationData,
  queryGuppyForRawData,
  queryGuppyForSubAggregationData,
  queryGuppyForTotalCounts,
  downloadDataFromGuppy,
  getAllFieldsFromFilterConfigs,
  getAllFieldsFromGuppy,
  getGQLFilter,
} from '../Utils/queries';
import { FILE_FORMATS } from '../Utils/const';
import {
  excludeSelfFilterFromAggsData,
  mergeFilters,
  unnestAggsData,
} from '../Utils/filters';
import '../typedef';

/**
 * @typedef {Object} GuppyWrapperProps
 * @property {FilterConfig} filterConfig
 * @property {GuppyConfig} guppyConfig
 * @property {((data: GuppyData) => JSX.Element)} children
 * @property {(x: FilterState) => void} onFilterChange
 * @property {string[]} rawDataFields
 * @property {{ [x: string]: OptionFilter }} adminAppliedPreFilters
 * @property {FilterState} initialAppliedFilters
 * @property {string[]} patientIds
 */

/**
 * @typedef {Object} GuppyWrapperState
 * @property {boolean} isLoadingAggsData
 * @property {AggsData} receivedAggsData
 * @property {AggsData} aggsData
 * @property {FilterState} filter
 * @property {boolean} isLoadingRawData
 * @property {Object[]} rawData
 * @property {number} accessibleCount
 * @property {number} totalCount
 * @property {string[]} allFields
 * @property {string[]} aggsDataFields
 * @property {string[]} rawDataFields
 */

/**
 * Wrapper that connects to Guppy server,
 * and pass filter, aggs, and data to children components
 * Input props:
 *   - filterConfig: configuration for ConnectedFilter component
 *   - guppyConfig: Guppy server config
 *   - onFilterChange: callback that takes filter as argument, will be
 * called every time filter changes
 *
 * This wrapper will pass following data (filters, aggs, configs) to children components via prop:
 *   - aggsData: the aggregation results, format:
 *         {
 *             // for text aggregation
 *            [field]: { histogram: [{key: 'v1', count: 42}, {key: 'v2', count: 19}, ...] },
 *             // for numeric aggregation
 *            [field]: { histogram: [{key: [1, 83], count: 100}] },
 *            ...
 *         }
 *   - filter: the filters, format:
 *         {
 *            [field]: { selectedValues: ['v1', 'v2', ...] },  // for text filter
 *            [field]: { upperBound: 1, lowerBound: 83 },  // for range filter
 *            ...
 *         }
 *   - filterConfig: configuration for ConnectedFilter component
 *   - rawData: raw data records filtered (with offset, size, and sort applied)
 *   - accessiableCount: count of raw data records user can access
 *   - totalCount: total count of raw data records
 *
 * @augments {React.Component<GuppyWrapperProps>}
 */
class GuppyWrapper extends React.Component {
  /** @param {GuppyWrapperProps} props */
  constructor(props) {
    super(props);

    /** @type {GuppyWrapperState} */
    this.state = {
      isLoadingAggsData: false,
      receivedAggsData: {},
      aggsData: {},
      filter: mergeFilters(
        props.initialAppliedFilters,
        props.adminAppliedPreFilters
      ),
      isLoadingRawData: false,
      rawData: [],
      accessibleCount: 0,
      totalCount: 0,
      allFields: [],
      aggsDataFields: getAllFieldsFromFilterConfigs(props.filterConfig.tabs),
      rawDataFields: [],
      initialTabsOptions: undefined,
    };
    this._isMounted = false;
    this.controller = new AbortController();
  }

  componentDidMount() {
    this._isMounted = true;

    getAllFieldsFromGuppy({
      path: this.props.guppyConfig.path,
      type: this.props.guppyConfig.dataType,
    }).then((fields) => {
      const rawDataFields =
        this.props.rawDataFields && this.props.rawDataFields.length > 0
          ? this.props.rawDataFields
          : fields;

      if (this._isMounted) {
        this.setState({ allFields: fields, rawDataFields });
        this.fetchAggsDataFromGuppy(this.state.filter);
        this.fetchRawDataFromGuppy({
          fields: rawDataFields,
          updateDataWhenReceive: true,
        });
      }
    });
  }

  /** @param {GuppyWrapperProps} prevProps */
  componentDidUpdate(prevProps) {
    if (prevProps.patientIds?.join(',') !== this.props.patientIds?.join(',')) {
      this.fetchAggsDataFromGuppy(this.state.filter);
      this.fetchRawDataFromGuppy({
        fields: this.state.rawDataFields,
        updateDataWhenReceive: true,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /** @param {FilterState} filter */
  handleFilterChange(filter) {
    if (this.props.onFilterChange) this.props.onFilterChange(filter);

    if (this._isMounted) this.setState({ filter });

    this.controller.abort();
    this.controller = new AbortController();
    this.fetchAggsDataFromGuppy(filter);
    this.fetchRawDataFromGuppy({
      fields: this.state.rawDataFields,
      updateDataWhenReceive: true,
    });
  }

  /**
   * Fetch data from Guppy server.
   * This function will update this.state.rawData and this.state.totalCount
   * @param {Object} args
   * @param {number} args.offset
   * @param {number} args.size
   * @param {GqlSort} args.sort
   */
  handleFetchAndUpdateRawData({ offset = 0, size = 20, sort = [] }) {
    return this.fetchRawDataFromGuppy({
      fields: this.state.rawDataFields,
      offset,
      sort,
      size,
      updateDataWhenReceive: true,
    });
  }

  /**
   * Download all data from Guppy server and return raw data
   * This function uses current filter argument
   * @param {Object} args
   * @param {GqlSort} args.sort
   * @param {string} args.format
   */
  handleDownloadRawData({ sort = [], format }) {
    // error handling for misconfigured format types
    if (format && !(format in FILE_FORMATS)) {
      throw new Error(`Invalid value ${format} found for arg format!`);
    }
    const filterForGuppy =
      this.props.patientIds?.length > 0
        ? mergeFilters(this.state.filter, {
            subject_submitter_id: { selectedValues: this.props.patientIds },
          })
        : this.state.filter;
    return downloadDataFromGuppy({
      path: this.props.guppyConfig.path,
      type: this.props.guppyConfig.dataType,
      fields: this.state.rawDataFields,
      sort,
      filter: filterForGuppy,
      format,
    });
  }

  /**
   * Download all data from Guppy server and return raw data
   * For only given fields
   * This function uses current filter argument
   * @param {Object} args
   * @param {string[]} args.fields
   * @param {GqlSort} args.sort
   */
  handleDownloadRawDataByFields({ fields, sort = [] }) {
    return downloadDataFromGuppy({
      path: this.props.guppyConfig.path,
      type: this.props.guppyConfig.dataType,
      fields: fields || this.state.rawDataFields,
      sort,
      filter: this.state.filter,
    });
  }

  /**
   * Get total count from other es type, with filter
   * @param {string} type
   * @param {FilterState} filter
   */
  handleGetTotalCountsByTypeAndFilter(type, filter) {
    return queryGuppyForTotalCounts({
      path: this.props.guppyConfig.path,
      type,
      filter,
    });
  }

  /**
   * Get raw data from other es type, with filter
   * @param {string} type
   * @param {FilterState} filter
   * @param {string[]} fields
   */
  handleDownloadRawDataByTypeAndFilter(type, filter, fields) {
    return downloadDataFromGuppy({
      path: this.props.guppyConfig.path,
      type,
      fields,
      filter,
    });
  }

  /**
   * This function
   * 1. Asks guppy for aggregation data using (processed) filter
   * 2. Uses the aggregation response to update the following states:
   *   - receivedAggsData
   *   - aggsData
   *   - accessibleCount
   *   - totalCount
   * @param {FilterState} filter
   */
  fetchAggsDataFromGuppy(filter) {
    if (this._isMounted) this.setState({ isLoadingAggsData: true });

    const filterForGuppy =
      this.props.patientIds?.length > 0
        ? mergeFilters(filter, {
            subject_submitter_id: { selectedValues: this.props.patientIds },
          })
        : filter;
    const isFilterEmpty = Object.keys(filter).length === 0;

    queryGuppyForAggregationData({
      path: this.props.guppyConfig.path,
      type: this.props.guppyConfig.dataType,
      fields: this.state.aggsDataFields,
      gqlFilter: getGQLFilter(filterForGuppy),
      shouldGetFullAggsData:
        this.state.initialTabsOptions === undefined && !isFilterEmpty,
      signal: this.controller.signal,
    }).then((res) => {
      if (!res.data)
        throw new Error(
          `error querying guppy${
            res.errors && res.errors.length > 0
              ? `: ${res.errors[0].message}`
              : ''
          }`
        );

      const receivedAggsData =
        res.data._aggregation[this.props.guppyConfig.dataType];
      const fullAggsData = isFilterEmpty
        ? receivedAggsData
        : res.data._aggregation.fullAggsData;
      const aggsData = excludeSelfFilterFromAggsData(receivedAggsData, filter);
      const accessibleCount = res.data._aggregation.accessible._totalCount;
      const totalCount = res.data._aggregation.all._totalCount;

      if (this._isMounted)
        this.setState((prevState) => ({
          isLoadingAggsData: false,
          receivedAggsData,
          aggsData,
          accessibleCount,
          totalCount,
          initialTabsOptions:
            fullAggsData === undefined
              ? prevState.initialTabsOptions
              : unnestAggsData(fullAggsData),
        }));
    });
  }

  /**
   * This function get data with current filter (if any),
   * and update this.state.rawData and this.state.totalCount
   * @param {Object} args
   * @param {string[]} args.fields
   * @param {number} [args.offset]
   * @param {number} [args.size]
   * @param {GqlSort} [args.sort]
   * @param {boolean} args.updateDataWhenReceive
   */
  fetchRawDataFromGuppy({ fields, offset, size, sort, updateDataWhenReceive }) {
    if (this._isMounted) this.setState({ isLoadingRawData: true });
    if (!fields || fields.length === 0) {
      if (this._isMounted) this.setState({ isLoadingRawData: false });
      return Promise.resolve({ data: [], totalCount: 0 });
    }

    const filterForGuppy =
      this.props.patientIds?.length > 0
        ? mergeFilters(this.state.filter, {
            subject_submitter_id: { selectedValues: this.props.patientIds },
          })
        : this.state.filter;
    // sub aggregations -- for DAT
    if (this.props.guppyConfig.mainField) {
      const numericAggAsText = this.props.guppyConfig.mainFieldIsNumeric;
      return queryGuppyForSubAggregationData({
        path: this.props.guppyConfig.path,
        type: this.props.guppyConfig.dataType,
        mainField: this.props.guppyConfig.mainField,
        numericAggAsText,
        termsFields: this.props.guppyConfig.aggFields,
        missingFields: [],
        gqlFilter: getGQLFilter(filterForGuppy),
        signal: this.controller.signal,
      }).then((res) => {
        if (!res || !res.data) {
          throw new Error(
            `Error getting raw ${this.props.guppyConfig.dataType} data from Guppy server ${this.props.guppyConfig.path}.`
          );
        }
        const data = res.data._aggregation[this.props.guppyConfig.dataType];
        const field = numericAggAsText ? 'asTextHistogram' : 'histogram';
        const parsedData = data[this.props.guppyConfig.mainField][field];
        if (this._isMounted) {
          if (updateDataWhenReceive) this.setState({ rawData: parsedData });
          this.setState({ isLoadingRawData: false });
        }
        return {
          data: res.data,
        };
      });
    }

    // non-nested aggregation
    return queryGuppyForRawData({
      path: this.props.guppyConfig.path,
      type: this.props.guppyConfig.dataType,
      fields,
      gqlFilter: getGQLFilter(filterForGuppy),
      sort,
      offset,
      size,
      signal: this.controller.signal,
    }).then((res) => {
      if (!res || !res.data) {
        throw new Error(
          `Error getting raw ${this.props.guppyConfig.dataType} data from Guppy server ${this.props.guppyConfig.path}.`
        );
      }
      const parsedData = res.data[this.props.guppyConfig.dataType];
      if (this._isMounted) {
        if (updateDataWhenReceive) this.setState({ rawData: parsedData });
        this.setState({ isLoadingRawData: false });
      }
      return {
        data: parsedData,
        totalCount: this.state.totalCount,
      };
    });
  }

  render() {
    return this.props.children({
      accessibleCount: this.state.accessibleCount,
      allFields: this.state.allFields,
      aggsData: this.state.aggsData,
      filter: this.state.filter,
      initialTabsOptions: this.state.initialTabsOptions,
      isLoadingAggsData: this.state.isLoadingAggsData,
      isLoadingRawData: this.state.isLoadingRawData,
      rawData: this.state.rawData,
      receivedAggsData: this.state.receivedAggsData,
      totalCount: this.state.totalCount,
      downloadRawData: this.handleDownloadRawData.bind(this),
      downloadRawDataByFields: this.handleDownloadRawDataByFields.bind(this),
      downloadRawDataByTypeAndFilter: this.handleDownloadRawDataByTypeAndFilter.bind(
        this
      ),
      fetchAndUpdateRawData: this.handleFetchAndUpdateRawData.bind(this),
      getTotalCountsByTypeAndFilter: this.handleGetTotalCountsByTypeAndFilter.bind(
        this
      ),
      onFilterChange: this.handleFilterChange.bind(this),
    });
  }
}

GuppyWrapper.propTypes = {
  guppyConfig: PropTypes.shape({
    path: PropTypes.string,
    type: PropTypes.string,
    mainField: PropTypes.string,
    mainFieldIsNumeric: PropTypes.bool,
    aggFields: PropTypes.array,
    dataType: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.func.isRequired,
  filterConfig: PropTypes.shape({
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        fields: PropTypes.arrayOf(PropTypes.string),
        searchFields: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }).isRequired,
  rawDataFields: PropTypes.arrayOf(PropTypes.string),
  onFilterChange: PropTypes.func,
  adminAppliedPreFilters: PropTypes.object,
  initialAppliedFilters: PropTypes.object,
  patientIds: PropTypes.arrayOf(PropTypes.string),
};

GuppyWrapper.defaultProps = {
  onFilterChange: () => {},
  rawDataFields: [],
  adminAppliedPreFilters: {},
  initialAppliedFilters: {},
};

export default GuppyWrapper;
