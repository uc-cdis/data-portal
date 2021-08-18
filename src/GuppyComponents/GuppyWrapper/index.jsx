import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  queryGuppyForAggregationData,
  queryGuppyForAggregationChartData,
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
 * @property {number} accessibleCount
 * @property {AggsData} aggsData
 * @property {AggsData} aggsChartData
 * @property {string[]} allFields
 * @property {FilterState} filter
 * @property {SimpleAggsData} initialTabsOptions
 * @property {boolean} isLoadingAggsData
 * @property {boolean} isLoadingRawData
 * @property {Object[]} rawData
 * @property {AggsData} receivedAggsData
 * @property {number} totalCount
 */

/** @param {GuppyWrapperProps} props */
function GuppyWrapper({
  chartConfig,
  filterConfig,
  guppyConfig,
  children,
  onFilterChange = () => {},
  rawDataFields: rawDataFieldsConfig = [],
  adminAppliedPreFilters = {},
  initialAppliedFilters = {},
  patientIds,
}) {
  /** @type {[GuppyWrapperState, React.Dispatch<React.SetStateAction<GuppyWrapperState>>]} */
  const [state, setState] = useState({
    accessibleCount: 0,
    allFields: [],
    aggsData: {},
    aggsChartData: {},
    filter: mergeFilters(initialAppliedFilters, adminAppliedPreFilters),
    initialTabsOptions: undefined,
    isLoadingAggsData: false,
    isLoadingRawData: false,
    receivedAggsData: {},
    rawData: [],
    totalCount: 0,
  });
  const controller = useRef(new AbortController());
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * Add patient ids to filter if provided
   * @param {FilterState} filter
   */
  function augmentFilter(filter) {
    return patientIds?.length > 0
      ? mergeFilters(filter, {
          subject_submitter_id: { selectedValues: patientIds },
        })
      : filter;
  }

  /** @param {FilterState} filter */
  function fetchAggsDataFromGuppy(filter) {
    if (isMounted.current)
      setState((prevState) => ({ ...prevState, isLoadingAggsData: true }));

    const isFilterEmpty = Object.keys(filter).length === 0;

    queryGuppyForAggregationData({
      path: guppyConfig.path,
      type: guppyConfig.dataType,
      fields: getAllFieldsFromFilterConfigs(filterConfig.tabs),
      gqlFilter: getGQLFilter(augmentFilter(filter)),
      shouldGetFullAggsData:
        state.initialTabsOptions === undefined && !isFilterEmpty,
      signal: controller.current.signal,
    }).then((res) => {
      if (!res.data)
        throw new Error(
          `error querying guppy${
            res.errors && res.errors.length > 0
              ? `: ${res.errors[0].message}`
              : ''
          }`
        );

      const receivedAggsData = res.data._aggregation[guppyConfig.dataType];
      const fullAggsData = isFilterEmpty
        ? receivedAggsData
        : res.data._aggregation.fullAggsData;
      const aggsData = excludeSelfFilterFromAggsData(receivedAggsData, filter);
      const accessibleCount = res.data._aggregation.accessible._totalCount;
      const totalCount = res.data._aggregation.all._totalCount;

      if (isMounted.current)
        setState((prevState) => ({
          ...prevState,
          accessibleCount,
          aggsData,
          initialTabsOptions:
            fullAggsData === undefined
              ? prevState.initialTabsOptions
              : unnestAggsData(fullAggsData),
          isLoadingAggsData: false,
          receivedAggsData,
          totalCount,
        }));
    });
  }

  /** @param {FilterState} filter */
  function fetchAggsChartDataFromGuppy(filter) {
    if (isMounted.current)
      setState((prevState) => ({ ...prevState, isLoadingAggsData: true }));

    queryGuppyForAggregationChartData({
      path: guppyConfig.path,
      type: guppyConfig.dataType,
      fields: Object.keys(chartConfig),
      gqlFilter: getGQLFilter(augmentFilter(filter)),
      signal: controller.current.signal,
    }).then((res) => {
      if (!res.data)
        throw new Error(
          `error querying guppy${
            res.errors && res.errors.length > 0
              ? `: ${res.errors[0].message}`
              : ''
          }`
        );

      const aggsChartData = excludeSelfFilterFromAggsData(
        res.data._aggregation[guppyConfig.dataType],
        filter
      );
      if (isMounted.current)
        setState((prevState) => ({ ...prevState, aggsChartData }));
    });
  }

  /**
   * @param {Object} args
   * @param {string[]} args.fields
   * @param {number} [args.offset]
   * @param {number} [args.size]
   * @param {GqlSort} [args.sort]
   * @param {boolean} args.updateDataWhenReceive
   */
  function fetchRawDataFromGuppy({
    fields,
    offset,
    size,
    sort,
    updateDataWhenReceive,
  }) {
    if (isMounted.current)
      setState((prevState) => ({ ...prevState, isLoadingRawData: true }));
    if (!fields || fields.length === 0) {
      if (isMounted.current)
        setState((prevState) => ({ ...prevState, isLoadingRawData: false }));
      return Promise.resolve({ data: [], totalCount: 0 });
    }

    // sub aggregations -- for DAT
    if (guppyConfig.mainField) {
      const numericAggAsText = guppyConfig.mainFieldIsNumeric;
      return queryGuppyForSubAggregationData({
        path: guppyConfig.path,
        type: guppyConfig.dataType,
        mainField: guppyConfig.mainField,
        numericAggAsText,
        termsFields: guppyConfig.aggFields,
        missingFields: [],
        gqlFilter: getGQLFilter(augmentFilter(state.filter)),
        signal: controller.current.signal,
      }).then((res) => {
        if (!res || !res.data)
          throw new Error(
            `Error getting raw ${guppyConfig.dataType} data from Guppy server ${guppyConfig.path}.`
          );

        const data = res.data._aggregation[guppyConfig.dataType];
        const field = numericAggAsText ? 'asTextHistogram' : 'histogram';
        const parsedData = data[guppyConfig.mainField][field];
        if (isMounted.current)
          setState((prevState) => ({
            ...prevState,
            isLoadingRawData: false,
            rawData: updateDataWhenReceive ? parsedData : prevState.rawData,
          }));

        return {
          data: res.data,
        };
      });
    }

    // non-nested aggregation
    return queryGuppyForRawData({
      path: guppyConfig.path,
      type: guppyConfig.dataType,
      fields,
      gqlFilter: getGQLFilter(augmentFilter(state.filter)),
      sort,
      offset,
      size,
      signal: controller.current.signal,
    }).then((res) => {
      if (!res || !res.data)
        throw new Error(
          `Error getting raw ${guppyConfig.dataType} data from Guppy server ${guppyConfig.path}.`
        );

      const parsedData = res.data[guppyConfig.dataType];
      if (isMounted.current)
        setState((prevState) => ({
          ...prevState,
          isLoadingRawData: false,
          rawData: updateDataWhenReceive ? parsedData : prevState.rawData,
        }));

      return {
        data: parsedData,
        totalCount: state.totalCount,
      };
    });
  }

  useEffect(() => {
    getAllFieldsFromGuppy({
      path: guppyConfig.path,
      type: guppyConfig.dataType,
    }).then((allFields) => {
      if (isMounted.current) {
        setState((prevState) => ({ ...prevState, allFields }));
        fetchAggsDataFromGuppy(state.filter);
        fetchAggsChartDataFromGuppy(state.filter);
        fetchRawDataFromGuppy({
          fields:
            rawDataFieldsConfig?.length > 0 ? rawDataFieldsConfig : allFields,
          updateDataWhenReceive: true,
        });
      }
    });
  }, []);

  const rawDataFields =
    rawDataFieldsConfig?.length > 0 ? rawDataFieldsConfig : state.allFields;

  useEffect(() => {
    fetchAggsDataFromGuppy(state.filter);
    fetchAggsChartDataFromGuppy(state.filter);
    fetchRawDataFromGuppy({
      fields: rawDataFields,
      updateDataWhenReceive: true,
    });
  }, [patientIds]);

  /**
   * Download all data from Guppy server and return raw data
   * This function uses current filter argument
   * @param {Object} args
   * @param {string} args.format
   * @param {GqlSort} args.sort
   */
  function downloadRawData({ format, sort = [] }) {
    // error handling for misconfigured format types
    if (format && !(format in FILE_FORMATS))
      throw new Error(`Invalid value ${format} found for arg format!`);

    return downloadDataFromGuppy({
      path: guppyConfig.path,
      type: guppyConfig.dataType,
      fields: rawDataFields,
      sort,
      filter: augmentFilter(state.filter),
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
  function downloadRawDataByFields({ fields, sort = [] }) {
    return downloadDataFromGuppy({
      path: guppyConfig.path,
      type: guppyConfig.dataType,
      fields: fields || rawDataFields,
      sort,
      filter: state.filter,
    });
  }

  /**
   * Get total count from other es type, with filter
   * @param {string} type
   * @param {FilterState} filter
   */
  function getTotalCountsByTypeAndFilter(type, filter) {
    return queryGuppyForTotalCounts({
      path: guppyConfig.path,
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
  function downloadRawDataByTypeAndFilter(type, filter, fields) {
    return downloadDataFromGuppy({
      path: guppyConfig.path,
      type,
      fields,
      filter,
    });
  }

  /**
   * Fetch data from Guppy server.
   * This function will update state.rawData and state.totalCount
   * @param {Object} args
   * @param {number} args.offset
   * @param {number} args.size
   * @param {GqlSort} args.sort
   */
  function fetchAndUpdateRawData({ offset = 0, size = 20, sort = [] }) {
    return fetchRawDataFromGuppy({
      fields: rawDataFields,
      offset,
      sort,
      size,
      updateDataWhenReceive: true,
    });
  }

  /** @param {FilterState} filter */
  function handleFilterChange(filter) {
    const mergedFilter = mergeFilters(filter, adminAppliedPreFilters);

    if (onFilterChange) onFilterChange(mergedFilter);

    if (isMounted.current)
      setState((prevState) => ({ ...prevState, filter: mergedFilter }));

    controller.current.abort();
    controller.current = new AbortController();
    fetchAggsDataFromGuppy(mergedFilter);
    fetchAggsChartDataFromGuppy(mergedFilter);
    fetchRawDataFromGuppy({
      fields: rawDataFields,
      updateDataWhenReceive: true,
    });
  }

  return children({
    ...state,
    downloadRawData,
    downloadRawDataByFields,
    downloadRawDataByTypeAndFilter,
    fetchAndUpdateRawData,
    getTotalCountsByTypeAndFilter,
    onFilterChange: handleFilterChange,
  });
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

export default GuppyWrapper;
