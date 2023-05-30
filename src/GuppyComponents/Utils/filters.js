import flat from 'flat';
import cloneDeep from 'lodash.clonedeep';
import { FILTER_TYPE } from './const';
import { queryGuppyForRawData } from './queries';

/** @typedef {import('../types').AggsCount} AggsCount */
/** @typedef {import('../types').AggsData} AggsData */
/** @typedef {import('../types').ComposedFilterState} ComposedFilterState */
/** @typedef {import('../types').FilterState} FilterState */
/** @typedef {import('../types').FilterConfig} FilterConfig */
/** @typedef {import('../types').GqlFilter} GqlFilter */
/** @typedef {import('../types').GuppyConfig} GuppyConfig */
/** @typedef {import('../types').OptionFilter} OptionFilter */
/** @typedef {import('../types').SimpleAggsData} SimpleAggsData */
/** @typedef {import('../types').StandardFilterState} StandardFilterState */
/** @typedef {{ [x: string]: { selectedValues?: string[] } }} AdminAppliedPreFilter */

/**
 * @param {ComposedFilterState} userFilter
 * @param {AdminAppliedPreFilter} adminAppliedPreFilter
 */
function mergeToComposedFilterState(userFilter, adminAppliedPreFilter) {
  const formattedAdminAppliedPreFilter = {
    __combineMode: 'AND',
    __type: FILTER_TYPE.STANDARD,
    value: {},
  };
  for (const [key, value] of Object.entries(adminAppliedPreFilter))
    value[key] = { __type: FILTER_TYPE.OPTION, ...value };

  return /** @type {ComposedFilterState} */ ({
    ...userFilter,
    value: [...userFilter.value, formattedAdminAppliedPreFilter],
  });
}

/**
 * This function takes two objects containing filters to be applied
 * and combines them into one filter object in the same format.
 * Note: the admin filter takes precedence. Selected values in the user
 * filter will be discarded if the key collides. This is to avoid
 * the user undoing the admin filter. (Multiple user checkboxes increase the
 * amount of data shown when combined, but an admin filter should always decrease
 * or keep constant the amount of data shown when combined with a user filter).
 * @param {StandardFilterState} userFilter
 * @param {AdminAppliedPreFilter} adminAppliedPreFilter
 * */
function mergeToStandardFilterState(userFilter, adminAppliedPreFilter) {
  /** @type {StandardFilterState} */
  const mergedFilterState = cloneDeep(userFilter ?? {});
  if (mergedFilterState.value === undefined) mergedFilterState.value = {};

  for (const [key, adminFilterValues] of Object.entries(
    adminAppliedPreFilter
  )) {
    if (key in mergedFilterState.value) {
      const userFilterValues = mergedFilterState.value[key];

      if (userFilterValues.__type === FILTER_TYPE.OPTION) {
        const userFilterSubset = userFilterValues.selectedValues.filter((x) =>
          adminFilterValues.selectedValues.includes(x)
        );

        mergedFilterState.value[key] = {
          ...mergedFilterState.value[key],
          __type: FILTER_TYPE.OPTION,
          selectedValues:
            userFilterSubset.length > 0
              ? // The user-applied filter is more exclusive than the admin-applied filter.
                userFilterValues.selectedValues
              : // The admin-applied filter is more exclusive than the user-applied filter.
                adminFilterValues.selectedValues,
        };
      }
    } else {
      mergedFilterState.value[key] = {
        __type: FILTER_TYPE.OPTION,
        ...adminFilterValues,
      };
    }
  }

  return mergedFilterState;
}

/**
 * @param {FilterState} userFilter
 * @param {AdminAppliedPreFilter} adminAppliedPreFilter
 * @returns {FilterState}
 */
export function mergeFilters(userFilter, adminAppliedPreFilter) {
  return userFilter?.__type === FILTER_TYPE.COMPOSED
    ? mergeToComposedFilterState(userFilter, adminAppliedPreFilter)
    : mergeToStandardFilterState(userFilter, adminAppliedPreFilter);
}

/**
 * This function updates the counts in the initial set of tab options
 * calculated from unfiltered data.
 * It is used to retain field options in the rendering if
 * they are still checked but their counts are zero.
 * @param {AggsData} initialTabsOptions
 * @param {AggsData} tabsOptions
 * @param {StandardFilterState} filtersApplied
 */
export function updateCountsInInitialTabsOptions(
  initialTabsOptions,
  tabsOptions,
  filtersApplied
) {
  /** @type {SimpleAggsData}} */
  const updatedTabsOptions = {};
  try {
    // flatten the tab options first
    // {
    //   project_id.histogram: ...
    //   visit.visit_label.histogram: ...
    // }
    /** @type {{ [x: string]: AggsCount[] }} */
    const flatInitialTabsOptions = flat(initialTabsOptions, { safe: true });
    /** @type {{ [x: string]: AggsCount[] }} */
    const flatTabsOptions = flat(tabsOptions, { safe: true });

    for (const flatFieldName of Object.keys(flatInitialTabsOptions)) {
      // in flattened tab options, to get actual field name, strip off the last '.histogram'
      const fieldName = flatFieldName.replace('.histogram', '');
      const initialHistogram = flatInitialTabsOptions[flatFieldName];
      if (initialHistogram === undefined)
        // eslint-disable-next-line no-console
        console.error(
          `Guppy did not return histogram data for filter field ${fieldName}`
        );

      updatedTabsOptions[fieldName] = { histogram: [] };
      for (const { key } of initialHistogram) {
        const histogram = flatTabsOptions[flatFieldName];

        if (typeof key === 'string') {
          const found = histogram.find((o) => o.key === key);
          if (found !== undefined)
            updatedTabsOptions[fieldName].histogram.push({
              key,
              count: found.count,
            });
        } else {
          // key is a range, just copy the histogram
          updatedTabsOptions[fieldName].histogram = initialHistogram;

          if (flatTabsOptions[flatFieldName]?.length > 0) {
            const lowerBound = Number(histogram[0].key[0]) || 0;
            const upperBound = Number(histogram[0].key[1]) || 0;

            updatedTabsOptions[fieldName].histogram[0] = {
              ...histogram[0],
              key: [lowerBound, upperBound],
            };
          }
        }
      }

      const filter = filtersApplied.value?.[fieldName];
      if (filter !== undefined && filter.__type === FILTER_TYPE.OPTION)
        for (const key of filter.selectedValues) {
          const found = updatedTabsOptions[fieldName].histogram.find(
            (o) => o.key === key
          );
          if (found === undefined)
            updatedTabsOptions[fieldName].histogram.push({ key, count: 0 });
        }
    }
  } catch (err) {
    /* eslint-disable no-console */
    // hopefully we won't get here but in case of
    // out-of-index error or obj undefined error
    console.error('error when processing filter data: ', err);
    console.trace();
    /* eslint-enable no-console */
  }
  return updatedTabsOptions;
}

/**
 * @param {SimpleAggsData} tabsOptions
 */
export const sortTabsOptions = (tabsOptions) => {
  const fields = Object.keys(tabsOptions);
  const sortedTabsOptions = { ...tabsOptions };
  for (let x = 0; x < fields.length; x += 1) {
    const field = fields[x];

    const optionsForThisField = sortedTabsOptions[field].histogram;
    optionsForThisField.sort((a, b) => (a.key > b.key ? 1 : -1));
    sortedTabsOptions[field].histogram = optionsForThisField;
  }
  return sortedTabsOptions;
};

/**
 * This function takes two TabsOptions object and merge them together
 * The order of merged histogram array is preserved by firstHistogram.concat(secondHistogram)
 * @param {SimpleAggsData} firstTabsOptions
 * @param {SimpleAggsData} secondTabsOptions
 */
export const mergeTabOptions = (firstTabsOptions, secondTabsOptions) => {
  if (!firstTabsOptions || !Object.keys(firstTabsOptions).length) {
    return secondTabsOptions;
  }
  if (!secondTabsOptions || !Object.keys(secondTabsOptions).length) {
    return firstTabsOptions;
  }

  const allOptionKeys = [
    ...new Set([
      ...Object.keys(firstTabsOptions),
      ...Object.keys(secondTabsOptions),
    ]),
  ];
  /** @type {SimpleAggsData} */
  const mergedTabOptions = {};
  allOptionKeys.forEach((optKey) => {
    if (!mergedTabOptions[`${optKey}`]) {
      mergedTabOptions[`${optKey}`] = { histogram: [] };
    }
    if (!mergedTabOptions[`${optKey}`].histogram) {
      mergedTabOptions[`${optKey}`].histogram = [];
    }
    const firstHistogram =
      firstTabsOptions[`${optKey}`] && firstTabsOptions[`${optKey}`].histogram
        ? firstTabsOptions[`${optKey}`].histogram
        : [];
    const secondHistogram =
      secondTabsOptions[`${optKey}`] && secondTabsOptions[`${optKey}`].histogram
        ? secondTabsOptions[`${optKey}`].histogram
        : [];
    mergedTabOptions[`${optKey}`].histogram =
      firstHistogram.concat(secondHistogram);
  });
  return mergedTabOptions;
};

/**
 * @param {Object} args
 * @param {string} [args.field]
 * @param {Array} [args.dictionaryEntries]
 */
function findDictionaryEntryForField(field, dictionaryEntries) {
  let foundEntry = dictionaryEntries.find((entry) => {
    let { entryKey, sectionKey } = entry;
    return field === entryKey || field === `${sectionKey}.${entryKey}`;
  });
  return foundEntry?.entryValue;
}

/**
 * @param {Object} args
 * @param {string} [args.field]
 * @param {Array} [args.dictionaryEntries]
 * @param {OptionFilter['selectedValues']} [args.adminAppliedPreFilterValues]
 * @param {{ histogram: AggsCount[] }} args.histogramResult
 * @param {{ histogram: AggsCount[] }} args.initialHistogramResult
 */
const getSingleFilterOption = ({
  field,
  dictionaryEntries,
  adminAppliedPreFilterValues,
  histogramResult,
  initialHistogramResult,
}) => {
  if (!histogramResult || !histogramResult.histogram) {
    throw new Error(
      `Error parsing field options ${JSON.stringify(histogramResult)}`
    );
  }

  const options = [];
  for (const item of histogramResult.histogram) {
    if (typeof item.key !== 'string') {
      let [minValue, maxValue] = item.key;
      if (
        initialHistogramResult &&
        typeof initialHistogramResult.histogram[0].key !== 'string'
      )
        [minValue, maxValue] = initialHistogramResult.histogram[0].key;

      options.push({
        filterType: 'range',
        min: Math.floor(minValue),
        max: Math.ceil(maxValue),
        lowerBound: item.key[0],
        upperBound: item.key[1],
        count: item.count,
      });
    } else {
      let entry = findDictionaryEntryForField(field, dictionaryEntries);
      let enumDef = (entry?.enumDef || []).find((enumDefEntry) => enumDefEntry.enumeration === item.key);

      options.push({
        description: enumDef?.description,
        text: item.key,
        filterType: 'singleSelect',
        count: item.count,
        accessible: item.accessible,
        disabled: adminAppliedPreFilterValues?.includes(item.key),
      });
    }
  }

  return options;
};

/**
 * createSearchFilterLoadOptionsFn creates a handler function that loads the search filter's
 * autosuggest options as the user types in the search filter.
 * @param {string} field
 * @param {GuppyConfig} guppyConfig
 * @returns {(searchString: string, offset: number) => Promise}
 */
const createSearchFilterLoadOptionsFn =
  (field, guppyConfig) => (searchString, offset) =>
    new Promise((resolve, reject) => {
      // If searchString is empty return just the first NUM_SEARCH_OPTIONS options.
      // This allows the client to show default options in the search filter before
      // the user has started searching.
      /** @type {GqlFilter | undefined} */
      const gqlFilter = searchString
        ? { search: { keyword: searchString, fields: [field] } }
        : undefined;

      queryGuppyForRawData({
        type: guppyConfig.dataType,
        fields: [field],
        gqlFilter,
        offset,
        withTotalCount: true,
      })
        .then((res) => {
          if (!res.data || !res.data[guppyConfig.dataType]) {
            resolve({
              options: [],
              hasMore: false,
            });
          } else {
            const results = res.data[guppyConfig.dataType];
            const totalCount =
              res.data._aggregation[guppyConfig.dataType]._totalCount;
            resolve({
              options: results.map((result) => ({
                value: result[field],
                label: result[field],
              })),
              hasMore: totalCount > offset + results.length,
            });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });

/**
 * @param {string} field
 * @param {string[][]} arrayFields
 */
export const checkIsArrayField = (field, arrayFields) => {
  let isArrayField = false;
  const keys = Object.keys(arrayFields);
  for (let i = 0; i < keys.length; i += 1) {
    if (arrayFields[keys[i]].includes(field)) {
      isArrayField = true;
    }
  }
  return isArrayField;
};

/**
 * @param {Object} args
 * @param {{ [x:string]: OptionFilter }} args.adminAppliedPreFilters
 * @param {string[][]} args.arrayFields
 * @param {string[]} args.fields
 * @param {FilterConfig['info']} args.filterInfo
 * @param {GuppyConfig} args.guppyConfig
 * @param {SimpleAggsData} args.initialTabsOptions
 * @param {string[]} args.searchFields
 * @param {SimpleAggsData} args.tabsOptions
 * @param {Array} args.dictionaryEntries
 * @returns {import('../../gen3-ui-component/components/filters/types').FilterSectionConfig[]}
 */
export const getFilterSections = ({
  adminAppliedPreFilters,
  arrayFields,
  fields,
  filterInfo,
  guppyConfig,
  initialTabsOptions,
  searchFields,
  tabsOptions,
  dictionaryEntries
}) => {
  let searchFieldSections = [];

  if (searchFields) {
    // Process searchFields first -- searchFields are special filters that allow the user
    // to search over all options, instead of displaying all options in a list. This allows
    // guppy/portal to support filters that have too many options to be displayed in a list.
    searchFieldSections = searchFields.map((field) => {
      const { label, tooltip } = filterInfo[field];

      const tabsOptionsFiltered = { ...tabsOptions[field] };
      if (Object.keys(adminAppliedPreFilters).includes(field)) {
        tabsOptionsFiltered.histogram = tabsOptionsFiltered.histogram.filter(
          (x) =>
            typeof x.key === 'string' &&
            adminAppliedPreFilters[field].selectedValues.includes(x.key)
        );
      }

      // For searchFields, don't pass all options to the component, only the selected ones.
      // This allows selected options to appear below the search box once they are selected.
      let selectedOptions = [];
      if (tabsOptionsFiltered && tabsOptionsFiltered.histogram) {
        selectedOptions = getSingleFilterOption({
          field,
          dictionaryEntries,
          adminAppliedPreFilterValues:
            adminAppliedPreFilters[field]?.selectedValues,
          histogramResult: tabsOptionsFiltered,
          initialHistogramResult: initialTabsOptions
            ? initialTabsOptions[field]
            : undefined,
        });
      }

      return {
        title: label,
        options: selectedOptions,
        isSearchFilter: true,
        onSearchFilterLoadOptions: createSearchFilterLoadOptionsFn(
          field,
          guppyConfig
        ),
        tooltip,
      };
    });
  }

  const sections = fields.map((field) => {
    const { label, tooltip } = filterInfo[field];

    const tabsOptionsFiltered = { ...tabsOptions[field] };
    if (Object.keys(adminAppliedPreFilters).includes(field)) {
      tabsOptionsFiltered.histogram = tabsOptionsFiltered.histogram.filter(
        (x) =>
          typeof x.key === 'string' &&
          adminAppliedPreFilters[field].selectedValues.includes(x.key)
      );
    }

    const defaultOptions = getSingleFilterOption({
      field,
      dictionaryEntries,
      adminAppliedPreFilterValues:
        adminAppliedPreFilters[field]?.selectedValues,
      histogramResult: tabsOptionsFiltered,
      initialHistogramResult: initialTabsOptions
        ? initialTabsOptions[field]
        : undefined,
    });

    const fieldIsArrayField = checkIsArrayField(field, arrayFields);

    return {
      title: label,
      options: defaultOptions,
      isArrayField: fieldIsArrayField,
      tooltip,
    };
  });
  return searchFieldSections.concat(sections);
};

/**
 * @param {AggsData} aggsData
 * @param {FilterState} filterResults
 */
export function excludeSelfFilterFromAggsData(aggsData, filterResults) {
  if (
    filterResults?.value === undefined ||
    filterResults.__type !== FILTER_TYPE.STANDARD
  )
    return aggsData;

  /** @type {SimpleAggsData} */
  const resultAggsData = {};
  /** @type {{ [x: string]: AggsCount[] }} */
  const flatAggsData = flat(aggsData, { safe: true });
  for (const flatFieldName of Object.keys(flatAggsData)) {
    const histogram = flatAggsData[flatFieldName];
    if (histogram !== undefined) {
      const fieldName = flatFieldName.replace('.histogram', '');
      resultAggsData[fieldName] = { histogram };
      if (fieldName in filterResults.value) {
        const filterValue = filterResults.value[fieldName];
        resultAggsData[fieldName].histogram =
          filterValue.__type === FILTER_TYPE.OPTION
            ? histogram.filter(
                ({ key }) =>
                  typeof key === 'string' &&
                  filterValue.selectedValues.includes(key)
              )
            : [];
      }
    }
  }
  return resultAggsData;
}

/**
 * @param {AggsData} aggsData
 */
export function unnestAggsData(aggsData) {
  /** @type {SimpleAggsData} */
  const simpleAggsData = {};
  for (const [key, value] of Object.entries(aggsData))
    if (Array.isArray(value.histogram))
      simpleAggsData[key] = {
        histogram: value.histogram,
      };
    else
      for (const [nestedKey, nestedValue] of Object.entries(value))
        simpleAggsData[`${key}.${nestedKey}`] = {
          histogram: nestedValue.histogram,
        };

  return simpleAggsData;
}
