import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  queryGuppyForAggregationChartData,
  queryGuppyForAggregationCountData,
  queryGuppyForAggregationOptionsData,
  queryGuppyForRawData,
  queryGuppyForSubAggregationData,
  queryGuppyForTotalCounts,
  downloadDataFromGuppy,
  getAllFieldsFromGuppy,
  getGQLFilter,
} from '../Utils/queries';
import { FILE_FORMATS, FILTER_TYPE, GUPPY_URL } from '../Utils/const';
import {
  excludeSelfFilterFromAggsData,
  mergeFilters,
  unnestAggsData,
} from '../Utils/filters';

/** @typedef {import('../types').AggsData} AggsData */
/** @typedef {import('../types').FilterConfig} FilterConfig */
/** @typedef {import('../types').FilterState} FilterState */
/** @typedef {import('../types').FilterTabsOption} FilterTabsOption */
/** @typedef {import('../types').GqlSort} GqlSort */
/** @typedef {import('../types').GuppyConfig} GuppyConfig */
/** @typedef {import('../types').GuppyData} GuppyData */
/** @typedef {import('../types').OptionFilter} OptionFilter */
/** @typedef {import('../types').SimpleAggsData} SimpleAggsData */

/**
 * @typedef {Object} GuppyWrapperProps
 * @property {{ [x: string]: OptionFilter }} adminAppliedPreFilters
 * @property {{ [fieldName: string]: any }} chartConfig
 * @property {((data: GuppyData) => JSX.Element)} children
 * @property {FilterState} explorerFilter
 * @property {FilterConfig} filterConfig
 * @property {GuppyConfig} guppyConfig
 * @property {(x: FilterState) => void} onFilterChange
 * @property {string[]} patientIds
 * @property {string[]} rawDataFields
 */

/**
 * @typedef {Object} GuppyWrapperState
 * @property {string} anchorValue
 * @property {number} accessibleCount
 * @property {AggsData} aggsData
 * @property {SimpleAggsData} aggsChartData
 * @property {string[]} allFields
 * @property {SimpleAggsData} [initialTabsOptions]
 * @property {boolean} isLoadingAggsData
 * @property {boolean} isLoadingRawData
 * @property {Object[]} rawData
 * @property {SimpleAggsData} tabsOptions
 * @property {number} totalCount
 */

/** @param {GuppyWrapperProps} props */
function GuppyWrapper({
  adminAppliedPreFilters = {},
  chartConfig,
  children,
  explorerFilter = {},
  filterConfig,
  guppyConfig,
  onFilterChange = () => {},
  patientIds,
  rawDataFields: rawDataFieldsConfig = [],
}) {
  /** @type {[GuppyWrapperState, React.Dispatch<React.SetStateAction<GuppyWrapperState>>]} */
  const [state, setState] = useState({
    anchorValue: filterConfig.anchor !== undefined ? '' : undefined,
    accessibleCount: 0,
    allFields: [],
    aggsData: {},
    aggsChartData: {},
    initialTabsOptions: undefined,
    isLoadingAggsData: false,
    isLoadingRawData: false,
    rawData: [],
    tabsOptions: {},
    totalCount: 0,
  });
  const filterState = useMemo(
    () => mergeFilters(explorerFilter, adminAppliedPreFilters),
    [explorerFilter, adminAppliedPreFilters]
  );
  const controller = useRef(new AbortController());
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      controller.current.abort();
    };
  }, []);

  /** @type {{ [anchorValue: string]: SimpleAggsData }} */
  const initialAnchoredTabsOptionsCache = {};
  const [anchoredTabsOptionsCache, setAnchoredTabsOptionsCache] = useState(
    initialAnchoredTabsOptionsCache
  );

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
  function fetchAggsChartDataFromGuppy(filter) {
    return queryGuppyForAggregationChartData({
      type: guppyConfig.dataType,
      fields: Object.keys(chartConfig),
      gqlFilter: getGQLFilter(augmentFilter(filter)),
      signal: controller.current.signal,
    }).then(({ data, errors }) => {
      if (data === undefined)
        throw new Error(
          `error querying guppy${
            errors?.length > 0 ? `: ${errors[0].message}` : ''
          }`
        );

      return {
        aggsChartData: /** @type {SimpleAggsData} */ (
          excludeSelfFilterFromAggsData(
            data._aggregation[guppyConfig.dataType],
            filter
          )
        ),
      };
    });
  }

  /** @param {FilterState} filter */
  function fetchAggsCountDataFromGuppy(filter) {
    return queryGuppyForAggregationCountData({
      type: guppyConfig.dataType,
      gqlFilter: getGQLFilter(augmentFilter(filter)),
      signal: controller.current.signal,
    }).then(({ data, errors }) => {
      if (data === undefined)
        throw new Error(
          `error querying guppy${
            errors?.length > 0 ? `: ${errors[0].message}` : ''
          }`
        );

      return {
        accessibleCount: data._aggregation.accessible._totalCount,
        totalCount: data._aggregation.all._totalCount,
      };
    });
  }

  /**
   * @param {Object} args
   * @param {string} args.anchorValue
   * @param {FilterState} args.filter
   * @param {FilterTabsOption[]} [args.filterTabs]
   */
  function fetchAggsOptionsDataFromGuppy({
    anchorValue,
    filter,
    filterTabs = filterConfig.tabs,
  }) {
    if (filter.__type === FILTER_TYPE.COMPOSED)
      return Promise.resolve({
        aggsData: state.aggsData,
        initialTabsOptions: state.initialTabsOptions,
        tabsOptions: state.tabsOptions,
      });

    return queryGuppyForAggregationOptionsData({
      type: guppyConfig.dataType,
      anchorConfig: filterConfig.anchor,
      anchorValue,
      filterTabs,
      gqlFilter: getGQLFilter(augmentFilter(filter)),
      isInitialQuery: state.initialTabsOptions === undefined,
      signal: controller.current.signal,
    }).then(({ data, errors }) => {
      if (data === undefined)
        throw new Error(
          `error querying guppy${
            errors?.length > 0 ? `: ${errors[0].message}` : ''
          }`
        );

      const { unfiltered, ...aggregation } = data._aggregation;
      /** @type {AggsData} */
      const receivedAggsData = {};
      for (const group of Object.values(aggregation))
        for (const [fieldName, value] of Object.entries(group))
          receivedAggsData[fieldName] = value;
      const unfilteredAggsData =
        Object.keys(filter.value ?? {}).length === 0
          ? receivedAggsData
          : unfiltered;
      return {
        aggsData: excludeSelfFilterFromAggsData(receivedAggsData, filter),
        initialTabsOptions:
          unfilteredAggsData === undefined
            ? state.initialTabsOptions
            : unnestAggsData(unfilteredAggsData),
        tabsOptions: unnestAggsData(receivedAggsData),
      };
    });
  }

  /** @param {FilterState} filter */
  function fetchAggsDataFromGuppy(filter) {
    if (isMounted.current)
      setState((prevState) => ({ ...prevState, isLoadingAggsData: true }));

    Promise.all([
      fetchAggsChartDataFromGuppy(filter),
      fetchAggsCountDataFromGuppy(filter),
      fetchAggsOptionsDataFromGuppy({
        anchorValue: state.anchorValue,
        filter,
      }),
    ]).then(
      ([
        { aggsChartData },
        { accessibleCount, totalCount },
        { aggsData, initialTabsOptions, tabsOptions },
      ]) => {
        if (isMounted.current) {
          setState((prevState) => ({
            ...prevState,
            accessibleCount,
            aggsChartData,
            aggsData,
            initialTabsOptions,
            isLoadingAggsData: false,
            tabsOptions,
            totalCount,
          }));

          if (state.anchorValue !== undefined)
            setAnchoredTabsOptionsCache({ [state.anchorValue]: tabsOptions });
        }
      }
    );
  }

  /**
   * @param {Object} args
   * @param {string[]} args.fields
   * @param {FilterState} [args.filter]
   * @param {number} [args.offset]
   * @param {number} [args.size]
   * @param {GqlSort} [args.sort]
   * @param {boolean} args.updateDataWhenReceive
   */
  function fetchRawDataFromGuppy({
    fields,
    filter = filterState,
    offset,
    size,
    sort,
    updateDataWhenReceive,
  }) {
    console.log(getGQLFilter(augmentFilter(filter)));
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
        type: guppyConfig.dataType,
        mainField: guppyConfig.mainField,
        numericAggAsText,
        termsFields: guppyConfig.aggFields,
        missingFields: [],
        gqlFilter: getGQLFilter(augmentFilter(filter)),
        signal: controller.current.signal,
      }).then((res) => {
        if (!res || !res.data)
          throw new Error(
            `Error getting raw ${guppyConfig.dataType} data from Guppy server ${GUPPY_URL}.`
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
      type: guppyConfig.dataType,
      fields,
      gqlFilter: getGQLFilter(augmentFilter(filter)),
      sort,
      offset,
      size,
      signal: controller.current.signal,
    }).then((res) => {
      if (!res || !res.data)
        throw new Error(
          `Error getting raw ${guppyConfig.dataType} data from Guppy server ${GUPPY_URL}.`
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

  /** @param {string[]} fields */
  function fetchGuppyData(fields) {
    controller.current.abort();
    controller.current = new AbortController();
    fetchAggsDataFromGuppy(filterState);
    fetchRawDataFromGuppy({ fields, updateDataWhenReceive: true });
  }

  const rawDataFields =
    rawDataFieldsConfig?.length > 0 ? rawDataFieldsConfig : state.allFields;

  const isInitialRenderRef = useRef(true);
  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;

      // initialize allFields
      getAllFieldsFromGuppy({ type: guppyConfig.dataType }).then((fields) => {
        if (isMounted.current)
          setState((prevState) => ({ ...prevState, allFields: fields }));
      });
    }

    fetchGuppyData(rawDataFields);
  }, [filterState, patientIds]);

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
      type: guppyConfig.dataType,
      fields: rawDataFields,
      sort,
      gqlFilter: getGQLFilter(augmentFilter(filterState)),
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
      type: guppyConfig.dataType,
      fields: fields || rawDataFields,
      sort,
      gqlFilter: getGQLFilter(filterState),
    });
  }

  /**
   * Get total count from other es type, with filter
   * @param {string} type
   * @param {FilterState} filter
   */
  function getTotalCountsByTypeAndFilter(type, filter) {
    return queryGuppyForTotalCounts({ type, filter });
  }

  /**
   * Get raw data from other es type, with filter
   * @param {string} type
   * @param {FilterState} filter
   * @param {string[]} fields
   */
  function downloadRawDataByTypeAndFilter(type, filter, fields) {
    return downloadDataFromGuppy({
      type,
      fields,
      gqlFilter: getGQLFilter(filter),
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

  /**
   * @param {string} anchorValue
   */
  function handleAnchorValueChange(anchorValue) {
    if (anchorValue in anchoredTabsOptionsCache) {
      setState((prevState) => ({
        ...prevState,
        anchorValue,
        tabsOptions: {
          ...prevState.tabsOptions,
          ...anchoredTabsOptionsCache[anchorValue],
        },
      }));
    } else {
      controller.current.abort();
      controller.current = new AbortController();
      setState((prevState) => ({ ...prevState, anchorValue }));
      fetchAggsOptionsDataFromGuppy({
        anchorValue,
        filter: filterState,
        filterTabs: filterConfig.tabs.filter(({ title }) =>
          filterConfig.anchor.tabs.includes(title)
        ),
      }).then(({ tabsOptions }) => {
        if (isMounted.current) {
          setState((prevState) => ({
            ...prevState,
            tabsOptions: { ...prevState.tabsOptions, ...tabsOptions },
          }));
          setAnchoredTabsOptionsCache((prevState) => ({
            ...prevState,
            [anchorValue]: tabsOptions,
          }));
        }
      });
    }
  }

  /** @param {FilterState} filter */
  function handleFilterChange(filter) {
    onFilterChange?.(mergeFilters(filter, adminAppliedPreFilters));
  }

  return children({
    ...state,
    filter: filterState,
    downloadRawData,
    downloadRawDataByFields,
    downloadRawDataByTypeAndFilter,
    fetchAndUpdateRawData,
    getTotalCountsByTypeAndFilter,
    onAnchorValueChange: handleAnchorValueChange,
    onFilterChange: handleFilterChange,
  });
}

GuppyWrapper.propTypes = {
  adminAppliedPreFilters: PropTypes.object,
  children: PropTypes.func.isRequired,
  explorerFilter: PropTypes.object,
  filterConfig: PropTypes.shape({
    anchor: PropTypes.shape({
      field: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
      tabs: PropTypes.arrayOf(PropTypes.string),
    }),
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        fields: PropTypes.arrayOf(PropTypes.string),
        searchFields: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }).isRequired,
  guppyConfig: PropTypes.shape({
    type: PropTypes.string,
    mainField: PropTypes.string,
    mainFieldIsNumeric: PropTypes.bool,
    aggFields: PropTypes.array,
    dataType: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func,
  patientIds: PropTypes.arrayOf(PropTypes.string),
  rawDataFields: PropTypes.arrayOf(PropTypes.string),
};

export default GuppyWrapper;
